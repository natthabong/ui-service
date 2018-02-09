var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentController', [
    '$rootScope',
    '$scope',
    '$log',
    '$stateParams',
    '$q',
    'SCFCommonService',
    'TransactionService',
    'PagingController',
    'PageNavigation',
    '$filter',
    'MappingDataService',
    'ProductTypeService',
    'UIFactory',
    '$window',
    'scfFactory',
    function ($rootScope, $scope, $log, $stateParams, $q, SCFCommonService, TransactionService, PagingController, PageNavigation, $filter, MappingDataService, ProductTypeService, UIFactory, $window, scfFactory) {
        var vm = this;
        var log = $log;
        var supplierCodeSelectionMode = 'SINGLE_PER_TRANSACTION';

        function prepareCriteria() {
            var ownerId = $rootScope.userInfo.organizeId;
            return $stateParams.criteria || {
                accountingTransactionType: 'RECEIVABLE',
                sponsorId: ownerId,
                buyerId: ownerId,
                overDuePeriod: null,
                displayNegativeDocument: true
            }
        }

        function prepareTransactionModel() {
            var ownerId = $rootScope.userInfo.organizeId;
            return $stateParams.transactionModel || {
                sponsorId: ownerId,
                transactionAmount: 0.0,
                documents: [],
                transactionDate: null,
                maturityDate: null
            }
        }

        function prepareTradingpartnerInfoModel() {
            var ownerId = $rootScope.userInfo.organizeId;
            return $stateParams.tradingpartnerInfoModel || {
                available: '0.00',
                tenor: null,
                interestRate: null
            }
        }

        function _loadSuppliers(dashboardParams) {
            vm.suppliers = [];
            var tradingPartnerList = [];
            var deffered = $q.defer();
            if ($stateParams.supplierModel !== undefined && $stateParams.supplierModel !== null) {
                tradingPartnerList = $stateParams.supplierModel;
                tradingPartnerList.forEach(function (supplier) {
                    var selectObj = {
                        label: supplier.supplierName,
                        value: supplier.supplierId
                    }
                    vm.suppliers.push(selectObj);
                    if (vm.suppliers.length == tradingPartnerList.length) {
                        deffered.resolve(tradingPartnerList);
                    }
                });
                return deffered;
            } else {
                var subDeffered = TransactionService.getSuppliers('RECEIVABLE');
                subDeffered.promise.then(function (response) {
                    tradingPartnerList = response.data;
                    if (tradingPartnerList !== undefined) {
                        tradingPartnerList.forEach(function (supplier) {
                            var selectObj = {
                                label: supplier.supplierName,
                                value: supplier.supplierId
                            }
                            vm.suppliers.push(selectObj);
                        });

                        if (!$stateParams.backAction && dashboardParams == null) {
                            vm.criteria.supplierId = tradingPartnerList[0].supplierId;
                        } else if (dashboardParams != null) {
                            vm.criteria.supplierId = dashboardParams.supplierId;
                        }
                    }
                    deffered.resolve(tradingPartnerList);
                }).catch(function (response) {
                    log.error(response);
                });
                return deffered;
            }
        }

        function _checkCreatePaymentType(tradingPartnerList, supplierId) {
            var deferred = $q.defer();
            var result = $.grep(tradingPartnerList, function (supplier) {
                return supplier.supplierId == supplierId;
            });
            if (result[0].createTransactionType !== undefined && result[0].createTransactionType == 'WITHOUT_INVOICE') {
                vm.displayPaymentPage = false;
                var ownerId = $rootScope.userInfo.organizeId;
                var params = {
                    supplierModel: tradingPartnerList,
                    criteria: {
                        accountingTransactionType: 'RECEIVABLE',
                        supplierId: result[0].supplierId,
                        buyerId: ownerId,
                    }
                }
                PageNavigation.gotoPage('/my-organize/create-payment-woip', params);
            } else {
                vm.displayPaymentPage = true;
                deferred.resolve();
            }
            return deferred;
        }

        function _loadProducTypes(supplierId) {
            vm.criteria.productType = null;
            vm.productTypes = [];
            var deffered = $q.defer();
            var defferedProductTypes = ProductTypeService.getProductTypes(supplierId);
            defferedProductTypes.promise.then(function (response) {
                var _productTypes = response.data;
                if (angular.isDefined(_productTypes)) {
                    _productTypes.forEach(function (productType) {
                        var selectObj = {
                            label: productType.displayName,
                            value: productType.productType
                        }
                        vm.productTypes.push(selectObj);
                    });

                    if (_productTypes.length > 0) {
                        vm.hasProductType = true;
                        var dashboardParams = $stateParams.dashboardParams;
                        if (dashboardParams != null) {
                            vm.criteria.productType = dashboardParams.productType;
                        } else if (!$stateParams.backAction) {
                            vm.criteria.productType = _productTypes[0].productType;
                        } else {
                            vm.criteria.productType = $stateParams.transactionModel.productType;
                        }
                    }

                    deffered.resolve();
                } else {
                    deffered.resolve();
                }
            })
            return deffered;
        };

        function _loadBuyerCodes(supplierId) {
            vm.customerCodes = [];
            var deffered = $q.defer();
            var dashboardParams = $stateParams.dashboardParams;
            var defferedBuyerCodes = TransactionService.getBuyerCodes(supplierId);
            defferedBuyerCodes.promise.then(function (response) {
            	 if (supplierCodeSelectionMode == 'MULTIPLE_PER_TRANSACTION') {
                     var customerCode = {
                         label: 'All',
                         value: ''
                     }
                     vm.customerCodes.push(customerCode);
                 }
                var _buyerCodes = response.data;
                if (angular.isDefined(_buyerCodes)) {
                    _buyerCodes.forEach(function (code) {
                        var selectObj = {
                            label: code,
                            value: code
                        }
                        vm.customerCodes.push(selectObj);
                    });

                    if (!$stateParams.backAction && dashboardParams == null) {
                        vm.criteria.customerCode = vm.customerCodes[0].value;;
                    } else if (dashboardParams != null) {
                        vm.criteria.customerCode = dashboardParams.buyerCode;
                    }
                    deffered.resolve();
                } else {
                    deffered.resolve();
                }
            }).catch(function (response) {
                log.error(response);
            });
            return deffered;
        };

        function _setTransactionMethod(supportSpecialDebit) {
            if (supportSpecialDebit) {
                vm.transactionModel.transactionMethod = 'DEBIT_SPECIAL';
            } else {
                vm.transactionModel.transactionMethod = 'DEBIT';
            }
            vm.isLoanPayment = false;
        }

        function _setTradingpartnerInfoModel(account) {
            vm.transactionModel.transactionMethod = 'TERM_LOAN';
            vm.tradingpartnerInfoModel.available = account.remainingAmount - account.pendingAmount;
            vm.tradingpartnerInfoModel.tenor = account.tenor;
            vm.tradingpartnerInfoModel.interestRate = account.interestRate;
            vm.isLoanPayment = true;
        }

        function _loadAccount(supplierId) {
            vm.accountDropDown = [];
            var deffered = $q.defer();
            var ownerId = $rootScope.userInfo.organizeId;
            var defferedAccounts = TransactionService.getAccounts(ownerId, supplierId);
            defferedAccounts.promise.then(function (response) {
                var accounts = response.data;
                vm.isLoanPayment = false;
                if (accounts.length > 0) {
                    accounts.forEach(function (account, index) {
                        if (index == 0 && vm.supportSpecialDebit) {
                            if (account.defaultLoanNo) {
                                vm.accountNotSupportSpecialDirectDebit = false;
                            } else {
                                vm.accountNotSupportSpecialDirectDebit = true;
                            }
                        }

                        var formatAccount = {
                            label: account.format ? ($filter('accountNoDisplay')(account.accountNo)) : account.accountNo,
                            value: account.accountId,
                            item: account
                        }
                        vm.accountDropDown.push(formatAccount);
                    });
                } else {
                    if (vm.supportSpecialDebit) {
                        vm.accountNotSupportSpecialDirectDebit = true;
                    } else {
                        vm.accountNotSupportSpecialDirectDebit = false;
                    }
                }
                deffered.resolve(accounts);
            });
            return deffered;
        }

        function _loadMaturityDate() {
            vm.maturityDateDropDown = [];
            if (angular.isDefined(vm.paymentModel) && vm.transactionModel.documents != [] && vm.transactionModel.documents.length != 0) {
                var deffered = TransactionService.getAvailableMaturityDates(vm.paymentModel, vm.tradingpartnerInfoModel.tenor);
                deffered.promise.then(function (response) {
                    var maturityDates = response.data;
                    maturityDates.forEach(function (data) {
                        vm.maturityDateDropDown.push({
                            label: data,
                            value: data
                        });
                    });
                    if (vm.maturityDateDropDown.length != 0) {
                        vm.maturityDateModel = vm.maturityDateDropDown[0].value;
                    }
                    if ($stateParams.backAction && vm.transactionModel.maturityDate != null) {
                        vm.maturityDateModel = SCFCommonService.convertDate(vm.transactionModel.maturityDate);
                    }
                }).catch(function (response) {
                    log.error(response);
                });
            }
        }

        function _loadPaymentDate() {
            vm.paymentDropDown = [];
            vm.transactionModel.documents = vm.documentSelects;
            vm.transactionModel.supplierId = vm.criteria.supplierId;
            if (vm.transactionModel.documents != [] && vm.transactionModel.documents.length != 0) {
                var deffered = TransactionService.getPaymentDate(vm.transactionModel, vm.createTransactionType, vm.accountType, vm.criteria.loanRequestMode, vm.criteria.productType);
                deffered.promise.then(function (response) {
                    var paymentDates = response.data;
                    vm.paymentDropDown = [];
                    paymentDates.forEach(function (data) {
                        vm.paymentDropDown.push({
                            label: data,
                            value: data
                        })
                    });

                    vm.paymentModel = vm.paymentDropDown[0].value;
                    if ($stateParams.backAction) {
                        if (vm.transactionModel.transactionDate != null) {
                            vm.paymentModel = SCFCommonService.convertDate(vm.transactionModel.transactionDate);
                        }
                        $stateParams.backAction = false;

                    }

                    _loadMaturityDate();

                }).catch(function (response) {
                    log.error(response);
                });
            } else {
                _loadMaturityDate();
            }
        }

        function _loadReasonCodeMappingDatas() {
            vm.resonCodeDropdown = [];
            var deffered = $q.defer();
            var params = {
                offset: 0,
                limit: 999,
                sort: ['defaultCode', 'code']
            }
            var defferedMappingData = MappingDataService.loadMappingDataItems(vm.criteria.supplierId, 'RECEIVABLE', vm.reasonCodeMappingId, params);
            defferedMappingData.promise.then(function (response) {
                vm.reasonCodes = response.data;
                vm.reasonCodes.forEach(function (data) {
                    vm.resonCodeDropdown.push({
                        label: data.code + ': ' + data.display,
                        value: data.code
                    });
                    vm.reasonCodes[data.code] = data.display;
                });
                deffered.resolve();
            }).catch(function (response) {
                log.error(response);
                deffered.resolve();
            });

            return deffered;
        }

        function addColumnForCreatePartial() {
            var columnNetAmount = {
                documentField: {
                    displayFieldName: 'Net amount',
                    documentFieldName: 'calculatedNetAmount'
                },
                fieldName: 'calculatedNetAmount',
                labelEN: 'Net amount',
                labelTH: 'Net amount',
                filterType: 'number',
                alignment: 'RIGHT'
            }

            var columnPaymentAmount = {
                labelEN: 'Payment amount',
                labelTH: 'Payment amount',
                cssTemplate: 'text-center',
                cellTemplate: '<scf-input-numeric id="payment-amount-{{$rowNo}}-textbox" ng-blur="ctrl.validatePaymentAmount($rowNo, data)" maxlength="19" format-default-value="{{data.calculatedNetAmount}}" format-only-positive="true" format-not-be-zero = "true" ng-model="data.calculatedPaymentAmount" ng-disabled="ctrl.disablePaymentAmount($rowNo, data, this)"></scf-input-text>',
                documentField: {
                    displayFieldName: 'Payment amount',
                    documentFieldName: 'calculatedPaymentAmount'
                },
                fieldName: 'calculatedPaymentAmount',
                idValueField: '$rowNo',
                id: 'payment-amount-{value}-textbox'
            }

            vm.dataTable.columns.push(columnNetAmount);
            vm.dataTable.columns.push(columnPaymentAmount);

            var columnReasonCodeLabel = {
                labelEN: 'Reason code',
                labelTH: 'Reason code',
                cssTemplate: 'text-right',
                idValueField: '$rowNo',
                id: 'reasonCode-{value}-label',
                fieldName: 'reasonCodeLabel',
                border: true,
                component: false
            }

            var columnReasonCodeDropdown = {
                cssTemplate: 'text-center',
                cellTemplate: '<scf-dropdown id="reason-code-{{$rowNo}}-dropdown" ng-model="data.reasonCode" component-data="ctrl.resonCodeDropdown"  translate-label="true" ng-disabled = "ctrl.disableReasonCode(data)" ng-change="ctrl.changeReasonCode($rowNo, data)"></scf-dropdown>',
                id: 'reason-code-{value}-dropdown',
                idValueField: '$rowNo',
                fieldName: 'reasonCode',
                component: true
            }

            vm.dataTable.expansion.columns.push(columnReasonCodeLabel);
            vm.dataTable.expansion.columns.push(columnReasonCodeDropdown);
        }

        function _loadDocumentDisplayConfig(supplierId, productType) {
            vm.dataTable.expansion.columns = [];
            vm.supportPartial = false;

            var deffered = $q.defer();
            var defferedDocumentDisplay = SCFCommonService.getDocumentDisplayConfig(supplierId, 'RECEIVABLE', 'TRANSACTION_DOCUMENT', productType);
            defferedDocumentDisplay.promise.then(function (response) {
                vm.dataTable.columns = response.items;
                vm.supportPartial = response.supportPartial;
                vm.supportSpecialDebit = response.supportSpecialDebit;
                if (vm.supportPartial) {
                    vm.reasonCodeMappingId = response.reasonCodeMappingId;
                    var defferedReasonCode = _loadReasonCodeMappingDatas();
                    addColumnForCreatePartial();
                }

                var _criteria = {};

                vm.documentSelection = response.documentSelection;
                vm.criteria.displayNegativeDocument = response.displayNegativeDocument;
                vm.criteria.overDuePeriod = response.overDuePeriod;
                vm.criteria.sort = response.sort;
                vm.criteria.loanRequestMode = response.loanRequestMode;
                supplierCodeSelectionMode = response.supplierCodeSelectionMode;

                angular.copy(vm.criteria, _criteria);
                vm.pagingAllController = PagingController.create('api/v1/documents/matching-by-fields', _criteria, 'GET');
                vm.pagingController = PagingController.create('api/v1/documents/matching-by-fields', _criteria, 'GET');

                if (vm.documentSelection != 'ANY_DOCUMENT') {
                    vm.checkSelectMatchingRef = true;
                } else {
                    vm.checkSelectMatchingRef = false;
                }

                if (vm.supportPartial) {
                    defferedReasonCode.promise.then(function (response) {
                        deffered.resolve(response);
                    });
                } else {
                    deffered.resolve(response);
                }

            });

            return deffered;
        }

        function _calculateTransactionAmount(documentSelects) {
            vm.transactionModel.transactionAmount = TransactionService.summaryAllDocumentAmount(documentSelects);
        }

        function _watchSelectAll() {
            var pageSize = vm.pagingController.splitePageTxt.split("of ")[1];
            vm.selectAllModel = TransactionService.checkSelectAllDocument(vm.documentSelects, pageSize);
        }

        function _watchCheckAll() {
            var allDocumentInPage = vm.pagingController.tableRowCollection;
            vm.checkAllModel = TransactionService.checkSelectAllDocumentInPage(vm.documentSelects, allDocumentInPage);
            _watchSelectAll();
        }

        var addDocumentInPage = function (document) {
            var document = document;
            vm.pagingController.tableRowCollection.forEach(function (documentInPage) {
                if (document.documentId == documentInPage.documentId) {
                    document = documentInPage;
                }
            });
            return document;
        }

        function isFound(data) {
            return TransactionService.findIndexFromDoucmentListByDocument(data, vm.documentSelects) > -1;
        }

        function _selectMatchingField(data) {
            if (isFound(data)) {
                if (data.groupingKey != null) {
                    vm.temporalDocuments.forEach(function (document) {
                        if (angular.equals(data.groupingKey, document.groupingKey)) {
                            if (!isFound(document)) {
                                if (vm.supportPartial) {
                                    document.reasonCode = vm.resonCodeDropdown[0].value;
                                    if (vm.documentSelection == 'AT_LEAST_ONE_DOCUMENT') {
                                        if (document.netAmount < 0) {
                                            vm.documentSelects = vm.documentSelects.concat(addDocumentInPage(document));
                                        }
                                    } else {
                                        vm.documentSelects = vm.documentSelects.concat(addDocumentInPage(document));
                                    }
                                } else {
                                    if (vm.documentSelection == 'AT_LEAST_ONE_DOCUMENT') {
                                        if (document.netAmount < 0) {
                                            vm.documentSelects = vm.documentSelects.concat(document);
                                        }
                                    } else {
                                        vm.documentSelects = vm.documentSelects.concat(document);
                                    }
                                }
                            }
                        }
                    });
                }
            } else {
                if (data.groupingKey != null) {
                    if (vm.documentSelection == 'AT_LEAST_ONE_DOCUMENT') {
                        var temp = [];
                        var unselectNagativeInvoice = true;

                        for (var index = vm.documentSelects.length; index--;) {
                            if (angular.equals(data.groupingKey, vm.documentSelects[index].groupingKey)) {
                                if (vm.documentSelects[index].netAmount < 0) {
                                    temp.push(index);
                                } else {
                                    unselectNagativeInvoice = false;
                                }
                            }
                        }

                        if (unselectNagativeInvoice) {
                            if (temp.length > 0) {
                                temp.forEach(function (index) {
                                    vm.documentSelects.splice(index, 1);
                                })
                            }
                        }

                    } else {
                        for (var index = vm.documentSelects.length; index--;) {
                            if (angular.equals(data.groupingKey, vm.documentSelects[index].groupingKey)) {
                                vm.documentSelects.splice(index, 1);
                            }
                        }
                    }
                }
            }

            _watchCheckAll();
            _calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
        }

        function _loadDocument(pagingModel) {

            var _criteria = {};
            angular.copy(vm.criteria, _criteria);
            _criteria.searchMatching = false;

            var deffered = vm.pagingController.search(pagingModel || ($stateParams.backAction ? {
                page: $stateParams.criteria.pagingModel.currentPage,
                pageSize: $stateParams.criteria.pagingModel.pageSizeSelectModel
            } : undefined));

            deffered.promise.then(function (response) {

                if ($stateParams.backAction) {
                    vm.pagingController.pagingModel.pageSizeSelectModel = $stateParams.criteria.pagingModel.pageSizeSelectModel;
                }

                if (vm.supportPartial) {
                    vm.pagingController.tableRowCollection.forEach(function (data) {
                        data.reasonCode = vm.resonCodeDropdown[0].value;
                    });
                    if (vm.documentSelects.length > 0) {
                        vm.documentSelects.forEach(function (documentSelect, index) {
                            vm.pagingController.tableRowCollection.forEach(function (data) {
                                if (documentSelect.documentId == data.documentId) {
                                    data.calculatedPaymentAmount = documentSelect.calculatedPaymentAmount;
                                    data.reasonCode = documentSelect.reasonCode;
                                    vm.documentSelects.splice(index, 1);
                                    vm.documentSelects.splice(index, 0, data);
                                }
                            });
                        });
                    }
                    _watchCheckAll();
                }

                _criteria.searchMatching = true;
                var defferedGetAllDocument = vm.pagingAllController.search({
                    offset: 0,
                    limit: 9999
                });
                defferedGetAllDocument.promise.then(function (response) {
                    vm.temporalDocuments = vm.pagingAllController.tableRowCollection;
                    if ($stateParams.backAction) {

                    } else if (!$stateParams.backAction && $stateParams.dashboardParams != null) {
                        vm.selectAllDocument();
                        $stateParams.dashboardParams = null;
                    } else {
                        if (!vm.display) {
                            vm.clearSelectDocument();
                        }
                    }
                    _watchCheckAll();
                });

                if (vm.documentSelects.length > 0) {
                    _loadPaymentDate();
                }

                if (_validateForSearch()) {
                    vm.display = true;
                } else {
                    vm.display = false;
                }


            }).catch(function (response) {
                log.error(response);
            });

        }

        function _validateForSearch() {
            $scope.errors = {};
            var valid = true;
            if (!angular.isDefined(vm.criteria.dueDateFrom) || vm.criteria.dueDateFrom == null) {
                var dueDateFrom = document.getElementById("due-date-from-textbox").value;
                if (dueDateFrom != null && dueDateFrom != '') {
                    valid = false;
                    $scope.errors.dueDateFormat = {
                        message: 'Wrong date format data.'
                    }
                }
            }
            if (!angular.isDefined(vm.criteria.dueDateTo) || vm.criteria.dueDateTo == null) {
                var dueDateTo = document.getElementById("due-date-to-textbox").value;
                if (dueDateTo != null && dueDateTo != '') {
                    valid = false;
                    $scope.errors.dueDateFormat = {
                        message: 'Wrong date format data.'
                    }
                }
            }

            if (angular.isDefined(vm.criteria.dueDateFrom) && angular.isDefined(vm.criteria.dueDateTo)) {
                var isDueDateFromAfterDueDateFrom = moment(vm.criteria.dueDateFrom).isAfter(vm.criteria.dueDateTo);
                if (isDueDateFromAfterDueDateFrom) {
                    valid = false;
                    $scope.errors.dueDateToLessThanFrom = {
                        message: 'From date must be less than or equal to To date.'
                    }
                }
            }

            return valid;
        }

        function getReasonCodeDropdownElement(row) {
            return $window.document.getElementById('reason-code-' + row + '-dropdown');
        }

        function getPaymentAmountTextboxElement(row) {
            return $window.document.getElementById('payment-amount-' + row + '-textbox');
        }

        function getDocumentCheckboxElement(row) {
            return $window.document.getElementById('document-' + row + '-checkbox');
        }

        function resetReasonCode(row, record) {
            var reasonCodeDropdown = getReasonCodeDropdownElement(row);
            record.reasonCode = vm.resonCodeDropdown[0].value; //reset to default reason code
            reasonCodeDropdown.disabled = true;
        }

        function resetPaymentAmount(row, record) {
            record.calculatedPaymentAmount = record.calculatedNetAmount; //reset to default value
        }

        function deselectDocument(row, record) {
            resetPaymentAmount(row, record)
            resetReasonCode(row, record)
        }

        function getSupplierName(supplierId) {
            var supplierName = null;
            vm.suppliers.map(function (obj) {
                if (obj.value == supplierId) {
                    supplierName = obj.label;
                }
            });
            return supplierName;
        }

        function showSelectReasonCodePopup(record) {
            var dialog = UIFactory.showDialog({
                templateUrl: '/js/app/modules/transaction/payment/reason-code/templates/dialog-partial-payment-reason-code.html',
                controller: 'SelectReasonCodePopupController',
                data: {
                    reasonCodeDropdown: vm.resonCodeDropdown
                }
            });

            dialog.closePromise.then(function (selectedReasonCode) {
                if (selectedReasonCode.value != null && selectedReasonCode.value !== undefined) {
                    record.reasonCode = selectedReasonCode.value;
                }
            });
        }

        vm.getUserInfoSuccess = false;
        var defered = scfFactory.getUserInfo();
        defered.promise.then(function (response) {
            vm.getUserInfoSuccess = true;
            vm.criteria = prepareCriteria();
            vm.transactionModel = prepareTransactionModel();

            vm.tradingPartnerList = [];
            vm.tradingpartnerInfoModel = prepareTradingpartnerInfoModel();
            vm.suppliers = [];

            vm.productTypes = [];
            vm.hasProductType = false;

            vm.customerCodes = [];

            vm.reasonCodeMappingId = null;

            vm.supportSpecialDebit = false;
            vm.accountList = [];
            vm.accountDropDown = [];
            vm.isLoanPayment = false;
            vm.accountNotSupportSpecialDirectDebit = false;

            vm.criteria.dueDateFrom = null;
            vm.criteria.dueDateTo = null;

            vm.reasonCodes = {};
            vm.temporalDocuments = [];
            vm.documentSelects = $stateParams.documentSelects || [];
            vm.documentSelection = null;
            vm.display = false;
            vm.checkSelectMatchingRef = false;
            vm.resonCodeDropdown = [];

            vm.createTransactionType = 'WITH_INVOICE';

            vm.dataTable = {
                options: {
                    displaySelect: {
                        label: '<input type="checkbox" id="select-all-checkbox" ng-model="ctrl.checkAllModel" ng-click="ctrl.checkAllDocument()"/>',
                        cssTemplate: 'text-center',
                        cellTemplate: '<input type="checkbox" checklist-comparator="ctrl.compareDocument" checklist-model="ctrl.documentSelects" checklist-value="data" ng-disabled="ctrl.disableDocment(data)" ng-click="ctrl.selectDocument(data)" ng-change="ctrl.changeSelectedDocument(this, $parent.$parent.$index+1 , data)"/>',
                        displayPosition: 'first',
                        idValueField: '$rowNo',
                        id: 'document-{value}-checkbox'
                    }
                },
                expansion: {
                    expanded: true,
                    exceptedMergeColumn: 1,
                    columns: []
                },
                columns: []
            };

            vm.initFlag = true;
            var init = function () {
                vm.showBackButton = $stateParams.showBackButton;
                var dashboardParams = $stateParams.dashboardParams;
                var defferedSupplier = _loadSuppliers(dashboardParams);
                defferedSupplier.promise.then(function (response) {
                    vm.tradingPartnerList = response;
                    var defferedCheckCreatePaymentType = _checkCreatePaymentType(vm.tradingPartnerList, vm.criteria.supplierId);
                    defferedCheckCreatePaymentType.promise.then(function (response) {
                        var defferedProducTypes = _loadProducTypes(vm.criteria.supplierId);
                        defferedProducTypes.promise.then(function (response) {

                            var defferedDocumentDisplayConfig = _loadDocumentDisplayConfig(vm.criteria.supplierId, vm.criteria.productType);
                            defferedDocumentDisplayConfig.promise.then(function (response) {
                                if (vm.initFlag) {
                                    vm.criteria.offset = 0;
                                    vm.criteria.limit = 20;
                                    var displayDocumentConfig = response;
                                    vm.initFlag = false;
                                }
                                
                                var defferedBuyerCodes = _loadBuyerCodes(vm.criteria.supplierId);
                                defferedBuyerCodes.promise.then(function (response) {});
                                
                                var defferedDocument = _loadDocument();

                                var defferedAccounts = _loadAccount(vm.criteria.supplierId);
                                defferedAccounts.promise.then(function (response) {
                                    vm.accountList = response;
                                    var _accounts = [];
                                    angular.copy(vm.accountList, _accounts);
                                    if (!$stateParams.backAction) {
                                        if (_accounts.length > 0) {
                                            vm.transactionModel.payerAccountId = _accounts[0].accountId;
                                            vm.transactionModel.payerAccountNo = _accounts[0].accountNo;
                                            vm.accountType = _accounts[0].accountType;
                                            vm.tradingpartnerInfoModel.updateTime = _accounts[0].accountUpdatedTime;

                                            if (_accounts[0].accountType == 'LOAN') {
                                                _setTradingpartnerInfoModel(_accounts[0]);
                                            } else {
                                                _setTransactionMethod(vm.supportSpecialDebit);
                                            }
                                            _loadMaturityDate();
                                        }
                                    } else {
                                        var result = $.grep(_accounts, function (account) {
                                            return account.accountId == vm.transactionModel.payerAccountId;
                                        });
                                        vm.accountType = result[0].accountType;
                                        vm.tradingpartnerInfoModel.updateTime = result[0].accountUpdatedTime;

                                        if (result[0].accountType !== undefined && result[0].accountType == 'LOAN') {
                                            _setTradingpartnerInfoModel(_accounts[0]);
                                        } else {
                                            _setTransactionMethod(vm.supportSpecialDebit);
                                        }
                                        // _loadPaymentDate();
                                    }
                                });
                            });
                        });
                    });
                });

                if (dashboardParams != null) {
                    vm.criteria.dueDateFrom = dashboardParams.dueDate;
                    vm.criteria.dueDateTo = dashboardParams.dueDate;
                    vm.showBackButton = true;
                }
            }();
        });

        vm.searchDocument = function () {
            if (_validateForSearch()) {
                var defferedDocumentDisplayConfig = _loadDocumentDisplayConfig(vm.criteria.supplierId, vm.criteria.productType);
                defferedDocumentDisplayConfig.promise.then(function (response) {
                    var defferedDocument = _loadDocument();
                });
            } else {
                vm.display = false;
            }
        }


        vm.loadDocument = function (pagingModel) {
            _loadDocument(pagingModel);
        }

        vm.clearSelectDocument = function () {
            vm.paymentDropDown = [];
            vm.documentSelects = [];
            vm.transactionModel.transactionAmount = '0.00';
            vm.errorDisplay = false;
            vm.selectAllModel = false;
            vm.checkAllModel = false;
        }

        vm.selectDocument = function (data) {
            vm.transactionModel.transactionDate = null;
            vm.checkAllModel = false;
            vm.selectAllModel = false;
            if (vm.checkSelectMatchingRef) {
                _selectMatchingField(data);
            } else {
                _watchCheckAll();
                _calculateTransactionAmount(vm.documentSelects);
            }
            _loadPaymentDate();
        }

        vm.checkAllDocument = function () {
            vm.transactionModel.transactionDate = null;
            var allDocumentInPage = vm.pagingController.tableRowCollection;
            if (vm.checkAllModel) {
                allDocumentInPage.forEach(function (document) {
                    if (!isFound(document)) {
                        vm.documentSelects.push(document);

                        if (vm.checkSelectMatchingRef) {
                            _selectMatchingField(document);
                        }
                    }
                });
            } else {
                allDocumentInPage.forEach(function (document, dataTableIndex) {
                    var index = TransactionService.findIndexFromDoucmentListByDocument(document, vm.documentSelects);
                    if (index > -1) {
                        vm.documentSelects.splice(index, 1);
                        if (vm.supportPartial) {
                            document.reasonCode = vm.resonCodeDropdown[0].value;
                            document.calculatedPaymentAmount = document.calculatedNetAmount;
                        }
                    }

                    if (vm.checkSelectMatchingRef) {
                        _selectMatchingField(document);
                    }
                });
            }
            _watchCheckAll();
            _calculateTransactionAmount(vm.documentSelects);
            _loadPaymentDate();
        };

        vm.selectAllDocument = function () {
            vm.transactionModel.transactionDate = null;
            if (!vm.selectAllModel) {
                var temporalDocuments = angular.copy(vm.temporalDocuments);
                if (vm.supportPartial) {
                    var unselectedData = [];
                    temporalDocuments.forEach(function (data) {
                        data.reasonCode = vm.resonCodeDropdown[0].value;
                        vm.documentSelects.forEach(function (documentSelect) {
                            if (documentSelect.documentId == data.documentId) {
                                data.calculatedPaymentAmount = documentSelect.calculatedPaymentAmount;
                                data.reasonCode = documentSelect.reasonCode;
                            }

                        });
                        unselectedData.push(data);
                    });
                    vm.documentSelects = unselectedData;
                    if (vm.documentSelects.length > 0) {
                        vm.documentSelects.forEach(function (documentSelect, index) {
                            vm.pagingController.tableRowCollection.forEach(function (data) {
                                if (documentSelect.documentId == data.documentId) {
                                    data.calculatedPaymentAmount = documentSelect.calculatedPaymentAmount;
                                    data.reasonCode = documentSelect.reasonCode;
                                    vm.documentSelects.splice(index, 1);
                                    vm.documentSelects.splice(index, 0, data);
                                }
                            });
                        });
                    }
                } else {
                    vm.documentSelects = [];
                    vm.documentSelects = temporalDocuments;
                }

                vm.selectAllModel = true;
                vm.checkAllModel = true;
            } else {
                vm.documentSelects = [];
                if (vm.supportPartial) {
                    vm.pagingController.tableRowCollection.forEach(function (document) {
                        document.reasonCode = vm.resonCodeDropdown[0].value;
                        document.calculatedPaymentAmount = document.calculatedNetAmount;
                    });
                }
                vm.selectAllModel = false;
                vm.checkAllModel = false;
            }

            _calculateTransactionAmount(vm.documentSelects);
            _loadPaymentDate();
        }

        vm.changeSelectedDocument = function (element, row, record) {
            if (vm.supportPartial) {
                if (!element.checked) {
                    deselectDocument(row, record);
                }
            }
        }

        vm.changeReasonCode = function (row, record) {
            if (record.reasonCode == vm.resonCodeDropdown[0].value) {
                resetPaymentAmount(row, record)
            }
        }

        vm.compareDocument = function (obj1, obj2) {
            return obj1.documentId === obj2.documentId;
        }

        // --- after blur payment amount
        vm.validatePaymentAmount = function (row, record) {
            var reasonCodeDropdown = getReasonCodeDropdownElement(row);

            /** for case invalid format---after blur payment amount textbox, 
                the 'format' directive will correct the data after. So, this condition is just 
                for control the appearing of reason code dropdown.
            **/
            if (record.calculatedPaymentAmount == 0 || record.calculatedPaymentAmount < 0 ||
                isNaN(Number(record.calculatedPaymentAmount.replace(/,/g, ""))) ||
                typeof (record.calculatedPaymentAmount) === "boolean") {
                resetReasonCode(row, record);
            }

            /** for case valid format--- control the appearing of reason code dropdown
                        according to business rules.
            **/
            else if (record.calculatedPaymentAmount < record.calculatedNetAmount) {
                reasonCodeDropdown.disabled = false;
                showSelectReasonCodePopup(record);
                _calculateTransactionAmount(vm.documentSelects);
            } else if (record.calculatedPaymentAmount == record.calculatedNetAmount) {
                resetReasonCode(row, record);
                _calculateTransactionAmount(vm.documentSelects);
            } else if (record.calculatedPaymentAmount > record.calculatedNetAmount) {
                UIFactory.showIncompleteDialog({
                    data: {
                        mode: 'general_warning',
                        headerMessage: 'Payment amount',
                        infoMessage: 'Payment amount cannot be greater than net amount.'
                    },
                    preCloseCallback: function () {
                        resetReasonCode(row, record);
                        resetPaymentAmount(row, record);
                        var paymentAmountTextbox = getPaymentAmountTextboxElement(row);
                        paymentAmountTextbox.focus();
                    }
                });
            }
        }

        vm.disablePaymentAmount = function (row, record, element) {
            var selectDocCheckbox = getDocumentCheckboxElement(row);

            if (selectDocCheckbox.checked &&
                record.calculatedNetAmount > 0) {
                return false;
            } else {
                return true;
            }

        }

        vm.disableDocment = function (document) {
            if (vm.documentSelection == 'AT_LEAST_ONE_DOCUMENT' && document.netAmount < 0) {
                return true;
            } else {
                return false;
            }
        }

        vm.disableReasonCode = function (data) {
            if (data.reasonCode == vm.resonCodeDropdown[0].value) {
                return true;
            } else {
                return false;
            }
        }

        vm.accountChange = function () {
            var accountId = vm.transactionModel.payerAccountId;
            vm.accountDropDown.forEach(function (account) {
                if (accountId == account.item.accountId) {
                    vm.transactionModel.payerAccountNo = account.item.accountNo;
                    vm.tradingpartnerInfoModel.available = account.item.remainingAmount - account.item.pendingAmount;
                    vm.tradingpartnerInfoModel.tenor = account.item.tenor;
                    vm.tradingpartnerInfoModel.interestRate = account.item.interestRate;
                    vm.accountType = account.item.accountType;
                    vm.tradingpartnerInfoModel.updateTime = account.item.accountUpdatedTime;

                    if (vm.accountType == 'LOAN') {
                        vm.transactionModel.transactionMethod = 'TERM_LOAN';
                        vm.isLoanPayment = true;
                    } else {
                        if (vm.supportSpecialDebit) {
                            vm.transactionModel.transactionMethod = 'DEBIT_SPECIAL';
                        } else {
                            vm.transactionModel.transactionMethod = 'DEBIT';
                        }
                        vm.isLoanPayment = false;
                    }

                    _loadPaymentDate();
                }
            });
        }

        vm.supplierChange = function () {
            vm.errorDisplay = false;
            vm.display = false;
            vm.maturityDateModel = null;
            var defferedCheckCreatePaymentType = _checkCreatePaymentType(vm.tradingPartnerList, vm.criteria.supplierId);
            defferedCheckCreatePaymentType.promise.then(function (response) {
                var defferedProducTypes = _loadProducTypes(vm.criteria.supplierId);
                defferedProducTypes.promise.then(function (response) {

                    var defferedDocumentDisplayConfig = _loadDocumentDisplayConfig(vm.criteria.supplierId, vm.criteria.productType);
                    defferedDocumentDisplayConfig.promise.then(function (response) {
                    	var defferedBuyerCodes = _loadBuyerCodes(vm.criteria.supplierId);
                        defferedBuyerCodes.promise.then(function (response) {});
                    	
                        vm.criteria.offset = 0;
                        vm.criteria.limit = 20;
                        _loadDocument();

                        var defferedAccounts = _loadAccount(vm.criteria.supplierId);
                        defferedAccounts.promise.then(function (response) {
                            vm.accountList = response;
                            var _accounts = [];
                            angular.copy(vm.accountList, _accounts);
                            if (!$stateParams.backAction) {
                                if (_accounts.length > 0) {
                                    vm.transactionModel.payerAccountId = _accounts[0].accountId;
                                    vm.transactionModel.payerAccountNo = _accounts[0].accountNo;
                                    vm.accountType = _accounts[0].accountType;
                                    vm.tradingpartnerInfoModel.updateTime = _accounts[0].accountUpdatedTime;

                                    if (_accounts[0].accountType == 'LOAN') {
                                        _setTradingpartnerInfoModel(_accounts[0]);
                                    } else {
                                        _setTransactionMethod(vm.supportSpecialDebit);
                                    }
                                    _loadMaturityDate();
                                }
                            } else {
                                var result = $.grep(_accounts, function (account) {
                                    return account.accountId == vm.transactionModel.payerAccountId;
                                });
                                vm.accountType = result[0].accountType;
                                vm.tradingpartnerInfoModel.updateTime = result[0].accountUpdatedTime;

                                if (result[0].accountType !== undefined && result[0].accountType == 'LOAN') {
                                    _setTradingpartnerInfoModel(_accounts[0]);
                                } else {
                                    _setTransactionMethod(vm.supportSpecialDebit);
                                }
                                _loadPaymentDate();
                            }
                        });
                    });
                });
            });
        }

        vm.customerCodeChange = function () {
            vm.errorDisplay = false;
            vm.display = false;
        }

        vm.paymentDateChange = function () {
            _loadMaturityDate();
        }

        vm.openCalendarDateFrom = function () {
            vm.openDateFrom = true;
        }

        vm.openCalendarDateTo = function () {
            vm.openDateTo = true;
        }

        vm.nextStep = function () {
            vm.errorDisplay = false;
            if (vm.documentSelects.length === 0) {
                $scope.errors.message = 'Please select document.';
                vm.errorDisplay = true;
            } else if (vm.isLoanPayment && (!angular.isDefined(vm.maturityDateModel) || vm.maturityDateModel == '')) {
                $scope.errors.message = 'Maturity date is required.';
                vm.errorDisplay = true;
            } else {
                vm.transactionModel.sponsorId = $rootScope.userInfo.organizeId;
                vm.transactionModel.supplierId = vm.criteria.supplierId;
                vm.transactionModel.documents = vm.documentSelects;
                vm.transactionModel.sponsorPaymentDate = SCFCommonService.convertStringTodate(vm.paymentModel);
                vm.transactionModel.transactionDate = SCFCommonService.convertStringTodate(vm.paymentModel);
                vm.transactionModel.maturityDate = SCFCommonService.convertStringTodate(vm.maturityDateModel);
                vm.transactionModel.supplierName = getSupplierName(vm.transactionModel.supplierId);
                vm.transactionModel.transactionType = 'PAYMENT';
                vm.transactionModel.productType = vm.criteria.productType;
                vm.tradingpartnerInfoModel.createTransactionType = vm.createTransactionType;
                vm.transactionModel.documents.forEach(function (document) {
                    document.reasonCodeDisplay = vm.reasonCodes[document.reasonCode];
                });

                var _accountList = [];
                angular.copy(vm.accountList, _accountList);
                var accountSelected = $.grep(_accountList, function (account) {
                    return account.accountId == vm.transactionModel.payerAccountId;
                });
                var formatAccount = accountSelected[0].format || false;

                if (accountSelected[0].accountType != 'LOAN') {
                    vm.transactionModel.payerLoanAccountId = _accountList[0].defaultLoanNo ? _accountList[0].accountId : null;
                    if (vm.supportSpecialDebit) {
                        vm.transactionModel.transactionMethod = 'DEBIT_SPECIAL';
                    } else {
                        vm.transactionModel.transactionMethod = 'DEBIT';
                    }
                } else {
                    vm.transactionModel.transactionMethod = 'TERM_LOAN';
                }

                var deffered = TransactionService.verifyTransaction(vm.transactionModel);
                deffered.promise.then(function (response) {
                    var transaction = response.data;
                    SCFCommonService.parentStatePage().saveCurrentState('/my-organize/create-transaction');

                    var objectToSend = {
                        transactionModel: vm.transactionModel,
                        tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                        formatAccount: formatAccount
                    };

                    var _criteria = {};
                    angular.copy(vm.criteria, _criteria);
                    _criteria.pagingModel = vm.pagingController.pagingModel;
                    PageNavigation.nextStep('/create-payment/validate-submit', objectToSend, {
                        transactionModel: vm.transactionModel,
                        tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                        criteria: _criteria,
                        documentSelects: vm.documentSelects
                    });
                }).catch(function (response) {
                    vm.errorMsgPopup = response.data.errorCode;
                    $scope.validateDataFailPopup = true;
                });
            }
        }

        vm.backStep = function () {
            PageNavigation.gotoPreviousPage(true);
        }
    }
]);