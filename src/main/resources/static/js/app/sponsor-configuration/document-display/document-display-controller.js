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
            function($log, $scope, $state, SCFCommonService,
                $stateParams, $timeout, ngDialog,
                PageNavigation, Service, $q, $rootScope, TEXTDisplayConfigController) {


                var vm = this;
                var log = $log;

                var sponsorId = $rootScope.sponsorId;
                var selectedItem = $stateParams.selectedItem;

                var BASE_URI = 'api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP';

                var newDisplayConfig = function() {
                    return {
                        filedName: null,
                        sortType: null
                    }
                }

                vm.dataModel = {
                    displayName: null,
                    items: null
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

                var sendRequest = function(uri, succcesFunc, failedFunc) {
                    var serviceDiferred = Service.doGet(BASE_URI + uri);

                    var failedFunc = failedFunc | function(response) {
                        log.error('Load data error');
                    };
                    serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
                }

                vm.setup = function() {

                    sendRequest('/displays/' + selectedItem.documentDisplayId, function(response) {
                        vm.dataModel = response.data;
                        if (vm.dataModel.items.length < 1) {
                            vm.addItem();
                        }
                    });

                    sendRequest('/display-document-fields', function(response) {
                        vm.documentFieldData = response.data;

                        vm.documentFieldData.forEach(function(obj) {
                            var item = {
                                value: obj.docFieldName,
                                label: obj.displayName
                            };
                            vm.documentFields.push(item);
                        });
                    });
                }

                vm.addItem = function() {
                    vm.dataModel.items.push({
                        filedName: null,
                        sortType: null,
						completed: false
                    });
                }

                vm.removeItem = function(record) {
                    var index = vm.dataModel.items.indexOf(record);
                    vm.dataModel.items.splice(index, 1);
                }

                vm.openSetting = function(index, record) {
                    var fieldName = record.fieldName;
                    vm.documentFieldData.forEach(function(obj) {
                        if (fieldName == obj.docFieldName) {

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
                	vm.dataModel.completed = true;
                    vm.dataModel.items.forEach(function(obj, index) {
                        obj.sequenceNo = index + 1;
                        vm.dataModel.completed =  obj.completed && vm.dataModel.completed; 
                    })
                    log.debug(vm.dataModel)
                    var url =  BASE_URI+'/displays/'+ vm.dataModel.documentDisplayId;
                    var deffered = Service.doPut(url, vm.dataModel);
                    
                    deffered.promise.then(function(response){
                    	console.log(sponsorId);
                    	var organizeModel = {organizeId: sponsorId};
                        PageNavigation.gotoPage('/sponsor-configuration', {
                        	organizeModel: organizeModel
                        });
                        
                    });
                }

                vm.setup();

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
                        if (record.fieldName == obj.docFieldName) {
                            if (record.completed) {								
                                var displayRecordObj = {
                                    record: record,
                                    config: obj,
                                    displayExampleMsg: ''
                                };
                                $rootScope.$emit(record.fieldName+'DisplayExample', displayRecordObj);
                                msg = displayRecordObj.displayExampleMsg;
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
	    }]).controller( 'TEXTDisplayConfigController', [ '$scope','ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
	       function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
	    	
			   this.model = angular.copy($scope.ngDialogData.record);
		     
			   this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;
    	 
			   function displayExampleConfig (record, obj) {
					var displayMessage = obj.displayDetailPattern;
                    var replacements = [SCFCommonService.camelize(record.alignment), obj.defaultExampleValue];
                    return SCFCommonService.replacementStringFormat(displayMessage, replacements);;
                }
			   
                $rootScope.$on(this.model.fieldName+'DisplayExample', function(event, parentScope) {
                    parentScope.displayExampleMsg = displayExampleConfig(parentScope.record, parentScope.config);                    
                });
     }]).controller( 'CUSTOMER_CODEDisplayConfigController', [ '$scope','ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
           function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
		    	
		       this.model = angular.copy($scope.ngDialogData.record);
		     
		       this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;
			   
			   function displayExampleConfig (record, obj) {
					var displayMessage = obj.displayDetailPattern;
                    var replacements = [SCFCommonService.camelize(record.alignment), obj.defaultExampleValue];
                    return SCFCommonService.replacementStringFormat(displayMessage, replacements);;
                }
			   
                $rootScope.$on(this.model.fieldName+'DisplayExample', function(event, parentScope) {
                    parentScope.displayExampleMsg = displayExampleConfig(parentScope.record, parentScope.config);                    
                });
		 
	 }]).controller( 'DOCUMENT_NODisplayConfigController', [ '$scope','ALIGNMENT_DROPDOWN_ITEM','$rootScope', 'SCFCommonService',
	        function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
	    	
		     this.model = angular.copy($scope.ngDialogData.record);
		     
		     this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;
				
				function displayExampleConfig (record, obj) {
					var displayMessage = obj.displayDetailPattern;
                    var replacements = [SCFCommonService.camelize(record.alignment), obj.defaultExampleValue];
                    return SCFCommonService.replacementStringFormat(displayMessage, replacements);;
                }
			   
                $rootScope.$on(this.model.fieldName+'DisplayExample', function(event, parentScope) {
                    parentScope.displayExampleMsg = displayExampleConfig(parentScope.record, parentScope.config);                    
                });
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

			 function displayExampleConfig (record, obj) {
				var displayMessage = obj.displayDetailPattern;
				var examplePosDataDisplay = $filter(record.filterType)(vm.exampleRawData, 2);
		    	var exampleNegDataDisplay = $filter(record.filterType)(-vm.exampleRawData, 2);
                var replacements = [SCFCommonService.camelize(record.alignment), examplePosDataDisplay, exampleNegDataDisplay];
               	return SCFCommonService.replacementStringFormat(displayMessage, replacements);
			 }
				 
		     $rootScope.$on(this.model.fieldName+'DisplayExample', function(event, parentScope) {
				 parentScope.displayExampleMsg = displayExampleConfig(parentScope.record, parentScope.config);                    
			 });

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

		      function displayExampleConfig(record, obj) {
                var displayMessage = obj.displayDetailPattern;
                var date = new Date(obj.defaultExampleValue);
				var exampleDataDisplay = $filter('date')(date, record.format);
                var replacements = [SCFCommonService.camelize(record.alignment), record.format.toUpperCase(), exampleDataDisplay];
                return SCFCommonService.replacementStringFormat(displayMessage, replacements);
            }

            $rootScope.$on(this.model.fieldName + 'DisplayExample', function(event, parentScope) {
                parentScope.displayExampleMsg = displayExampleConfig(parentScope.record, parentScope.config);
            });
             
	 }]);
