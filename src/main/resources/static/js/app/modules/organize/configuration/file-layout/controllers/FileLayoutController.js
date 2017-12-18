'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.controller('FileLayoutController', [
	'$log',
	'$rootScope',
	'$scope',
	'$state',
	'$stateParams',
	'$injector',
	'ngDialog',
	'UIFactory',
	'PageNavigation',
	'blockUI', 'FileLayoutService',
	'FILE_TYPE_ITEM',
	'DELIMITER_TYPE_TEM',
	'CHARSET_ITEM', 'Service', 'MappingDataService','SCFCommonService',
	function (log, $rootScope, $scope, $state, $stateParams, $injector, ngDialog, UIFactory, PageNavigation,
		blockUI, FileLayoutService, FILE_TYPE_ITEM, DELIMITER_TYPE_TEM, CHARSET_ITEM, Service, MappingDataService,SCFCommonService) {

		var vm = this;

		vm.manageAll = false;
		vm.newMode = true;
		var ownerId = $rootScope.sponsorId;

		vm.processType = $stateParams.processType;
		vm.integrateType = $stateParams.integrateType;
		vm.model = $stateParams.fileLayoutModel || {
			ownerId: ownerId,
			paymentDateConfig: vm.processType == 'AP_DOCUMENT' ? {
				strategy: 'FIELD',
				documentDateField: null,
				paymentDateFormulaId: null
			} : null
		};
		

		vm.headerName = vm.processType == 'AP_DOCUMENT' ? "AP Document file layout" : "AR Document file layout";

		var BASE_URI = 'api/v1/organize-customers/' + ownerId + '/process-types/' + vm.processType + '/integrate-types/' + vm.integrateType ;

		var reqUrlFormula = '';

		vm.dataTypes = [];
		vm.dataTypeByIds = {};

		vm.dataTypeHeaders = [];
		vm.dataTypeFooters = [];
		
		vm.documentFieldData = [];

		vm.configHeader = false;
		vm.configFooter = false;
		vm.isConfigOffsetRowNo = false;

		vm.paymentDateConfigStrategy = {
			'FIELD': 'FIELD',
			'FORMULA': 'FORMULA'
		}

		vm.recordType = {
			'HEADER': 'HEADER',
			'DETAIL': 'DETAIL',
			'FOOTER': 'FOOTER'
		}

		var defaultDropdown = [{
			value: null,
			label: 'Please select'
		}];
		
		
		vm.expectedInDataList = [];
		var loadMappingData = function(){
			var accountingTransactionType = vm.processType == 'AP_DOCUMENT' ? "PAYABLE" : "RECEIVABLE";
			var mappingTypeList = ["SIGN_FLAG_MAPPING","TEXT_MAPPING"];
			var deffered = SCFCommonService.loadMappingData(ownerId,accountingTransactionType,mappingTypeList);
			deffered.promise.then(function(response) {
				vm.expectedInDataList = response.data;
			}).catch(function(response) {
				log.error("Can not load mapping data!");
			});
		}		
		loadMappingData();

		vm.delimitersDropdown = [];
		vm.dataTypeDropdown = angular.copy(defaultDropdown);
		vm.dataTypeHeaderDropdown = angular.copy(defaultDropdown);
		vm.dataTypeFooterDropdown = angular.copy(defaultDropdown);
		vm.documentFieldDropdown = angular.copy(defaultDropdown);
		vm.dataTypeByGroupsDropdown = {};

		vm.specificsDropdown = [];
		vm.specificModel = null;

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

		vm.headerItems = [];

		vm.items = [];
		vm.dataDetailItems = [];

		vm.footerItems = [];

		vm.backToSponsorConfigPage = function () {
			PageNavigation.gotoPreviousPage();
		}

		var dateTimeFieldIds = [];

		var loadDataTypes = function () {
			var deffered = FileLayoutService.getDocumentFields('IMPORT','DETAIL',null);
			deffered.promise.then(function (response) {
				vm.dataTypes = response.data;
				vm.dataTypes.forEach(function (obj) {
					vm.dataTypeByIds[obj.documentFieldId] = obj;
					if (!vm.dataTypeByGroupsDropdown[obj.dataType]) {
						vm.dataTypeByGroupsDropdown[obj.dataType] = [];
					}


					if (obj.dataType == 'DATE_TIME') {
						dateTimeFieldIds.push(obj.documentFieldId);
					}
					var item = {
						value: obj.documentFieldId,
						label: obj.displayFieldName
					}
						
					if(obj.dataType == 'RECORD_TYPE'){
						vm.recordTypeId = obj.documentFieldId;
					}
					vm.dataTypeDropdown.push(item);
					vm.dataTypeByGroupsDropdown[obj.dataType].push(item);
				});


			}).catch(function (response) {
				log.error('Load customer code group data error');
			});
		}

		var loadDocumentFieldData = function () {
			var deffered = FileLayoutService.loadDocumentFieldData('DETAIL');
			deffered.promise.then(function (response) {
				vm.documentFieldData = response.data;
				vm.documentFieldData.forEach(function (obj) {
					if (!vm.dataTypeByGroupsDropdown[obj.dataType]) {
						vm.dataTypeByGroupsDropdown[obj.dataType] = [];
					}

					if (obj.dataType == 'DATE_TIME') {
						dateTimeFieldIds.push(obj.documentFieldId);
					}
					var item = {
						value: obj.documentFieldId,
						label: obj.displayFieldName
					}
						
					if(obj.dataType == 'RECORD_TYPE'){
						vm.recordTypeId = obj.documentFieldId;
					}else{
						vm.documentFieldDropdown.push(item);
						vm.dataTypeByGroupsDropdown[obj.dataType].push(item);						
					}
					
				});


			}).catch(function (response) {
				log.error('Load customer code group data error');
			});
		}

		var loadHeaderDataTypes = function () {
			var deffered = FileLayoutService.getDocumentFields('IMPORT','HEADER',null);
			deffered.promise.then(function (response) {
				vm.dataTypeHeaders = response.data;
				vm.dataTypeHeaders.forEach(function (obj) {
					var item = {
						value: obj.documentFieldId,
						label: obj.displayFieldName
					}
					vm.dataTypeHeaderDropdown.push(item);
				});

			}).catch(function (response) {
				log.error('Load data type header data error');
			});
		}

		var loadFooterDataTypes = function () {
			var deffered = FileLayoutService.getDocumentFields('IMPORT','FOOTER',null);
			deffered.promise.then(function (response) {
				vm.dataTypeFooters = response.data;
				vm.dataTypeFooters.forEach(function (obj) {
					var item = {
						value: obj.documentFieldId,
						label: obj.displayFieldName
					}
					vm.dataTypeFooterDropdown.push(item);
				});

			}).catch(function (response) {
				log.error('Load data type footer data error');
			});
		}

		var loadDelimiters = function () {
			DELIMITER_TYPE_TEM.forEach(function (obj) {
				var selectObj = {
					label: obj.delimiterName,
					value: obj.delimiterId
				}

				vm.delimitersDropdown.push(selectObj);
			});
		}

		var loadFileEncode = function () {
			CHARSET_ITEM.forEach(function (obj) {
				var selectObj = {
					label: obj.fileEncodeName,
					value: obj.fileEncodeId
				}

				vm.fileEncodeDropdown.push(selectObj);
			});
		}

		var loadFileSpecificsData = function () {
			var deffered = FileLayoutService.getSpecificData();
			deffered.promise.then(function (response) {

				var specificModels = response.data;
				if (specificModels !== undefined) {
					specificModels.forEach(function (obj) {
						var selectObj = {
							label: obj.specificName,
							value: obj.specificName,
							item: obj.specificItem
						}
						vm.specificsDropdown.push(selectObj);
					});
				}

				deffered.resolve(vm.specificModels);
			}).catch(function (response) {
				log.error('Load relational operators format Fail');
				deffered.reject();
			});
		}
		
		var sendRequestGetFileLayout = function(layoutId, succcesFunc, failedFunc){
			var serviceDiferred = FileLayoutService.getFileLayout(ownerId, vm.processType, vm.integrateType, layoutId);
			var failedFunc = failedFunc | function (response) {
				log.error('Load data error');
			};
			serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
		}


		var sendRequest = function (uri, succcesFunc, failedFunc) {
			var serviceDiferred = Service.doGet(BASE_URI + uri);

			var failedFunc = failedFunc | function (response) {
				log.error('Load data error');
			};
			serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
		}
		
		var sendRequestFormula = function (uri, succcesFunc, failedFunc) {
			var serviceDiferred = Service.doGet(uri);

			var failedFunc = failedFunc | function (response) {
				log.error('Load data error');
			};
			serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
		}
		
		var isEmptyValue = function (value) {
			if (angular.isUndefined(value) || value == null) {
				return true;
			}
			return false;
		}

		var addPaymentDateFieldDropdown = function (configItems) {
			var paymentDateDropdown = [{
				label: 'Please select',
				value: null
			}];
			if (!isEmptyValue(configItems)) {
				configItems.forEach(function (data) {
					
					if (dateTimeFieldIds.indexOf(data.documentFieldId) != -1 && !isEmptyValue(data.displayValue) && !data.isTransient) {
						paymentDateDropdown.push({
							label: data.displayValue,
							value: vm.dataTypeByIds[data.documentFieldId].documentFieldName
						});
					}
				});
			}

			return paymentDateDropdown;
		}

		//check not customer code
		vm.checkDisable = function (record) {
			var disable = false;
			if (angular.isUndefined(record.documentFieldId) || isNaN(record.documentFieldId)) {
				disable = true;
			} else {
				var documentFieldId = record.documentFieldId;
				var recordType = record.recordType;

				var dataTypeDropdowns = vm.dataTypes;
				if (recordType == vm.recordType.HEADER) {
					dataTypeDropdowns = vm.dataTypeHeaders;
				} else if (recordType == vm.recordType.FOOTER) {
					dataTypeDropdowns = vm.dataTypeFooters;
				}
				dataTypeDropdowns.forEach(function (obj) {
					if (documentFieldId == obj.documentFieldId) {
						if (obj.configUrl == null) {
							disable = true;
						}
					}
				});
			}
			return disable;
		}
		
		vm.unauthenConfig = function(){
			if(vm.manageAll && vm.model.fileType != vm.fileType.delimited){
				return false;
			}else{
				return true;
			}
		}
		
		vm.fileTypeChange = function () {

			if (vm.oldStateFileType == 'SPECIFIC') {
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

			if (vm.model.fileType == 'SPECIFIC') {
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
			}else if(vm.model.fileType == 'CSV') {
				vm.headerItems = [];
				vm.footerItems = [];

				vm.configHeader = false;
				vm.configFooter = false;

				vm.clearHeaderConfig;
				vm.clearFooterConfig;
			}else {
				if (vm.items.length == 0) {
					vm.items = [{
						primaryKeyField: false,
						docFieldName: null,
						dataType: null,
						isTransient: false,
						dataLength: null,
						startIndex: null,
						endIndex: null,
						recordType: "DETAIL",
						itemType: 'FIELD'
					}];
				}
				vm.customerCodeGroup = '';
			}

			vm.oldStateFileType = vm.model.fileType;

		}
		
		var initialModel = function () {
			vm.model = {
				displayName: '',
				sponsorConfigId: 'SFP',
				sponsorId: ownerId,
				delimeter: ',',
				wrapper: '"',
				fileExtensions: 'csv',
				integrateType: 'IMPORT',
				fileType: 'FIXED_LENGTH',
				charsetName: 'TIS-620',
				checkBinaryFile: false,
				completed: false,
				ownerId: ownerId,
				paymentDateConfig: {
					strategy: 'FIELD',
					documentDateField: null,
					paymentDateFormulaId: null
				}
			}

			vm.items = [{
				primaryKeyField: false,
				docFieldName: null,
				dataType: null,
				isTransient: false,
				dataLength: null,
				startIndex: null,
				endIndex: null,
				recordType: "DETAIL",
				itemType: 'FIELD'
			}];

			vm.delimeter = ',';
			vm.delimeterOther = '';

			vm.specificModel = 'Specific 1';
		}

		vm.paymentDateFormularModelDropdowns = [];
		var addPaymentDateFormulaDropdown = function (formulaData) {
			var dropdownPleaseSelect = [{
				label: 'Please select',
				value: null,
				formulaType: ''
			}];
			vm.paymentDateFormularModelDropdowns = dropdownPleaseSelect;

			if (formulaData.length > 0) {
				formulaData.forEach(function (item) {
					var paymentDateFormulaItem = {
						value: item.paymentDateFormulaId,
						label: item.formulaName,
						formulaType: item.formulaType
					}
					vm.paymentDateFormularModelDropdowns.push(paymentDateFormulaItem);
				})

			}
		}

		vm.displayLayout = false;

		var setup = function () {			
			loadDelimiters();
			loadFileEncode();
			loadDataTypes();
			loadDocumentFieldData();
			loadHeaderDataTypes();
			loadFooterDataTypes();
			loadFileSpecificsData();

			if (vm.model.layoutConfigId != null) {
				vm.newMode = false;
				var reqUrlHeaderField = '/layouts/' + vm.model.layoutConfigId + '/items?itemType=FIELD&recordType=HEADER';
				var reqUrlFooterField = '/layouts/' + vm.model.layoutConfigId + '/items?itemType=FIELD&recordType=FOOTER';
				var reqUrlField = '/layouts/' + vm.model.layoutConfigId + '/items?itemType=FIELD&recordType=DETAIL';
				var reqUrlData = '/layouts/' + vm.model.layoutConfigId + '/items?itemType=DATA&recordType=DETAIL';
				reqUrlFormula = 'api/v1/organize-customers/' + ownerId + '/processTypes/' + vm.processType + '/payment-date-formulas/';
				var reqCustomerCodeConfg = '/layouts/' + vm.model.layoutConfigId + '/items?dataType=CUSTOMER_CODE';

				sendRequestGetFileLayout(vm.model.layoutConfigId, function (response) {
					vm.model = response.data;

					vm.oldStateFileType = vm.model.fileType;
					if (angular.isDefined(vm.model.offsetRowNo) && vm.model.offsetRowNo != null) {
						vm.isConfigOffsetRowNo = true;
					}


					if (vm.model.delimeter != null && vm.model.delimeter != '') {
						vm.delimeter = 'Other';
						vm.delimeterOther = vm.model.delimeter;

						DELIMITER_TYPE_TEM.forEach(function (obj) {
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
				sendRequest(reqCustomerCodeConfg, function (response) {
					vm.customerCodeItem = response.data;
					if (vm.customerCodeItem.length == 1) {
						vm.customerCodeGroup = vm.customerCodeItem[0].expectedValue;
					}
				});

				sendRequest(reqUrlField, function (response) {
					vm.items = response.data;
					if (vm.items.length < 1) {
						vm.addItem();
					}
					vm.reloadPaymentDateFields();
					addCreditTermFields(vm.items);
				});

				sendRequest(reqUrlData, function (response) {
					var detailData = response.data;
					detailData.forEach(function (item) {
						vm.dataDetailItems.push(item);
					})
				});

				sendRequestFormula(reqUrlFormula, function (response) {
					var formulaData = response.data;
					addPaymentDateFormulaDropdown(formulaData);
				});

				sendRequest(reqUrlHeaderField, function (response) {
					var headerItems = response.data;
					if (headerItems.length > 0) {
						vm.configHeader = true;
						vm.headerItems = headerItems;
					}
				});

				sendRequest(reqUrlFooterField, function (response) {
					var footerItems = response.data;
					if (footerItems.length > 0) {
						vm.configFooter = true;
						vm.footerItems = footerItems;
					}
				});
				
				vm.fileTypeChange();

			} else {
				initialModel();
				addPaymentDateFormulaDropdown([]);
				vm.displayLayout = true;
			}
		}();

		vm.tempDocFieldName = [];

		var _convertToHumanize = function (str) {
			str = str.toLowerCase().split('_');

			for (var i = 0; i < str.length; i++) {
				str[i] = str[i].split('');
				str[i][0] = str[i][0].toUpperCase();
				str[i] = str[i].join('');
			}
			return str.join('');
		}


		vm.openSetting = function (index, record) {
			var documentFieldId = record.documentFieldId;
			var recordType = record.recordType;
			var dataTypeDropdowns = vm.dataTypes;
			if (recordType == vm.recordType.HEADER) {
				dataTypeDropdowns = vm.dataTypeHeaders;
			} else if (recordType == vm.recordType.FOOTER) {
				dataTypeDropdowns = vm.dataTypeFooters;
			}

			dataTypeDropdowns.forEach(function (obj) {
				if (documentFieldId == obj.documentFieldId) {
					var dataType = obj.dataType;
					var dialog = ngDialog.open({
						id: 'layout-setting-dialog-' + index,
						template: obj.configUrl,
						className: 'ngdialog-theme-default',
						controller: _convertToHumanize(dataType) + 'LayoutConfigController',
						controllerAs: 'ctrl',
						scope: $scope,
						data: {
							processType: vm.processType,
							owner: ownerId,
							record: record,
							index: index,
							config: obj,
							headerItems: vm.headerItems,
							detailItems: vm.items,
							footerItems: vm.footerItems,
							dataTypeByIds: vm.dataTypeByIds

						},
						cache: false,
						preCloseCallback: function (value) {
							if (value != null) {
								angular.copy(value, record);
								record.completed = true;
								if(value.dataType='TEXT'){
									loadMappingData();
								}
							}
						}
					});
				}
			});
		}

		vm.addItem = function () {
			var itemConfig = {
				primaryKeyField: false,
				docFieldName: null,
				dataType: null,
				dataLength: null,
				startIndex: null,
				endIndex: null,
				isTransient: false,
				recordType: "DETAIL",
				itemType: 'FIELD'
			};
			vm.items.push(itemConfig);
		}

		vm.addHeaderItem = function () {
			var headerItemConfig = {
				primaryKeyField: false,
				docFieldName: null,
				dataType: null,
				dataLength: null,
				startIndex: null,
				endIndex: null,
				isTransient: true,
				recordType: "HEADER",
				itemType: 'FIELD'
			};
			vm.headerItems.push(headerItemConfig);
		}

		vm.addFooterItem = function () {
			var footerItemConfig = {
				primaryKeyField: false,
				docFieldName: null,
				dataType: null,
				dataLength: null,
				startIndex: null,
				endIndex: null,
				isTransient: true,
				recordType: "FOOTER",
				itemType: 'FIELD'
			};
			vm.footerItems.push(footerItemConfig);
		}

		vm.removeItem = function (record) {
			var index = vm.itemsindexOf(record);
			vm.items.splice(index, 1);
		}

		vm.formula = {
			paymentDateFormulaId: null,
			formulaName: '',
			formulaType: 'CREDIT_TERM',
			sponsorId: ownerId,
			isCompleted: '0'
		};

		vm.openNewFormula = function () {

			vm.formula = {
				paymentDateFormulaId: null,
				formulaName: '',
				formulaType: 'CREDIT_TERM',
				sponsorId: ownerId,
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
					formula: vm.formula,
					paymentDateFormulaId: ''
				},
				cache: false,
				preCloseCallback: function (value) {
					vm.model.paymentDateConfig.paymentDateFormulaId = value;
					vm.refreshFormulaDropDown();
					return true;
				}
			});
		};


		vm.refreshFormulaDropDown = function () {
			
			var serviceDiferred = Service.doGet(reqUrlFormula);
			serviceDiferred.promise.then(function (response) {
				var formulaData = response.data;
				vm.paymentDateFormularModelDropdowns = [];

				addPaymentDateFormulaDropdown(formulaData);
			});
		}

		var addHeaderModel = function (model, headerItems) {
			headerItems.forEach(function (item) {
				model.items.push(item);
			});
		}

		var addFooterModel = function (model, footerItems) {
			footerItems.forEach(function (item) {
				model.items.push(item);
			});
		}


		vm.save = function () {
			
			var sponsorLayout = null;
			vm.model.completed = true;
			vm.model.processType = vm.processType;
			if (vm.model.fileType == vm.fileType.specific) {
				vm.specificsDropdown.forEach(function (obj) {
					vm.model.fileExtensions = obj.item.fileExtensions;
					if (obj.value == vm.specificModel) {
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
						if (vm.model.layoutConfigId != null && vm.items.length > 0) {
							sponsorLayout.items = [];
							addHeaderModel(sponsorLayout, vm.headerItems);
							vm.items.forEach(function (item) {
								sponsorLayout.items.push(item);
							});

							vm.dataDetailItems.forEach(function (item) {
								sponsorLayout.items.push(item);
							});

						} else {
							sponsorLayout.items = [];
							obj.item.items.forEach(function (item) {
								sponsorLayout.items.push(item);
							});

						}

					}
				});
			} else {
				if (vm.model.fileType == 'CSV') {
					if (vm.delimeter == 'Other') {
						vm.model.delimeter = vm.delimeterOther;
					} else {
						vm.model.delimeter = vm.delimeter;
					}
					vm.model.wrapper = '"';
					vm.model.headerRecordType = null;
					vm.model.detailRecordType = null;
					vm.model.footerRecordType = null;
				}else{
					vm.items.forEach(function (item) {
						if(item.documentFieldId == vm.recordTypeId){
							vm.model.detailRecordType = item.expectedValue;
						}
					});

					vm.headerItems.forEach(function (item) {
						if(item.documentFieldId == vm.recordTypeId){
							vm.model.headerRecordType = item.expectedValue;
						}
					});
					
					vm.footerItems.forEach(function (item) {
						if(item.documentFieldId == vm.recordTypeId){
							vm.model.footerRecordType = item.expectedValue;
						}
					});

				}

				sponsorLayout = angular.copy(vm.model);
				sponsorLayout.items = angular.copy(vm.items);
				
				vm.dataDetailItems.forEach(function (detailItem) {
					sponsorLayout.items.push(detailItem);
				});

				if (!vm.isConfigOffsetRowNo) {
					sponsorLayout.offsetRowNo = null;
				}

				addHeaderModel(sponsorLayout, vm.headerItems);
				addFooterModel(sponsorLayout, vm.footerItems);

				sponsorLayout.items.forEach(function (obj, index) {
					if(!isEmptyValue(obj.documentFieldId)){
						var dataType = vm.dataTypeByIds[obj.documentFieldId];
						obj.docFieldName = dataType.docFieldName;
						obj.dataType = dataType.dataType;
						obj.transient = dataType.transient;
						if (dataType.dataType == 'CUSTOMER_CODE') {
							obj.validationType = 'IN_CUSTOMER_CODE_GROUP';
						}
					}
				});
			}


			var onFail = function (errors) {
				$scope.errors = errors;
			}

			if (FileLayoutService.validate(sponsorLayout, vm.dataTypeByIds, onFail)) {
				UIFactory.showConfirmDialog({
					data: {
						headerMessage: 'Confirm save?'
					},
					confirm: function () {
						blockUI.start();
						return $scope.confirmSave(sponsorLayout)
					},
					onSuccess: function (response) {
						var headerMessage = "Add new file layout complete.";
						if(response.version != 0){
							headerMessage = "Edit file layout complete."
						}
						UIFactory.showSuccessDialog({
							data: {
								headerMessage: headerMessage,
								bodyMessage: ''
							},
							preCloseCallback: function () {
								vm.backToSponsorConfigPage();
							}
						});
						blockUI.stop();
					},
					onFail: function (response) {
						console.log(response);
						if (response.status != 400) {
							var msg = {};
							UIFactory
									.showFailDialog({
										data : {
											headerMessage : vm.editMode ? 'Edit file layout fail.'
													: 'Add new file layout fail.',
											bodyMessage : msg[response.status] ? msg[response.status]
													: response.data.message
										},
										preCloseCallback : preCloseCallback
									});
						} else {
							$scope.errors = {};
							$scope.errors[response.data.reference] = {
								message : response.data.errorMessage
							}
							
							var errors = {
								duplicateLayoutName : true
							}
							
							onFail(errors)
						}
						blockUI.stop();
					}
				});
			}
		}

		$scope.confirmSave = function (sponsorLayout) {
			if(vm.newMode){
				
				return FileLayoutService.createFileLayout(sponsorLayout.ownerId, sponsorLayout.processType, sponsorLayout.integrateType, sponsorLayout);
				
			}else {
				if (sponsorLayout.processType == 'AP_DOCUMENT') {
					sponsorLayout.paymentDateConfig.sponsorLayoutPaymentDateConfigId = vm.model.layoutConfigId;
				}
				
				return FileLayoutService.updateFileLayout(sponsorLayout.ownerId, sponsorLayout.processType, sponsorLayout.integrateType, sponsorLayout.layoutConfigId, sponsorLayout);
				
			}

		};

		var addCreditTermFields = function (configItems) {
			var creditermDropdowns = [{
				label: 'Please select',
				value: null
			}];

			if (angular.isDefined(configItems) && configItems.length > 0) {
				configItems.forEach(function (data) {

					if (!isEmptyValue(data.displayValue) && !isEmptyValue(data.documentFieldId)) {
						creditermDropdowns.push({
							label: data.displayValue,
							value: vm.dataTypeByIds[data.documentFieldId].documentFieldName
						});
					}
				});
			}
			vm.credittermFieldDropdown = creditermDropdowns;
		}


		$scope.$watch('ctrl.items', function () {
			vm.reloadPaymentDateFields();
			addCreditTermFields(vm.items);
			if (vm.model.paymentDateConfig == null) {
				vm.model.paymentDateConfig = {
					strategy: 'FIELD',
					documentDateField: null,
					paymentDateFormulaId: null
				};
			}
		}, true);

		vm.reloadPaymentDateFields = function () {
			
			vm.paymentDateFieldDropdown = addPaymentDateFieldDropdown(vm.items);
		}

		vm.displayExample = function (record) {
			var msg = '';
			var dataTypeObject = vm.dataTypeByIds[record.documentFieldId];
			if (angular.isDefined(dataTypeObject)) {
				if(dataTypeObject.dataType == 'TEXT'){
					msg = $injector.get('FileLayerExampleDisplayService')[dataTypeObject.dataType + '_DisplayExample'](record, dataTypeObject, vm.expectedInDataList);
				}else{
					msg = $injector.get('FileLayerExampleDisplayService')[dataTypeObject.dataType + '_DisplayExample'](record, dataTypeObject);
				}
			}

			return msg;
		}

		vm.isHideSaveCheckbox = function (item) {
			var disabled = false;
			vm.dataTypes.forEach(function (obj) {
				if (item.dataType == obj.documentFieldId) {
					if (obj.transient == true) {
						item.isTransient = true;
						disabled = true;
					}
				}
			});
			return disabled;
		}

		vm.isChangeDataType = function (item) {
			vm.dataTypes.forEach(function (obj) {
				if (item.dataType == obj.documentFieldId) {
					item.isTransient = obj.transient;
				}
			});
		}

		vm.addDataItem = function (dataItems) {
			var itemConfig = {
				primaryKeyField: false,
				docFieldName: null,
				dataType: null,
				dataLength: 0,
				startIndex: 0,
				isTransient: false,
				itemType: 'DATA',
				recordType: "DETAIL"
			};
			dataItems.push(itemConfig)
		}
		vm.getAllSameDataTypes = function (record) {
			var dataType = vm.dataTypeByIds[record.documentFieldId];
			return vm.dataTypeByGroupsDropdown[dataType.dataType];
		}
		vm.addValueClonningField = function (record) {
			if (!angular.isDefined(record.valueCloningFields)) {
				record.valueCloningFields = [];
			}
			record.valueCloningFields.push({
				documentFieldId: record.documentFieldId
			});
		}

		vm.removeValueClonningField = function (dataItems, valueCloningField) {
			var index = dataItems.indexOf(valueCloningField);
			dataItems.splice(index, 1);
		}
		vm.removeDataItem = function (dataItems, item) {
			var index = dataItems.indexOf(item);
			dataItems.splice(index, 1);

			var indexDocFieldName = vm.tempDocFieldName.indexOf(item.docFieldName);
			if (indexDocFieldName > -1) {
				vm.tempDocFieldName.splice(indexDocFieldName, 1);
			}
		}

		vm.getDetailFieldSize = function () {
			return vm.items.length;
		}

		vm.getHeaderFieldSize = function () {
			return vm.headerItems.length;
		}

		vm.getFooterFieldSize = function () {
			return vm.footerItems.length;
		}

		vm.isEven = function (fieldSize, currentIndex) {
			return (fieldSize + currentIndex) % 2 == 0 ? true : false;
		}

		vm.dataRowNo = function (fieldSize, currentIndex) {
			return (fieldSize + currentIndex) + 1;
		}

		vm.isSaveCheckedDisplay = function (item) {
			return !item.isTransient;
		}

		vm.saveField = function (item) {
			item.isTransient = !item.isTransient;
		}

		vm.formularTypeDisplayMsg = '';
		vm.formulaTypeDisplay = function (paymentDateFormulaId) {
			var displayResult = '';
			var creditTermItems = vm.paymentDateFormularModelDropdowns;
			if (angular.isUndefined(creditTermItems) && creditTermItems.length == 0) {
				return displayResult;
			}
			if (isEmptyValue(paymentDateFormulaId)) {
				return displayResult;
			}

			creditTermItems.forEach(function (creditTerm) {
				if (creditTerm.value == paymentDateFormulaId) {
					displayResult = creditTerm.formulaType;
				}
			});
			return displayResult;
		}

		vm.changePaymentDate = function () {
			if (vm.model.paymentDateConfig.strategy == vm.paymentDateConfigStrategy.FIELD) {
				vm.model.paymentDateConfig.formula = null;
				vm.model.paymentDateConfig.creditTermField = null;
				vm.model.paymentDateConfig.paymentDateFormulaId = null;
				vm.model.paymentDateConfig.documentDateField = null;
			} else {
				vm.model.paymentDateConfig.documentDateField = null;
			}
		}

		vm.clearHeaderConfig = function () {
			if (vm.configHeader == false) {
				vm.headerItems = [];
			} else {
				vm.addHeaderItem();
			}
		}

		vm.clearFooterConfig = function () {
			if (vm.configFooter == false) {
				vm.footerItems = [];
			} else {
				vm.addFooterItem();
			}
		}

		vm.showHeaderConfig = function () {
			if (vm.model.fileType != 'SPECIFIC') {
				return vm.configHeader;
			} else {
				return false;
			}
		}

		vm.showFooterConfig = function () {
			if (vm.model.fileType != 'SPECIFIC') {
				return vm.configFooter;
			} else {
				return false;
			}
		}

		vm.delimeterChange = function () {
			if (vm.delimeter != 'Other') {
				vm.delimeterOther = '';
			}
		}

		vm.unSelectFieldName = function (item) {
			if (!vm.manageAll || isNaN(item.documentFieldId)) {
				return true;
			} else {
				return false;
			}
		}

	}]);

app.constant('FILE_TYPE_ITEM', {
	fixedLength: 'FIXED_LENGTH',
	delimited: 'CSV',
	specific: 'SPECIFIC'
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

module.filter('layoutFileDataTypeDisplay', function () {
	return function (id, layoutFileDataTypeItem) {
		for (var i = 0; i < layoutFileDataTypeItem.length; i++) {
			if (id == layoutFileDataTypeItem[i].value) {
				return layoutFileDataTypeItem[i].label + ' is duplicated';
			}
		}
		return "";
	};
});
