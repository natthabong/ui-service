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
        
        // <----------------------- initial varible start --------------------->
        var vm = this;

        var defaultDropDown = {
            value: null,
            label: 'Please select'
        }

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

         // <----------------------- initial varible end --------------------->

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

        var loadDocumentFields = function (sectionType, data) {
            var deffered = SCFCommonService.getDocumentFields('EXPORT', sectionType, null);
            deffered.promise.then(function (response) {
                data.push(defaultDropDown)
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
                recordType: "DOCUMENT",
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
            loadDocumentFields('HEADER', vm.headerGECDropdown);
            loadDocumentFields('FOOTER', vm.footerGECDropdown);
            loadDocumentFields('PAYMENT', vm.paymentGECDropdown);
            loadDocumentFields('DOCUMENT', vm.doucmentGECDropdown);
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
					var dataType = vm.dataTypeByIds[obj.documentFieldId];
					obj.docFieldName = dataType.docFieldName;
					obj.dataType = dataType.dataType;
					obj.transient = dataType.transient;
					if (dataType.dataType == 'CUSTOMER_CODE') {
						obj.validationType = 'IN_CUSTOMER_CODE_GROUP';
					}
				});
			}

			if (sponsorLayout.processType == 'AP_DOCUMENT') {
				if (sponsorLayout.paymentDateConfig.strategy == 'FIELD') {
					sponsorLayout.paymentDateConfig.documentDateField = sponsorLayout.paymentDateConfig.documentDateFieldOfField;
				} else {
					sponsorLayout.paymentDateConfig.documentDateField = sponsorLayout.paymentDateConfig.documentDateFieldOfFormula;
				}
			}


			var onFail = function (errors) {
				$scope.errors = errors;
			}

			if (FileLayoutService.validate(sponsorLayout, vm.dataTypeByIds, onFail)) {
				UIFactory.showConfirmDialog({
					data: {
						headerMessage: 'Confirm save?'
					},
					confirm: function () { return $scope.confirmSave(sponsorLayout) },
					onSuccess: function (response) {
						UIFactory.showSuccessDialog({
							data: {
								headerMessage: 'Edit file layout complete.',
								bodyMessage: ''
							},
							preCloseCallback: function () {
								vm.backToSponsorConfigPage();
							}
						});
					},
					onFail: function (response) {
						blockUI.stop();
					}
				});
			}
		}

		$scope.confirmSave = function (sponsorLayout) {

			var apiURL = 'api/v1/organize-customers/' + sponsorLayout.ownerId + '/processTypes/' + sponsorLayout.processType + '/layouts';
			if (!vm.newMode) {
				if (sponsorLayout.processType == 'AP_DOCUMENT') {
					sponsorLayout.paymentDateConfig.sponsorLayoutPaymentDateConfigId = vm.model.layoutConfigId;
				}
				apiURL = apiURL + '/' + sponsorLayout.layoutConfigId;
			}

			console.log(sponsorLayout);
			var fileLayoutDiferred = Service.requestURL(apiURL, sponsorLayout, vm.newMode ? 'POST' : 'PUT');

			return fileLayoutDiferred;

		};

		var addCreditTermFields = function (configItems) {
			var creditermDropdowns = [{
				label: 'Please select',
				value: null
			}];

			if (angular.isDefined(configItems) && configItems.length > 0) {
				configItems.forEach(function (data) {
					if (!isEmptyValue(data.displayValue)) {
						creditermDropdowns.push({
							label: data.displayValue,
							value: vm.dataTypeByIds[data.documentFieldId].documentFieldName
						});
					}
				});
			}
			vm.credittermFieldDropdown = creditermDropdowns;
		}
        //<---------------- founction for user action  ---------------->
    }
]);