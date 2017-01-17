var app = angular.module('scfApp');
app.controller('NewFileLayoutController', [
		'$log',
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'ngDialog',
		'Service',
		'PageNavigation',
		'FILE_TYPE_ITEM',
		'DELIMITER_TYPE_TEM',
		'CHARSET_ITEM', '$injector',
		function($log, $rootScope, $scope, $state, $stateParams, ngDialog, Service, PageNavigation, FILE_TYPE_ITEM, DELIMITER_TYPE_TEM, CHARSET_ITEM, $injector) {

			var vm = this;
			var log = $log;

			vm.newMode = true;
			var sponsorId = $rootScope.sponsorId;
			
			var selectedItem = $stateParams.fileLayoutModel;

			var BASE_URI = 'api/v1/organize-customers/' + sponsorId
					+ '/sponsor-configs/SFP';
			
			
			vm.dataTypes = [];
			 
			vm.delimitersDropdown = [];
			vm.dataTypeDropdown = [{
				value: null,
                label: 'Please select'
            }];
			vm.fileEncodeDropdown = [];
			vm.paymentDateFieldDropdown = [];
			vm.credittermFieldDropdown = [];
			
			vm.fileType = FILE_TYPE_ITEM;
			
			var fieldCounter = {};
			
			var newItem = {
                primaryKeyField: false,
                docFieldName: null,
                dataType: null,
                dataLength: 0,
                startIndex: 0
            }
			
			vm.dataDetailItems = [];
						
			vm.backToSponsorConfigPage = function(){
				PageNavigation.gotoPreviousPage();
			}
			
			var loadDataTypes = function() {
                var serviceURI = 'api/v1/configs/gecscf/layouts/file/data-types';
                var serviceDiferred = Service.doGet(serviceURI, {
                    record_type: 'DETAIL'
                });

                serviceDiferred.promise.then(function(response) {
                	vm.dataTypes = response.data;
                	vm.dataTypes.forEach(function(obj) {
	                	var item = {
	            			 value: obj.layoutFileDataTypeId,
	                         label: obj.dataTypeDisplay
	                    }
                        vm.dataTypeDropdown.push(item);
                    });

                }).catch(function(response) {
                    log.error('Load customer code group data error');
                });
            }
			
			
			var loadDelimiters = function() {
				DELIMITER_TYPE_TEM.forEach(function(obj) {
                    var selectObj = {
                        label: obj.delimiterName,
                        value: obj.delimiterId
                    }

                    vm.delimitersDropdown.push(selectObj);
                });
            }
			
			var loadFileEncode = function() {
				CHARSET_ITEM.forEach(function(obj) {
                    var selectObj = {
                        label: obj.fileEncodeName,
                        value: obj.fileEncodeId
                    }

                    vm.fileEncodeDropdown.push(selectObj);
                });
           }
			
		   var sendRequest = function(uri, succcesFunc, failedFunc) {
                 var serviceDiferred = Service.doGet(BASE_URI + uri);

                 var failedFunc = failedFunc | function(response) {
                     log.error('Load data error');
                 };
                 serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
            }
		   var isEmptyValue =  function (value) {
               if (angular.isUndefined(value) || value == null) {
                   return true;
               }
               return false;
           }
		   
		   var addPaymentDateFieldDropdown = function(configItems) {
               var paymentDateDropdown = [{
                   label: 'Please select',
                   value: null
               }];
               
               if (!isEmptyValue(configItems)) {
            	   fieldCounter = {};
                   configItems.forEach(function(data) {
						if ('DATE_TIME' == data.dataType && !isEmptyValue(data.displayValue) && data.completed) {
							paymentDateDropdown.push({
								label: data.displayValue,
								value: data.docFieldName
							});
						}
						
						if(!fieldCounter[data.dataType]){
							fieldCounter[data.dataType] = 1;
						}
						else{
							fieldCounter[data.dataType]++;
						}
                   });
               }
               
               return paymentDateDropdown;
           }
		   
		   var initialModel = function() {
             vm.model = {
               sponsorConfigId: 'SFP',
               sponsorId: sponsorId,
               displayName: null,
               delimeter: ',',
               wrapper: '"',
               fileExtensions: 'csv',
               integrateType: 'SPONSOR_UPLOAD',
               fileType: 'CSV',
               charsetName: 'TIS-620',
               checkBinaryFile: false,
               completed: false,
               ownerId: sponsorId,
               paymentDateConfig: {
            	   strategy: 'FIELD',
            	   fieldName: null
               },
               items: [{
                   primaryKeyField: false,
                   docFieldName: null,
                   dataType: null,
                   isTransient: false,
                   dataLength: 0,
                   startIndex: 0
               }]
             }
           }
			 
			vm.model = {};
			vm.paymentDateModel = { }

			vm.paymentDateFormularModelDropdowns = [];
			
			vm.setup = function(){
				
				loadDelimiters();
				loadFileEncode();
				loadDataTypes();
				
				if (!angular.isUndefined(selectedItem) && selectedItem != null) {
					vm.newMode = false;
					var reqUrlLayoutConfg = '/layouts/' + selectedItem.layoutConfigId;
					var reqUrlField = '/layouts/' + selectedItem.layoutConfigId + '/items?itemType=FIELD';
					var reqUrlData = '/layouts/' + selectedItem.layoutConfigId + '/items?itemType=DATA';
					var reqUrlFormula = '/payment-date-formulas/';
					
					sendRequest(reqUrlLayoutConfg, function(response) {
                        vm.model = response.data;
                        vm.reloadPaymentDateFields();
                    });					
					
					sendRequest(reqUrlField, function(response) {
                        vm.model.items = response.data;
                        if (vm.model.items.length < 1) {
                            vm.addItem();
                        }                        
                    });
					
					sendRequest(reqUrlData, function(response) {
                        var detailData = response.data;
                        	detailData.forEach(function(item) {
                        		vm.dataDetailItems.push(item);
                        	})
                    });
					
					sendRequest(reqUrlFormula, function(response) {
                        var formulaData = response.data;
                        	formulaData.forEach(function(item) {
        	                	var paymentDateFormulaItem = {
        		            			 value: item.paymentDateFormulaId,
        		                         label: item.formulaName
        		                }                        			
                        		vm.paymentDateFormularModelDropdowns.push(paymentDateFormulaItem);
                        	})
                        	vm.model.paymentDateConfig.formula.paymentDateFormulaId = ""+vm.model.paymentDateConfig.formula.paymentDateFormulaId;
                        	
                    });					
                     
                 } else {
                	 initialModel();
                 }
			}
			
			vm.setup();
			
			vm.openSetting = function(index, record) {
                var dataType = record.dataType;
                log.debug(dataType);
                vm.dataTypes.forEach(function(obj) {
                    if (dataType == obj.layoutFileDataTypeId) {

                        var dialog = ngDialog.open({
                            id: 'layout-setting-dialog-' + index,
                            template: obj.configActionUrl,
                            className: 'ngdialog-theme-default',
                            controller: dataType + 'LayoutConfigController',
                            controllerAs: 'ctrl',
                            scope: $scope,
                            data: {
                                record: record,
                                config: obj
                            },
                            cache: false,
                            preCloseCallback: function(value) {
                                if (value != null) {
									if(value.docFieldName == null){
										 var field = obj.docFieldName;
										 var patt=/{sequenceNo}/g; 
										 var res = field.match(patt);
										 if(res!=null){
											 field = field.replace(patt, fieldCounter[dataType]++);
										 }
										 value.docFieldName = field;
									}
									angular.copy(value, record);
									record.completed = true;
                                }
                            }
                        });
                    }
                });

            }
			
			vm.addItem = function() {
            	  var itemConfig = {
                      primaryKeyField: false,
                      docFieldName: null,
                      dataType: null,
                      dataLength: 0,
                      startIndex: 0,
                      isTransient: false,
                      itemType: 'FIELD'
                  };
                  vm.model.items.push(itemConfig);
            }

            vm.removeItem = function(record) {
                  var index = vm.model.items.indexOf(record);
                  vm.model.items.splice(index, 1);
            }
            
            vm.formula = {
            	paymentDateFormulaId : null,	
            	formulaName: '',
            	formulaType: 'CREDIT_TERM',
            	sponsorId: sponsorId,
            	isCompleted: '0'
            };
            
            vm.newFormulaDialogId = null;
            
            vm.openNewFormula = function(){
            	
            	 vm.formula = {
                     	paymentDateFormulaId : null,	
                     	formulaName: '',
                     	formulaType: 'CREDIT_TERM',
                     	sponsorId: sponsorId,
                     	isCompleted: '0'
                 };
            	
            	 vm.newFormulaDialog = ngDialog.open({
                    id: 'new-formula-dialog',
                    template: '/js/app/sponsor-configuration/file-layouts/dialog-new-formula.html',
                    className: 'ngdialog-theme-default',
                    controller: 'NewPaymentDateFormulaController',
                    controllerAs: 'ctrl',
                    scope: $scope,
                    data: {
                    	formula: vm.formula
                    },
                    cache: false,
                    preCloseCallback: function(value) {
                    	vm.formula = value;
                    	vm.refershFormulaDropDown();
                    }
                });	
            	
            	vm.newFormulaDialogId = vm.newFormulaDialog.id;
            };

    		
    		vm.refershFormulaDropDown = function(){
    			var serviceGetFormula = '/api/v1/organize-customers/' + sponsorId
				+ '/sponsor-configs/SFP/payment-date-formulas/';    			
                var serviceDiferred = Service.doGet(serviceGetFormula);
                serviceDiferred.promise.then(function(response) {
                    var formulaData = response.data;
                    vm.paymentDateFormularModelDropdowns = [];
                    formulaData.forEach(function(item) {
    	                	var paymentDateFormulaItem = {
    		            			 value: item.paymentDateFormulaId,
    		                         label: item.formulaName
    		                }                        			
    	                	vm.paymentDateFormularModelDropdowns.push(paymentDateFormulaItem);
                    })
                    console.log(vm.formula);
                    vm.model.paymentDateConfig.formula.paymentDateFormulaId = ""+vm.formula.paymentDateFormulaId;                    
                });
    		}

              
            vm.save = function() {
            	vm.model.completed = true;
            	var sponsorLayout = angular.copy(vm.model);
            	vm.dataDetailItems.forEach(function(detailItem) {
            		sponsorLayout.items.push(detailItem);
            	});
            	
            	sponsorLayout.items.forEach(function(obj, index) {
            		sponsorLayout.completed =  obj.completed && sponsorLayout.completed; 
                })
                 var apiURL = 'api/v1/organize-customers/' +  sponsorId + '/sponsor-configs/SFP/layouts';
                 if(!vm.newMode){
                	 vm.model.paymentDateConfig.sponsorLayoutPaymentDateConfigId = vm.model.layoutConfigId;
                	 apiURL = apiURL+'/'+vm.model.layoutConfigId;
                 }
                 var fileLayoutDiferred = Service.requestURL(apiURL, sponsorLayout, vm.newMode?'POST':'PUT');

                 fileLayoutDiferred.promise.then(function(response) {
                      var organizeModel = {
                          organizeId: sponsorId
                      }
                      PageNavigation.gotoPage('/sponsor-configuration', {
                          organizeModel: organizeModel
                      });
                  }).catch(function(response) {
                      log.error('Save config fail');
                  });
              };
              
              var addCredittermFields = function(configItems){
            	  var creditermDropdowns = [{
                      label: 'Please select',
                      value: null
                  }];
            	  
            	  if(angular.isDefined(configItems) && configItems.length > 0){
            		  configItems.forEach(function(data) {
            			  if (!isEmptyValue(data.displayValue) && data.completed) {
            				  creditermDropdowns.push({
    								label: data.displayValue,
    								value: data.docFieldName
    							});
    						}
            		  });
            	  }            	  
            	  vm.credittermFieldDropdown = creditermDropdowns;
              }
              
              
              $scope.$watch('newFileLayoutCtrl.model.items', function() {
                  vm.reloadPaymentDateFields();
                  addCredittermFields(vm.model.items);
              }, true);
              
              vm.reloadPaymentDateFields = function(){
            	  vm.paymentDateFieldDropdown = addPaymentDateFieldDropdown(vm.model.items);
			  }
              
              vm.displayExample = function(record) {
      			var msg = '';
      			vm.dataTypes.forEach(function(obj) {
      				if (record.dataType == obj.layoutFileDataTypeId) {

      					if (record.completed) {
      						msg = $injector.get('NewFileLayerExampleDisplayService')[record.dataType + '_DisplayExample'](record, obj);
      					}
      				}
      			});
      			return msg;
		}

		vm.addDataItem = function(dataItems) {
			var itemConfig = {
				primaryKeyField : false,
				docFieldName : null,
				dataType : null,
				dataLength : 0,
				startIndex : 0,
				isTransient: false,
				itemType: 'DATA'
			};
			dataItems.push(itemConfig)
		}
		
		vm.removeDataItem = function(dataItems, item){
			var index = dataItems.indexOf(item);
			dataItems.splice(index, 1);
		}
		
		vm.getDetailFieldSize = function(){
			return vm.model.items.length;
		}
		
		vm.isEven = function(fieldSize, currentIndex){
			return (fieldSize + currentIndex) % 2 == 0 ? true: false;
		}
		
		vm.dataRowNo = function(fieldSize, currentIndex){
			return (fieldSize + currentIndex) + 1;
		}
		
		vm.isSaveCheckedDisplay = function(item){
			return !item.isTransient;
		}
		
		vm.saveField = function(item){
			item.isTransient = !item.isTransient;
		}
		
		
		vm.formulaTypeDisplay = function(creditTermField, creditTermItems){
			var displayResult = '';
			
			if(angular.isUndefined(creditTermItems) && creditTermItems.length == 0){
				return displayResult;
			}
			
			if(isEmptyValue(creditTermField)){
				return displayResult;
			}
			
			creditTermItems.forEach(function(creditTerm){
				if(creditTerm.value == creditTermField){
					displayResult = creditTerm.label;
				}
			});
			return displayResult;
		}

	} ]);

app.constant('FILE_TYPE_ITEM', {
	fixedLength : 'FIXEDLENGTH',
	delimited : 'CSV'
});
app.constant('DELIMITER_TYPE_TEM', [{
    delimiterName: 'Comma (,)',
    delimiterId: ','
}, {
    delimiterName: 'Colon (:)',
    delimiterId: ':'
}, {
    delimiterName: 'Tab',
    delimiterId: '3'
}, {
    delimiterName: 'Semicolon (;)',
    delimiterId: ';'
}, {
    delimiterName: 'Other',
    delimiterId: 'Other'
}]);

app.constant('CHARSET_ITEM', [{
    fileEncodeName: 'UTF-8',
    fileEncodeId: 'UTF-8'
}, {
    fileEncodeName: 'TIS-620',
    fileEncodeId: 'TIS-620'
}]);

app.controller('TEXTLayoutConfigController', [ '$scope', '$rootScope', function($scope, $rootScope) {
	this.model = angular.copy($scope.ngDialogData.record);
} ]);

app.controller('DOCUMENT_NOLayoutConfigController', [ '$scope', '$rootScope', function($scope, $rootScope) {
	this.model = angular.copy($scope.ngDialogData.record);
} ]);

app.controller('CUSTOMER_CODELayoutConfigController', [ '$scope', '$rootScope', '$q', 'Service', 'ngDialog',
	function($scope, $rootScope, $q, Service, ngDialog) {
		var vm = this;
		vm.sponsorId = $rootScope.sponsorId;
		this.model = angular.copy($scope.ngDialogData.record);

		this.customerCodeGroupDropdown = [];

		vm.loadCustomerCodeGroup = function() {
			var diferred = $q.defer();
			vm.customerCodeGroupDropdown = [ {
				label : 'Please select',
				value : ''
			} ];

			var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/customer-code-groups';
			var serviceDiferred = Service.doGet(serviceUrl, {
				offset : 0,
				limit : 20
			});
			serviceDiferred.promise.then(function(response) {
				var customerCodeGroupList = response.data;
				if (customerCodeGroupList !== undefined) {
					customerCodeGroupList.forEach(function(obj) {
						var selectObj = {
							label : obj.groupName,
							value : obj.groupName
						}
						vm.customerCodeGroupDropdown.push(selectObj);
					});
				}
				diferred.resolve(vm.customerCodeGroupDropdown);
			}).catch(function(response) {
				$log.error('Load Customer Code Group Fail');
				diferred.reject();
			});

			return diferred;
		};

		vm.loadCustomerCodeGroup();

		vm.newCustomerCodeGroup = function() {
			vm.newCustCodeDialog = ngDialog.open({
				id : 'new-customer-code-setting-dialog',
				template : '/configs/layouts/file/data-types/customer-code/new-customer-code',
				className : 'ngdialog-theme-default',
				scope : $scope
			});
			vm.newCustCodeDialogId = vm.newCustCodeDialog.id;
		};

		vm.saveNewCustomerGroup = function() {
			vm.customerCodeGroupRequest.sponsorId = vm.sponsorId;
			vm.customerCodeGroupRequest.completed = false;

			var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/customer-code-groups';
			var serviceDiferred = Service.requestURL(serviceUrl, vm.customerCodeGroupRequest, 'POST');
			serviceDiferred.promise.then(function(response) {
				if (response !== undefined) {
					if (response.message !== undefined) {
						vm.messageError = response.message;
					} else {
						var loadCustCodeDiferred = vm.loadCustomerCodeGroup();
						loadCustCodeDiferred.promise.then(function() {
							vm.model.expectedValue = response.groupName;
						});
						ngDialog.close(vm.newCustCodeDialogId);
					}
				}
			}).catch(function(response) {
				$log.error('Save customer Code Group Fail');
			});
		};
	} ]);

app.controller('DATE_TIMELayoutConfigController', [ '$scope', '$rootScope', '$q', 'Service', function($scope, $rootScope, $q, Service) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	
	vm.calendarType = {
		christCalendar : 'AD',
		buddhistCalendar : 'BE'
	};
	
	vm.defaultCalendarType = function(){
		if(angular.isUndefined(vm.model.calendarEra) 
				|| vm.model.calendarEra == null 
				|| vm.model.calendarEra.length == 0){
			vm.model.calendarEra = vm.calendarType.christCalendar;
			vm.model.datetimeFormat = 'dd/MM/yyyy';
		}
	};
	
	vm.exampleDateTime = Date.parse('04/13/2016 13:30:55');

	vm.loadDateTimeFormat = function() {

		var diferred = $q.defer();
		vm.dateTimeDropdown = [];

		var serviceUrl = 'js/app/sponsor-configuration/file-layouts/date_time_format.json';
		var serviceDiferred = Service.doGet(serviceUrl);
		serviceDiferred.promise.then(function(response) {
			var dateTimeDropdownList = response.data;
			if (dateTimeDropdownList !== undefined) {
				dateTimeDropdownList.forEach(function(obj) {
					var selectObj = {
						label : obj.dateTimeName,
						value : obj.dateTimeId
					}
					vm.dateTimeDropdown.push(selectObj);
				});
			}
			diferred.resolve(vm.dateTimeDropdown);
			
		}).catch(function(response) {
			$log.error('Load date time format Fail');
			diferred.reject();
		});


		return diferred;
	};
	
	vm.loadDateTimeFormat();
	vm.defaultCalendarType();
} ]);

app.controller('NUMERICLayoutConfigController', [ '$scope', '$rootScope', '$q', 'Service', '$filter', function($scope, $rootScope, $q, Service, $filter) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	vm.config = $scope.ngDialogData.config;
	vm.numericeModel = {
		numericTypeFormat : '',
		signFlagTypeFormat : '',
		disableCustomField : true,
		usePadding : false,
		signFlag: ''
	}

	vm.numericType = {
		anyNumericFormat : 'ANY',
		customNumericFormat : 'CUSTOM'
	}

	vm.signFlagType = {
		ignorePlusSymbol : 'IGNORE_PLUS',
		needPlusSymbol : 'NEES_PLUS',
		avoidPlusSymbol : 'AVOID_PLUS'
	}

	vm.checkCustomNumeric = function() {
        if (vm.numericeModel.numericTypeFormat == 'ANY') {
            vm.numericeModel.disableCustomField = true;            
            vm.numericeModel.usePadding = false;
            
            vm.model.has1000Separator = null;
            vm.model.hasDecimalPlace = null;
            vm.model.decimalPlace = 2;
            vm.model.paddingCharacter = '';
        } else if (vm.numericeModel.numericTypeFormat == 'CUSTOM') {
            vm.numericeModel.disableCustomField = false;
        }
    };
    
    vm.loadSignFlagList = function() {
        var diferred = $q.defer();
        vm.signFlagDropdown = [];

        var serviceUrl = 'js/app/sponsor-configuration/file-layouts/sign_flag_list.json';
        var serviceDiferred = Service.doGet(serviceUrl);
        serviceDiferred.promise.then(function(response) {

            var signFlagList = response.data;
            if (signFlagList !== undefined) {
                signFlagList.forEach(function(obj) {
                    var selectObj = {
                        label: obj.signFlagName,
                        value: obj.signFlagName
                    }
                    vm.signFlagDropdown.push(selectObj);
                });
                vm.numericeModel.signFlag = vm.signFlagDropdown[0].value;
            }
            diferred.resolve(vm.signFlagDropdown);
        }).catch(function(response) {
            $log.error('Load date time format Fail');
            diferred.reject();
        });
        return diferred;
    }
    
    vm.initLoad = function(){
    	if(isDefaultCusomNumeric(vm.model)){
    		vm.numericeModel.numericTypeFormat = vm.numericType.customNumericFormat;
    	}else{
    		vm.numericeModel.numericTypeFormat = vm.numericType.anyNumericFormat;
    	}
    	vm.checkCustomNumeric();
    	vm.loadSignFlagList();    	
    	if(isValueEmpty(vm.model.signFlagTypeFormat)){
    		vm.model.signFlagTypeFormat = vm.signFlagType.ignorePlusSymbol;
    	}
    	if(vm.model.signFlagId == null){
    		vm.numericeModel.signFlag = "Within field";
    	}
    }
    
    vm.initLoad();
    
    vm.resetPadding = function(){
    	if(!vm.numericeModel.usePadding){
    		vm.model.paddingCharacter = null;
    	}
	}
    var defaultExampleValue = vm.config.defaultExampleValue;
	$scope.$watch('ctrl.model', function() {
		vm.examplePosDataDisplay = parseFloat(defaultExampleValue).toFixed(vm.model.decimalPlace);
		vm.exampleNegDataDisplay = parseFloat(-defaultExampleValue).toFixed(vm.model.decimalPlace);
	}, true);

	function isDefaultCusomNumeric(model){
    	var isCustomField = false;
    	if(!isValueEmpty(model.paddingCharacter)){
    		isCustomField = true;
    		vm.numericeModel.usePadding = true;
    	}
    	
    	if(model.has1000Separator){
    		isCustomField = true;
    	}
    	
    	if(model.hasDecimalPlace){
    		isCustomField = true;
    	}
    	return isCustomField;
    }
    
    function isValueEmpty(value){
    	if(angular.isUndefined(value) || value == null || value.length == 0){
    		return true;
    	}
    	return false;
    }
    
} ]);

app.controller('PAYMENT_AMOUNTLayoutConfigController', [ '$scope', '$rootScope', '$q', 'Service', '$filter', function($scope, $rootScope, $q, Service, $filter) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	
	vm.config = $scope.ngDialogData.config;
	vm.numericeModel = {
		numericTypeFormat : '',
		signFlagTypeFormat : '',
		disableCustomField : true,
		usePadding : false,
		signFlag: ''
	}
	
	vm.numericType = {
			anyNumericFormat : 'ANY',
			customNumericFormat : 'CUSTOM'
		}

		vm.signFlagType = {
			ignorePlusSymbol : 'IGNORE_PLUS',
			needPlusSymbol : 'NEES_PLUS',
			avoidPlusSymbol : 'AVOID_PLUS'
		}

		vm.checkCustomNumeric = function() {
	        if (vm.numericeModel.numericTypeFormat == 'ANY') {
	            vm.numericeModel.disableCustomField = true;            
	            vm.numericeModel.usePadding = false;
	            
	            vm.model.has1000Separator = null;
	            vm.model.hasDecimalPlace = null;
	            vm.model.decimalPlace = 2;
	            vm.model.paddingCharacter = '';
	        } else if (vm.numericeModel.numericTypeFormat == 'CUSTOM') {
	            vm.numericeModel.disableCustomField = false;
	        }
	    };
	    
	    vm.loadSignFlagList = function() {
	        var diferred = $q.defer();
	        vm.signFlagDropdown = [];

	        var serviceUrl = 'js/app/sponsor-configuration/file-layouts/sign_flag_list.json';
	        var serviceDiferred = Service.doGet(serviceUrl);
	        serviceDiferred.promise.then(function(response) {

	            var signFlagList = response.data;
	            if (signFlagList !== undefined) {
	                signFlagList.forEach(function(obj) {
	                    var selectObj = {
	                        label: obj.signFlagName,
	                        value: obj.signFlagName
	                    }
	                    vm.signFlagDropdown.push(selectObj);
	                });
	                vm.numericeModel.signFlag = vm.signFlagDropdown[0].value;
	            }
	            diferred.resolve(vm.signFlagDropdown);
	        }).catch(function(response) {
	            $log.error('Load date time format Fail');
	            diferred.reject();
	        });
	        return diferred;
	    }
	    
	    vm.initLoad = function(){
	    	if(isDefaultCusomNumeric(vm.model)){
	    		vm.numericeModel.numericTypeFormat = vm.numericType.customNumericFormat;
	    	}else{
	    		vm.numericeModel.numericTypeFormat = vm.numericType.anyNumericFormat;
	    	}
	    	vm.checkCustomNumeric();
	    	vm.loadSignFlagList();    	
	    	if(isValueEmpty(vm.model.signFlagTypeFormat)){
	    		vm.model.signFlagTypeFormat = vm.signFlagType.ignorePlusSymbol;
	    	}
	    }
	    
	    vm.initLoad();
	    
	    vm.resetPadding = function(){
	    	if(!vm.numericeModel.usePadding){
	    		vm.model.paddingCharacter = null;
	    	}
		}    
	    
	    var defaultExampleValue = vm.config.defaultExampleValue;
		$scope.$watch('ctrl.model', function() {
			vm.examplePosDataDisplay = parseFloat(defaultExampleValue).toFixed(vm.model.decimalPlace);
			vm.exampleNegDataDisplay = parseFloat(-defaultExampleValue).toFixed(vm.model.decimalPlace);
		}, true);

		function isDefaultCusomNumeric(model){
	    	var isCustomField = false;
	    	if(!isValueEmpty(model.paddingCharacter)){
	    		isCustomField = true;
	    		vm.numericeModel.usePadding = true;
	    	}
	    	
	    	if(model.has1000Separator){
	    		isCustomField = true;
	    	}
	    	
	    	if(model.hasDecimalPlace){
	    		isCustomField = true;
	    	}
	    	return isCustomField;
	    }
	    
	    function isValueEmpty(value){
	    	if(angular.isUndefined(value) || value == null || value.length == 0){
	    		return true;
	    	}
	    	return false;
	    }
} ]);

app.controller("DOCUMENT_TYPELayoutConfigController", ['$scope', '$rootScope', '$q', 'Service', '$filter', function($scope, $rootScope, $q, Service, $filter) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	vm.requiredChange = function(){
		if(vm.model.required == false){
			vm.model.defaultValue = null;
		}
	}
}]);

app.factory('NewFileLayerExampleDisplayService', ['$filter', function($filter) {
	return {
		TEXT_DisplayExample : TEXT_DisplayExample,
		DOCUMENT_NO_DisplayExample : DOCUMENT_NO_DisplayExample,
		CUSTOMER_CODE_DisplayExample : CUSTOMER_CODE_DisplayExample,
		DATE_TIME_DisplayExample : DATE_TIME_DisplayExample,
		NUMERIC_DisplayExample : NUMERIC_DisplayExample,
		PAYMENT_AMOUNT_DisplayExample : PAYMENT_AMOUNT_DisplayExample,
		DOCUMENT_TYPE_DisplayExample: DOCUMENT_TYPE_DisplayExample
	}

	function TEXT_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;
		var hasExpected = !(angular.isUndefined(record.expectedValue) || record.expectedValue === null);
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', (hasExpected?record.expectedValue:''));
		displayMessage = displayMessage.replace('{exampleData}', (hasExpected?record.expectedValue:config.defaultExampleValue));
		return displayMessage;
	}

	function DOCUMENT_NO_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', record.expectedValue);
		displayMessage = displayMessage.replace('{exampleData}', config.defaultExampleValue);
		return displayMessage;
	}

	function CUSTOMER_CODE_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', record.expectedValue || '-');
		displayMessage = displayMessage.replace('{exampleData}', config.defaultExampleValue);
		return displayMessage;
	}
	
	function DATE_TIME_DisplayExample(record, config) {
		
		if(angular.isUndefined(record.datetimeFormat) || record.datetimeFormat.length == 0){
			return '';
		}
		var displayMessage = config.configDetailPattern;
		
		var calendarEra = "Christ calendar (A.D.)";
    	if(record.calendarEra == "BE"){
    		calendarEra = "Buddhist calendar (B.E.)";
    	}
    	
    	var dateDefault = new Date(config.defaultExampleValue);
    	
    	displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
    	displayMessage = displayMessage.replace('| {conditionUploadDate}', '');
    	displayMessage = displayMessage.replace('{dateTimeFormat}',record.datetimeFormat.toUpperCase());
    	displayMessage = displayMessage.replace('{calendarType}', calendarEra);
    	displayMessage = displayMessage.replace('{exampleData}', $filter('date')(dateDefault, record.datetimeFormat));
    	
		return displayMessage;
	}

	function NUMERIC_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;
		
		var numberFormatDisplay = 'Any numeric format'
// if (record.dataFormat.numericTypeFormat == 'CUSTOM') {
// numberFormatDisplay = 'Custom numeric format'
// }

		var signFlagTypeDisplay = '';
		if (record.signFlagTypeFormat == "IGNORE_PLUS") {
			signFlagTypeDisplay = ' Within field (ignore plus symbol (+) on positive value)'
		} else if (record.signFlagTypeFormat == "NEES_PLUS") {
			signFlagTypeDisplay = ' Within field (need plus symbol (+) on positive value)'
		} else if (record.signFlagTypeFormat == "AVOID_PLUS") {
			signFlagTypeDisplay = ' Within field (avoid plus symbol (+) on positive value)'
		}

		var examplePosDataDisplay = parseFloat(config.defaultExampleValue).toFixed(record.decimalPlace);
		var exampleNegDataDisplay = parseFloat(-config.defaultExampleValue).toFixed(record.decimalPlace);
		
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));

		displayMessage = displayMessage.replace('{numberFormat}', numberFormatDisplay);
		displayMessage = displayMessage.replace('{decimalPlace}', record.decimalPlace);
		displayMessage = displayMessage.replace('{signFlag}', signFlagTypeDisplay);
		displayMessage = displayMessage.replace('{positiveExampleData}', examplePosDataDisplay);
		displayMessage = displayMessage.replace('{negativeExampleData}', exampleNegDataDisplay);		

		return displayMessage;
	}

	function PAYMENT_AMOUNT_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;
		
		var numberFormatDisplay = 'Any numeric format'
// if (record.dataFormat.numericTypeFormat == 'CUSTOM') {
// numberFormatDisplay = 'Custom numeric format'
// }

		var signFlagTypeDisplay = '';
		if (record.signFlagTypeFormat == "IGNORE_PLUS") {
			signFlagTypeDisplay = ' Within field (ignore plus symbol (+) on positive value)'
		} else if (record.signFlagTypeFormat == "NEES_PLUS") {
			signFlagTypeDisplay = ' Within field (need plus symbol (+) on positive value)'
		} else if (record.signFlagTypeFormat == "AVOID_PLUS") {
			signFlagTypeDisplay = ' Within field (avoid plus symbol (+) on positive value)'
		}

		var examplePosDataDisplay = parseFloat(config.defaultExampleValue).toFixed(record.decimalPlace);
		var exampleNegDataDisplay = parseFloat(-config.defaultExampleValue).toFixed(record.decimalPlace);
		
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));

		displayMessage = displayMessage.replace('{numberFormat}', numberFormatDisplay);
		displayMessage = displayMessage.replace('{decimalPlace}', record.decimalPlace);
		displayMessage = displayMessage.replace('{signFlag}', signFlagTypeDisplay);
		displayMessage = displayMessage.replace('{positiveExampleData}', examplePosDataDisplay);
		displayMessage = displayMessage.replace('{negativeExampleData}', exampleNegDataDisplay);		

		return displayMessage;
	}
	
	function DOCUMENT_TYPE_DisplayExample(record, config){
		var displayMessage = config.configDetailPattern;

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', record.expectedValue || '-');
		displayMessage = displayMessage.replace('{exampleData}', config.defaultExampleValue);
		displayMessage = displayMessage.replace('{defaultValue}', record.defaultValue == null ? '-' : record.defaultValue);
		return displayMessage;
	}
	
	function convertRequiredToString(record){
		return record.required == true ? 'yes' : 'no';
	};
} ]);

app.controller('NewPaymentDateFormulaController', [ '$scope', '$rootScope','Service','ngDialog', function($scope, $rootScope, Service, ngDialog) {
	var vm = this;

	vm.formula = angular.copy($scope.ngDialogData.formula);
	vm.sponsorId  = angular.copy($scope.ngDialogData.formula.sponsorId);
	
	vm.saveNewFormula = function() {
		var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/payment-date-formulas';
		var serviceDiferred = Service.requestURL(serviceUrl, vm.formula, 'POST');
		serviceDiferred.promise.then(function(response) {
			ngDialog.close('new-formula-dialog',response);
		}); 
	};
} ]);