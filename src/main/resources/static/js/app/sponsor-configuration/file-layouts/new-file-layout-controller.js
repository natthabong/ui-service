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
	'CHARSET_ITEM', '$injector', '$q',
	'UIFactory',
	'blockUI',
	function($log, $rootScope, $scope, $state, $stateParams, ngDialog, Service, 
		PageNavigation, FILE_TYPE_ITEM, DELIMITER_TYPE_TEM, CHARSET_ITEM, $injector, 
		$q, UIFactory, blockUI) {

		var vm = this;
		var log = $log;

		vm.manageAll=false;
		
		vm.newMode = true;
		var sponsorId = $rootScope.sponsorId;

		var selectedItem = $stateParams.fileLayoutModel;

		var BASE_URI = 'api/v1/organize-customers/' + sponsorId
			+ '/sponsor-configs/SFP';


		vm.dataTypes = [];
		vm.dataTypeHeaders = [];
		vm.dataTypeFooters = [];
		
		vm.configHeader = false;
		vm.configFooter = false;
		vm.isConfigOffsetRowNo = false; 

		vm.paymentDateConfigStrategy = {
			'FIELD' : 'FIELD',
			'FORMULA' : 'FORMULA'
		}
		
		vm.recordType = {
				'HEADER': 'HEADER',
				'DETAIL': 'DETAIL',
				'FOOTER': 'FOOTER'
			}

		var defaultDropdown = [ {
			value : null,
			label : 'Please select'
		} ];

		vm.delimitersDropdown = [];
		vm.dataTypeDropdown = angular.copy(defaultDropdown);
		vm.dataTypeHeaderDropdown = angular.copy(defaultDropdown);
		vm.dataTypeFooterDropdown = angular.copy(defaultDropdown);
		
		vm.specificsDropdown = [];
		vm.specificModel = null;

		vm.fileEncodeDropdown = [];
		vm.paymentDateFieldDropdown = [];
		vm.credittermFieldDropdown = [];

		vm.fileType = FILE_TYPE_ITEM;

		var fieldCounter = {};

		var newItem = {
			primaryKeyField : false,
			docFieldName : null,
			dataType : null,
			dataLength : 0,
			startIndex : 0
		}

		vm.headerItems = [];

		vm.items = [];
		vm.dataDetailItems = [];

		vm.footerItems = [];

		vm.backToSponsorConfigPage = function() {
			PageNavigation.gotoPreviousPage();
		}

		var loadDataTypes = function() {
			var serviceURI = 'api/v1/configs/gecscf/layouts/file/data-types';
			var serviceDiferred = Service.doGet(serviceURI, {
				recordType : 'DETAIL'
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

		var loadHeaderDataTypes = function() {
			var serviceURI = 'api/v1/configs/gecscf/layouts/file/data-types';
			var serviceDiferred = Service.doGet(serviceURI, {
				recordType : 'HEADER'
			});

			serviceDiferred.promise.then(function(response) {
				vm.dataTypeHeaders = response.data;
				vm.dataTypeHeaders.forEach(function(obj) {
					var item = {
						value : obj.layoutFileDataTypeId,
						label : obj.dataTypeDisplay
					}
					vm.dataTypeHeaderDropdown.push(item);
				});

			}).catch(function(response) {
				log.error('Load data type header data error');
			});
		}

		var loadFooterDataTypes = function() {
			var serviceURI = 'api/v1/configs/gecscf/layouts/file/data-types';
			var serviceDiferred = Service.doGet(serviceURI, {
				recordType : 'FOOTER'
			});

			serviceDiferred.promise.then(function(response) {
				vm.dataTypeFooters = response.data;
				vm.dataTypeFooters.forEach(function(obj) {
					var item = {
						value : obj.layoutFileDataTypeId,
						label : obj.dataTypeDisplay
					}
					vm.dataTypeFooterDropdown.push(item);
				});

			}).catch(function(response) {
				log.error('Load data type footer data error');
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
		
		var loadFileSpecificsData = function() {
			var diferred = $q.defer();
			var serviceUrl = 'js/app/sponsor-configuration/file-layouts/specifics_data.json';
			var serviceDiferred = Service.doGet(serviceUrl);
			serviceDiferred.promise.then(function(response) {
				
				var specificModels = response.data;
				if (specificModels !== undefined) {
					specificModels.forEach(function(obj) {
						var selectObj = {
							label : obj.specificName,
							value : obj.specificName,
							item : obj.specificItem
						}
						vm.specificsDropdown.push(selectObj);
					});
				}

				diferred.resolve(vm.specificModels);
			}).catch(function(response) {
				$log.error('Load relational operators format Fail');
				diferred.reject();
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
				fieldCounter = {};
				configItems.forEach(function(data) {
					if ('DATE_TIME' == data.dataType && !isEmptyValue(data.displayValue) && data.completed && !data.isTransient) {
						paymentDateDropdown.push({
							label : data.displayValue,
							value : data.docFieldName
						});
					}

					if (!fieldCounter[data.dataType]) {
						fieldCounter[data.dataType] = 1;
					} else {
						fieldCounter[data.dataType]++;
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
				integrateType : 'IMPORT',
				fileType : 'FIXED_LENGTH',
				charsetName : 'TIS-620',
				checkBinaryFile : false,
				completed : false,
				ownerId : sponsorId,
				paymentDateConfig : {
					strategy : 'FIELD',
					documentDateField : null,
					paymentDateFormulaId : null
				}
			}

			vm.items = [ {
				primaryKeyField : false,
				docFieldName : null,
				dataType : null,
				isTransient : false,
				dataLength : null,
				startIndex : null,
				endIndex : null,
				recordType : "DETAIL",
				itemType : 'FIELD'
			} ];

			vm.delimeter = ',';
			vm.delimeterOther = '';
			
			vm.specificModel = 'Specific 1'			
		}

		vm.paymentDateFormularModelDropdowns = [];
		var addPaymentDateFormulaDropdown = function(formulaData) {
			var dropdownPleaseSelect = [ {
				label : 'Please select',
				value : null,
				formulaType : ''
			} ];
			vm.paymentDateFormularModelDropdowns = dropdownPleaseSelect;

			if (formulaData.length > 0) {
				formulaData.forEach(function(item) {
					var paymentDateFormulaItem = {
						value : item.paymentDateFormulaId,
						label : item.formulaName,
						formulaType : item.formulaType
					}
					vm.paymentDateFormularModelDropdowns.push(paymentDateFormulaItem);
				})

			}
		}

		vm.model = {
			ownerId : sponsorId,
			paymentDateConfig : {
				strategy : 'FIELD',
				documentDateField : null,
				paymentDateFormulaId : null
			}
		};
		
		vm.displayLayout = false;
		
		vm.setup = function() {
			loadDelimiters();
			loadFileEncode();
			loadDataTypes();
			loadHeaderDataTypes();
			loadFooterDataTypes();
			loadFileSpecificsData();
			
			if (!angular.isUndefined(selectedItem) && selectedItem != null) {
				vm.newMode = false;
				var reqUrlLayoutConfg = '/layouts/' + selectedItem.layoutConfigId;
				var reqUrlHeaderField = '/layouts/' + selectedItem.layoutConfigId + '/items?itemType=FIELD&recordType=HEADER';
				var reqUrlFooterField = '/layouts/' + selectedItem.layoutConfigId + '/items?itemType=FIELD&recordType=FOOTER';
				var reqUrlField = '/layouts/' + selectedItem.layoutConfigId + '/items?itemType=FIELD&recordType=DETAIL';
				var reqUrlData = '/layouts/' + selectedItem.layoutConfigId + '/items?itemType=DATA&recordType=DETAIL';
				var reqUrlFormula = '/payment-date-formulas/';
				var reqCustomerCodeConfg = '/layouts/' + selectedItem.layoutConfigId + '/items?dataType=CUSTOMER_CODE';

				sendRequest(reqUrlLayoutConfg, function(response) {
					vm.model = response.data;
					
					vm.oldStateFileType = vm.model.fileType;
					if(angular.isDefined(vm.model.offsetRowNo) && vm.model.offsetRowNo != null){
						vm.isConfigOffsetRowNo = true;
					}
					
					vm.reloadPaymentDateFields();

					if (vm.model.delimeter != null && vm.model.delimeter != '') {
						vm.delimeter = 'Other';
						vm.delimeterOther = vm.model.delimeter;
						
						DELIMITER_TYPE_TEM.forEach(function(obj) {
							if (obj.delimiterId == vm.model.delimeter) {
								vm.delimeter = vm.model.delimeter;
								vm.delimeterOther = '';
							}
						});
					}

					if (vm.model.fileType != 'CSV') {
						vm.delimeter = ',';
						vm.delimeterOther = '';
					}
					vm.specificModel = 'Specific 1';		
					vm.displayLayout = true;
				});
				
				vm.customerCodeGroup = '';	
				sendRequest(reqCustomerCodeConfg, function(response) {
					vm.customerCodeItem = response.data;
					if (vm.customerCodeItem.length == 1) {
						vm.customerCodeGroup = vm.customerCodeItem[0].expectedValue;
					}
				});

				sendRequest(reqUrlField, function(response) {
					vm.items = response.data;
					if (vm.items.length < 1) {
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
					addPaymentDateFormulaDropdown(formulaData);
				});

				sendRequest(reqUrlHeaderField, function(response) {
					var headerItems = response.data;
					if (headerItems.length > 0) {
						vm.configHeader = true;
						vm.headerItems = headerItems;
					}
				});

				sendRequest(reqUrlFooterField, function(response) {
					var footerItems = response.data;
					if (footerItems.length > 0) {
						vm.configFooter = true;
						vm.footerItems = footerItems;
					}
				});
				
			} else {
				initialModel();
				addPaymentDateFormulaDropdown([]);
				vm.displayLayout = true;
			}
		}

		vm.setup();

		vm.tempDocFieldName = [];
		
		var settingDocFieldName = function(record, value, dataTypeObj) {
			if (value.docFieldName == null) {
				if (dataTypeObj.docFieldName != null) {
					var field = dataTypeObj.docFieldName;
					var patt = /{sequenceNo}/g;
					var res = field.match(patt);
					if (res != null) {
						//field = field.replace(patt, fieldCounter[record.dataType]++);
						for (i = 1; i <= fieldCounter[record.dataType]; i++) { 
							var tempField = field.replace(patt, i);
							if(vm.tempDocFieldName.indexOf(tempField) == -1) {
								vm.tempDocFieldName.push(tempField);
								field = field.replace(patt, i);
								break;
							}
						}
					}
					value.docFieldName = field;
				}
			}
			return value;
		}

		vm.openSetting = function(index, record) {
			var dataType = record.dataType;
			var recordType = record.recordType;
			
			if(recordType == vm.recordType.HEADER){
				dataTypeDropdowns = vm.dataTypeHeaders;
			}else if(recordType == vm.recordType.DETAIL){
				dataTypeDropdowns = vm.dataTypes;
			}else{
				dataTypeDropdowns = vm.dataTypeFooters;
			}
			
			dataTypeDropdowns.forEach(function(obj) {
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
							config : obj,
							headerItems : vm.headerItems,
							detailItems : vm.items,
							footerItems : vm.footerItems
						},
						cache : false,
						preCloseCallback : function(value) {
							if (value != null) {
								if(value.dataType === 'CUSTOMER_CODE'){
									vm.loadCustomerCodeGroup();
								}
								value = settingDocFieldName(record, value, obj);
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
				docFieldName : null,
				dataType : null,
				dataLength : null,
				startIndex : null,
				endIndex : null,
				isTransient : false,
				recordType : "DETAIL",
				itemType : 'FIELD'
			};
			vm.items.push(itemConfig);
		}

		vm.addHeaderItem = function() {
			var headerItemConfig = {
				primaryKeyField : false,
				docFieldName : null,
				dataType : null,
				dataLength : null,
				startIndex : null,
				endIndex : null,
				isTransient : true,
				recordType : "HEADER",
				itemType : 'FIELD'
			};
			vm.headerItems.push(headerItemConfig);
		}

		vm.addFooterItem = function() {
			var footerItemConfig = {
				primaryKeyField : false,
				docFieldName : null,
				dataType : null,
				dataLength : null,
				startIndex : null,
				endIndex : null,
				isTransient : true,
				recordType : "FOOTER",
				itemType : 'FIELD'
			};
			vm.footerItems.push(footerItemConfig);
		}

		vm.removeItem = function(record) {
			var index = vm.itemsindexOf(record);
			vm.items.splice(index, 1);
		}

		vm.formula = {
			paymentDateFormulaId : null,
			formulaName : '',
			formulaType : 'CREDIT_TERM',
			sponsorId : sponsorId,
			isCompleted : '0'
		};

		vm.openNewFormula = function() {

			vm.formula = {
				paymentDateFormulaId : null,
				formulaName : '',
				formulaType : 'CREDIT_TERM',
				sponsorId : sponsorId,
				isCompleted : '0'
			};

			vm.newFormulaDialog = ngDialog.open({
				id : 'new-formula-dialog',
				template : '/js/app/sponsor-configuration/file-layouts/dialog-new-formula.html',
				className : 'ngdialog-theme-default',
				controller : 'NewPaymentDateFormulaController',
				controllerAs : 'ctrl',
				scope : $scope,
				data : {
					formula : vm.formula,
					paymentDateFormulaId : ''
				},
				cache : false,
				preCloseCallback : function(value) {
					vm.model.paymentDateConfig.paymentDateFormulaId = value;
					vm.refershFormulaDropDown();
					return true;
				}
			});
		};


		vm.refershFormulaDropDown = function() {
			var serviceGetFormula = '/api/v1/organize-customers/' + sponsorId
				+ '/sponsor-configs/SFP/payment-date-formulas';
			var serviceDiferred = Service.doGet(serviceGetFormula);
			serviceDiferred.promise.then(function(response) {
				var formulaData = response.data;
				vm.paymentDateFormularModelDropdowns = [];

				addPaymentDateFormulaDropdown(formulaData);
			});
		}

		var addHeaderModel = function(model, headerItems) {
			headerItems.forEach(function(item) {
				model.items.push(item);
			});
		}

		var addFooterModel = function(model, footerItems) {
			footerItems.forEach(function(item) {
				model.items.push(item);
			});
		}

		vm.save = function() {
			UIFactory.showConfirmDialog({
				data : {
					headerMessage : 'Confirm save?'
				},
				confirm : $scope.confirmSave,
				onSuccess: function(response){
					dialogSuccess = UIFactory.showSuccessDialog({
						data: {
							headerMessage : 'Edit file layout complete.',
							bodyMessage : ''
						},
						preCloseCallback: function(){
							vm.backToSponsorConfigPage();
						}
				    });
				},
				onFail : function(response) {
					blockUI.stop();
				}
			});
		}

		$scope.confirmSave = function() {
			
			var sponsorLayout = null;
			vm.model.completed = true;
			
			if(vm.model.fileType == vm.fileType.specific){
					vm.specificsDropdown.forEach(function(obj) {
						vm.model.fileExtensions = obj.item.fileExtensions;
						if(obj.value == vm.specificModel){
							sponsorLayout = angular.copy(vm.model);
							sponsorLayout.sponsorConfigId = obj.item.sponsorConfigId;
							sponsorLayout.headerRecordType = obj.item.headerRecordType;
							sponsorLayout.detailRecordType = obj.item.detailRecordType;
							sponsorLayout.footerRecordType = obj.item.footerRecordType;
							sponsorLayout.integrateType = obj.item.integrateType;
							sponsorLayout.fileExtensions = obj.item.fileExtensions;
							sponsorLayout.fileType = obj.item.fileType;
							sponsorLayout.completed = obj.item.completed;
							sponsorLayout.paymentDateConfig = obj.item.paymentDateConfig;
							if(vm.model.layoutConfigId !=null && vm.items.length >0){
								sponsorLayout.items = [];
								addHeaderModel(sponsorLayout, vm.headerItems);
								vm.items.forEach(function(item) {
									if(item.dataType == 'CUSTOMER_CODE' && vm.customerCodeGroup !=null){
										item.expectedValue = vm.customerCodeGroup;
									}
									sponsorLayout.items.push(item);
								});	
								
								vm.dataDetailItems.forEach(function(item) {
									if(item.dataType == 'CUSTOMER_CODE' && vm.customerCodeGroup !=null){
										item.expectedValue = vm.customerCodeGroup;
									}									
									sponsorLayout.items.push(item);
								});
								
							}else{					        
								sponsorLayout.items = [];
								obj.item.items.forEach(function(item) {
									if(item.dataType == 'CUSTOMER_CODE' && vm.customerCodeGroup !=null){
										item.expectedValue = vm.customerCodeGroup;
									}									
									sponsorLayout.items.push(item);
								});
								
							}

						}
					});						
			}else{
				
				if (vm.model.fileType == 'CSV') {
					if (vm.delimeter == 'Other') {
						vm.model.delimeter = vm.delimeterOther;
					} else {
						vm.model.delimeter = vm.delimeter;
					}
				}
				
				sponsorLayout = angular.copy(vm.model);
				sponsorLayout.items = angular.copy(vm.items);
				vm.dataDetailItems.forEach(function(detailItem) {
					sponsorLayout.items.push(detailItem);
				});
				
				if(!vm.isConfigOffsetRowNo){
					sponsorLayout.offsetRowNo = null;
				}
	
				addHeaderModel(sponsorLayout, vm.headerItems);
				addFooterModel(sponsorLayout, vm.footerItems);
	
				sponsorLayout.items.forEach(function(obj, index) {
					sponsorLayout.completed = obj.completed && sponsorLayout.completed;
				});			
			}

			var apiURL = 'api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP/layouts';
			if (!vm.newMode) {
				sponsorLayout.paymentDateConfig.sponsorLayoutPaymentDateConfigId = vm.model.layoutConfigId;
				apiURL = apiURL + '/' + vm.model.layoutConfigId;
			}
			
			var fileLayoutDiferred = Service.requestURL(apiURL, sponsorLayout, vm.newMode ? 'POST' : 'PUT');

			return fileLayoutDiferred;

		};

		var addCreditTermFields = function(configItems) {
			var creditermDropdowns = [ {
				label : 'Please select',
				value : null
			} ];

			if (angular.isDefined(configItems) && configItems.length > 0) {
				configItems.forEach(function(data) {
					if (!isEmptyValue(data.displayValue) && data.completed) {
						creditermDropdowns.push({
							label : data.displayValue,
							value : data.docFieldName
						});
					}
				});
			}
			vm.credittermFieldDropdown = creditermDropdowns;
		}


		$scope.$watch('newFileLayoutCtrl.items', function() {
			vm.reloadPaymentDateFields();
			addCreditTermFields(vm.items);
			if(vm.model.paymentDateConfig == null){
				vm.model.paymentDateConfig = {
					strategy : 'FIELD',
					documentDateField : null,
					paymentDateFormulaId : null
				};
			}
		}, true);

		vm.reloadPaymentDateFields = function() {
			vm.paymentDateFieldDropdown = addPaymentDateFieldDropdown(vm.items);
		}

		vm.displayExample = function(record) {
			var msg = '';
			vm.dataTypes.forEach(function(obj) {
				if (record.dataType == obj.layoutFileDataTypeId) {
					if (record.completed) {
						msg = $injector.get('NewFileLayerExampleDisplayService')[record.dataType + '_DisplayExample'](record, obj, vm.customerCodeGroupDropdown);
					}
				}
			});
			return msg;
		}

		vm.isHideSaveCheckbox = function(item) {
			var disabled = false;
			vm.dataTypes.forEach(function(obj) {
				if (item.dataType == obj.layoutFileDataTypeId) {
					if (obj.transient == true) {
						item.isTransient = true;
						disabled = true;
					}
				}
			});
			return disabled;
		}
		
		vm.isChangeDataType = function(item) {
			vm.dataTypes.forEach(function(obj) {
				if (item.dataType == obj.layoutFileDataTypeId) {
					item.isTransient = obj.transient;
				}
			});
		}

		vm.addDataItem = function(dataItems) {
			var itemConfig = {
				primaryKeyField : false,
				docFieldName : null,
				dataType : null,
				dataLength : 0,
				startIndex : 0,
				isTransient : false,
				itemType : 'DATA',
				recordType : "DETAIL"
			};
			dataItems.push(itemConfig)
		}

		vm.removeDataItem = function(dataItems, item) {
			var index = dataItems.indexOf(item);
			dataItems.splice(index, 1);
			
			console.log(vm.tempDocFieldName);
			console.log(item);
			var indexDocFieldName = vm.tempDocFieldName.indexOf(item.docFieldName);
			if(indexDocFieldName>-1){
				vm.tempDocFieldName.splice(indexDocFieldName, 1);
				console.log(vm.tempDocFieldName);
			}
		}

		vm.getDetailFieldSize = function() {
			return vm.items.length;
		}

		vm.getHeaderFieldSize = function() {
			return vm.headerItems.length;
		}

		vm.getFooterFieldSize = function() {
			return vm.footerItems.length;
		}

		vm.isEven = function(fieldSize, currentIndex) {
			return (fieldSize + currentIndex) % 2 == 0 ? true : false;
		}

		vm.dataRowNo = function(fieldSize, currentIndex) {
			return (fieldSize + currentIndex) + 1;
		}

		vm.isSaveCheckedDisplay = function(item) {
			return !item.isTransient;
		}

		vm.saveField = function(item) {
			item.isTransient = !item.isTransient;
		}

		vm.formularTypeDisplayMsg = '';
		vm.formulaTypeDisplay = function(paymentDateFormulaId) {
			var displayResult = '';
			var creditTermItems = vm.paymentDateFormularModelDropdowns;
			if (angular.isUndefined(creditTermItems) && creditTermItems.length == 0) {
				return displayResult;
			}
			if (isEmptyValue(paymentDateFormulaId)) {
				return displayResult;
			}

			creditTermItems.forEach(function(creditTerm) {
				if (creditTerm.value == paymentDateFormulaId) {
					displayResult = creditTerm.formulaType;
				}
			});
			return displayResult;
		}

		vm.changePaymentDate = function() {
			if (vm.model.paymentDateConfig.strategy == vm.paymentDateConfigStrategy.FIELD) {
				vm.model.paymentDateConfig.formula = null;
				vm.model.paymentDateConfig.creditTermField = null;
				vm.model.paymentDateConfig.paymentDateFormulaId = null;
			}
			vm.model.paymentDateConfig.documentDateField = null;
		}

		vm.clearHeaderConfig = function() {
			if (vm.configHeader == false) {
				vm.headerItems = [];
			} else {
				vm.addHeaderItem();
			}
		}

		vm.clearFooterConfig = function() {
			if (vm.configFooter == false) {
				vm.footerItems = [];
			} else {
				vm.addFooterItem();
			}
		}

		vm.showHeaderConfig = function() {
			if(vm.model.fileType != 'SPECIFIC'){
				return vm.configHeader;
			}else{
				return false;
			}
		}

		vm.showFooterConfig = function() {
			if(vm.model.fileType != 'SPECIFIC'){
				return vm.configFooter;
			}else{
				return false;
			}
		}

		vm.fileTypeChange = function() {
			
			if(vm.oldStateFileType == 'SPECIFIC'){
				vm.headerItems = [];
				vm.items = [];
				vm.dataDetailItems = [];
				vm.footerItems = [];
				vm.dataDetailItems = [];

				vm.configHeader = false;
				vm.configFooter = false;
				
				vm.clearHeaderConfig;
				vm.clearFooterConfig;
				vm.clearRelationField;				
			}
			
			if (vm.model.fileType != 'CSV') {
				vm.delimeter = ',';
				vm.delimeterOther = '';
			}
						
			if(vm.model.fileType == 'SPECIFIC'){
				vm.headerItems = [];
				vm.items = [];
				vm.dataDetailItems = [];
				vm.footerItems = [];
				vm.dataDetailItems = [];

				vm.configHeader = false;
				vm.configFooter = false;
				
				vm.clearHeaderConfig;
				vm.clearFooterConfig;
				vm.clearRelationField;
			}else{
				if(vm.items.length == 0){
					vm.items = [{
						primaryKeyField : false,
						docFieldName : null,
						dataType : null,
						isTransient : false,
						dataLength : null,
						startIndex : null,
						endIndex : null,
						recordType : "DETAIL",
						itemType : 'FIELD'
					}];					
				}
				vm.customerCodeGroup = '';
			}
			
			vm.oldStateFileType = vm.model.fileType;
			
		}

		vm.delimeterChange = function() {
			if (vm.delimeter != 'Other') {
				vm.delimeterOther = '';
			}
		}
		
		vm.loadCustomerCodeGroup = function(groupName) {
			var diferred = $q.defer();
			vm.customerCodeGroupDropdown = [{
				label : 'Please select',
				value : ''
			}];

			var serviceUrl = '/api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP/customer-code-groups';
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
							value : obj.groupId
						}
						vm.customerCodeGroupDropdown.push(selectObj);
						if(groupName!=null && groupName==obj.groupName){
							vm.customerCodeGroup = obj.groupId;
						}
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

//		vm.newCustomerCodeGroup = function() {	    
//			vm.newCustomerCodeGroupDialog = ngDialog.open({
//				id : 'new-customer-code-setting-dialog',
//				template : '/configs/layouts/file/data-types/customer-code/new-customer-code',
//				className : 'ngdialog-theme-default',
//				controller : 'NewFileLayoutController',
//				controllerAs : 'ctrl',
//				scope : $scope,
//				preCloseCallback : function(value) {
//					if(value!=null){
//						var loadCustCodeDiferred = vm.loadCustomerCodeGroup(value.groupName);									
//					}				
//				}
//			});
//		};
//		
//		vm.saveNewCustomerGroup = function() {
//			vm.customerCodeGroupRequest.sponsorId = sponsorId;
//			vm.customerCodeGroupRequest.completed = false;
//
//			var serviceUrl = '/api/v1/organize-customers/' + sponsorId + '/sponsor-configs/SFP/customer-code-groups';
//			var serviceDiferred = Service.requestURL(serviceUrl, vm.customerCodeGroupRequest, 'POST');
//			serviceDiferred.promise.then(function(response) {
//				if (response !== undefined) {
//					if (response.message !== undefined) {
//						vm.messageError = response.message;
//					} else {
//						vm.closeThisDialog = $scope.closeThisDialog
//						vm.closeThisDialog(vm.customerCodeGroupRequest);
//					}
//				}
//			}).catch(function(response) {
//				$log.error('Save customer Code Group Fail');
//			});
//		};
		
	} ]);

app.constant('FILE_TYPE_ITEM', {
	fixedLength : 'FIXED_LENGTH',
	delimited : 'CSV',
	specific : 'SPECIFIC'
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
							value : obj.groupId
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
		
//		vm.newCustomerCodeGroupDialog = null;
//		vm.newCustomerCodeGroup = function() {
//		    vm.newCustomerCodeGroupDialog = ngDialog.open({
//				id : 'new-customer-code-setting-dialog',
//				template : '/configs/layouts/file/data-types/customer-code/new-customer-code',
//				className : 'ngdialog-theme-default',
//				scope : $scope
//			});
//		};
//
//		vm.saveNewCustomerGroup = function() {
//			vm.customerCodeGroupRequest.sponsorId = vm.sponsorId;
//			vm.customerCodeGroupRequest.completed = false;
//
//			var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/customer-code-groups';
//			var serviceDiferred = Service.requestURL(serviceUrl, vm.customerCodeGroupRequest, 'POST');
//			serviceDiferred.promise.then(function(response) {
//				if (response !== undefined) {
//					if (response.message !== undefined) {
//						vm.messageError = response.message;
//					} else {
//					    ngDialog.close(vm.newCustomerCodeGroupDialog.id);
//						var loadCustCodeDiferred = vm.loadCustomerCodeGroup();
//						loadCustCodeDiferred.promise.then(function() {
//							vm.model.expectedValue = response.groupId;
//							vm.customerCodeGroupRequest.groupId = vm.model.expectedValue;
//							
//						});
//						
//					}
//				}
//			}).catch(function(response) {
//				$log.error('Save customer Code Group Fail');
//			});
//		};
		
		
	} ]);

app.controller('DATE_TIMELayoutConfigController', [ '$scope', '$rootScope', '$q', 'Service', function($scope, $rootScope, $q, Service) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	vm.config = $scope.ngDialogData.config;
	var headerItems = $scope.ngDialogData.headerItems;

	vm.requiredRelationalOperators = false;
	vm.relationalOperators = [];
	vm.loadRelationalOperator = function() {

		var diferred = $q.defer();
		vm.relationalOperators = [];

		var serviceUrl = 'js/app/sponsor-configuration/file-layouts/date_relational_operators.json';
		var serviceDiferred = Service.doGet(serviceUrl);
		serviceDiferred.promise.then(function(response) {
			var dateRelationalOperatorList = response.data;
			if (dateRelationalOperatorList !== undefined) {
				dateRelationalOperatorList.forEach(function(obj) {
					var selectObj = {
						label : obj.dateRelationalOperatorName,
						value : obj.dateRelationalOperatorId
					}
					vm.relationalOperators.push(selectObj);
				});
				if (vm.model.recordType == 'FOOTER') {
					var equalToHeadderField = {
						label : 'Equal to header field',
						value : 'EQUAL_TO_HEADER_FIELD'
					}
					vm.relationalOperators.push(equalToHeadderField);
				}
				vm.selectedRelationalOperators = vm.relationalOperators[0].value;
				initDateTime();
			}
			diferred.resolve(vm.relationalOperators);

		}).catch(function(response) {
			$log.error('Load relational operators format Fail');
			diferred.reject();
		});
	}

	vm.relationalField = [];
	var pleaseSelect = {
		label : 'Please select',
		value : null
	}
	vm.relationalField.push(pleaseSelect);

	vm.calendarType = {
		christCalendar : 'A.D.',
		buddhistCalendar : 'B.E.'
	};

	vm.defaultCalendarType = function() {
		if (angular.isUndefined(vm.model.calendarEra)
			|| vm.model.calendarEra == null
			|| vm.model.calendarEra.length == 0) {
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
	vm.loadRelationalOperator();

	vm.disableRelationDropdown = function() {
		var isDisable = false;
		if (vm.selectedRelationalOperators == 'EQUAL_TO_HEADER_FIELD' && vm.requiredRelationalOperators) {
			isDisable = false;
		} else {
			isDisable = true;
		}
		return isDisable;
	};

	vm.saveDateTimeValidation = function() {
		
		if(vm.requiredRelationalOperators){
			vm.model.validationType = vm.selectedRelationalOperators;
			if(vm.selectedRelationalOperators == 'EQUAL_TO_HEADER_FIELD'){
				vm.relationalField.forEach(function(dropdownItem) {			
					if(vm.selectedRelationalField == dropdownItem.label){
						vm.model.validationRecordFieldConfig = dropdownItem.item;
					}
				});		
			}else{
				vm.model.validationRecordFieldId = null;
				vm.model.validationRecordFieldConfig = null;
			}
		}else{
			vm.model.validationType = null;
		}
		
	}
	
	vm.clearRelationField = function(){
		vm.selectedRelationalField = null;
	}

	var headerDatetimeList = function() {		
		headerItems.forEach(function(item) {
			if (item.completed && item.dataType == 'DATE_TIME') {
				var itemDropdown = {
					label : item.displayValue,
					value : item.displayValue,
					item: item
				}
				vm.relationalField.push(itemDropdown);
			}
		});
	}
	headerDatetimeList();
	
	var initDateTime = function(){
		if(angular.isDefined(vm.model.validationType) && vm.model.validationType != null){
			 vm.selectedRelationalOperators = vm.model.validationType;
			 vm.requiredRelationalOperators = true;
		}
		
		if(angular.isDefined(vm.model.validationRecordFieldConfig) && vm.model.validationRecordFieldConfig != null){			
			vm.selectedRelationalField = vm.model.validationRecordFieldConfig.displayValue;
		}
	}
	
	
} ]);

app.controller('NUMERICLayoutConfigController', [ '$scope', '$rootScope', '$q', 'Service', '$filter', function($scope, $rootScope, $q, Service, $filter) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	vm.config = $scope.ngDialogData.config;
	
	var headerItems = $scope.ngDialogData.headerItems;
	var detailItems = $scope.ngDialogData.detailItems;
	var footerItems = $scope.ngDialogData.footerItems;
	
	vm.requiredRelationalSummary = false;
	vm.relationalSummary = [];
	var diferred = $q.defer();
		
	var serviceUrl = 'js/app/sponsor-configuration/file-layouts/numeric_relational_summary.json';
	var serviceDiferred = Service.doGet(serviceUrl);
	serviceDiferred.promise.then(function(response) {
		var dateRelationalSummaryList = response.data;
		if (dateRelationalSummaryList !== undefined) {
			dateRelationalSummaryList.forEach(function(obj) {
				var selectObj = {
					label : obj.dateRelationalSummaryName,
					value : obj.dateRelationalSummaryId
				}
				vm.relationalSummary.push(selectObj);
			});
			if(vm.model.validationType == null){
				vm.selectedRelationalSummary = vm.relationalSummary[0].value;
			}else{
				vm.requiredRelationalSummary = true;
				vm.selectedRelationalSummary = vm.model.validationType;
			}
		}
		diferred.resolve(vm.relationalOperators);

	}).catch(function(response) {
		$log.error('Load relational operators format Fail');
		diferred.reject();
	});

	vm.clearRelationField = function(){
		vm.selectedRelationalField = null;
	}
	
	vm.numericeModel = {
		numericTypeFormat : '',
		signFlagTypeFormat : '',
		disableCustomField : true,
		usePadding : false,
		signFlag : '',
		signFlagId : null
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
			vm.model.paddingCharacter = null;
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
						label : obj.signFlagName,
						value : obj.signFlagName
					}
					vm.signFlagDropdown.push(selectObj);
				});
				vm.numericeModel.signFlag = vm.signFlagDropdown[0].value;
				if(vm.model.signFlagConfig != null){
					vm.numericeModel.signFlag = vm.signFlagDropdown[1].value;
					vm.numericeModel.signFlagId = vm.model.signFlagConfig.displayValue;			
				}		
			}
			diferred.resolve(vm.signFlagDropdown);
		}).catch(function(response) {
			$log.error('Load date time format Fail');
			diferred.reject();
		});
		return diferred;
	}
	
	vm.loadSignFlagFieldList = function() {
		var diferred = $q.defer();
		vm.signFlagFieldDropdown = [];
		var pleaseSelect = {
				label : 'Please select',
				value : null,
				item: null			
		}
		vm.signFlagFieldDropdown.push(pleaseSelect);
		vm.numericeModel.signFlagId = null;		
		
		if(vm.config.recordType == 'HEADER'){
			headerFlagList();
		}else if(vm.config.recordType == 'FOOTER'){
			footerFlagList();
		}else{
			detailFlagList();
		}
	}

	vm.signFlagDataChange = function() {
		
		vm.numericeModel.signFlagId = null;
		vm.model.signFlagTypeFormat = null;
		
		if(vm.numericeModel.signFlag == vm.signFlagDropdown[1].value){
			vm.loadSignFlagFieldList();
			vm.numericeModel.signFlagId = vm.signFlagFieldDropdown[0].value;
		}else if(vm.numericeModel.signFlag == vm.signFlagDropdown[0].value){
			vm.model.signFlagTypeFormat = 'IGNORE_PLUS';
		}
	}
	
	var headerFlagList = function() {		
		headerItems.forEach(function(item , index) {
			if (item.completed && item.dataType == 'SIGN_FLAG') {
				var itemDropdown = {
					label : item.displayValue,
					value : item.displayValue,
					item: item
				}
				vm.signFlagFieldDropdown.push(itemDropdown);
			}
		});		
	}
	
	var detailFlagList = function() {		
		detailItems.forEach(function(item , index) {
			if (item.completed && item.dataType == 'SIGN_FLAG') {
				var itemDropdown = {
					label : item.displayValue,
					value : item.displayValue,
					item: item
				}
				vm.signFlagFieldDropdown.push(itemDropdown);
			}
		});
	}

	var footerFlagList = function() {		
		footerItems.forEach(function(item , index) {
			if (item.completed && item.dataType == 'SIGN_FLAG') {
				var itemDropdown = {
					label : item.displayValue,
					value : item.displayValue,
					item: item
				}
				vm.signFlagFieldDropdown.push(itemDropdown);
			}
		});	
	}

	
	vm.relationalField = [];
	var pleaseSelect = {
			label : 'Please select',
			value : null
	}	
	vm.relationalField.push(pleaseSelect);
	
	vm.detailNumericList = function() {
		var diferred = $q.defer();
		vm.relationalField = [];
		var pleaseSelect = {
				label : 'Please select',
				value : null
		}	
		vm.relationalField.push(pleaseSelect);
		
		detailItems.forEach(function(item , index) {
			if (item.completed && item.dataType == 'NUMERIC') {
				var itemDropdown = {
					label : item.displayValue,
					value : item.displayValue,
					item: item
				}
				vm.relationalField.push(itemDropdown);
			}
		});
		
		diferred.resolve(vm.relationalField);
		return diferred;
	}

	vm.initLoad = function() {
		if (isDefaultCusomNumeric(vm.model)) {
			vm.numericeModel.numericTypeFormat = vm.numericType.customNumericFormat;
		} else {
			vm.numericeModel.numericTypeFormat = vm.numericType.anyNumericFormat;
		}
		
		vm.checkCustomNumeric();
		vm.loadSignFlagList();
		vm.loadSignFlagFieldList();
		vm.detailNumericList();
		
		if (isValueEmpty(vm.model.signFlagTypeFormat)) {
			vm.model.signFlagTypeFormat = vm.signFlagType.ignorePlusSymbol;
		}
		if (vm.model.signFlagConfig == null) {
			vm.numericeModel.signFlag = "Within field";
		}

		if(angular.isDefined(vm.model.validationRecordFieldConfig) && vm.model.validationRecordFieldConfig != null && vm.model.validationType != null){
			vm.requiredRelationalSummary = true;
			vm.selectedRelationalSummary = vm.model.validationType;
			vm.selectedRelationalField = vm.model.validationRecordFieldConfig.displayValue;
		}	

	}
	
	vm.initLoad();
	
	vm.disableRelationDropdown = function() {
		var isDisable = false;
		if (vm.selectedRelationalSummary == 'SUMMARY_OF_FIELD' && vm.requiredRelationalSummary) {
			isDisable = false;
		} else {
			isDisable = true;
		}
		return isDisable;
	};

	vm.resetPadding = function() {
		if (!vm.numericeModel.usePadding) {
			vm.model.paddingCharacter = null;
		}
	}
	
	vm.saveNumericValidation = function() {	
		if(vm.numericeModel.signFlag == 'Within field'){
			vm.model.signFlagConfig = null;
			
		}else{
			vm.model.signFlagTypeFormat = null;
			vm.signFlagFieldDropdown.forEach(function(dropdownItem) {	
				if(vm.numericeModel.signFlagId == dropdownItem.value){
					vm.model.signFlagConfig = dropdownItem.item;
				}
			});
		}

		if(vm.requiredRelationalSummary){
			vm.model.validationType = vm.selectedRelationalSummary;
			if(vm.selectedRelationalSummary == 'SUMMARY_OF_FIELD'){
				vm.relationalField.forEach(function(dropdownItem) {			
					if(vm.selectedRelationalField == dropdownItem.value){
						vm.model.validationRecordFieldConfig = dropdownItem.item;
					}
				});		
			}else{
				vm.model.validationRecordFieldId = null;
				vm.model.validationRecordFieldConfig = null;
			}
		}else{
			vm.model.validationType = null;
			vm.model.validationRecordFieldConfig = null;
		}
	}
	
	var defaultExampleValue = vm.config.defaultExampleValue;
	$scope.$watch('ctrl.model', function() {
		vm.examplePosDataDisplay = parseFloat(defaultExampleValue).toFixed(vm.model.decimalPlace);
		vm.exampleNegDataDisplay = parseFloat(-defaultExampleValue).toFixed(vm.model.decimalPlace);
	}, true);

	function isDefaultCusomNumeric(model) {
		var isCustomField = false;
		if (!isValueEmpty(model.paddingCharacter)) {
			isCustomField = true;
			vm.numericeModel.usePadding = true;
		}

		if (model.has1000Separator) {
			isCustomField = true;
		}

		if (model.hasDecimalPlace) {
			isCustomField = true;
		}
		return isCustomField;
	}

	function isValueEmpty(value) {
		if (angular.isUndefined(value) || value == null || value.length == 0) {
			return true;
		}
		return false;
	}

} ]);

app.controller('PAYMENT_AMOUNTLayoutConfigController', [ '$scope', '$rootScope', '$q', 'Service', '$filter', function($scope, $rootScope, $q, Service, $filter) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);

	var detailItems = $scope.ngDialogData.detailItems;

	vm.config = $scope.ngDialogData.config;
	
	vm.requiredRelationalSummary = false;
	vm.relationalSummary = [];
	
	vm.clearRelationField = function(){
		vm.selectedRelationalField = null;
	}
	
	vm.numericeModel = {
		numericTypeFormat : '',
		signFlagTypeFormat : '',
		disableCustomField : true,
		usePadding : false,
		signFlag : ''
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
			vm.model.paddingCharacter = null;
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
						label : obj.signFlagName,
						value : obj.signFlagName
					}
					vm.signFlagDropdown.push(selectObj);
				});
				
				if(vm.model.signFlagConfig != null){
					vm.numericeModel.signFlag = vm.signFlagDropdown[1].value;
					vm.numericeModel.signFlagId = vm.model.signFlagConfig.displayValue;			
				}else{
					vm.numericeModel.signFlag = vm.signFlagDropdown[0].value;
				}
			}
			diferred.resolve(vm.signFlagDropdown);
		}).catch(function(response) {
			$log.error('Load date time format Fail');
			diferred.reject();
		});
		return diferred;
	}
	
	vm.loadSignFlagFieldList = function() {
		var diferred = $q.defer();
		vm.signFlagFieldDropdown = [];
		var pleaseSelect = {
				label : 'Please select',
				value : null,
				item: null			
		}
		vm.signFlagFieldDropdown.push(pleaseSelect);
		vm.numericeModel.signFlagId = null;		
		
		if(vm.config.recordType == 'HEADER'){
			headerFlagList();
		}else if(vm.config.recordType == 'FOOTER'){
			footerFlagList();
		}else{
			detailFlagList();
		}
	}
	
	vm.signFlagDataChange = function() {
		
		vm.numericeModel.signFlagId = null;
		vm.model.signFlagTypeFormat = null;
		
		if(vm.numericeModel.signFlag == vm.signFlagDropdown[1].value){
			vm.loadSignFlagFieldList();
			vm.numericeModel.signFlagId = vm.signFlagFieldDropdown[0].value;
		}else if(vm.numericeModel.signFlag == vm.signFlagDropdown[0].value){
			vm.model.signFlagTypeFormat = 'IGNORE_PLUS';
		}
	}
	
	var detailFlagList = function() {		
		detailItems.forEach(function(item , index) {
			if (item.completed && item.dataType == 'SIGN_FLAG') {
				var itemDropdown = {
					label : item.displayValue,
					value : item.displayValue,
					item: item
				}
				vm.signFlagFieldDropdown.push(itemDropdown);
			}
		});
	}
	
	vm.detailNumericList = function() {
		var diferred = $q.defer();
		vm.relationalField = [];
		var pleaseSelect = {
				label : 'Please select',
				value : null
		}	
		vm.relationalField.push(pleaseSelect);
		
		detailItems.forEach(function(item , index) {
			if (item.completed && item.dataType == 'NUMERIC') {
				var itemDropdown = {
					label : item.displayValue,
					value : item.displayValue,
					item: item
				}
				vm.relationalField.push(itemDropdown);
			}
		});
		
		diferred.resolve(vm.relationalField);
		return diferred;
	}

	vm.initLoad = function() {
				
		if (isDefaultCusomNumeric(vm.model)) {
			vm.numericeModel.numericTypeFormat = vm.numericType.customNumericFormat;
		} else {
			vm.numericeModel.numericTypeFormat = vm.numericType.anyNumericFormat;
		}
		vm.checkCustomNumeric();
		vm.loadSignFlagList();
		vm.loadSignFlagFieldList();
		vm.detailNumericList();
				
		if (isValueEmpty(vm.model.signFlagTypeFormat)) {
			vm.model.signFlagTypeFormat = vm.signFlagType.ignorePlusSymbol;
		}
		
		if (vm.model.signFlagConfig == null) {
			vm.numericeModel.signFlag = "Within field";
		}
	}

	vm.initLoad();

	vm.resetPadding = function() {
		if (!vm.numericeModel.usePadding) {
			vm.model.paddingCharacter = null;
		}
	}
	
	vm.saveNumericValidation = function() {
		
		if(vm.numericeModel.signFlag == 'Within field'){
			vm.model.signFlagConfig = null;
			
		}else{
			vm.model.signFlagTypeFormat = null;
			vm.signFlagFieldDropdown.forEach(function(dropdownItem) {
				if(vm.numericeModel.signFlagId == dropdownItem.value){
					vm.model.signFlagConfig = dropdownItem.item;
				}
			});	
		}
	}

	var defaultExampleValue = vm.config.defaultExampleValue;
	$scope.$watch('ctrl.model', function() {
		vm.examplePosDataDisplay = parseFloat(defaultExampleValue).toFixed(vm.model.decimalPlace);
		vm.exampleNegDataDisplay = parseFloat(-defaultExampleValue).toFixed(vm.model.decimalPlace);
	}, true);

	function isDefaultCusomNumeric(model) {
		var isCustomField = false;
		if (!isValueEmpty(model.paddingCharacter)) {
			isCustomField = true;
			vm.numericeModel.usePadding = true;
		}

		if (model.has1000Separator) {
			isCustomField = true;
		}

		if (model.hasDecimalPlace) {
			isCustomField = true;
		}
		return isCustomField;
	}

	function isValueEmpty(value) {
		if (angular.isUndefined(value) || value == null || value.length == 0) {
			return true;
		}
		return false;
	}
} ]);

app.controller("DOCUMENT_TYPELayoutConfigController", [ '$scope', '$rootScope', '$q', 'Service', '$filter', function($scope, $rootScope, $q, Service, $filter) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	vm.requiredChange = function() {
		if (vm.model.required == false) {
			vm.model.defaultValue = null;
		}
	}
} ]);

app.controller('RECORD_TYPELayoutConfigController', [ '$scope', '$rootScope', function($scope, $rootScope) {
	this.model = angular.copy($scope.ngDialogData.record);
	this.model.required = true;
} ]);

app.controller('FILLERLayoutConfigController', [ '$scope', function($scope) {
	var vm = this;

	vm.model = angular.copy($scope.ngDialogData.record);

	vm.fillerTypeDropdown = [
		{
			label : 'Unexpect',
			value : null
		},{
			label : 'Space',
			value : 'space'
		},
		{
			label : 'Zero (0)',
			value : 'zero'
		},
		{
			label : 'Other',
			value : 'other'
		}
	];

	vm.initial = function() {
		vm.fillerType = null;
		vm.model.required = true;
		if (vm.model.expectedValue == null) {
			vm.fillerType = null;
		} else if (vm.model.expectedValue == ' ') {
			vm.fillerType = 'space';
		} else if (vm.model.expectedValue == 0) {
			vm.fillerType = 'zero';
			
			// reset value for display
			vm.model.expectedValue = null;
		} else {
			vm.fillerType = 'other';
		}
	}
	vm.initial();

	vm.disabledOtherFiller = function() {
		if (vm.fillerType != 'other') {
			return true;
		}
		return false;
	}

	vm.changeFiller = function() {
		vm.model.expectedValue = null;
	}

	vm.saveFiller = function() {
		if (vm.fillerType == null) {
			vm.model.expectedValue = null;
		} else if (vm.fillerType == 'space') {
			vm.model.expectedValue = ' ';
		} else if (vm.fillerType == 'zero') {
			vm.model.expectedValue = '0';
		}
	}
} ]);

app.controller("SIGN_FLAGLayoutConfigController", [ '$scope', '$rootScope', '$q', 'Service', '$filter', function($scope, $rootScope, $q, Service, $filter) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	vm.config = $scope.ngDialogData.config;

	vm.model.positiveFlag = vm.model.positiveFlag ? vm.model.positiveFlag : 0;
	vm.model.negativeFlag = vm.model.negativeFlag ? vm.model.negativeFlag : 1;
	
	var defaultExampleValue = vm.config.defaultExampleValue;
	$scope.$watch('ctrl.model', function() {
		vm.examplePosDataDisplay = '(flag: '+vm.model.positiveFlag+', amount: '+parseFloat(defaultExampleValue)+') -> '+parseFloat(defaultExampleValue).toLocaleString();
		vm.exampleNegDataDisplay = '(flag: '+vm.model.negativeFlag+', amount: '+parseFloat(defaultExampleValue)+') -> '+parseFloat(-defaultExampleValue).toLocaleString();
	}, true);
} ]);

app.factory('NewFileLayerExampleDisplayService', [ '$filter', function($filter) {
	return {
		TEXT_DisplayExample : TEXT_DisplayExample,
		DOCUMENT_NO_DisplayExample : DOCUMENT_NO_DisplayExample,
		CUSTOMER_CODE_DisplayExample : CUSTOMER_CODE_DisplayExample,
		DATE_TIME_DisplayExample : DATE_TIME_DisplayExample,
		NUMERIC_DisplayExample : NUMERIC_DisplayExample,
		PAYMENT_AMOUNT_DisplayExample : PAYMENT_AMOUNT_DisplayExample,
		DOCUMENT_TYPE_DisplayExample : DOCUMENT_TYPE_DisplayExample,
		RECORD_TYPE_DisplayExample : RECORD_TYPE_DisplayExample,
		FILLER_DisplayExample : FILLER_DisplayExample,
		SIGN_FLAG_DisplayExample : SIGN_FLAG_DisplayExample,
		MATCHING_REF_DisplayExample : MATCHING_REF_DisplayExample
	}

	function TEXT_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;
		var hasExpected = !(angular.isUndefined(record.expectedValue) || record.expectedValue === null);
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', (hasExpected ? record.expectedValue : ''));
		displayMessage = displayMessage.replace('{exampleData}', (hasExpected ? record.expectedValue : config.defaultExampleValue));
		return displayMessage;
	}
	
	function MATCHING_REF_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;
		var hasExpected = !(angular.isUndefined(record.expectedValue) || record.expectedValue === null);
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', (hasExpected ? record.expectedValue : ''));
		displayMessage = displayMessage.replace('{exampleData}', (hasExpected ? record.expectedValue : config.defaultExampleValue));
		return displayMessage;
	}

	function DOCUMENT_NO_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', record.expectedValue);
		displayMessage = displayMessage.replace('{exampleData}', config.defaultExampleValue);
		return displayMessage;
	}

	function CUSTOMER_CODE_DisplayExample(record, config, customerCodeGroup) {
		var displayMessage = config.configDetailPattern;
		
		var displayCustomerCode = '-';
		customerCodeGroup.forEach(function(obj) {
			if(obj.value==record.expectedValue){
				displayCustomerCode = obj.label;
			}
		});
		
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', displayCustomerCode);
		displayMessage = displayMessage.replace('{exampleData}', config.defaultExampleValue);
		return displayMessage;
	}

	function DATE_TIME_DisplayExample(record, config) {
		if (angular.isUndefined(record.datetimeFormat) || record.datetimeFormat.length == 0) {
			return '';
		}
		var displayMessage = config.configDetailPattern;

		var calendarEra = "Christ calendar (A.D.)";
		if (record.calendarEra == "BE") {
			calendarEra = "Buddhist calendar (B.E.)";
		}

		//2016-04-13T13:30:55
		var defaultDateExample = config.defaultExampleValue;
		var year = defaultDateExample.substring(0, 4);
	    var month = defaultDateExample.substring(5, 7);
	    var day = defaultDateExample.substring(8, 10);    
	    var hours = defaultDateExample.substring(11, 13);
	    var minutes = defaultDateExample.substring(14, 16); 
	    var seconds = defaultDateExample.substring(17, 19);
		var dateDefault = new Date(year, month-1, day, hours, minutes, seconds, 0)
	    
		var displayDateTimeFormat = record.datetimeFormat.replace('HHmmss','T1');
		displayDateTimeFormat = displayDateTimeFormat.replace('HH:mm:ss','T2');
		displayDateTimeFormat = displayDateTimeFormat.toUpperCase();
		displayDateTimeFormat = displayDateTimeFormat.replace('T1','HHMMSS');
		displayDateTimeFormat = displayDateTimeFormat.replace('T2','HH:MM:SS');

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('| {conditionUploadDate}', '');
		displayMessage = displayMessage.replace('{dateTimeFormat}', displayDateTimeFormat);
		displayMessage = displayMessage.replace('{calendarType}', calendarEra);
		displayMessage = displayMessage.replace('{exampleData}', $filter('date')(dateDefault, record.datetimeFormat));

		return displayMessage;
	}

	function NUMERIC_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;

		var numberFormatDisplay = 'Any numeric format'
		if ((record.paddingCharacter != null&&record.paddingCharacter != '') || record.has1000Separator == true || record.hasDecimalPlace == true) {
			var numberFormatDisplay = ''
			if(record.paddingCharacter != null && record.paddingCharacter != ''){
				numberFormatDisplay = numberFormatDisplay + ', Padding character ('+record.paddingCharacter+')';
			}
			if(record.has1000Separator == true){
				numberFormatDisplay = numberFormatDisplay + ', Has 1,000 seperator (,)';
			}
			if(record.hasDecimalPlace == true){
				numberFormatDisplay = numberFormatDisplay + ', Has decimal place (.)';
			}
			numberFormatDisplay = numberFormatDisplay.substring(2);
		}
			
		var signFlagTypeDisplay = '';
		if(record.signFlagConfig !=null){
			signFlagTypeDisplay = ' sign flag field ('+record.signFlagConfig.displayValue+')'
		}else if (record.signFlagTypeFormat == "IGNORE_PLUS") {
			signFlagTypeDisplay = ' within field (ignore plus symbol (+) on positive value)'
		} else if (record.signFlagTypeFormat == "NEES_PLUS") {
			signFlagTypeDisplay = ' within field (need plus symbol (+) on positive value)'
		} else if (record.signFlagTypeFormat == "AVOID_PLUS") {
			signFlagTypeDisplay = ' within field (avoid plus symbol (+) on positive value)'
		}
		
		var examplePosDataDisplay = parseFloat(config.defaultExampleValue).toFixed(record.decimalPlace);
		var exampleNegDataDisplay = parseFloat(-config.defaultExampleValue).toFixed(record.decimalPlace);

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));

		displayMessage = displayMessage.replace('{numberFormat}', numberFormatDisplay);
		
		if(record.decimalPlace != null){
			displayMessage = displayMessage.replace('{decimalPlace}', record.decimalPlace);
		}else{
			displayMessage = displayMessage.replace('{decimalPlace}', '0');
		}
		
		displayMessage = displayMessage.replace('{signFlag}', signFlagTypeDisplay);
		displayMessage = displayMessage.replace('{positiveExampleData}', examplePosDataDisplay);
		displayMessage = displayMessage.replace('{negativeExampleData}', exampleNegDataDisplay);

		return displayMessage;
	}

	function PAYMENT_AMOUNT_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;

		var numberFormatDisplay = 'Any numeric format'

		if ((record.paddingCharacter != null && record.paddingCharacter != '') || record.has1000Separator == true || record.hasDecimalPlace == true) {
			var numberFormatDisplay = ''
			if (record.paddingCharacter != null && record.paddingCharacter != '') {
				numberFormatDisplay = numberFormatDisplay + ', Padding character (' + record.paddingCharacter + ')';
			}
			if (record.has1000Separator == true) {
				numberFormatDisplay = numberFormatDisplay + ', Has 1,000 seperator (,)';
			}
			if (record.hasDecimalPlace == true) {
				numberFormatDisplay = numberFormatDisplay + ', Has decimal place (.)';
			}
			numberFormatDisplay = numberFormatDisplay.substring(2);
		}

		var signFlagTypeDisplay = '';
		if(record.signFlagConfig != null){
			signFlagTypeDisplay = ' sign flag field ('+record.signFlagConfig.displayValue+')'
		}else if (record.signFlagTypeFormat == "IGNORE_PLUS") {
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
		if(record.decimalPlace != null){
			displayMessage = displayMessage.replace('{decimalPlace}', record.decimalPlace);
		}else{
			displayMessage = displayMessage.replace('{decimalPlace}', '0');
		}
		displayMessage = displayMessage.replace('{signFlag}', signFlagTypeDisplay);
		displayMessage = displayMessage.replace('{positiveExampleData}', examplePosDataDisplay);
		displayMessage = displayMessage.replace('{negativeExampleData}', exampleNegDataDisplay);

		return displayMessage;
	}

	function DOCUMENT_TYPE_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', record.expectedValue || '-');
		displayMessage = displayMessage.replace('{exampleData}', config.defaultExampleValue);
		displayMessage = displayMessage.replace('{defaultValue}', record.defaultValue == null ? '-' : record.defaultValue);
		return displayMessage;
	}

	function RECORD_TYPE_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;
		var hasExpected = !(angular.isUndefined(record.expectedValue) || record.expectedValue === null);
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', (hasExpected ? record.expectedValue : ''));
		displayMessage = displayMessage.replace('{exampleData}', (hasExpected ? record.expectedValue : config.defaultExampleValue));
		return displayMessage;
	}

	function FILLER_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;
		var hasExpected = !(angular.isUndefined(record.expectedValue) || record.expectedValue === null);
		var fillerTypeMsg = '';

		if (record.expectedValue == null) {
			fillerTypeMsg = 'Unexpect'
		} else if (record.expectedValue == ' ') {
			fillerTypeMsg = 'Space';
		} else if (record.expectedValue == '0') {
			fillerTypeMsg = 'Zero';
		} else {
			fillerTypeMsg = 'Other';
		}
		
		displayMessage = displayMessage.replace('{fillerType}', fillerTypeMsg);
		displayMessage = displayMessage.replace('{exampleData}', (hasExpected ? record.expectedValue : config.defaultExampleValue));
		if(!hasExpected){
			displayMessage = displayMessage.replace('(Ex. )', '');
		}
		return displayMessage;
	}
	
	function SIGN_FLAG_DisplayExample(record, config) {
		var displayMessage = config.configDetailPattern;
		var hasPositiveValue = !(angular.isUndefined(record.positiveFlag) || record.positiveFlag === null);
		var hasNegativeValue = !(angular.isUndefined(record.negativeFlag) || record.negativeFlag === null);
		var examplePosDataDisplay = parseFloat(config.defaultExampleValue);
		var exampleNegDataDisplay = parseFloat(-config.defaultExampleValue);
		
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{positiveValue}', (hasPositiveValue ? record.positiveFlag : ''));
		displayMessage = displayMessage.replace('{negativeValue}', (hasNegativeValue ? record.negativeFlag : ''));
		displayMessage = displayMessage.replace('{positiveExampleData}', examplePosDataDisplay);
		displayMessage = displayMessage.replace('{negativeExampleData}', exampleNegDataDisplay);
		return displayMessage;
	}

	function convertRequiredToString(record) {
		return record.required == true ? 'yes' : 'no';
	}
	;
} ]);
