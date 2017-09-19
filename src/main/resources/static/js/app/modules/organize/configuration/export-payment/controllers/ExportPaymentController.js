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
        var ownerId = $rootScope.sponsorId;

        var defaultDropDown = {
            value: null,
            label: 'Please select'
        }
        
        vm.fileType = FILE_TYPE_ITEM;
        vm.fileEncodeDropdown = [];
        vm.delimitersDropdown = [];
        vm.specificsDropdown = [];
        vm.items = [];
        vm.displayHeaderColumn = false;

        vm.delimeter = null;
        vm.delimeterOther = null;

        // GECSCF dropdown
        vm.headerGECDropdown = [];
        vm.footerGECDropdown = [];
        vm.paymentGECDropdown = [];
        vm.doucmentGECDropdown = [];

        // dropdown data type
        vm.dataTypes = {
            HEADER : null,
            PAYMENT : null,
            DOCUMENT : null,
            FOOTER : null
        }

        vm.dataTypeByIds = {};

         // <----------------------- initial varible end --------------------->

        vm.model = $stateParams.fileLayoutModel || {
            ownerId: ownerId
        };
        console.log(vm.model);

        var loadDocumentFields = function (sectionType, dropDownData) {
            var deffered = SCFCommonService.getDocumentFields('EXPORT', sectionType, null);
            deffered.promise.then(function (response) {
                dropDownData.push(defaultDropDown);
                vm.dataTypes[sectionType] = response.data;
                response.data.forEach(function (obj) {
                    vm.dataTypeByIds[obj.documentFieldId] = obj;
                    var item = {
                        value: obj.documentFieldId,
                        label: obj.displayFieldName
                    }
                    dropDownData.push(item);
                });
            }).catch(function (response) {
                log.error('Load data error');
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
                sponsorConfigId: 'BFP',
                sponsorId: ownerId,
                delimeter: ',',
                wrapper: '"',
                fileExtensions: 'txt',
                integrateType: 'EXPORT',
                fileType: 'FIXED_LENGTH',
                charsetName: 'TIS-620',
                checkBinaryFile: false,
                completed: false,
                ownerId: ownerId
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
                recordType: "DOCUMENT",
                itemType: 'FIELD'
            };
            vm.items.push(itemConfig);
        }

        vm.backToSponsorConfigPage = function () {
			PageNavigation.gotoPreviousPage();
		}

        vm.openSetting = function (index, record) {
            var documentFieldId = record.documentFieldId;
            var recordType = record.recordType;
            var dataTypeDropdowns = [];

            if(recordType == "HEADER"){
                dataTypeDropdowns = vm.dataTypes["HEADER"];
            }else if(recordType == "PAYMENT"){
                dataTypeDropdowns = vm.dataTypes["PAYMENT"];
            }else if(recordType == "DOCUMENT"){
                dataTypeDropdowns = vm.dataTypes["DOCUMENT"];
            }else if(recordType == "FOOTER"){
                dataTypeDropdowns = vm.dataTypes["FOOTER"];
            }

            dataTypeDropdowns.forEach(function (obj) {
                if (documentFieldId == obj.documentFieldId) {
                    var dataType = obj.dataType;
                    var dialog = ngDialog.open({
                        id: 'layout-setting-dialog-' + index,
                        template: obj.configUrl,
                        className: 'ngdialog-theme-default',
                        controller: _convertToHumanize(dataType) + 'ExportLayoutConfigController',
                        controllerAs: 'ctrl',
                        scope: $scope,
                        data: {
                            processType: vm.processType,
                            owner: ownerId,
                            record: record,
                            index: index,
                            config: obj,
                            headerItems: vm.headerItems,
                            paymentItems: vm.paymentItems,
                            documentItems: vm.items,
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

            vm.model.displayHeaderColumn = vm.displayHeaderColumn;

            if (vm.model.fileType == 'CSV') {
                if (vm.delimeter == 'Other') {
                    vm.model.delimeter = vm.delimeterOther;
                } else {
                    vm.model.delimeter = vm.delimeter;
                }
            }

            sponsorLayout = angular.copy(vm.model);
            sponsorLayout.items = angular.copy(vm.items);
            // console.log(sponsorLayout);
            // vm.dataDetailItems.forEach(function (detailItem) {
            //     sponsorLayout.items.push(detailItem);
            // });
            // console.log(vm.dataTypeByIds);

            sponsorLayout.items.forEach(function (obj, index) {
                var dataType = vm.dataTypeByIds[obj.documentFieldId];
                obj.dataType = dataType.dataType;
                obj.transient = dataType.transient;
                if (dataType.dataType == 'CUSTOMER_CODE') {
                    obj.validationType = 'IN_CUSTOMER_CODE_GROUP';
                }
            });


			// var onFail = function (errors) {
			// 	$scope.errors = errors;
			// }

			// if (FileLayoutService.validate(sponsorLayout, vm.dataTypeByIds, onFail)) {
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
			// }
		}

		$scope.confirmSave = function (sponsorLayout) {
            
			var apiURL = 'api/v1/organize-customers/' + sponsorLayout.ownerId + '/process-types/EXPORT_DOCUMENT/integrate-types/EXPORT/layouts';
			// if (!vm.newMode) {
			// 	apiURL = apiURL + '/' + sponsorLayout.layoutConfigId;
			// }

			console.log(sponsorLayout);
			var fileLayoutDiferred = Service.requestURL(apiURL, sponsorLayout, 'POST');

			return fileLayoutDiferred;

		};

		
        //<---------------- founction for user action  ---------------->
    }
]);