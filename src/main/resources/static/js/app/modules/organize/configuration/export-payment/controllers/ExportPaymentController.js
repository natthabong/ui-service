'use strict';
var module = angular.module('gecscf.organize.configuration.exportPayment');
module.controller('ExportPaymentController', [
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
    'CHARSET_ITEM',
    'Service',
    'SCFCommonService',
    function (log, $rootScope, $scope, $state, $stateParams, $injector, ngDialog, UIFactory, PageNavigation,
        blockUI, FileLayoutService, FILE_TYPE_ITEM, DELIMITER_TYPE_TEM, CHARSET_ITEM, Service, SCFCommonService) {

        var vm = this;

        vm.fileType = FILE_TYPE_ITEM;
        vm.fileEncodeDropdown = [];
        vm.delimitersDropdown = [];
        vm.specificsDropdown = [];
        vm.dataTypeDropdown
        vm.items = [];
        vm.headerGECDropdown = [];
        vm.footerGECDropdown = [];
        vm.paymentGECDropdown = [];
        vm.doucmentGECDropdown = [];

        // vm.model = $stateParams.fileLayoutModel || {
        //     ownerId: ownerId,
        //     paymentDateConfig: vm.processType == 'AP_DOCUMENT' ? {
        //         strategy: 'FIELD',
        //         documentDateFieldOfField: null,
        //         documentDateFieldOfFormula: null,
        //         documentDateField: null,
        //         paymentDateFormulaId: null
        //     } : null
        // };

        var loadDocumentFields = function(sectionType,data){
            var deffered = SCFCommonService.getDocumentFields('EXPORT',sectionType,null);
			deffered.promise.then(function (response) {
                response.data.forEach(function (obj) {
                    var item = {
						value: obj.documentFieldId,
						label: obj.displayFieldName
					}
					data.push(item);
                });
			}).catch(function (response) {
				log.error('Load customer code group data error');
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

        var loadDelimiters = function () {
            DELIMITER_TYPE_TEM.forEach(function (obj) {
                var selectObj = {
                    label: obj.delimiterName,
                    value: obj.delimiterId
                }

                vm.delimitersDropdown.push(selectObj);
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

        var initialModel = function () {
            vm.model = {
                displayName: vm.headerName,
                sponsorConfigId: 'SFP',
                sponsorId: null,
                delimeter: ',',
                wrapper: '"',
                fileExtensions: 'csv',
                integrateType: 'IMPORT',
                fileType: 'FIXED_LENGTH',
                charsetName: 'TIS-620',
                checkBinaryFile: false,
                completed: false,
                ownerId: null,
                paymentDateConfig: {
                    strategy: 'FIELD',
                    documentDateFieldOfField: null,
                    documentDateFieldOfFormula: null,
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

        var _convertToHumanize = function (str) {
			str = str.toLowerCase().split('_');

			for (var i = 0; i < str.length; i++) {
				str[i] = str[i].split('');
				str[i][0] = str[i][0].toUpperCase();
				str[i] = str[i].join('');
			}
			return str.join('');
		}

        var initial = function () {
            loadFileEncode();
            loadDelimiters();
            loadFileSpecificsData();
            loadDocumentFields('HEADER',vm.headerGECDropdown);
            loadDocumentFields('FOOTER',vm.footerGECDropdown);
            loadDocumentFields('PAYMENT',vm.paymentGECDropdown);
            loadDocumentFields('DOCUMENT',vm.doucmentGECDropdown);
            initialModel();
            
        } ();

        //<---------------- founction for user action  ---------------->
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

        vm.openSetting = function (index, record) {
			var documentFieldId = record.documentFieldId;
			var recordType = record.recordType;

            switch (recordType) {
                case 'HEADER':
                    dataTypeDropdowns = vm.headerGECDropdown;
                    break;
                case 'PAYMENT':
                    dataTypeDropdowns = vm.paymentGECDropdown;
                    break;
                case 'DOCUMENT':
                    dataTypeDropdowns = vm.doucmentGECDropdown;
                    break;
                case 'FOOTER':
                    dataTypeDropdowns = vm.footerGECDropdown;
                    break;
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
							}
						}
					});
				}
			});
		}
        //<---------------- founction for user action  ---------------->
    }
]);