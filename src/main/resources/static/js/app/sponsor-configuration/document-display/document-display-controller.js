angular
    .module('scfApp')
    .controller(
        'DocumentDisplayController', [
            '$log',
            '$scope',
            '$state',
            'SCFCommonService',
            '$stateParams',
            '$timeout',
            'ngDialog',
            'PageNavigation',
            'Service',
            '$q',
            '$rootScope',
            '$injector',
            'DocumentDisplayConfigExampleService',
            'LOAN_REQUEST_MODE_ITEM',
            'DOCUMENT_SELECTION_ITEM',
            'SUPPLIER_CODE_GROUP_SELECTION_ITEM',
			'UIFactory',
			'blockUI',
			'FileLayoutService',
            function($log, $scope, $state, SCFCommonService,
                $stateParams, $timeout, ngDialog,
                PageNavigation, Service, $q, $rootScope, $injector, DocumentDisplayConfigExampleService, LOAN_REQUEST_MODE_ITEM, 
                DOCUMENT_SELECTION_ITEM, SUPPLIER_CODE_GROUP_SELECTION_ITEM, UIFactory, blockUI, FileLayoutService) {


                var vm = this;
                var log = $log;

                vm.manageAll=false;
            	
                var ownerId = $rootScope.sponsorId;
                var accountingTransactionType = $stateParams.accountingTransactionType;
                var displayMode = $stateParams.displayMode;
                var selectedItem = $stateParams.selectedItem;

                var BASE_URI = 'api/v1/organize-customers/' + ownerId + '/accounting-transactions/' + accountingTransactionType +'/display-modes/' + displayMode + '/displays';

                var newDisplayConfig = function() {
                    return {
                    	layoutFileDataTypeId: null,
                        sortType: null
                    }
                }

                vm.headerMessageLabel = "Setup create transaction display";
                vm.mode = "Loan request mode";
                vm.groupSelection = "Supplier code group selection";
                
                vm.isCreateTransactionMode = false;
				vm.loanRequestMode = LOAN_REQUEST_MODE_ITEM;
                vm.documentSelection = DOCUMENT_SELECTION_ITEM;
                vm.supplierCodeSelectionMode = SUPPLIER_CODE_GROUP_SELECTION_ITEM;

				vm.dataModel = {
                    displayName: null,
                    items: null,
                    loanRequestMode: null,
                    documentSelection: null,
                    supplierCodeSelectionMode: null
                };
                
                vm.dataModel.items = [newDisplayConfig()];
                
                vm.sortTypes = [{
                    label: 'ASC',
                    value: 'ASC'
                }, {
                    label: 'DESC',
                    value: 'DESC'
                }, {
                    label: '-',
                    value: null
                }]

                vm.documentFields = [{
                    value: null,
                    label: 'Please select'
                }];
                vm.documentFieldData = [];
                
                vm.documentGroupByFields = [{
                    value: null,
                    label: 'Please select'
                }];
                vm.documentGroupByFieldData = [];
                
    			vm.backToSponsorConfigPage = function(){
    				PageNavigation.gotoPreviousPage();
    			}
    			
    			var loadDataTypes = function() {
    				var deffered = FileLayoutService.getDocumentFields('DISPLAY', 'DETAIL');
    				deffered.promise.then(function(response) {
    					vm.documentFieldData = response.data;
    					
                        vm.documentFieldData.forEach(function(obj) {
                            var item = {
                        		value : obj.documentFieldId,
    							label : obj.displayFieldName
                            };
                            vm.documentFields.push(item);
                        });
    				}).catch(function(response) {
    					log.error('Load customer code group data error');
    				});
    			}
    			
    			// var loadGroupByDataTypes = function() {
    			// 	var deffered = FileLayoutService.getDisplayDataTypes('TEXT');
    			// 	deffered.promise.then(function(response) {
    			// 		vm.documentGroupByFieldData = response.data;
    					
                //         vm.documentGroupByFieldData.forEach(function(obj) {
                //             var item = {
                //         		value : obj.layoutFileDataTypeId,
    			// 				label : obj.displayFieldName
                //             };
                //             vm.documentGroupByFields.push(item);
                //         });
    			// 	}).catch(function(response) {
    			// 		log.error('Load customer code group data error');
    			// 	});
    			// }
    			
                var sendRequest = function(uri, succcesFunc, failedFunc) {
                    var serviceDiferred = Service.doGet(BASE_URI + uri);

                    var failedFunc = failedFunc | function(response) {
                        log.error('Load data error');
                    };
                    serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
                }

                vm.setup = function() {
                	loadDataTypes();
                	//loadGroupByDataTypes();
                	
                    sendRequest('', function(response) {
                        vm.dataModel = response.data;
                        if (vm.dataModel.items == null || vm.dataModel.items.length < 1) {
                            vm.addItem();
                        }
                        
                        if(vm.dataModel.displayMode == 'DOCUMENT'){
                        	vm.headerMessageLabel = "Setup document display";
                        }else{
                        	vm.isCreateTransactionMode = true;
                        	
                        	if(vm.dataModel.accountingTransactionType == 'RECEIVABLE'){
                        		vm.mode = "Payment mode";
                                vm.groupSelection = "Buyer code group selection";
                        	}
                        }
                        
                    });
                }

                vm.addItem = function() {
                    vm.dataModel.items.push({
                    	layoutFileDataTypeId: null,
                        sortType: null,
						completed: false
                    });
                }

                vm.removeItem = function(record) {
                    var index = vm.dataModel.items.indexOf(record);
                    vm.dataModel.items.splice(index, 1);
                }

                vm.openSetting = function(index, record) {
                    var layoutFileDataTypeId = record.layoutFileDataType.layoutFileDataTypeId;
                    vm.documentFieldData.forEach(function(obj) {
                        if (layoutFileDataTypeId == obj.layoutFileDataTypeId) {
                            var dialog = ngDialog.open({
                                id: 'setting-dialog-' + index,
                                template: obj.displayActionUrl,
                                className: 'ngdialog-theme-default',
                                controller: obj.dataType + 'DisplayConfigController',
                                controllerAs: 'ctrl',
                                scope: $scope,
                                data: {
                                    record: record,
                                    config: obj
                                },
                                cache: false,
                                preCloseCallback: function(value) {
                                    if (value != null) {
                                        angular.copy(value, record);
										record.completed = true;
                                    }
                                }
                            });
                        }
                    });

                }

                vm.save = function() {
                	var preCloseCallback = function() {
						var organizeModel = {organizeId: ownerId};
                        PageNavigation.gotoPage('/sponsor-configuration', {
                        	organizeModel: organizeModel
                        });
					}
					UIFactory.showConfirmDialog({
						data : {
							headerMessage : 'Confirm save?'
						},
						confirm : $scope.confirmSave,
						onFail : function(response) {
								blockUI.stop();
							var msg = {
								409 : 'Display document has been deleted.',
								405 : 'Display document has been used.'
							};
							UIFactory.showFailDialog({
								data : {
									headerMessage : 'Edit display document configuration fail.',
									bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
								},
								preCloseCallback : preCloseCallback
							});
						},
						onSuccess : function(response) {
								blockUI.stop();
							UIFactory.showSuccessDialog({
								data : {
									headerMessage : 'Edit display document configuration complete.',
									bodyMessage : ''
								},
								preCloseCallback : preCloseCallback
							});
						}
					});
                }

				$scope.confirmSave = function() {
					vm.dataModel.completed = true;
					vm.dataModel.items.forEach(function(obj, index) {
                        obj.sequenceNo = index + 1;
                        vm.dataModel.items[index].layoutFileDataTypeId = obj.layoutFileDataType.layoutFileDataTypeId;
                        vm.dataModel.completed =  obj.completed && vm.dataModel.completed; 
                    })
                    
                    var url =  BASE_URI+'/' + vm.dataModel.documentDisplayId;
                    var deffered = Service.requestURL(url, vm.dataModel,'PUT');
                    return deffered;
				}

                vm.setup();
                
                vm.isUnCheckGroupBy = function(){
                	if(!vm.manageAll || vm.dataModel.documentSelection != 'GROUP_BY'){
                		vm.dataModel.groupByFieldId = null;
                		return true;
                	}else{
                		return false;
                	}
                }
                
                vm.cannotSetup = function(record){
                	if(angular.isDefined(record.layoutFileDataType)){
                		var hasUrl = true;
                    	var layoutFileDataTypeId = record.layoutFileDataType.layoutFileDataTypeId;
                        vm.documentFieldData.forEach(function(obj) {
                            if (layoutFileDataTypeId == obj.layoutFileDataTypeId) {
                        		if(obj.displayActionUrl == null){
                            		hasUrl = false;
                            	}
                            }
                        });
                        
                    	if(!vm.manageAll || !hasUrl){
                    		return true;
                    	}else{
                    		return false;
                    	}
                	}
                }
                
                vm.moveItemUp = function(item) {
                    var itemIndex = vm.dataModel.items.indexOf(item);
                    addItemToIndex(itemIndex - 1, item);
                }

                vm.moveItemDown = function(item) {
                    var itemIndex = vm.dataModel.items.indexOf(item);
                    addItemToIndex(itemIndex + 1, item);
                }

                function addItemToIndex(index, item) {
                    var totalItem = vm.dataModel.items.length;
                    if (index >= 0 && index <= totalItem) {
                        vm.removeItem(item);
                        vm.dataModel.items.splice(index, 0, item);
                    }
                }

                vm.displayExample = function(record) {
                    var msg = '';
                    vm.documentFieldData.forEach(function(obj) {
                        if (record.layoutFileDataType != null && record.layoutFileDataType.layoutFileDataTypeId == obj.layoutFileDataTypeId) {
                            if (record.completed) {
                            	msg = $injector.get('DocumentDisplayConfigExampleService')[obj.dataType+'_DisplayExample'](record, obj);
                            }
                        }
                    });
                    return msg;
                };
            }

        ]).constant('ALIGNMENT_DROPDOWN_ITEM', [{
	     	label: 'Please select',
	    	value: null
	    }, {
	    	label: 'Center',
	    	value: 'CENTER'
	    }, {
	    	label: 'Left',
	    	value: 'LEFT'
	    },{
	    	label: 'Right',
	    	value: 'RIGHT'
	   }]).constant('NEGATIVE_NUMMBER_DROPDOWN_ITEM', [{
	     	label: '-123,456.00',
	    	value: "number"
	    }, {
	    	label: '(123,456.00)',
	    	value: 'negativeParenthesis'
	    }]).constant('LOAN_REQUEST_MODE_ITEM', {
	    	currentAndFuture : 'CURRENT_AND_FUTURE',
	    	current : 'CURRENT'
	    }).constant('DOCUMENT_SELECTION_ITEM', {
	    	anyDocument : 'ANY_DOCUMENT',
	    	groupBy : 'GROUP_BY'
	    }).constant('SUPPLIER_CODE_GROUP_SELECTION_ITEM', {
	    	singlePerTransaction : 'SINGLE_PER_TRANSACTION',
	    	multiplePerTransaction : 'MULTIPLE_PER_TRANSACTION'
	    }).controller( 'TEXTDisplayConfigController', [ '$scope','ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
	       function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
	    	
			   this.model = angular.copy($scope.ngDialogData.record);
		     
			   this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;
    	 
     }]).controller( 'MATCHING_REFDisplayConfigController', [ '$scope','ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
	       function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
	    	
		   this.model = angular.copy($scope.ngDialogData.record);
	     
		   this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;
	 
     }]).controller( 'CUSTOMER_CODEDisplayConfigController', [ '$scope','ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
           function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
		    	
		       this.model = angular.copy($scope.ngDialogData.record);
		     
		       this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;
		 
	 }]).controller( 'DOCUMENT_NODisplayConfigController', [ '$scope','ALIGNMENT_DROPDOWN_ITEM','$rootScope', 'SCFCommonService',
	        function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
	    	
		     this.model = angular.copy($scope.ngDialogData.record);
		     
		     this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

     }]).controller( 'DOCUMENT_TYPEDisplayConfigController', [ '$scope','ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
                                           	       function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
	    	
		   this.model = angular.copy($scope.ngDialogData.record);
	     
		   this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;
	 
     }]).controller( 'NUMERICDisplayConfigController', [ '$scope', 
														'$filter',
														'ALIGNMENT_DROPDOWN_ITEM',
														'NEGATIVE_NUMMBER_DROPDOWN_ITEM',
														'$rootScope', 'SCFCommonService',
             function($scope, $filter, ALIGNMENT_DROPDOWN_ITEM, NEGATIVE_NUMMBER_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
	    	 var vm = this;
    	     var dataTypeConfig =  $scope.ngDialogData.config;

    	     vm.dlgData = {useSeperator:false, filterType: null};
    	    	 
    	     vm.model = angular.copy($scope.ngDialogData.record);
		     
    	     vm.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;
		     
    	     vm.negativeNumberDropdownItems = NEGATIVE_NUMMBER_DROPDOWN_ITEM;
		     
		     var rawExample =  parseFloat(dataTypeConfig.defaultExampleValue).toFixed(2);
		     vm.exampleRawData = isNaN(rawExample)?123456.00:rawExample;
		     
		     var prepareDiaglogData = function(){
		    	 
		    	 if(vm.model.filterType == 'negativeParenthesis'){
		    		 vm.dlgData.useSeperator = true;
		    		 vm.dlgData.filterType = 'negativeParenthesis';
		    	 }
		    	 else if(vm.model.filterType == 'noSeperatorNegativeParenthesis'){
		    		 vm.dlgData.useSeperator = false;
		    		 vm.dlgData.filterType = 'negativeParenthesis';
		    	 }
		    	 else if(vm.model.filterType == 'number'){
		    		 vm.dlgData.useSeperator = true;
		    		 vm.dlgData.filterType = 'number';
		    	 }
		    	 else{
		    		 vm.dlgData.useSeperator = false;
		    		 vm.dlgData.filterType = 'number';
		    	 }
		     }
		     
		     prepareDiaglogData();
		     
		     $scope.$watch('ctrl.dlgData', function() {
		    	 if(vm.dlgData.useSeperator){
		    		 vm.model.filterType = vm.dlgData.filterType;
		    	 }
		    	 else{
		    		 if(vm.dlgData.filterType == 'number'){
		    			 vm.model.filterType = 'noSeperatorNumeric';
		    		 }
		    		 else{
		    			 vm.model.filterType = 'noSeperatorNegativeParenthesis';
		    		 }
		    	 }
		    	 vm.examplePosDataDisplay = $filter(vm.model.filterType)(vm.exampleRawData, 2);
		    	 vm.exampleNegDataDisplay = $filter(vm.model.filterType)(-vm.exampleRawData, 2);
		     }, true);

	 }]).controller( 'PAYMENT_AMOUNTDisplayConfigController', [ '$scope', 
															'$filter',
															'ALIGNMENT_DROPDOWN_ITEM',
															'NEGATIVE_NUMMBER_DROPDOWN_ITEM',
															'$rootScope', 'SCFCommonService',
	             function($scope, $filter, ALIGNMENT_DROPDOWN_ITEM, NEGATIVE_NUMMBER_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
		    	 var vm = this;
	    	     var dataTypeConfig =  $scope.ngDialogData.config;
	    	     
	    	     vm.dlgData = {useSeperator:false, filterType: null};
	    	    	 
	    	     vm.model = angular.copy($scope.ngDialogData.record);
			     
	    	     vm.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;
			     
	    	     vm.negativeNumberDropdownItems = NEGATIVE_NUMMBER_DROPDOWN_ITEM;
			     
			     var rawExample =  parseFloat(dataTypeConfig.defaultExampleValue).toFixed(2);
			     vm.exampleRawData = isNaN(rawExample)?123456.00:rawExample;
			     
			     var prepareDiaglogData = function(){
			    	 
			    	 if(vm.model.filterType == 'negativeParenthesis'){
			    		 vm.dlgData.useSeperator = true;
			    		 vm.dlgData.filterType = 'negativeParenthesis';
			    	 }
			    	 else if(vm.model.filterType == 'noSeperatorNegativeParenthesis'){
			    		 vm.dlgData.useSeperator = false;
			    		 vm.dlgData.filterType = 'negativeParenthesis';
			    	 }
			    	 else if(vm.model.filterType == 'number'){
			    		 vm.dlgData.useSeperator = true;
			    		 vm.dlgData.filterType = 'number';
			    	 }
			    	 else{
			    		 vm.dlgData.useSeperator = false;
			    		 vm.dlgData.filterType = 'number';
			    	 }
			     }
			     
			     prepareDiaglogData();
			     
			     $scope.$watch('ctrl.dlgData', function() {
			    	 if(vm.dlgData.useSeperator){
			    		 vm.model.filterType = vm.dlgData.filterType;
			    	 }
			    	 else{
			    		 if(vm.dlgData.filterType == 'number'){
			    			 vm.model.filterType = 'noSeperatorNumeric';
			    		 }
			    		 else{
			    			 vm.model.filterType = 'noSeperatorNegativeParenthesis';
			    		 }
			    	 }
			    	 vm.examplePosDataDisplay = $filter(vm.model.filterType)(vm.exampleRawData, 2);
			    	 vm.exampleNegDataDisplay = $filter(vm.model.filterType)(-vm.exampleRawData, 2);
			     }, true);

		 }]).controller( 'DATE_TIMEDisplayConfigController', [ '$scope', '$filter', '$log','ALIGNMENT_DROPDOWN_ITEM','Service', '$rootScope', 'SCFCommonService',
	                                                       function($scope, $filter, $log, ALIGNMENT_DROPDOWN_ITEM, Service, $rootScope, SCFCommonService) {
		   	 var vm = this;
		   	 vm.model = angular.copy($scope.ngDialogData.record);
		     if(!vm.model.filterType){
		    	 vm.model.filterType = 'date';
		     }
		     if(!vm.model.format){
		    	 vm.model.format = 'dd/MM/yyyy';
		     }
		   	 vm.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;
		   	 vm.formatDropdownItems = [];
		   	 
		     var serviceUrl = 'js/app/sponsor-configuration/file-layouts/date_time_format.json';
             var diferred = Service.doGet(serviceUrl);
             diferred.promise.then(function(response) {
                 var dateTimeDropdownList = response.data;
                 if (dateTimeDropdownList !== undefined) {
                     dateTimeDropdownList.forEach(function(obj) {
                         var selectObj = {
                             label: obj.dateTimeName,
                             value: obj.dateTimeId
                         }
                         vm.formatDropdownItems.push(selectObj);
                     });
                 }
                 diferred.resolve(vm.formatDropdownItems);
             }).catch(function(response) {
                 $log.error('Load date time format Fail');
                 diferred.reject();
             });
             
             $scope.$watch('ctrl.model.format', function() {
            	 var collectionDate = '2016-04-13T00:00:00';
            	 var date = new Date(collectionDate);
		    	 vm.exampleDataDisplay = $filter('date')(date, vm.model.format);
		     });
             
	 }]).factory('DocumentDisplayConfigExampleService', ['$filter', 'SCFCommonService', function($filter, SCFCommonService) {
		 return {
			 TEXT_DisplayExample: TEXT_DisplayExample,
			 DOCUMENT_TYPE_DisplayExample: DOCUMENT_TYPE_DisplayExample,
			 CUSTOMER_CODE_DisplayExample: CUSTOMER_CODE_DisplayExample,
			 DOCUMENT_NO_DisplayExample: DOCUMENT_NO_DisplayExample,
			 NUMERIC_DisplayExample: NUMERIC_DisplayExample,
			 PAYMENT_AMOUNT_DisplayExample: PAYMENT_AMOUNT_DisplayExample,
			 DATE_TIME_DisplayExample: DATE_TIME_DisplayExample
		 }
		 
		 function TEXT_DisplayExample(record, config){
			 var displayMessage = config.displayDetailPattern;
             var replacements = [SCFCommonService.camelize(record.alignment), config.defaultExampleValue];
             return SCFCommonService.replacementStringFormat(displayMessage, replacements);
		 }
		 
		 function DOCUMENT_TYPE_DisplayExample(record, config){
			 var displayMessage = config.displayDetailPattern;
             var replacements = [SCFCommonService.camelize(record.alignment), config.defaultExampleValue];
             return SCFCommonService.replacementStringFormat(displayMessage, replacements);
		 }
		 
		 function CUSTOMER_CODE_DisplayExample(record, config){
			 var displayMessage = config.displayDetailPattern;
             var replacements = [SCFCommonService.camelize(record.alignment), config.defaultExampleValue];
             return SCFCommonService.replacementStringFormat(displayMessage, replacements);
		 }
		 
		 function DOCUMENT_NO_DisplayExample(record, config){
			 var displayMessage = config.displayDetailPattern;
             var replacements = [SCFCommonService.camelize(record.alignment), config.defaultExampleValue];
             return SCFCommonService.replacementStringFormat(displayMessage, replacements);
		 }
		 function NUMERIC_DisplayExample(record, config){
			 if(record.filterType != null){
				 var displayMessage = config.displayDetailPattern;
				 var exampleRawData =  parseFloat(config.defaultExampleValue).toFixed(2);
				 var examplePosDataDisplay = $filter(record.filterType)(exampleRawData, 2);
		    	 var exampleNegDataDisplay = $filter(record.filterType)(-exampleRawData, 2);
	             var replacements = [SCFCommonService.camelize(record.alignment), examplePosDataDisplay, exampleNegDataDisplay];
	             return SCFCommonService.replacementStringFormat(displayMessage, replacements);
			 }else{
				 return "";
			 }
		 }
		 function PAYMENT_AMOUNT_DisplayExample(record, config) {
			var displayMessage = config.displayDetailPattern;
			
			var exampleRawData =  parseFloat(config.defaultExampleValue).toFixed(2);		    
			var examplePosDataDisplay = $filter(record.filterType)(exampleRawData, 2);
			var exampleNegDataDisplay = $filter(record.filterType)(-exampleRawData, 2);
			var replacements = [ SCFCommonService.camelize(record.alignment), examplePosDataDisplay, exampleNegDataDisplay ];
			return SCFCommonService.replacementStringFormat(displayMessage, replacements);
		}
		 
		 function DATE_TIME_DisplayExample(record, config) {
			var displayMessage = config.displayDetailPattern;
			var date = new Date(config.defaultExampleValue);
			var exampleDataDisplay = $filter('date')(date, record.format);
			var replacements = [ SCFCommonService.camelize(record.alignment), record.format.toUpperCase(), exampleDataDisplay ];
			return SCFCommonService.replacementStringFormat(displayMessage, replacements);
		}
	 }]);
