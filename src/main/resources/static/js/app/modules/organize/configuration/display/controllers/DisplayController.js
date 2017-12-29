'use strict';
var displayModule = angular.module('gecscf.organize.configuration.display');
displayModule.controller('DisplayController', [
    '$log',
    '$scope',
    '$state',
    'SCFCommonService',
    '$stateParams',
    '$timeout',
    'ngDialog',
    'PageNavigation',
    'Service',
    '$q',
    '$rootScope',
    '$injector',
    'DocumentDisplayConfigExampleService',
    'LOAN_REQUEST_MODE_ITEM',
    'DOCUMENT_SELECTION_ITEM',
    'SUPPLIER_CODE_GROUP_SELECTION_ITEM',
    'UIFactory',
    'blockUI',
    'DisplayService',
    'ConfigurationUtils',
    'scfFactory',
    'OVERDUE_DROPDOWN_ITEM',
    'PAYMENT_DATE_DROPDOWN_ITEM',
    'GRACE_PERIOD_DROPDOWN_ITEM',
    function ($log, $scope, $state, SCFCommonService,
        $stateParams, $timeout, ngDialog,
        PageNavigation, Service, $q, $rootScope, $injector, DocumentDisplayConfigExampleService,
        LOAN_REQUEST_MODE_ITEM, DOCUMENT_SELECTION_ITEM, SUPPLIER_CODE_GROUP_SELECTION_ITEM,
        UIFactory, blockUI, DisplayService, ConfigurationUtils, scfFactory,
        OVERDUE_DROPDOWN_ITEM, PAYMENT_DATE_DROPDOWN_ITEM, GRACE_PERIOD_DROPDOWN_ITEM) {

        var vm = this;
        var log = $log;

        vm.manageAll = false;

        var ownerId = $stateParams.organizeId;
        vm.accountingTransactionType = $stateParams.accountingTransactionType;
        var displayMode = $stateParams.displayMode;
        var displayId = $stateParams.documentDisplayId;

        var newDisplayConfig = function () {
            return {
                documentFieldId: null,
                sortType: null
            }
        }

        vm.headerMessageLabel = displayMode == "TRANSACTION_DOCUMENT" ? "Setup create transaction display" : "Setup document display";

        vm.mode = vm.accountingTransactionType == "RECEIVABLE" ? "Payment mode" : "Loan request mode";
        vm.groupSelection = vm.accountingTransactionType == "RECEIVABLE" ? "Buyer code group selection" : "Supplier code group selection";

        vm.isCreateTransactionMode = displayMode == "TRANSACTION_DOCUMENT" ? true : false;

        vm.loanRequestMode = LOAN_REQUEST_MODE_ITEM;
        vm.documentSelection = DOCUMENT_SELECTION_ITEM;
        vm.supplierCodeSelectionMode = SUPPLIER_CODE_GROUP_SELECTION_ITEM;
        vm.overdueDropDown = OVERDUE_DROPDOWN_ITEM;
        vm.paymentDropDown = PAYMENT_DATE_DROPDOWN_ITEM;
        vm.gracePeriodDropDown = GRACE_PERIOD_DROPDOWN_ITEM;

        vm.groupDocumentType = DOCUMENT_SELECTION_ITEM.allDocument;

        vm.overdueRadioType = {
            "UNLIMITED": "UNLIMITED",
            "PERIOD": "PERIOD"
        }

        vm.productTypeDropDown = [{
            value: null,
            label: 'Default'
        }];

        vm.sortTypes = [{
            label: 'ASC',
            value: 'ASC'
        }, {
            label: 'DESC',
            value: 'DESC'
        }, {
            label: '-',
            value: null
        }];

        vm.documentFields = [{
            value: null,
            label: 'Please select'
        }];
        vm.documentFieldData = [];

        vm.dataMappingType = [{
            value: null,
            label: 'Please select'
        }];

        vm.documentConditions = [{
            value: null,
            label: 'Please select'
        }];

        vm.displayOverdue = "false";
        vm.supportGracePeriod = "false";
        vm.gracePriod = null;

        var defaultAllowablePaymentDays = function () {
            var allowablePaymentDays = [];
            var forDebit = {
                allowablePaymentDay: "ALL_DAY",
                transactionMethod: "DEBIT"
            }
            var forDrawdown = {
                allowablePaymentDay: "ALL_DAY",
                transactionMethod: "TERM_LOAN"
            }
            var forSpecialDebit = {
                allowablePaymentDay: "ALL_DAY",
                transactionMethod: "DEBIT_SPECIAL"
            }
            allowablePaymentDays.push(forDebit);
            allowablePaymentDays.push(forDrawdown);
            allowablePaymentDays.push(forSpecialDebit);
            return allowablePaymentDays;
        }

        vm.checkedForDebit = false;
        vm.checkedForDrawdown = false;
        vm.checkedForSpecialDebit = false;

        var checkIsWorkingDay = function (data) {
            var isWorkingDay = true
            if (data.allowablePaymentDay == "ALL_DAY") {
                isWorkingDay = false;
            }
            return isWorkingDay;
        }
        vm.overdueType = vm.overdueRadioType.UNLIMITED;

        var initialCheckBoxPayOnlyBankWorkingDay = function () {
            console.log("object");
            vm.allowablePaymentDays.forEach(function (data) {
                if (data.transactionMethod == "DEBIT") {
                    vm.checkedForDebit = checkIsWorkingDay(data);
                } else if (data.transactionMethod == "TERM_LOAN") {
                    vm.checkedForDrawdown = checkIsWorkingDay(data);
                } else if (data.transactionMethod == "DEBIT_SPECIAL") {
                    vm.checkedForSpecialDebit = checkIsWorkingDay(data);
                }
            });
        }

        vm.overDuePeriod = null;
        var initialOverdue = function () {
            console.log(vm.dataModel.overDuePeriod);
            if (vm.dataModel.overDuePeriod == 0 || vm.dataModel.overDuePeriod == null) {
                vm.overDuePeriod = null;
                vm.overdueType = vm.overdueRadioType.UNLIMITED;
            } else {
                vm.overDuePeriod = vm.dataModel.overDuePeriod;
                vm.overdueType = vm.overdueRadioType.PERIOD;
            }
        }

        var loadDisplayConfig = function (ownerId, accountingTransactionType, displayMode) {
            var deffered = DisplayService.getDocumentDisplayConfig(ownerId, accountingTransactionType, displayMode, displayId);
            deffered.promise.then(function (response) {
                var data = response.data;
                console.log(data);
                vm.dataModel = data || {
                    displayName: null,
                    items: [newDisplayConfig()],
                    loanRequestMode: null,
                    documentSelection: null,
                    supplierCodeSelectionMode: null,
                    documentGroupingFields: [],
                    displayNegativeDocument: null,
                    reasonCodeMappingId: null,
                    supportPartial: false,
                    supportSpecialDebit: null
                };

                vm.displayOverdue = vm.dataModel.displayOverdue ? "true" : "false";
                initialOverdue();

                vm.supportGracePeriod = vm.dataModel.supportGracePeriod ? "true" : "false";
                vm.gracePriod = vm.dataModel.gracePriod;

                vm.allowablePaymentDays = vm.dataModel.allowablePaymentDays.length > 0 ? vm.dataModel.allowablePaymentDays : defaultAllowablePaymentDays();
                initialCheckBoxPayOnlyBankWorkingDay();

                vm.shiftIn = vm.dataModel.shiftIn == null ? true : vm.dataModel.shiftIn;

                // default grouping field 1 record if don't have data
                if (vm.dataModel.documentGroupingFields == [] || vm.dataModel.documentGroupingFields.length == 0) {
                    var groupItem = {
                        documentFieldId: null,
                        documentDisplayId: vm.dataModel.documentDisplayId
                    }
                    vm.dataModel.documentGroupingFields.push(groupItem);
                }

                // default Display CN documents is select record if don't have
                // data and accounting transaction type is RECEIVABLE
                if (vm.dataModel.displayNegativeDocument == null && vm.accountingTransactionType == "RECEIVABLE") {
                    vm.dataModel.displayNegativeDocument = true;
                }
                if (vm.dataModel.supportSpecialDebit == null && vm.accountingTransactionType == "RECEIVABLE") {
                    vm.dataModel.supportSpecialDebit = false;
                }

                if (vm.dataModel.documentSelection != DOCUMENT_SELECTION_ITEM.anyDocument) {
                    vm.groupDocumentType = angular.copy(vm.dataModel.documentSelection);
                    vm.dataModel.documentSelection = DOCUMENT_SELECTION_ITEM.groupBy;
                }

                if (vm.dataModel.items == null || vm.dataModel.items.length < 1) {
                    vm.addItem();
                }

                if (vm.dataModel.loanRequestMode == null || vm.dataModel.loanRequestMode == '') {
                    vm.dataModel.loanRequestMode = 'CURRENT_AND_FUTURE';
                }
                if (vm.dataModel.documentSelection == null || vm.dataModel.documentSelection == '') {
                    vm.dataModel.documentSelection = 'ANY_DOCUMENT';
                }
                if (vm.dataModel.supplierCodeSelectionMode == null || vm.dataModel.supplierCodeSelectionMode == '') {
                    vm.dataModel.supplierCodeSelectionMode = 'SINGLE_PER_TRANSACTION';
                }

            }).catch(function (response) {
                log.error('Load data error');
            });
        }

        var loadMappingData = function (ownerId, accountingTransactionType) {
            var dataType = ["TEXT_MAPPING_WITH_DEFAULT"];
            var deffered = SCFCommonService.loadMappingData(ownerId, accountingTransactionType, dataType);
            deffered.promise.then(function (response) {
                var mapping = response.data;
                if (mapping != null) {
                    mapping.forEach(function (data) {
                        var mappingData = {
                            value: data.mappingDataId,
                            label: data.mappingDataName
                        }
                        vm.dataMappingType.push(mappingData);
                    });
                }
                loadDisplayConfig(ownerId, accountingTransactionType, displayMode);

            });
        }

        var loadDocumentCondition = function () {
            var deffered = SCFCommonService.getDocumentFields('DISPLAY', 'DETAIL', 'TEXT', false);
            deffered.promise.then(function (response) {
                var documentFieldData = response.data;

                documentFieldData.forEach(function (obj) {
                    var item = {
                        value: obj.documentFieldId,
                        label: obj.displayFieldName
                    };
                    vm.documentConditions.push(item);
                });
            }).catch(function (response) {
                log.error('Load data condition error');
            });
        }

        var loadDataTypes = function () {
            var deffered = SCFCommonService.getDocumentFields('DISPLAY', 'DETAIL');
            deffered.promise.then(function (response) {
                vm.documentFieldData = response.data;

                vm.documentFieldData.forEach(function (obj) {
                    var item = {
                        value: obj.documentFieldId,
                        label: obj.displayFieldName
                    };
                    vm.documentFields.push(item);
                });
            }).catch(function (response) {
                log.error('Load data type error');
            });
        }

        var loadProductTypeDropdawn = function (ownerId) {
            var deffered = DisplayService.getProductTypes(ownerId);
            deffered.promise.then(function (response) {
                var productTypes = response.data;
                if (productTypes != null) {
                    productTypes.forEach(function (data) {
                        var productTypeData = {
                            value: data.productType,
                            label: data.displayName
                        }
                        vm.productTypeDropDown.push(productTypeData);
                    });
                }
            });
        }


        var init = function () {
            loadDataTypes();
            loadDocumentCondition();
            loadMappingData(ownerId, vm.accountingTransactionType);
            loadProductTypeDropdawn(ownerId);
        } ();

        // <------------------------------------------ User Action ------------------------------------------->
        vm.removeGroupDocumentCondition = function (field) {
            var index = vm.dataModel.documentGroupingFields.indexOf(field);
            vm.dataModel.documentGroupingFields.splice(index, 1);
        }

        vm.addGroupDocumentCondition = function () {
            var groupItem = {
                documentFieldId: null,
                documentDisplayId: vm.dataModel.documentDisplayId
            }
            vm.dataModel.documentGroupingFields.push(groupItem);
        }

        var clearGroupDocumentConditionField = function () {
            vm.dataModel.documentGroupingFields = [];
            var groupItem = {
                documentFieldId: null,
                documentDisplayId: vm.dataModel.documentDisplayId
            }
            vm.dataModel.documentGroupingFields.push(groupItem);
        }

        vm.changeDocumentSelection = function () {
            if (vm.dataModel.documentSelection == DOCUMENT_SELECTION_ITEM.anyDocument) {
                clearGroupDocumentConditionField();
                vm.groupDocumentType = DOCUMENT_SELECTION_ITEM.allDocument;
            }
        }

        vm.addItem = function () {
            refreshSession();
            vm.dataModel.items.push({
                documentFieldId: null,
                sortType: null,
                completed: false
            });
        }

        vm.removeItem = function (record) {
            var index = vm.dataModel.items.indexOf(record);
            vm.dataModel.items.splice(index, 1);
        }

        vm.openSetting = function (index, record) {
            var documentFieldId = record.documentField.documentFieldId;
            vm.documentFieldData.forEach(function (obj) {
                if (documentFieldId == obj.documentFieldId) {

                    var dialog = ngDialog.open({
                        id: 'setting-dialog-' + index,
                        template: obj.configUrl,
                        className: 'ngdialog-theme-default',
                        controller: obj.dataType + 'DisplayConfigController',
                        controllerAs: 'ctrl',
                        scope: $scope,
                        data: {
                            record: record,
                            config: obj
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

        vm.clearSelectMappingData = function () {
            if (!vm.dataModel.supportPartial) {
                vm.dataModel.reasonCodeMappingId = null;
            }
        }

        vm.newMapping = function () {
            ConfigurationUtils.showCreateMappingDataDialog({
                data: {
                    ownerId: ownerId,
                    accountingTransactionType: vm.accountingTransactionType,
                    showAll: false
                },
                preCloseCallback: function (saveResponse) {
                    var dataType = ["TEXT_MAPPING_WITH_DEFAULT"];
                    var deffered = SCFCommonService.loadMappingData(ownerId, vm.accountingTransactionType, dataType);
                    deffered.promise.then(function (response) {
                        vm.dataMappingType = [{
                            value: null,
                            label: 'Please select'
                        }];
                        var mapping = response.data;
                        if (mapping != null) {
                            mapping.forEach(function (data) {
                                var mappingData = {
                                    value: data.mappingDataId,
                                    label: data.mappingDataName
                                }
                                vm.dataMappingType.push(mappingData);
                            });
                        }

                        vm.dataModel.reasonCodeMappingId = saveResponse.data.mappingDataId;
                    });
                }
            });
        }

        vm.changeOverdue = function () {
            if (vm.displayOverdue == "false") {
                vm.overdueType = vm.overdueRadioType.UNLIMITED
                vm.overDuePeriod = null;
                vm.showMessagePeriodError = false;
            }
        }

        vm.changeOverdueType = function () {
            if (vm.overdueType == vm.overdueRadioType.UNLIMITED) {
                vm.overDuePeriod = null;
                vm.showMessagePeriodError = false;
            } else {
                vm.overDuePeriod = 1;
            }
        }

        vm.changeSupportGracePeriod = function () {
            if (vm.supportGracePeriod == 'true') {
                vm.gracePriod = 1;
            } else {
                vm.gracePriod = null;
            }
        }

        vm.changeShiftPaymentDate = function () {
            if (!vm.dataModel.shiftPaymentDate) {
                vm.shiftIn = true
            }
        }

        vm.backToSponsorConfigPage = function () {
            PageNavigation.gotoPage('/sponsor-configuration', {
                organizeId: ownerId
            });
        }

        var setValueBeforeSave = function () {
            // Overdue
            if (vm.displayOverdue == 'false') {
                vm.dataModel.overDuePeriod = null;
            } else if (vm.displayOverdue == 'true') {
                if (vm.overdueType == vm.overdueRadioType.UNLIMITED) {
                    vm.dataModel.overDuePeriod = 0;
                } else {
                    vm.dataModel.overDuePeriod = vm.overDuePeriod;
                }
            }

            // Grace period
            if (vm.supportGracePeriod == "false") {
                vm.dataModel.gracePriod = null;
            } else if (vm.supportGracePeriod == 'true'){
                vm.dataModel.gracePriod = vm.gracePriod;
            }

            // Shift In
            console.log(vm.dataModel.shiftPaymentDate);
            if(!vm.dataModel.shiftPaymentDate){
                vm.dataModel.shiftIn = null;
            }else{
                vm.dataModel.shiftIn = vm.shiftIn;
            }
        }

        vm.showMessagePeriodError = false;
        vm.showMessageGracePeriodError = false;

        var validateOverdueAndGracePeriod = function () {
            var validate = true;
            if (vm.overdueType == vm.overdueRadioType.PERIOD) {
                if (angular.isUndefined(vm.overDuePeriod) || vm.overDuePeriod == null) {
                    vm.showMessagePeriodError = true;
                    validate = false;
                } else {
                    vm.showMessagePeriodError = false;
                }

            }

            if (vm.supportGracePeriod == "true") {
                if (angular.isUndefined(vm.gracePriod)) {
                    vm.showMessageGracePeriodError = true;
                    validate = false;
                } else {
                    vm.showMessageGracePeriodError = false;
                }

            }
            return validate;

        }

        vm.save = function () {
            if (validateOverdueAndGracePeriod()) {
                setValueBeforeSave();
                var preCloseCallback = function () {
                    var organizeModel = { organizeId: ownerId };
                    PageNavigation.gotoPage('/sponsor-configuration', {
                        organizeModel: organizeModel
                    });
                }
                if (vm.dataModel.displayName == '') {
                    var errors = {
                        requireLayoutName: true
                    }
                    onFail(errors)
                } else {
                    UIFactory.showConfirmDialog({
                        data: {
                            headerMessage: 'Confirm save?'
                        },
                        confirm: $scope.confirmSave,
                        onFail: function (response) {
                            var msg = {
                                409: 'Display document has been deleted.',
                                405: 'Display document has been used.'
                            };
                            if (response.status == 404) {
                                vm.isNotTradeFinance = true;
                            }
                            else if (response.status != 400) {
                                UIFactory.showFailDialog({
                                    data: {
                                        headerMessage: 'Edit display document configuration fail.',
                                        bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
                                    },
                                    preCloseCallback: function () {
                                        if (response.status != 404) {
                                            vm.backToSponsorConfigPage();
                                        } else {
                                            vm.isNotTradeFinance = true;
                                            vm.dataModel.supportSpecialDebit = false;
                                        }
                                    }
                                });
                            } else {
                                $scope.errors[response.data.reference] = {
                                    message: response.data.errorMessage
                                }

                                var errors = {
                                    duplicateLayoutName: true
                                }

                                onFail(errors)
                            }
                            blockUI.stop();

                        },
                        onSuccess: function (response) {
                            blockUI.stop();
                            UIFactory.showSuccessDialog({
                                data: {
                                    headerMessage: 'Edit display document configuration complete.',
                                    bodyMessage: ''
                                },
                                preCloseCallback: function () {
                                    vm.backToSponsorConfigPage();
                                }
                            });
                        }
                    });
                }
            }
        }

        $scope.errors = {};
        $scope.errors.isNotTradeFinance = {
            message: 'Please setup trade finance before creating special direct debit.'
        }

        var onFail = function (errors) {
            $scope.errors = errors;
        }



        $scope.confirmSave = function () {
            if (vm.dataModel.documentSelection == DOCUMENT_SELECTION_ITEM.groupBy) {
                if (vm.accountingTransactionType == "RECEIVABLE") {
                    vm.dataModel.documentSelection = vm.groupDocumentType;
                } else {
                    vm.dataModel.documentSelection = DOCUMENT_SELECTION_ITEM.allDocument;
                }
            } else {
                vm.dataModel.documentGroupingFields = [];
            }

            vm.dataModel.completed = true;
            var dataSaveModel = jQuery.extend(true, {}, vm.dataModel);
            dataSaveModel.items.forEach(function (obj, index) {
                if (obj.documentField != null) {
                    var dataType = vm.documentFields[obj.documentField.documentFieldId];
                    if (angular.isDefined(dataType)) {
                        obj.sequenceNo = index + 1;
                        dataSaveModel.items[index].documentFieldId = obj.documentField.documentFieldId;
                        dataSaveModel.completed = obj.completed && dataSaveModel.completed;
                    }
                } else {
                    dataSaveModel.items.splice(index, 1);
                }
            })
            return DisplayService.updateDisplay(ownerId, vm.accountingTransactionType, displayMode, dataSaveModel);
        }

        vm.cannotSetup = function (record) {
            if (angular.isDefined(record.documentField)) {
                var hasUrl = true;
                var documentFieldId = record.documentField.documentFieldId;
                vm.documentFieldData.forEach(function (obj) {
                    if (documentFieldId == obj.documentFieldId) {

                        if (obj.configUrl == null) {
                            hasUrl = false;
                        }
                    }
                });

                if (!vm.manageAll || !hasUrl) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        vm.moveItemUp = function (item) {
            refreshSession();
            var itemIndex = vm.dataModel.items.indexOf(item);
            addItemToIndex(itemIndex - 1, item);
        }

        vm.moveItemDown = function (item) {
            refreshSession();
            var itemIndex = vm.dataModel.items.indexOf(item);
            addItemToIndex(itemIndex + 1, item);
        }


        function addItemToIndex(index, item) {
            var totalItem = vm.dataModel.items.length;
            if (index >= 0 && index <= totalItem) {
                vm.removeItem(item);
                vm.dataModel.items.splice(index, 0, item);
            }
        }

        function refreshSession() {
            Service.doGet('/api/rest');
        }

        vm.displayExample = function (record) {
            var msg = '';
            vm.documentFieldData.forEach(function (obj) {

                if (record.documentField != null && record.documentField.documentFieldId == obj.documentFieldId) {
                    // if (record.completed) {

                    msg = $injector.get('DocumentDisplayConfigExampleService')[obj.dataType + '_DisplayExample'](record, obj);
                    // }
                }
            });
            return msg;
        };
        // <------------------------------------------ User Action ------------------------------------------->
    }

]).constant('OVERDUE_DROPDOWN_ITEM', [{
    label: 'Not display overdue invoice',
    value: false
}, {
    label: 'Display overdue invoice',
    value: true
}]).constant('PAYMENT_DATE_DROPDOWN_ITEM', [{
    label: 'Current date',
    value: 'CURRENT'
}, {
    label: 'Current date - Min due date',
    value: 'CURRENT_AND_FUTURE'
}]).constant('GRACE_PERIOD_DROPDOWN_ITEM', [{
    label: 'Not support invoice grace period',
    value: false
}, {
    label: 'Support invoice grace period',
    value: true
}]).constant('ALIGNMENT_DROPDOWN_ITEM', [{
    label: 'Please select',
    value: null
}, {
    label: 'Center',
    value: 'CENTER'
}, {
    label: 'Left',
    value: 'LEFT'
}, {
    label: 'Right',
    value: 'RIGHT'
}]).constant('NEGATIVE_NUMMBER_DROPDOWN_ITEM', [{
    label: '-123,456.00',
    value: "number"
}, {
    label: '(123,456.00)',
    value: 'negativeParenthesis'
}]).constant('LOAN_REQUEST_MODE_ITEM', {
    currentAndFuture: 'CURRENT_AND_FUTURE',
    current: 'CURRENT'
}).constant('DOCUMENT_SELECTION_ITEM', {
    anyDocument: 'ANY_DOCUMENT',
    groupBy: 'GROUP_BY',
    allDocument: 'ALL_DOCUMENT',
    atLeastOneDocument: 'AT_LEAST_ONE_DOCUMENT'
}).constant('SUPPLIER_CODE_GROUP_SELECTION_ITEM', {
    singlePerTransaction: 'SINGLE_PER_TRANSACTION',
    multiplePerTransaction: 'MULTIPLE_PER_TRANSACTION'
}).controller('TEXTDisplayConfigController', ['$scope', 'ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
    function ($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {

        this.model = angular.copy($scope.ngDialogData.record);

        this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

    }
]).controller('MATCHING_REFDisplayConfigController', ['$scope', 'ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
    function ($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {

        this.model = angular.copy($scope.ngDialogData.record);

        this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

    }
]).controller('CUSTOMER_CODEDisplayConfigController', ['$scope', 'ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
    function ($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {

        this.model = angular.copy($scope.ngDialogData.record);

        this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

    }
]).controller('DOCUMENT_NODisplayConfigController', ['$scope', 'ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
    function ($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {

        this.model = angular.copy($scope.ngDialogData.record);

        this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

    }
]).controller('DOCUMENT_TYPEDisplayConfigController', ['$scope', 'ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
    function ($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {

        this.model = angular.copy($scope.ngDialogData.record);

        this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

    }
]).controller('NUMERICDisplayConfigController', ['$scope',
    '$filter',
    'ALIGNMENT_DROPDOWN_ITEM',
    'NEGATIVE_NUMMBER_DROPDOWN_ITEM',
    '$rootScope', 'SCFCommonService',
    function ($scope, $filter, ALIGNMENT_DROPDOWN_ITEM, NEGATIVE_NUMMBER_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
        var vm = this;
        var dataTypeConfig = $scope.ngDialogData.config;

        vm.dlgData = { useSeperator: false, filterType: null };

        vm.model = angular.copy($scope.ngDialogData.record);

        vm.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

        vm.negativeNumberDropdownItems = NEGATIVE_NUMMBER_DROPDOWN_ITEM;

        var rawExample = parseFloat(dataTypeConfig.defaultExampleValue).toFixed(2);
        vm.exampleRawData = isNaN(rawExample) ? 123456.00 : rawExample;

        var prepareDiaglogData = function () {

            if (vm.model.filterType == 'negativeParenthesis') {
                vm.dlgData.useSeperator = true;
                vm.dlgData.filterType = 'negativeParenthesis';
            } else if (vm.model.filterType == 'noSeperatorNegativeParenthesis') {
                vm.dlgData.useSeperator = false;
                vm.dlgData.filterType = 'negativeParenthesis';
            } else if (vm.model.filterType == 'number') {
                vm.dlgData.useSeperator = true;
                vm.dlgData.filterType = 'number';
            } else {
                vm.dlgData.useSeperator = false;
                vm.dlgData.filterType = 'number';
            }
        }

        prepareDiaglogData();

        $scope.$watch('ctrl.dlgData', function () {
            if (vm.dlgData.useSeperator) {
                vm.model.filterType = vm.dlgData.filterType;
            } else {
                if (vm.dlgData.filterType == 'number') {
                    vm.model.filterType = 'noSeperatorNumeric';
                } else {
                    vm.model.filterType = 'noSeperatorNegativeParenthesis';
                }
            }
            vm.examplePosDataDisplay = $filter(vm.model.filterType)(vm.exampleRawData, 2);
            vm.exampleNegDataDisplay = $filter(vm.model.filterType)(-vm.exampleRawData, 2);
        }, true);

    }
]).controller('PAYMENT_AMOUNTDisplayConfigController', ['$scope',
    '$filter',
    'ALIGNMENT_DROPDOWN_ITEM',
    'NEGATIVE_NUMMBER_DROPDOWN_ITEM',
    '$rootScope', 'SCFCommonService',
    function ($scope, $filter, ALIGNMENT_DROPDOWN_ITEM, NEGATIVE_NUMMBER_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
        var vm = this;
        var dataTypeConfig = $scope.ngDialogData.config;

        vm.dlgData = { useSeperator: false, filterType: null };

        vm.model = angular.copy($scope.ngDialogData.record);

        vm.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

        vm.negativeNumberDropdownItems = NEGATIVE_NUMMBER_DROPDOWN_ITEM;

        var rawExample = parseFloat(dataTypeConfig.defaultExampleValue).toFixed(2);
        vm.exampleRawData = isNaN(rawExample) ? 123456.00 : rawExample;

        var prepareDiaglogData = function () {

            if (vm.model.filterType == 'negativeParenthesis') {
                vm.dlgData.useSeperator = true;
                vm.dlgData.filterType = 'negativeParenthesis';
            } else if (vm.model.filterType == 'noSeperatorNegativeParenthesis') {
                vm.dlgData.useSeperator = false;
                vm.dlgData.filterType = 'negativeParenthesis';
            } else if (vm.model.filterType == 'number') {
                vm.dlgData.useSeperator = true;
                vm.dlgData.filterType = 'number';
            } else {
                vm.dlgData.useSeperator = false;
                vm.dlgData.filterType = 'number';
            }
        }

        prepareDiaglogData();

        $scope.$watch('ctrl.dlgData', function () {
            if (vm.dlgData.useSeperator) {
                vm.model.filterType = vm.dlgData.filterType;
            } else {
                if (vm.dlgData.filterType == 'number') {
                    vm.model.filterType = 'noSeperatorNumeric';
                } else {
                    vm.model.filterType = 'noSeperatorNegativeParenthesis';
                }
            }
            vm.examplePosDataDisplay = $filter(vm.model.filterType)(vm.exampleRawData, 2);
            vm.exampleNegDataDisplay = $filter(vm.model.filterType)(-vm.exampleRawData, 2);
        }, true);

    }
]).controller('DATE_TIMEDisplayConfigController', ['$scope', '$filter', '$log', 'ALIGNMENT_DROPDOWN_ITEM', 'Service', '$rootScope', 'SCFCommonService',
    function ($scope, $filter, $log, ALIGNMENT_DROPDOWN_ITEM, Service, $rootScope, SCFCommonService) {
        var vm = this;
        vm.model = angular.copy($scope.ngDialogData.record);
        if (!vm.model.filterType) {
            vm.model.filterType = 'date';
        }
        if (!vm.model.format) {
            vm.model.format = 'dd/MM/yyyy';
        }
        vm.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;
        vm.formatDropdownItems = [];

        var serviceUrl = 'js/app/sponsor-configuration/file-layouts/date_time_format.json';
        var diferred = Service.doGet(serviceUrl);
        diferred.promise.then(function (response) {
            var dateTimeDropdownList = response.data;
            if (dateTimeDropdownList !== undefined) {
                dateTimeDropdownList.forEach(function (obj) {
                    var selectObj = {
                        label: obj.dateTimeName,
                        value: obj.dateTimeId
                    }
                    vm.formatDropdownItems.push(selectObj);
                });
            }
            diferred.resolve(vm.formatDropdownItems);
        }).catch(function (response) {
            $log.error('Load date time format Fail');
            diferred.reject();
        });

        $scope.$watch('ctrl.model.format', function () {
            var collectionDate = '2016-04-13T00:00:00';
            var date = new Date(collectionDate);
            vm.exampleDataDisplay = $filter('date')(date, vm.model.format);
        });

    }
]).factory('DocumentDisplayConfigExampleService', ['$filter', 'SCFCommonService', function ($filter, SCFCommonService) {
    return {
        TEXT_DisplayExample: TEXT_DisplayExample,
        CUSTOMER_CODE_DisplayExample: CUSTOMER_CODE_DisplayExample,
        NUMERIC_DisplayExample: NUMERIC_DisplayExample,
        DATE_TIME_DisplayExample: DATE_TIME_DisplayExample
    }

    function TEXT_DisplayExample(record, config) {
        var displayMessage = config.detailExamplePattern;
        var replacements = [SCFCommonService.camelize(record.alignment), config.defaultExampleValue];
        return SCFCommonService.replacementStringFormat(displayMessage, replacements);
    }

    function CUSTOMER_CODE_DisplayExample(record, config) {
        var displayMessage = config.detailExamplePattern;
        var replacements = [SCFCommonService.camelize(record.alignment), config.defaultExampleValue];
        return SCFCommonService.replacementStringFormat(displayMessage, replacements);
    }

    function NUMERIC_DisplayExample(record, config) {
        var displayMessage = config.detailExamplePattern;
        var exampleRawData = parseFloat(config.defaultExampleValue).toFixed(2);
        var examplePosDataDisplay = '';
        var exampleNegDataDisplay = '';
        if (record.filterType != null) {
            examplePosDataDisplay = $filter(record.filterType)(exampleRawData, 2);
            exampleNegDataDisplay = $filter(record.filterType)(-exampleRawData, 2);
        } else {
            examplePosDataDisplay = $filter('number')(exampleRawData, 2);
            exampleNegDataDisplay = $filter('number')(-exampleRawData, 2);
        }
        var replacements = [SCFCommonService.camelize(record.alignment), examplePosDataDisplay, exampleNegDataDisplay];
        return SCFCommonService.replacementStringFormat(displayMessage, replacements);
    }

    function DATE_TIME_DisplayExample(record, config) {
        var displayMessage = config.detailExamplePattern;
        var date = new Date(config.defaultExampleValue);
        var exampleDataDisplay = '';
        var replacements = '';
        if (record.format != null) {
            exampleDataDisplay = $filter('date')(date, record.format);
            replacements = [SCFCommonService.camelize(record.alignment), record.format.toUpperCase(), exampleDataDisplay];
        } else {
            replacements = [SCFCommonService.camelize(record.alignment), '-', config.defaultExampleValue];
        }
        return SCFCommonService.replacementStringFormat(displayMessage, replacements);
    }

}
]);