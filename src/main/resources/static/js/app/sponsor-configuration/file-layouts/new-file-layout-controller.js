var app = angular.module('scfApp');
app.controller('NewFileLayoutController', [
		'$log',
		'$rootScope',
		'$scope',
		'$state',
		'$stateParams',
		'Service',
		'FILE_TYPE_ITEM',
		'DELIMITER_TYPE_TEM',
		'CHARSET_ITEM',
		function($log, $rootScope, $scope, $state, $stateParams, Service, FILE_TYPE_ITEM, DELIMITER_TYPE_TEM, CHARSET_ITEM) {

			var vm = this;
			var log = $log;

			vm.newMode = true;
			var sponsorId = $rootScope.sponsorId;
			
			var selectedItem = $stateParams.fileLayoutModel;

			var BASE_URI = 'api/v1/organize-customers/' + sponsorId
					+ '/sponsor-configs/SFP';
			
			vm.delimitersDropdown = [];
			vm.dataTypeDropdown = [];
			vm.fileEncodeDropdown = [];
			vm.paymentDateFieldDropdown = [];
			
			vm.fileType = FILE_TYPE_ITEM;
			
			var fieldCounter = {};
			
			var newItem = {
                primaryKeyField: false,
                sponsorFieldName: '',
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
                    response.data.forEach(function(obj) {
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
               var items = [{
                   label: 'Please select',
                   value: null
               }];
               
               if (!isEmptyValue(configItems)) {
                   configItems.forEach(function(data) {
						if ('DATE_TIME' == data.dataType && !isEmptyValue(data.displayValue)) {
							items.push({
								label: data.displayValue,
								value: data.docFieldName
							});
						}
                   });
               }
               return items;
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
               fileType: vm.layoutInfoModel.fileType,
               charsetName: vm.layoutInfoModel.fileEncode,
               checkBinaryFile: false,
               completed: true,
               ownerId: sponsorId,
               items: []
             }
             vm.paymentDateModel = {
                 paymentDateType: 'FIELD',
                 paymentDateField: null
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
                         console.log(vm.model);
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
			
			
			vm.save = function() {
                  var layoutConfigRequest = getLayoutConfigRequest();
                  var apiURL = 'api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/layouts';
                  var layoutConfigRequest = {
                		  sponsorIntegrateFileConfig: vm.model,
                		  paymentDateField: vm.paymentDateModel
                  }
                  var fileLayoutDiferred = Service.requestURL(apiURL, layoutConfigRequest, 'POST');

                  fileLayoutDiferred.promise.then(function(response) {
                      var organizeModel = {
                          organizeId: vm.sponsorId
                      }
                      PageNavigation.gotoPage('/sponsor-configuration', {
                          organizeModel: organizeModel
                      });
                  }).catch(function(response) {
                      log.error('Save config fail');
                  });
              };
              
              vm.addItem = function() {
            	  var itemConfig = {
                      primaryKeyField: false,
                      sponsorFieldName: '',
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
              
              $scope.$watch('newFileLayoutCtrl.model.items', function() {
            	  log.debug(vm.model.items);
                  vm.reloadPaymentDateFields();
              }, true);
              
              vm.reloadPaymentDateFields = function(){
            	  vm.paymentDateFieldDropdown = addPaymentDateFieldDropdown(vm.model.items);
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
