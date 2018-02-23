'use strict';
angular.module('gecscf.organize.configuration.exportPayment').controller('ViewExportPaymentController', [
	'$log',
	'$stateParams',
	'FileLayoutService',
	'DELIMITER_TYPE_ITEM',
	'FILE_TYPE_ITEM',
	function ($log, $stateParams, FileLayoutService, DELIMITER_TYPE_ITEM, FILE_TYPE_ITEM) {
		var vm = this;
		var log = $log;
		var organizeId = $stateParams.organizeId;
		var layoutConfigId = $stateParams.layoutConfigId;
		var sections = {
			HEADER: 'HEADER',
			PAYMENT: 'PAYMENT',
			DOCUMENT: 'DOCUMENT',
			FOOTER: 'FOOTER'
		}

		vm.model = undefined;

		// Radio button
		vm.fileType = FILE_TYPE_ITEM;

		// Check box
		vm.headerSelected = false;
		vm.paymentSelected = false;
		vm.documentSelected = false;
		vm.footerSelected = false;

		// Section
		vm.items = [];
		vm.headerItem = [];
		vm.documentItem = [];
		vm.paymentItem = [];
		vm.footerItem = [];

		function getDelimiterObject(item) {
			return (item.delimiterId == vm.model.delimeter);
		}

		function loadSectionItem(organizeId, layoutConfigId, section, data) {
			var deferred = FileLayoutService.getFileLayoutItems(organizeId, layoutConfigId, section);
			deferred.promise.then(function (response) {
				if (response.data != null && response.data.length > 0) {
					if (section == sections.HEADER) {
						vm.headerSelected = true;
					} else if (section == sections.PAYMENT) {
						vm.paymentSelected = true;
					} else if (section == sections.DOCUMENT) {
						vm.documentSelected = true;
					} else if (section == sections.FOOTER) {
						vm.footerSelected = true;
					}
					response.data.forEach(function (obj) {
						data.push(obj);
					});
				}
			}).catch(function (response) {
				log.error('Fail to load file layout items.');
			});
		}

		function loadFileLayout(organizeId, layoutConfigId) {
			var defferd = FileLayoutService.getFileLayout(organizeId, 'EXPORT_DOCUMENT', 'EXPORT', layoutConfigId);
			defferd.promise.then(function (response) {
				if (response.data != null) {
					vm.model = response.data;
					console.log(vm.model)
					console.log(vm.fileType)
				}
				// initialModel(model);
				loadSectionItem(organizeId, layoutConfigId, sections.HEADER, vm.headerItem);
				loadSectionItem(organizeId, layoutConfigId, sections.PAYMENT, vm.paymentItem);
				loadSectionItem(organizeId, layoutConfigId, sections.DOCUMENT, vm.documentItem);
				loadSectionItem(organizeId, layoutConfigId, sections.FOOTER, vm.footerItem);
			}).catch(function (response) {
				log.error('Fail to load file layout.');
			});
			return defferd;
		}

		vm.getDelimiterName = function () {
			var obj = DELIMITER_TYPE_ITEM.filter(getDelimiterObject);
			if (obj.length == 0) {
				return "Other";
			} else {
				return obj[0].delimiterName;
			}
		}

		function init() {
			loadFileLayout(organizeId, layoutConfigId);
		}
		init();
	}
]);

// 		vm.processType = $stateParams.processType;
// 		vm.integrateType = $stateParams.integrateType;

// 		vm.model = $stateParams.fileLayoutModel || {
// 			ownerId: ownerId,
// 			paymentDateConfig: vm.processType == 'AP_DOCUMENT' ? {
// 				strategy: 'FIELD',
// 				documentDateField: null,
// 				paymentDateFormulaId: null
// 			} : null
// 		};


// 		vm.headerName = vm.processType == 'AP_DOCUMENT' ? "AP Document file layout" : "AR Document file layout";

// 		var BASE_URI = 'api/v1/organize-customers/' + ownerId + '/process-types/' + vm.processType + '/integrate-types/' + vm.integrateType ;

// 		var reqUrlFormula = '';

// 		vm.dataTypes = [];
// 		vm.dataTypeByIds = {};

// 		vm.configHeader = false;
// 		vm.configFooter = false;
// 		vm.isConfigOffsetRowNo = false;

// 		vm.paymentDateConfigStrategy = {
// 			'FIELD': 'FIELD',
// 			'FORMULA': 'FORMULA'
// 		}

// 		vm.recordType = {
// 			'HEADER': 'HEADER',
// 			'DETAIL': 'DETAIL',
// 			'FOOTER': 'FOOTER'
// 		}

// 		vm.specificModel = null;

// 		vm.fileType = FILE_TYPE_ITEM;


// 		vm.headerItems = [];

// 		vm.items = [];
// 		vm.dataDetailItems = [];

// 		vm.footerItems = [];

// 		vm.backToSponsorConfigPage = function () {
// 			var params = {organizeId: ownerId};
// 			PageNavigation.gotoPage("/sponsor-configuration",params);
// 		}


// 		var loadDataTypes = function () {
// 			var deffered = FileLayoutService.getDocumentFields('IMPORT','DETAIL',null);
// 			deffered.promise.then(function (response) {
// 				vm.dataTypes = response.data;
// 				vm.dataTypes.forEach(function (obj) {
// 					vm.dataTypeByIds[obj.documentFieldId] = obj;
// 				})

// 			}).catch(function (response) {
// 				log.error('Load gecscf document field error');
// 			});
// 		}


// 		var sendRequestGetFileLayout = function(layoutId, succcesFunc, failedFunc){
// 			var serviceDiferred = FileLayoutService.getFileLayout(ownerId, vm.processType, vm.integrateType, layoutId);
// 			var failedFunc = failedFunc | function (response) {
// 				log.error('Load data error');
// 			};
// 			serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
// 		}


// 		var sendRequest = function (uri, succcesFunc, failedFunc) {
// 			var serviceDiferred = Service.doGet(BASE_URI + uri);

// 			var failedFunc = failedFunc | function (response) {
// 				log.error('Load data error');
// 			};
// 			serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
// 		}

// 		var sendRequestFormula = function (uri, succcesFunc, failedFunc) {
// 			if(vm.processType == 'AP_DOCUMENT'){
// 				var serviceDiferred = Service.doGet(uri);

// 				var failedFunc = failedFunc | function (response) {
// 					log.error('Load data error');
// 				};
// 				serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
// 			}
// 		}

// 		var isEmptyValue = function (value) {
// 			if (angular.isUndefined(value) || value == null) {
// 				return true;
// 			}
// 			return false;
// 		}


// 		vm.paymentDateFormularModelDropdowns = [];
// 		var addPaymentDateFormulaDropdown = function (formulaData) {
// 			var dropdownPleaseSelect = [{
// 				label: 'Please select',
// 				value: null,
// 				formulaType: ''
// 			}];
// 			vm.paymentDateFormularModelDropdowns = dropdownPleaseSelect;

// 			if (formulaData.length > 0) {
// 				formulaData.forEach(function (item) {
// 					var paymentDateFormulaItem = {
// 						value: item.paymentDateFormulaId,
// 						label: item.formulaName,
// 						formulaType: item.formulaType
// 					}
// 					vm.paymentDateFormularModelDropdowns.push(paymentDateFormulaItem);
// 				})

// 			}
// 		}

// 		vm.displayLayout = false;

// 		var setup = function () {			
// 			loadDataTypes();

// 			if (vm.model.layoutConfigId != null) {
// 				var reqUrlHeaderField = '/layouts/' + vm.model.layoutConfigId + '/items?itemType=FIELD&recordType=HEADER';
// 				var reqUrlFooterField = '/layouts/' + vm.model.layoutConfigId + '/items?itemType=FIELD&recordType=FOOTER';
// 				var reqUrlField = '/layouts/' + vm.model.layoutConfigId + '/items?itemType=FIELD&recordType=DETAIL';
// 				var reqUrlData = '/layouts/' + vm.model.layoutConfigId + '/items?itemType=DATA&recordType=DETAIL';
// 				reqUrlFormula = 'api/v1/organize-customers/' + ownerId + '/processTypes/' + vm.processType + '/payment-date-formulas/';
// 				var reqCustomerCodeConfg = '/layouts/' + vm.model.layoutConfigId + '/items?dataType=CUSTOMER_CODE';

// 				sendRequestGetFileLayout(vm.model.layoutConfigId, function (response) {
// 					vm.model = response.data;
// 					vm.oldStateFileType = vm.model.fileType;
// 					if (angular.isDefined(vm.model.offsetRowNo) && vm.model.offsetRowNo != null) {
// 						vm.isConfigOffsetRowNo = true;
// 					}


// 					if (vm.model.delimeter != null && vm.model.delimeter != '') {
// 						vm.delimeter = 'Other';
// 						vm.delimeterOther = vm.model.delimeter;

// 						DELIMITER_TYPE_ITEM.forEach(function (obj) {
// 							if (obj.delimiterId == vm.model.delimeter) {
// 								vm.delimeter = vm.model.delimeter;
// 								vm.delimeterOther = '';
// 							}
// 						});
// 					}

// 					if (vm.model.fileType != 'CSV') {
// 						vm.delimeter = ',';
// 						vm.delimeterOther = '';
// 					}
// 					vm.specificModel = 'Specific 1';
// 					vm.displayLayout = true;
// 				});


// 				sendRequest(reqUrlField, function (response) {
// 					vm.items = response.data;
// 				});

// 				sendRequest(reqUrlData, function (response) {
// 					var detailData = response.data;
// 					detailData.forEach(function (item) {
// 						vm.dataDetailItems.push(item);
// 					})
// 				});


// 				sendRequestFormula(reqUrlFormula, function (response) {
// 					var formulaData = response.data;
// 					addPaymentDateFormulaDropdown(formulaData);
// 				});


// 				sendRequest(reqUrlHeaderField, function (response) {
// 					var headerItems = response.data;
// 					if (headerItems.length > 0) {
// 						vm.configHeader = true;
// 						vm.headerItems = headerItems;
// 					}
// 				});

// 				sendRequest(reqUrlFooterField, function (response) {
// 					var footerItems = response.data;
// 					if (footerItems.length > 0) {
// 						vm.configFooter = true;
// 						vm.footerItems = footerItems;
// 					}
// 				});


// 			}
// 		}();

// 		vm.displayExample = function (record) {
// 			var msg = '';
// 			var dataTypeObject = vm.dataTypeByIds[record.documentFieldId];
// 			if (angular.isDefined(dataTypeObject)) {
// 				if(dataTypeObject.dataType == 'TEXT'){
// 					msg = $injector.get('FileLayerExampleDisplayService')[dataTypeObject.dataType + '_DisplayExample'](record, dataTypeObject, vm.expectedInDataList);
// 				}else{
// 					msg = $injector.get('FileLayerExampleDisplayService')[dataTypeObject.dataType + '_DisplayExample'](record, dataTypeObject);
// 				}
// 			}

// 			return msg;
// 		}

// 		vm.getDetailFieldSize = function () {
// 			return vm.items.length;
// 		}

// 		vm.getHeaderFieldSize = function () {
// 			return vm.headerItems.length;
// 		}

// 		vm.getFooterFieldSize = function () {
// 			return vm.footerItems.length;
// 		}

// 		vm.isEven = function (fieldSize, currentIndex) {
// 			return (fieldSize + currentIndex) % 2 == 0 ? true : false;
// 		}

// 		vm.dataRowNo = function (fieldSize, currentIndex) {
// 			return (fieldSize + currentIndex) + 1;
// 		}

// 		vm.formularTypeDisplayMsg = '';
// 		vm.formulaTypeDisplay = function (paymentDateFormulaId) {
// 			var displayResult = '';
// 			var creditTermItems = vm.paymentDateFormularModelDropdowns;
// 			if (angular.isUndefined(creditTermItems) && creditTermItems.length == 0) {
// 				return displayResult;
// 			}
// 			if (isEmptyValue(paymentDateFormulaId)) {
// 				return displayResult;
// 			}

// 			creditTermItems.forEach(function (creditTerm) {
// 				if (creditTerm.value == paymentDateFormulaId) {
// 					displayResult = creditTerm.formulaType;
// 				}
// 			});
// 			return displayResult;
// 		}

// 		vm.showHeaderConfig = function () {
// 			if (vm.model.fileType != 'SPECIFIC') {
// 				return vm.configHeader;
// 			} else {
// 				return false;
// 			}
// 		}

// 		vm.showFooterConfig = function () {
// 			if (vm.model.fileType != 'SPECIFIC') {
// 				return vm.configFooter;
// 			} else {
// 				return false;
// 			}
// 		}

// 		function getDelimiterObject(item) {
//     		return (item.delimiterId == vm.model.delimeter);
// 		}

// 		vm.getDelimiterName = function() {
// 		    var obj = DELIMITER_TYPE_ITEM.filter(getDelimiterObject);
// 		    if(obj.length == 0){
// 		    	return "Other";
// 		    }
// 			else{
// 				return obj[0].delimiterName;
// 			}
// 		}

// 		var _documentFieldName = null;
// 		function getDocumentFieldObject(item) {
//     		return (item.documentFieldName == _documentFieldName);
// 		}

// 		//from detail sector items
// 		vm.getDisplayDocumentFieldName = function(fieldname) {
// 			_documentFieldName = fieldname;
// 		    var obj = vm.items.filter(getDocumentFieldObject);
// 			if(obj[0] != null && obj[0] != 'undefined'){
// 				return obj[0].displayValue;
// 			}else{
// 				return "";
// 			}
// 		}

// 	}]);

// app.constant('FILE_TYPE_ITEM', {
// 	fixedLength: 'FIXED_LENGTH',
// 	delimited: 'CSV',
// 	specific: 'SPECIFIC'
// });

// app.constant('DELIMITER_TYPE_ITEM', [{
// 	delimiterName: 'Comma (,)',
// 	delimiterId: ','
// }, {
// 	delimiterName: 'Colon (:)',
// 	delimiterId: ':'
// }, {
// 	delimiterName: 'Tab',
// 	delimiterId: '3'
// }, {
// 	delimiterName: 'Semicolon (;)',
// 	delimiterId: ';'
// }, {
// 	delimiterName: 'Other',
// 	delimiterId: 'Other'
// }]);