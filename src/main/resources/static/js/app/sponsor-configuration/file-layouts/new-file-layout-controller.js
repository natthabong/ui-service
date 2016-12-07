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
			
			vm.fileType = FILE_TYPE_ITEM;
			
			var fieldCounter = {};
			
			var newItem = {
                primaryKeyField: false,
                docFieldName: null,
                dataType: null,
                dataLength: 0,
                startIndex: 0
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
               paymentDate: {
            	   strategy: 'FIELD',
            	   fieldName: null
               },
               items: [{
                   primaryKeyField: false,
                   docFieldName: null,
                   dataType: null,
                   dataLength: 0,
                   startIndex: 0
               }]
             }
           }
			 
			vm.model = {};
			vm.paymentDateModel = { }
			vm.setup = function(){
				
				loadDelimiters();
				loadFileEncode();
				loadDataTypes();
				
				if (!angular.isUndefined(selectedItem) && selectedItem != null) {
					vm.newMode = false;
					console.log(selectedItem);
                    sendRequest('/layouts/' + selectedItem.sponsorIntegrateFileConfigId, function(response) {
                         vm.model = response.data;
                         if (vm.model.items.length < 1) {
                             vm.addItem();
                         }
                         vm.reloadPaymentDateFields();
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
                      startIndex: 0
                  };
                  vm.model.items.push(itemConfig);
            }

            vm.removeItem = function(record) {
                  var index = vm.model.items.indexOf(record);
                  vm.model.items.splice(index, 1);
            }
              
            vm.save = function() {
            	vm.model.completed = true;
                vm.model.items.forEach(function(obj, index) {
                    vm.model.completed =  obj.completed && vm.model.completed; 
                })
                 var apiURL = 'api/v1/organize-customers/' +  sponsorId + '/sponsor-configs/SFP/layouts';
                 if(!vm.newMode){
                	 apiURL = apiURL+'/'+vm.model.sponsorIntegrateFileConfigId;
                 }
                 var fileLayoutDiferred = Service.requestURL(apiURL, vm.model, vm.newMode?'POST':'PUT');

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
              
              $scope.$watch('newFileLayoutCtrl.model.items', function() {
                  vm.reloadPaymentDateFields();
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
	console.log(vm.model)
	vm.calendarType = {
		christCalendar : 'AD',
		buddhistCalendar : 'BE'
	};
	
	vm.defaultCalendarType = function(){
		if(angular.isUndefined(vm.model.calendarEra) 
				|| vm.model.calendarEra == null 
				|| vm.model.calendarEra.length == 0){
			vm.model.calendarEra = vm.calendarType.buddhistCalendar;
		}
	};
	
	vm.exampleDateTime = Date.parse('04/13/2016 13:30:55');

	vm.loadDateTimeFormat = function() {

		var diferred = $q.defer();
		vm.dateTimeDropdown = [ {
			label : 'Please select',
			value : ''
		} ];

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

		vm.dateTimeFormat = vm.dateTimeDropdown[0].value;
		return diferred;
	};
	
	vm.loadDateTimeFormat();
	vm.defaultCalendarType();
} ]);

app.controller('NUMERICLayoutConfigController', [ '$scope', '$rootScope', function($scope, $rootScope) {
	this.model = angular.copy($scope.ngDialogData.record);
} ]);

app.controller('PAYMENT_AMOUNTLayoutConfigController', [ '$scope', '$rootScope', function($scope, $rootScope) {
	this.model = angular.copy($scope.ngDialogData.record);
} ]);

app.factory('NewFileLayerExampleDisplayService', ['$filter', function($filter) {
	return {
		TEXT_DisplayExample : TEXT_DisplayExample,
		DOCUMENT_NO_DisplayExample : DOCUMENT_NO_DisplayExample,
		CUSTOMER_CODE_DisplayExample : CUSTOMER_CODE_DisplayExample,
		DATE_TIME_DisplayExample : DATE_TIME_DisplayExample,
		NUMERIC_DisplayExample : NUMERIC_DisplayExample,
		PAYMENT_AMOUNT_DisplayExample : PAYMENT_AMOUNT_DisplayExample
	}

	function TEXT_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', record.expectedValue);
		displayMessage = displayMessage.replace('{exampleData}', config.defaultExampleValue);
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
		displayMessage = displayMessage.replace('{expectedValue}', record.expectedValue);
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
		return '';
	}

	function PAYMENT_AMOUNT_DisplayExample(record, config) {
		return '';
	}
	
	function convertRequiredToString(record){
		return record.required == true ? 'yes' : 'no';
	};
} ]);