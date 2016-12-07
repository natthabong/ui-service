var app = angular.module('scfApp');
app.controller('NewFileLayoutController', [
	'$log',
	'$rootScope',
	'$scope',
	'$state',
	'$stateParams',
	'ngDialog',
	'Service',
	'FILE_TYPE_ITEM',
	'DELIMITER_TYPE_TEM',
	'CHARSET_ITEM',
	function($log, $rootScope, $scope, $state, $stateParams, ngDialog, Service, FILE_TYPE_ITEM, DELIMITER_TYPE_TEM, CHARSET_ITEM) {

		var vm = this;
		var log = $log;

		vm.newMode = true;
		var sponsorId = $rootScope.sponsorId;

		var selectedItem = $stateParams.fileLayoutModel;

		var BASE_URI = 'api/v1/organize-customers/' + sponsorId
			+ '/sponsor-configs/SFP';

		vm.dataTypes = [];

		vm.delimitersDropdown = [];
		vm.dataTypeDropdown = [];
		vm.fileEncodeDropdown = [];
		vm.paymentDateFieldDropdown = [];

		vm.fileType = FILE_TYPE_ITEM;

		var fieldCounter = {};

		var newItem = {
			primaryKeyField : false,
			sponsorFieldName : '',
			dataType : null,
			dataLength : 0,
			startIndex : 0
		}

		var loadDataTypes = function() {
			var serviceURI = 'api/v1/configs/gecscf/layouts/file/data-types';
			var serviceDiferred = Service.doGet(serviceURI, {
				record_type : 'DETAIL'
			});

			serviceDiferred.promise.then(function(response) {
				vm.dataTypes = response.data;
				vm.dataTypes.forEach(function(obj) {
					var item = {
						value : obj.layoutFileDataTypeId,
						label : obj.dataTypeDisplay
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
					label : obj.delimiterName,
					value : obj.delimiterId
				}

				vm.delimitersDropdown.push(selectObj);
			});
		}

		var loadFileEncode = function() {
			CHARSET_ITEM.forEach(function(obj) {
				var selectObj = {
					label : obj.fileEncodeName,
					value : obj.fileEncodeId
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
		var isEmptyValue = function(value) {
			if (angular.isUndefined(value) || value == null) {
				return true;
			}
			return false;
		}
		var addPaymentDateFieldDropdown = function(configItems) {
			var paymentDateDropdown = [ {
				label : 'Please select',
				value : null
			} ];

			if (!isEmptyValue(configItems)) {
				configItems.forEach(function(data) {
					if ('DATE_TIME' == data.dataType && !isEmptyValue(data.displayValue) && data.completed) {
						paymentDateDropdown.push({
							label : data.displayValue,
							value : data.docFieldName
						});
					}
				});
			}

			return paymentDateDropdown;
		}

		var initialModel = function() {
			vm.model = {
				sponsorConfigId : 'SFP',
				sponsorId : sponsorId,
				displayName : null,
				delimeter : ',',
				wrapper : '"',
				fileExtensions : 'csv',
				integrateType : 'SPONSOR_UPLOAD',
				fileType : vm.layoutInfoModel.fileType,
				charsetName : vm.layoutInfoModel.fileEncode,
				checkBinaryFile : false,
				completed : true,
				ownerId : sponsorId,
				items : []
			}
			vm.paymentDateModel = {
				paymentDateType : 'FIELD',
				paymentDateField : null
			}
		}

		vm.model = {};
		vm.paymentDateModel = { }
		vm.setup = function() {

			loadDelimiters();
			loadFileEncode();
			loadDataTypes();

			if (!angular.isUndefined(selectedItem) && selectedItem != null) {
				vm.newMode = false;
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
						id : 'layout-setting-dialog-' + index,
						template : obj.configActionUrl,
						className : 'ngdialog-theme-default',
						controller : dataType + 'LayoutConfigController',
						controllerAs : 'ctrl',
						scope : $scope,
						data : {
							record : record,
							config : obj
						},
						cache : false,
						preCloseCallback : function(value) {
							
							if (value != null) {
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
				primaryKeyField : false,
				sponsorFieldName : '',
				dataType : null,
				dataLength : 0,
				startIndex : 0
			};
			vm.model.items.push(itemConfig);
		}

		vm.removeItem = function(record) {
			var index = vm.model.items.indexOf(record);
			vm.model.items.splice(index, 1);
		}

		vm.save = function() {
			var layoutConfigRequest = getLayoutConfigRequest();
			var apiURL = 'api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/layouts';
			var layoutConfigRequest = {
				sponsorIntegrateFileConfig : vm.model,
				paymentDateField : vm.paymentDateModel
			}
			var fileLayoutDiferred = Service.requestURL(apiURL, layoutConfigRequest, 'POST');

			fileLayoutDiferred.promise.then(function(response) {
				var organizeModel = {
					organizeId : vm.sponsorId
				}
				PageNavigation.gotoPage('/sponsor-configuration', {
					organizeModel : organizeModel
				});
			}).catch(function(response) {
				log.error('Save config fail');
			});
		};

		$scope.$watch('newFileLayoutCtrl.model.items', function() {
			log.debug(vm.model.items);
			vm.reloadPaymentDateFields();
		}, true);

		vm.reloadPaymentDateFields = function() {
			vm.paymentDateFieldDropdown = addPaymentDateFieldDropdown(vm.model.items);
		}

		vm.displayExample = function(record) {
			var msg = '';

			vm.dataTypes.forEach(function(obj) {
				if (record.dataType == obj.layoutFileDataTypeId) {

					if (record.completed) {
						var displayRecordObj = {
							record : record,
							config : obj,
							displayExampleMsg : ''
						};
						$rootScope.$emit(record.dataType+'DisplayExample', displayRecordObj);
						msg = displayRecordObj.displayExampleMsg;
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
app.constant('DELIMITER_TYPE_TEM', [ {
	delimiterName : 'Comma (,)',
	delimiterId : ','
}, {
	delimiterName : 'Colon (:)',
	delimiterId : ':'
}, {
	delimiterName : 'Tab',
	delimiterId : '3'
}, {
	delimiterName : 'Semicolon (;)',
	delimiterId : ';'
}, {
	delimiterName : 'Other',
	delimiterId : 'Other'
} ]);

app.constant('CHARSET_ITEM', [ {
	fileEncodeName : 'UTF-8',
	fileEncodeId : 'UTF-8'
}, {
	fileEncodeName : 'TIS-620',
	fileEncodeId : 'TIS-620'
} ]);

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
        vm.customerCodeGroupDropdown = [{
            label: 'Please select',
            value: ''
        }];

        var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/customer-code-groups';
        var serviceDiferred = Service.doGet(serviceUrl, {
            offset: 0,
            limit: 20
        });
        serviceDiferred.promise.then(function(response) {
            var customerCodeGroupList = response.data;
            if (customerCodeGroupList !== undefined) {
                customerCodeGroupList.forEach(function(obj) {
                    var selectObj = {
                        label: obj.groupName,
                        value: obj.groupName
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
            template: '/configs/layouts/file/data-types/customer-code/new-customer-code',
            className: 'ngdialog-theme-default',
            scope: $scope
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
    
	function displayExampleConfig(record, obj){
		var displayMessage = obj.configDetailPattern;
		var requiredDisplay = record.required == true ? 'yes': 'no';
		
		displayMessage = displayMessage.replace('{required}', requiredDisplay);
		displayMessage = displayMessage.replace('{expectedValue}', record.expectedValue);
		displayMessage = displayMessage.replace('{exampleData}', obj.defaultExampleValue);
		return displayMessage;
	}
	
	$rootScope.$on(this.model.dataType+'DisplayExample', function(event, parentScope) {
		parentScope.displayExampleMsg = displayExampleConfig(parentScope.record, parentScope.config); 
	});
} ]);

app.controller('DATE_TIMELayoutConfigController', [ '$scope', '$rootScope', function($scope, $rootScope) {
	this.model = angular.copy($scope.ngDialogData.record);
} ]);

app.controller('NUMERICLayoutConfigController', [ '$scope', '$rootScope', function($scope, $rootScope) {
	this.model = angular.copy($scope.ngDialogData.record);
} ]);

app.controller('PAYMENT_AMOUNTLayoutConfigController', [ '$scope', '$rootScope', function($scope, $rootScope) {
	this.model = angular.copy($scope.ngDialogData.record);
} ]);