var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'TransactionService',
    'PagingController', 'PageNavigation', '$filter', 'MappingDataService', 'UIFactory', '$window',
    function ($rootScope, $scope, $log, $stateParams, SCFCommonService, TransactionService, PagingController, PageNavigation, $filter, MappingDataService, UIFactory, $window) {
        //<-------------------------------------- declare variable ---------------------------------------->
        var vm = this;
        var log = $log;
        var comparator = angular.equals;

        var ownerId = $rootScope.userInfo.organizeId;
        var backAction = $stateParams.backAction || false;
        var fristTime = true;
        vm.isLoanPayment = false;
        var dashboardParams = $stateParams.dashboardParams;
        var tradingPartnerList = [];
        vm.suppliers = [];
        vm.paymentDropDown = [];
        var _criteria = {};
        vm.displayPaymentPage = false;
        $scope.validateDataFailPopup = false;
        var createTransactionType = 'WITH_INVOICE';
        vm.errorDisplay = false;
        var checkSelectMatchingRef = false;
        vm.documentSelects = [];
        vm.reasonCodeMappingId = null;
        var supportPartial = false;
        vm.reasonCodes = {};
        vm.temporalDocuments = [];

        var enterPageByBackAction = $stateParams.backAction || false;
        vm.criteria = $stateParams.criteria || {
            accountingTransactionType: 'RECEIVABLE',
            sponsorId: ownerId,
            buyerId: ownerId,
            showOverdue: false,
            displayNegativeDocument: false
        }

        vm.transactionModel = $stateParams.transactionModel || {
            sponsorId: ownerId,
            transactionAmount: 0.0,
            documents: [],
            transactionDate: null,
            maturityDate: null
        }

        vm.tradingpartnerInfoModel = $stateParams.tradingpartnerInfoModel || {
            available: '0.00',
            tenor: null,
            interestRate: null
        }

        $scope.errors = {}

        var pageOptions = {}

        vm.documentSelects = $stateParams.documentSelects || [];
        vm.selectAllModel = false;
        vm.display = false;
        vm.openDateFrom = false;
        vm.openDateTo = false;

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

        //<-------------------------------------- declare variable ---------------------------------------->

        function getSupplierName(supplierId) {
            var supplierName = null;
            vm.suppliers.map(function (obj) {
                if (obj.value == supplierId) {
                    supplierName = obj.label;
                }
            });
            return supplierName;
        }

        function calculateTransactionAmount(documentSelects) {
            vm.transactionModel.transactionAmount = TransactionService.summaryAllDocumentAmount(documentSelects);
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

        vm.display = false;

        vm.clearSelectDocument = function () {
            if (_validateForSearch()) {
                vm.display = true;
            } else {
                vm.display = false;
            }
            vm.paymentDropDown = [];
            vm.documentSelects = [];
            vm.transactionModel.transactionAmount = '0.00';
            vm.errorDisplay = false;
            vm.selectAllModel = false;
            vm.checkAllModel = false;

        }

        vm.test = function () {
            console.log(vm.documentSelects)
        }

        vm.test2 = function () {
            console.log(vm.pagingController.tableRowCollection)
        }

        vm.loadDocument = function (pagingModel) {
            _criteria.searchMatching = false;
            var deffered = vm.pagingController.search(pagingModel || ($stateParams.backAction ? {
                offset: _criteria.offset,
                limit: _criteria.limit
            } : undefined));
            deffered.promise.then(function (response) {
                if (supportPartial) {
                    vm.pagingController.tableRowCollection.forEach(function (data) {
                        data.reasonCode = vm.resonCodeDropdown[0].value;
                    });

                    if (vm.documentSelects.length > 0) {
                        vm.documentSelects.forEach(function (documentSelect,index) {
                            vm.pagingController.tableRowCollection.forEach(function (data) {
                                if (documentSelect.documentId == data.documentId) {
                                    data.calculatedPaymentAmount = documentSelect.calculatedPaymentAmount;
                                    data.reasonCode = documentSelect.reasonCode;
                                    vm.documentSelects.splice(index,1);
                                    vm.documentSelects.splice(index,0,data);
                                }
                            });
                        });
                    }
                    watchCheckAll();
                }

                if (!vm.display) {
                    vm.clearSelectDocument();
                }
                _criteria.searchMatching = true;
                var defferedAll = vm.pagingAllController.search(pagingModel);
                defferedAll.promise.then(function (response) {
                    vm.temporalDocuments = vm.pagingAllController.tableRowCollection;

                    if ($stateParams.backAction) {
                        $stateParams.backAction = false;
                    } else if (!$stateParams.backAction && dashboardParams != null) {
                        vm.selectAllDocument();
                        // clear dashboard param after search
                        $stateParams.dashboardParams = null;
                        dashboardParams = null;
                    }
                    watchCheckAll();
                });
            }).catch(function (response) {
                log.error(response);
            });
            vm.showInfomation = true;
        }

        vm.searchDocument = function (pagingModel) {
            if (_validateForSearch()) {
                angular.copy(vm.criteria, _criteria);
                vm.loadDocument();
            } else {
                vm.display = false;
            }
        }

        function _loadBuyerCodes(supplierId) {
            var deffered = TransactionService.getBuyerCodes(supplierId);
            deffered.promise.then(function (response) {
                vm.customerCodes = [];
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
                        vm.criteria.customerCode = _buyerCodes[0];
                    } else if (dashboardParams != null) {
                        vm.criteria.customerCode = dashboardParams.buyerCode;
                    }

                    if (fristTime) {
                        vm.display = true;
                        vm.searchDocument();
                        fristTime = false;
                    }

                }
            }).catch(function (response) {
                log.error(response);
            });
        };

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

                })
                    .catch(function (response) {
                        log.error(response);
                    });
            }
        }

        function _loadPaymentDate() {
            vm.paymentDropDown = [];
            vm.transactionModel.documents = vm.documentSelects;
            vm.transactionModel.supplierId = vm.criteria.supplierId;
            if (vm.transactionModel.documents != [] && vm.transactionModel.documents.length != 0) {
                var deffered = TransactionService.getPaymentDate(vm.transactionModel, createTransactionType);
                deffered.promise.then(function (response) {
                    var paymentDates = response.data;

                    paymentDates.forEach(function (data) {
                        vm.paymentDropDown.push({
                            label: data,
                            value: data
                        })
                    });

                    if ($stateParams.backAction && vm.transactionModel.transactionDate != null) {
                        vm.paymentModel = SCFCommonService.convertDate(vm.transactionModel.transactionDate);
                    } else {
                        vm.paymentModel = vm.paymentDropDown[0].value;
                    }
                    _loadMaturityDate();
                })
                    .catch(function (response) {
                        log.error(response);
                    });
            } else {
                _loadMaturityDate();
            }
        }

        function _loadAccount(ownerId, supplierId) {
            vm.accountDropDown = [];
            var deffered = TransactionService.getAccounts(ownerId, supplierId);
            deffered.promise.then(function (response) {
                var accounts = response.data;
                vm.isLoanPayment = false;

                var loanAccountIndex = 0;
                accounts.forEach(function (account, index) {
                    var a = {
                        label: ($filter('accountNoDisplay')(account.accountNo)),
                        value: account.accountId,
                        item: account
                    };
                    if (account.accountType == 'LOAN') {
                        loanAccountIndex = index;
                        vm.accountDropDown.unshift(a)
                    } else {
                        vm.accountDropDown.push(a)
                    }

                });

                if (!$stateParams.backAction) {
                    if (accounts.length > 0) {
                        vm.transactionModel.payerAccountId = accounts[loanAccountIndex].accountId;
                        vm.transactionModel.payerAccountNo = accounts[loanAccountIndex].accountNo;
                        vm.tradingpartnerInfoModel.available = accounts[loanAccountIndex].remainingAmount - accounts[loanAccountIndex].pendingAmount;
                        vm.tradingpartnerInfoModel.tenor = accounts[loanAccountIndex].tenor;
                        vm.tradingpartnerInfoModel.interestRate = accounts[loanAccountIndex].interestRate;

                        if (accounts[loanAccountIndex].accountType == 'LOAN') {
                            vm.transactionModel.transactionMethod = 'TERM_LOAN';
                            vm.isLoanPayment = true;
                            _loadMaturityDate();
                        }
                    }
                } else {

                    var result = $.grep(accounts, function (account) { return account.accountId == vm.transactionModel.payerAccountId; });
                    if (result[0].accountType !== undefined && result[0].accountType == 'LOAN') {
                        vm.isLoanPayment = true;
                        _loadMaturityDate();
                    }
                }
            }).catch(function (response) {
                log.error(response);
            });
        }

        var _loadDocumentDisplayConfig = function (ownerId) {
            vm.dataTable.expansion.columns = [];
            var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, 'RECEIVABLE', 'TRANSACTION_DOCUMENT');
            deffered.promise.then(function (response) {
                vm.dataTable.columns = response.items;
                supportPartial = response.supportPartial;
                if (supportPartial) {
                    vm.reasonCodeMappingId = response.reasonCodeMappingId;
                    _loadReasonCodeMappingDatas();
                    addColumnForCreatePartial();
                }

                vm.pagingAllController = PagingController.create('api/v1/documents/matching-by-fields', _criteria, 'GET');
                vm.pagingController = PagingController.create('api/v1/documents/matching-by-fields', _criteria, 'GET');

                var displayNegativeDocument = response.displayNegativeDocument;
                vm.documentSelection = response.documentSelection;
                if (displayNegativeDocument === false) {
                    vm.criteria.displayNegativeDocument = false;
                } else {
                    vm.criteria.displayNegativeDocument = true;
                }
                vm.criteria.sort = response.sort;

                if (vm.documentSelection != 'ANY_DOCUMENT') {
                    checkSelectMatchingRef = true;
                } else {
                    checkSelectMatchingRef = false;
                }
                _loadBuyerCodes(ownerId);
            });
        }

        function _loadSuppliers(dashboardParams) {
            if ($stateParams.supplierModel !== undefined && $stateParams.supplierModel !== null) {
                tradingPartnerList = $stateParams.supplierModel;
                tradingPartnerList.forEach(function (supplier) {
                    var selectObj = {
                        label: supplier.supplierName,
                        value: supplier.supplierId
                    }
                    vm.suppliers.push(selectObj);
                });
                checkCreatePaymentType(vm.criteria.supplierId);
            } else {
                var deffered = TransactionService.getSuppliers('RECEIVABLE');
                deffered.promise.then(function (response) {
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
                        checkCreatePaymentType(vm.criteria.supplierId);
                    }
                }).catch(function (response) {
                    log.error(response);
                });
                return deffered;
            }
        };

        var init = function () {
            vm.showBackButton = $stateParams.showBackButton;

            _loadSuppliers(dashboardParams);
            if (vm.documentSelects.length > 0) {
                _loadPaymentDate();
            }

            if (dashboardParams != null) {
                vm.criteria.dueDateFrom = dashboardParams.dueDate;
                vm.criteria.dueDateTo = dashboardParams.dueDate;
                vm.showBackButton = true;
            }
        } ();

        function checkCreatePaymentType(supplierId) {
            // find in list by supplier id
            var result = $.grep(tradingPartnerList, function (supplier) { return supplier.supplierId == supplierId; });

            if (result[0].createTransactionType !== undefined && result[0].createTransactionType == 'WITHOUT_INVOICE') {
                vm.displayPaymentPage = false;
                var params = {
                    supplierModel: tradingPartnerList,
                    criteria: {
                        accountingTransactionType: 'RECEIVABLE',
                        supplierId: result[0].supplierId,
                        buyerId: ownerId
                    }
                }
                PageNavigation.gotoPage('/my-organize/create-payment-woip', params);
            } else {
                vm.displayPaymentPage = true;
                _loadAccount(ownerId, vm.criteria.supplierId);
                _loadDocumentDisplayConfig(vm.criteria.supplierId);
            }
        }

        vm.disableDocment = function (document) {
            if (vm.documentSelection == 'AT_LEAST_ONE_DOCUMENT' && document.netAmount < 0) {
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
                    if (account.item.accountType == 'LOAN') {
                        vm.transactionModel.transactionMethod = 'TERM_LOAN';
                        vm.isLoanPayment = true;
                        _loadMaturityDate();
                    } else {
                        vm.transactionModel.transactionMethod = 'DEBIT';
                        vm.isLoanPayment = false;
                    }
                }
            });
        }

        vm.supplierChange = function () {
            vm.errorDisplay = false;
            vm.display = false;
            checkCreatePaymentType(vm.criteria.supplierId)
            vm.maturityDateModel = null;

        }

        vm.customerCodeChange = function () {
            vm.errorDisplay = false;
            vm.display = false;
        }

        vm.backStep = function () {
            PageNavigation.gotoPreviousPage(true);
        }

        function isFound(data) {
            return TransactionService.findIndexFromDoucmentListByDocument(data, vm.documentSelects) > -1;
        }

        var watchCheckAll = function () {
            var allDocumentInPage = vm.pagingController.tableRowCollection;
            vm.checkAllModel = TransactionService.checkSelectAllDocumentInPage(vm.documentSelects, allDocumentInPage);
            watchSelectAll();
        }

        var watchSelectAll = function () {
            var pageSize = vm.pagingController.splitePageTxt.split("of ")[1];
            vm.selectAllModel = TransactionService.checkSelectAllDocument(vm.documentSelects, pageSize);
        }

        var selectMatchingField = function (data) {
            if (isFound(data)) {
                if (data.groupingKey != null) {
                    vm.pagingAllController.tableRowCollection.forEach(function (document) {
                        if (comparator(data.groupingKey, document.groupingKey)) {
                            if (!isFound(document)) {
                                if (vm.documentSelection == 'AT_LEAST_ONE_DOCUMENT') {
                                    if (document.netAmount < 0) {
                                        vm.documentSelects = vm.documentSelects.concat(document);
                                    }
                                } else {
                                    vm.documentSelects = vm.documentSelects.concat(document);
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
                            if (comparator(data.groupingKey, vm.documentSelects[index].groupingKey)) {
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
                            if (comparator(data.groupingKey, vm.documentSelects[index].groupingKey)) {
                                vm.documentSelects.splice(index, 1);
                            }
                        }
                    }
                }
            }

            watchCheckAll();
            calculateTransactionAmount(vm.documentSelects, vm.tradingpartnerInfoModel.prePercentageDrawdown);
        }

        vm.selectDocument = function (data) {
            vm.transactionModel.transactionDate = null;
            vm.checkAllModel = false;
            vm.selectAllModel = false;
            if (checkSelectMatchingRef) {
                selectMatchingField(data);
            } else {
                watchCheckAll();
                calculateTransactionAmount(vm.documentSelects);
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

                        if (checkSelectMatchingRef) {
                            selectMatchingField(document);
                        }
                    }
                });
            } else {
                allDocumentInPage.forEach(function (document) {
                    var index = TransactionService.findIndexFromDoucmentListByDocument(document, vm.documentSelects);
                    if (index > -1) {
                        vm.documentSelects.splice(index, 1);
                    }

                    if (checkSelectMatchingRef) {
                        selectMatchingField(document);
                    }
                });
            }
            watchCheckAll();
            calculateTransactionAmount(vm.documentSelects);
            _loadPaymentDate();
        };

        vm.selectAllDocument = function () {
            vm.transactionModel.transactionDate = null;
            if (!vm.selectAllModel) {
                vm.documentSelects = [];
                var temporalDocuments = angular.copy(vm.temporalDocuments);

                // if (supportPartial) {
                //     temporalDocuments.forEach(function (data) {
                //         data.reasonCode = vm.resonCodeDropdown[0].value;
                //     });

                //     if (vm.documentSelects.length > 0) {
                //         vm.documentSelects.forEach(function (documentSelect) {
                //             temporalDocuments.forEach(function (data) {
                //                 if (documentSelect.documentId == data.documentId) {
                //                     data.calculatedPaymentAmount = documentSelect.calculatedPaymentAmount;
                //                     data.reasonCode = documentSelect.reasonCode;
                //                 }
                //             });
                //         });
                //     }
                // }

                vm.documentSelects = temporalDocuments;
                vm.selectAllModel = true;
                vm.checkAllModel = true;
            } else {
                vm.documentSelects = [];
                // if (supportPartial) {
                //     vm.pagingController.tableRowCollection.forEach(function (document) {
                //         document.reasonCode = vm.resonCodeDropdown[0].value;
                //         document.calculatedPaymentAmount = document.calculatedNetAmount;
                //     });
                // }
                vm.selectAllModel = false;
                vm.checkAllModel = false;
            }
            calculateTransactionAmount(vm.documentSelects);
            _loadPaymentDate();
        }

        // next to page verify and submit
        vm.nextStep = function () {
            vm.errorDisplay = false;
            if (vm.documentSelects.length === 0) {
                $scope.errors.message = 'Please select document.';
                vm.errorDisplay = true;
            } else if (vm.isLoanPayment && (!angular.isDefined(vm.maturityDateModel) || vm.maturityDateModel == '')) {
                $scope.errors.message = 'Maturity date is required.';
                vm.errorDisplay = true;
            } else {
                vm.transactionModel.sponsorId = ownerId;
                vm.transactionModel.supplierId = vm.criteria.supplierId;
                vm.transactionModel.documents = vm.documentSelects;
                vm.transactionModel.sponsorPaymentDate = SCFCommonService.convertStringTodate(vm.paymentModel);
                vm.transactionModel.transactionDate = SCFCommonService.convertStringTodate(vm.paymentModel);
                vm.transactionModel.maturityDate = SCFCommonService.convertStringTodate(vm.maturityDateModel);
                vm.transactionModel.supplierName = getSupplierName(vm.transactionModel.supplierId);
                vm.transactionModel.transactionType = 'PAYMENT';
                vm.tradingpartnerInfoModel.createTransactionType = createTransactionType;
                vm.transactionModel.documents.forEach(function (document) {
                    document.reasonCodeDisplay = vm.reasonCodes[document.reasonCode];
                });

                var deffered = TransactionService.verifyTransaction(vm.transactionModel);
                deffered.promise.then(function (response) {
                    var transaction = response.data;
                    SCFCommonService.parentStatePage().saveCurrentState('/my-organize/create-transaction');

                    var objectToSend = {
                        transactionModel: vm.transactionModel,
                        tradingpartnerInfoModel: vm.tradingpartnerInfoModel
                    };

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

        vm.paymentDateChange = function () {
            _loadMaturityDate();
        }

        vm.openCalendarDateFrom = function () {
            vm.openDateFrom = true;
        }

        vm.openCalendarDateTo = function () {
            vm.openDateTo = true;
        }

        var addColumnForCreatePartial = function () {

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

        var _loadReasonCodeMappingDatas = function () {
            vm.resonCodeDropdown = [];
            var params = {
                offset: 0,
                limit: 999,
                sort: ['defaultCode', 'code']
            }
            var deffered = MappingDataService.loadMappingDataItems(vm.criteria.supplierId, 'RECEIVABLE', vm.reasonCodeMappingId, params);
            deffered.promise.then(function (response) {
                vm.reasonCodes = {};
                var reasonCodes = response.data;
                reasonCodes.forEach(function (data) {
                    vm.resonCodeDropdown.push({
                        label: data.code + ': ' + data.display,
                        value: data.code
                    });
                    vm.reasonCodes[data.code] = data.display;
                });

            }).catch(function (response) {
                log.error(response);
            });
        }

        vm.disableReasonCode = function (data) {
            if (data.reasonCode == vm.resonCodeDropdown[0].value) {
                return true;
            } else {
                return false;
            }
        }

        var getReasonCodeDropdownElement = function (row) {
            return $window.document.getElementById('reason-code-' + row + '-dropdown');
        }

        var getPaymentAmountTextboxElement = function (row) {
            return $window.document.getElementById('payment-amount-' + row + '-textbox');
        }

        var getDocumentCheckboxElement = function (row) {
            return $window.document.getElementById('document-' + row + '-checkbox');
        }

        var resetReasonCode = function (row, record) {
            var reasonCodeDropdown = getReasonCodeDropdownElement(row);
            record.reasonCode = vm.resonCodeDropdown[0].value; //reset to default reason code
            reasonCodeDropdown.disabled = true;
        }

        var resetPaymentAmount = function (row, record) {
            record.calculatedPaymentAmount = record.calculatedNetAmount; //reset to default value
        }

        var showSelectReasonCodePopup = function (record) {
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
                calculateTransactionAmount(vm.documentSelects);
            } else if (record.calculatedPaymentAmount == record.calculatedNetAmount) {
                resetReasonCode(row, record);
                calculateTransactionAmount(vm.documentSelects);
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

        var deselectDocument = function (row, record) {
            resetPaymentAmount(row, record)
            resetReasonCode(row, record)
        }

        vm.changeSelectedDocument = function (element, row, record) {
            if (supportPartial) {
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

        vm.disablePaymentAmount = function (row, record, element) {
            var selectDocCheckbox = getDocumentCheckboxElement(row);

            if (selectDocCheckbox.checked
                && record.calculatedNetAmount > 0) {
                return false;
            } else {
                return true;
            }

        }

        vm.compareDocument = function (obj1, obj2) {
            return obj1.documentId === obj2.documentId;
        }

    }
]);