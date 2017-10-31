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
    function($log, $scope, $state, SCFCommonService,
        $stateParams, $timeout, ngDialog,
        PageNavigation, Service, $q, $rootScope, $injector, DocumentDisplayConfigExampleService, LOAN_REQUEST_MODE_ITEM,
        DOCUMENT_SELECTION_ITEM, SUPPLIER_CODE_GROUP_SELECTION_ITEM, UIFactory, blockUI, DisplayService) {

        var vm = this;
        var log = $log;

        vm.manageAll = false;

        var ownerId = $rootScope.sponsorId;
        vm.accountingTransactionType = $stateParams.accountingTransactionType;
        var displayMode = $stateParams.displayMode;

        var BASE_URI = 'api/v1/organize-customers/' + ownerId + '/accounting-transactions/' + vm.accountingTransactionType + '/display-modes/' + displayMode + '/displays';

        var newDisplayConfig = function() {
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

        vm.groupDocumentType = DOCUMENT_SELECTION_ITEM.allDocument;

        vm.sortTypes = [{
            label: 'ASC',
            value: 'ASC'
        }, {
            label: 'DESC',
            value: 'DESC'
        }, {
            label: '-',
            value: null
        }]

        vm.documentFields = [{
            value: null,
            label: 'Please select'
        }];
        vm.documentFieldData = [];

        // vm.documentGroupByFields = [{
        // 	value: null,
        // 	label: 'Please select'
        // }];
        // vm.documentGroupByFieldData = [];

        var loadDisplayConfig = function(ownerId, accountingTransactionType, displayMode) {
            var deffered = DisplayService.getDocumentDisplayConfig(ownerId, accountingTransactionType, displayMode);
            deffered.promise.then(function(response) {
                var data = response.data;

                vm.dataModel = data || {
                    displayName: null,
                    items: [newDisplayConfig()],
                    loanRequestMode: null,
                    documentSelection: null,
                    supplierCodeSelectionMode: null,
                    documentGroupingFields: [],
                    displayNegativeDocument: null
                };

                // default grouping field 1 record if don't have data
                if (vm.dataModel.documentGroupingFields == [] || vm.dataModel.documentGroupingFields.length == 0) {
                    var groupItem = {
                        documentFieldId: null,
                        documentDisplayId: vm.dataModel.documentDisplayId
                    }
                    vm.dataModel.documentGroupingFields.push(groupItem);
                }

                // default Display CN documents is select record if don't have data and accounting transaction type is RECEIVABLE
                if (vm.dataModel.displayNegativeDocument == null && vm.accountingTransactionType == "RECEIVABLE") {
                    vm.dataModel.displayNegativeDocument = true;
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

            }).catch(function(response) {
                log.error('Load data error');
            });
        }

        var loadDataTypes = function() {
            var deffered = SCFCommonService.getDocumentFields('DISPLAY', 'DETAIL');
            deffered.promise.then(function(response) {
                vm.documentFieldData = response.data;

                vm.documentFieldData.forEach(function(obj) {
                    var item = {
                        value: obj.documentFieldId,
                        label: obj.displayFieldName
                    };
                    vm.documentFields.push(item);
                });
            }).catch(function(response) {
                log.error('Load data type error');
            });
        }

        var init = function() {
            loadDataTypes();
            loadDisplayConfig(ownerId, vm.accountingTransactionType, displayMode);
        }();

        // <------------------------------------------  User Action ------------------------------------------->
        vm.removeGroupDocumentCondition = function(field) {
            var index = vm.dataModel.documentGroupingFields.indexOf(field);
            vm.dataModel.documentGroupingFields.splice(index, 1);
        }

        vm.addGroupDocumentCondition = function() {
            var groupItem = {
                documentFieldId: null,
                documentDisplayId: vm.dataModel.documentDisplayId
            }
            vm.dataModel.documentGroupingFields.push(groupItem);
        }

        var clearGroupDocumentConditionField = function() {
            vm.dataModel.documentGroupingFields = [];
            var groupItem = {
                documentFieldId: null,
                documentDisplayId: vm.dataModel.documentDisplayId
            }
            vm.dataModel.documentGroupingFields.push(groupItem);
        }

        vm.changeDocumentSelection = function() {
            if (vm.dataModel.documentSelection == DOCUMENT_SELECTION_ITEM.anyDocument) {
                clearGroupDocumentConditionField();
                vm.groupDocumentType = DOCUMENT_SELECTION_ITEM.allDocument;
            }
        }

        vm.addItem = function() {
            vm.dataModel.items.push({
                documentFieldId: null,
                sortType: null,
                completed: false
            });
        }

        vm.removeItem = function(record) {
            var index = vm.dataModel.items.indexOf(record);
            vm.dataModel.items.splice(index, 1);
        }

        vm.openSetting = function(index, record) {
            var documentFieldId = record.documentField.documentFieldId;
            vm.documentFieldData.forEach(function(obj) {
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
                        preCloseCallback: function(value) {
                            if (value != null) {
                                angular.copy(value, record);
                                record.completed = true;
                            }
                        }
                    });
                }
            });

        }

        vm.backToSponsorConfigPage = function() {
            PageNavigation.gotoPreviousPage();
        }

        vm.save = function() {
            var preCloseCallback = function() {
                var organizeModel = { organizeId: ownerId };
                PageNavigation.gotoPage('/sponsor-configuration', {
                    organizeModel: organizeModel
                });
            }
            UIFactory.showConfirmDialog({
                data: {
                    headerMessage: 'Confirm save?'
                },
                confirm: $scope.confirmSave,
                onFail: function(response) {
                    blockUI.stop();
                    var msg = {
                        409: 'Display document has been deleted.',
                        405: 'Display document has been used.'
                    };
                    UIFactory.showFailDialog({
                        data: {
                            headerMessage: 'Edit display document configuration fail.',
                            bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
                        },
                        preCloseCallback: preCloseCallback
                    });
                },
                onSuccess: function(response) {
                    blockUI.stop();
                    UIFactory.showSuccessDialog({
                        data: {
                            headerMessage: 'Edit display document configuration complete.',
                            bodyMessage: ''
                        },
                        preCloseCallback: preCloseCallback
                    });
                }
            });
        }

        $scope.confirmSave = function() {
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
            vm.dataModel.items.forEach(function(obj, index) {
                obj.sequenceNo = index + 1;
                vm.dataModel.items[index].documentFieldId = obj.documentField.documentFieldId;
                vm.dataModel.completed = obj.completed && vm.dataModel.completed;
            })

            return DisplayService.updateDisplay(ownerId, vm.accountingTransactionType, displayMode, vm.dataModel);
        }

        vm.cannotSetup = function(record) {
            if (angular.isDefined(record.documentField)) {
                var hasUrl = true;
                var documentFieldId = record.documentField.documentFieldId;
                vm.documentFieldData.forEach(function(obj) {
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

        vm.moveItemUp = function(item) {
            var itemIndex = vm.dataModel.items.indexOf(item);
            addItemToIndex(itemIndex - 1, item);
        }

        vm.moveItemDown = function(item) {
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

        vm.displayExample = function(record) {
            var msg = '';
            vm.documentFieldData.forEach(function(obj) {

                if (record.documentField != null && record.documentField.documentFieldId == obj.documentFieldId) {
                    //                            if (record.completed) {

                    msg = $injector.get('DocumentDisplayConfigExampleService')[obj.dataType + '_DisplayExample'](record, obj);
                    //                            }
                }
            });
            return msg;
        };

        // <------------------------------------------  User Action ------------------------------------------->
    }

]).constant('ALIGNMENT_DROPDOWN_ITEM', [{
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
    function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {

        this.model = angular.copy($scope.ngDialogData.record);

        this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

    }
]).controller('MATCHING_REFDisplayConfigController', ['$scope', 'ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
    function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {

        this.model = angular.copy($scope.ngDialogData.record);

        this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

    }
]).controller('CUSTOMER_CODEDisplayConfigController', ['$scope', 'ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
    function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {

        this.model = angular.copy($scope.ngDialogData.record);

        this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

    }
]).controller('DOCUMENT_NODisplayConfigController', ['$scope', 'ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
    function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {

        this.model = angular.copy($scope.ngDialogData.record);

        this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

    }
]).controller('DOCUMENT_TYPEDisplayConfigController', ['$scope', 'ALIGNMENT_DROPDOWN_ITEM', '$rootScope', 'SCFCommonService',
    function($scope, ALIGNMENT_DROPDOWN_ITEM, $rootScope, SCFCommonService) {

        this.model = angular.copy($scope.ngDialogData.record);

        this.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

    }
]).controller('NUMERICDisplayConfigController', ['$scope',
    '$filter',
    'ALIGNMENT_DROPDOWN_ITEM',
    'NEGATIVE_NUMMBER_DROPDOWN_ITEM',
    '$rootScope', 'SCFCommonService',
    function($scope, $filter, ALIGNMENT_DROPDOWN_ITEM, NEGATIVE_NUMMBER_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
        var vm = this;
        var dataTypeConfig = $scope.ngDialogData.config;

        vm.dlgData = { useSeperator: false, filterType: null };

        vm.model = angular.copy($scope.ngDialogData.record);

        vm.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

        vm.negativeNumberDropdownItems = NEGATIVE_NUMMBER_DROPDOWN_ITEM;

        var rawExample = parseFloat(dataTypeConfig.defaultExampleValue).toFixed(2);
        vm.exampleRawData = isNaN(rawExample) ? 123456.00 : rawExample;

        var prepareDiaglogData = function() {

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

        $scope.$watch('ctrl.dlgData', function() {
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
    function($scope, $filter, ALIGNMENT_DROPDOWN_ITEM, NEGATIVE_NUMMBER_DROPDOWN_ITEM, $rootScope, SCFCommonService) {
        var vm = this;
        var dataTypeConfig = $scope.ngDialogData.config;

        vm.dlgData = { useSeperator: false, filterType: null };

        vm.model = angular.copy($scope.ngDialogData.record);

        vm.alignDropdownItems = ALIGNMENT_DROPDOWN_ITEM;

        vm.negativeNumberDropdownItems = NEGATIVE_NUMMBER_DROPDOWN_ITEM;

        var rawExample = parseFloat(dataTypeConfig.defaultExampleValue).toFixed(2);
        vm.exampleRawData = isNaN(rawExample) ? 123456.00 : rawExample;

        var prepareDiaglogData = function() {

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

        $scope.$watch('ctrl.dlgData', function() {
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
    function($scope, $filter, $log, ALIGNMENT_DROPDOWN_ITEM, Service, $rootScope, SCFCommonService) {
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
        diferred.promise.then(function(response) {
            var dateTimeDropdownList = response.data;
            if (dateTimeDropdownList !== undefined) {
                dateTimeDropdownList.forEach(function(obj) {
                    var selectObj = {
                        label: obj.dateTimeName,
                        value: obj.dateTimeId
                    }
                    vm.formatDropdownItems.push(selectObj);
                });
            }
            diferred.resolve(vm.formatDropdownItems);
        }).catch(function(response) {
            $log.error('Load date time format Fail');
            diferred.reject();
        });

        $scope.$watch('ctrl.model.format', function() {
            var collectionDate = '2016-04-13T00:00:00';
            var date = new Date(collectionDate);
            vm.exampleDataDisplay = $filter('date')(date, vm.model.format);
        });

    }
]).factory('DocumentDisplayConfigExampleService', ['$filter', 'SCFCommonService', function($filter, SCFCommonService) {
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
}]);