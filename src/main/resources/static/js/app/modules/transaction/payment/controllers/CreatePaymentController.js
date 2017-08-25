var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'TransactionService', 'CreatePaymentService',
    'PagingController', 'PageNavigation', '$filter',
    function($rootScope, $scope, $log, $stateParams, SCFCommonService, TransactionService, CreatePaymentService, PagingController, PageNavigation, $filter) {

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

        var enterPageByBackAction = $stateParams.backAction || false;
        vm.criteria = $stateParams.criteria || {
            accountingTransactionType: 'RECEIVABLE',
            sponsorId: ownerId,
            buyerId: ownerId,
            documentStatus: 'NEW',
            showOverdue: false
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
                    cellTemplate: '<input type="checkbox" checklist-model="ctrl.documentSelects" checklist-value="data" ng-click="ctrl.selectDocument(data)"/>',
                    displayPosition: 'first',
                    idValueField: '$rowNo',
                    id: 'document-{value}-checkbox'
                }
            },
            columns: []
        };

        //<-------------------------------------- declare variable ---------------------------------------->

        function getSupplierName(supplierId) {
            var supplierName = null;
            vm.suppliers.map(function(obj) {
                if (obj.value == supplierId) {
                    supplierName = obj.label;
                }
            });
            return supplierName;
        }

        function _calculateTransactionAmount(documentSelects) {
            vm.transactionModel.transactionAmount = CreatePaymentService.calculateTransactionAmount(documentSelects);
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

        vm.pagingAllController = PagingController.create('api/v1/documents/matching-by-fields', _criteria, 'GET');
        vm.pagingController = PagingController.create('api/v1/documents/matching-by-fields', _criteria, 'GET');
        vm.display = false;

        vm.clearSelectDocument = function() {
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

        vm.loadData = function(pagingModel, callback) {
        	_criteria.searchMatching = false;
            var diferred = vm.pagingController.search(pagingModel);
            diferred.promise.then(function(response) {
                if (!vm.display) {
                    vm.clearSelectDocument();
                }
                vm.watchCheckAll();
                
                _criteria.searchMatching = true;
                var deffered = vm.pagingAllController.search(pagingModel);
                
                var totalRecord = vm.pagingController.pagingModel.totalRecord;
                if (vm.documentSelects.length == totalRecord && vm.documentSelects.length > 0) {
                    vm.selectAllModel = true;
                }
                vm.showInfomation = true;

                if (callback) {
                    callback();
                }
            }).catch(function(response) {
                log.error(response);
            });
        }

        vm.searchDocument = function(pagingModel) {
            if (_validateForSearch()) {
                angular.copy(vm.criteria, _criteria);

                vm.loadData(pagingModel || ($stateParams.backAction ? {
                    limit: _criteria.limit,
                    offset: _criteria.offset
                } : undefined), function() {
                    if ($stateParams.backAction) {
                        $stateParams.backAction = false;
                    } else if (!$stateParams.backAction && dashboardParams != null) {
                        vm.selectAllDocument();
                        // clear dashboard param after search
                        $stateParams.dashboardParams = null;
                        dashboardParams = null;
                    }
                });
            } else {
                vm.display = false;
            }
        }

        function _loadBuyerCodes(supplierId) {
            var deffered = TransactionService.getBuyerCodes(supplierId);
            deffered.promise.then(function(response) {
                vm.customerCodes = [];
                var _buyerCodes = response.data;
                if (angular.isDefined(_buyerCodes)) {
                    _buyerCodes.forEach(function(code) {
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
            }).catch(function(response) {
                log.error(response);
            });
        };

        function _loadMaturityDate() {
            vm.maturityDateDropDown = [];
            if (angular.isDefined(vm.paymentModel) && vm.transactionModel.documents != [] && vm.transactionModel.documents.length != 0) {

                var deffered = TransactionService.getAvailableMaturityDates(vm.paymentModel, vm.tradingpartnerInfoModel.tenor);
                deffered.promise.then(function(response) {
                        var maturityDates = response.data;

                        maturityDates.forEach(function(data) {
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
                    .catch(function(response) {
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
                deffered.promise.then(function(response) {
                        var paymentDates = response.data;

                        paymentDates.forEach(function(data) {
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
                    .catch(function(response) {
                        log.error(response);
                    });
            } else {
                _loadMaturityDate();
            }
        }

        function _loadAccount(ownerId, supplierId) {
            vm.accountDropDown = [];
            var deffered = TransactionService.getAccounts(ownerId, supplierId);
            deffered.promise.then(function(response) {
                var accounts = response.data;
                vm.isLoanPayment = false;

                var loanAccountIndex = 0;
                accounts.forEach(function(account, index) {
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

                    var result = $.grep(accounts, function(account) { return account.accountId == vm.transactionModel.payerAccountId; });
                    if (result[0].accountType !== undefined && result[0].accountType == 'LOAN') {
                        vm.isLoanPayment = true;
                        _loadMaturityDate();
                    }
                }
            }).catch(function(response) {
                log.error(response);
            });
        }

        var _loadDocumentDisplayConfig = function(ownerId) {
            var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, 'RECEIVABLE', 'TRANSACTION_DOCUMENT');
            deffered.promise.then(function(response) {
                vm.dataTable.columns = response.items;
                pageOptions.loanRequestMode = response.loanRequestMode;
                pageOptions.documentSelection = response.documentSelection;
                pageOptions.buyerCodeSelectionMode = response.buyerCodeSelectionMode;
                vm.criteria.sort = response.sort;
                _loadBuyerCodes(ownerId);
            });
        }

        function _loadSuppliers(dashboardParams) {
            if ($stateParams.supplierModel !== undefined && $stateParams.supplierModel !== null) {
                tradingPartnerList = $stateParams.supplierModel;
                tradingPartnerList.forEach(function(supplier) {
                    var selectObj = {
                        label: supplier.supplierName,
                        value: supplier.supplierId
                    }
                    vm.suppliers.push(selectObj);
                });
                checkCreatePaymentType(vm.criteria.supplierId);
            } else {
                var deffered = TransactionService.getSuppliers('RECEIVABLE');
                deffered.promise.then(function(response) {
                    tradingPartnerList = response.data;
                    if (tradingPartnerList !== undefined) {
                        tradingPartnerList.forEach(function(supplier) {
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
                }).catch(function(response) {
                    log.error(response);
                });
                return deffered;
            }
        };

        var init = function() {
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
        }();

        function checkCreatePaymentType(supplierId) {
            // find in list by supplier id
            var result = $.grep(tradingPartnerList, function(supplier) { return supplier.supplierId == supplierId; });

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

        vm.accountChange = function() {
            var accountId = vm.transactionModel.payerAccountId;
            vm.accountDropDown.forEach(function(account) {
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

        vm.supplierChange = function() {
            vm.errorDisplay = false;
            vm.display = false;
            checkCreatePaymentType(vm.criteria.supplierId)
            vm.maturityDateModel = null;

        }

        vm.customerCodeChange = function() {
            vm.errorDisplay = false;
            vm.display = false;
        }

        vm.backStep = function() {
            PageNavigation.gotoPreviousPage(true);
        }

        vm.selectDocument = function(data) {
            vm.transactionModel.transactionDate = null;
            vm.checkAllModel = false;
            vm.selectAllModel = false;
            vm.watchCheckAll();
            _calculateTransactionAmount(vm.documentSelects);
            _loadPaymentDate();

        }

        vm.checkAllDocument = function() {
            vm.transactionModel.transactionDate = null;
            if (vm.checkAllModel) {
                vm.pagingController.tableRowCollection.forEach(function(document) {
                    var foundDataSelect = (vm.documentSelects.map(function(o) {
                        return o.documentId;
                    }).indexOf(document.documentId) > -1);
                    if (!foundDataSelect) {
                        vm.documentSelects.push(document);
                        _calculateTransactionAmount(vm.documentSelects);
                    }
                });
            } else {
                vm.selectAllModel = false;
                vm.pagingController.tableRowCollection.forEach(function(document) {
                    for (var index = vm.documentSelects.length - 1; index > -1; index--) {
                        if (document.documentId === vm.documentSelects[index].documentId) {
                            vm.documentSelects.splice(index, 1);
                        }
                    }
                });
                _calculateTransactionAmount(vm.documentSelects);
            }
            vm.watchCheckAll();
            _loadPaymentDate();
        };

        vm.selectAllDocument = function() {
            vm.transactionModel.transactionDate = null;
            var pagingModel = vm.pagingController.pagingModel;
            if (!vm.selectAllModel) {
                vm.documentSelects = [];
                var searchDocumentCriteria = {
                    accountingTransactionType: _criteria.accountingTransactionType,
                    customerCode: _criteria.customerCode,
                    dueDateFrom: _criteria.dueDateFrom,
                    dueDateTo: _criteria.dueDateTo,
                    documentStatus: _criteria.documentStatus,
                    limit: pagingModel.totalRecord,
                    offset: 0,
                    buyerId: ownerId,
                    supplierId: _criteria.supplierId,
                    showOverdue: false,
                    searchMatching: false
                }

                var diferredDocumentAll = TransactionService.getDocuments(searchDocumentCriteria);
                diferredDocumentAll.promise.then(function(response) {
                    vm.documentSelects = response.data;
                    _calculateTransactionAmount(vm.documentSelects);
                    vm.selectAllModel = true;
                    vm.checkAllModel = true;
                    _loadPaymentDate();
                }).catch(function(response) {
                    log.error('Select all document error')
                });
            } else {
                vm.documentSelects = [];
                vm.selectAllModel = false;
                vm.checkAllModel = false;
                _calculateTransactionAmount(vm.documentSelects);
                _loadPaymentDate();
            }
        }

        vm.watchCheckAll = function() {
            vm.checkAllModel = false;
            var countRecordData = 0;
            vm.pagingController.tableRowCollection.forEach(function(document) {
                for (var index = vm.documentSelects.length; index--;) {
                    if (comparator(document, vm.documentSelects[index])) {
                        countRecordData++;
                        break;
                    }
                }
            });
            if (countRecordData === vm.pagingController.tableRowCollection.length && countRecordData > 0) {
                vm.checkAllModel = true;
            }
            vm.watchSelectAll();
        }

        vm.watchSelectAll = function() {
            vm.selectAllModel = false;
            var pageSize = vm.pagingController.splitePageTxt.split("of ")[1];
            if (vm.documentSelects.length > 0 && vm.documentSelects.length == pageSize) {
                vm.selectAllModel = true;
            }
        }

        //        var validatePaymentAmount = function() {
        //            var valid = true;
        //            if (vm.transactionModel.transactionAmount <= 0) {
        //                valid = false;
        //                vm.errorMsgPopup = "Transaction amount must be greater than zero";
        //                $scope.validateDataFailPopup = true;
        //            }
        //            return valid;
        //        }

        // next to page verify and submit
        vm.nextStep = function() {
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

                var deffered = TransactionService.verifyTransaction(vm.transactionModel);
                deffered.promise.then(function(response) {
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
                }).catch(function(response) {
                    vm.errorMsgPopup = response.data.errorCode;
                    $scope.validateDataFailPopup = true;
                });
            }
        }

        vm.paymentDateChange = function() {
            _loadMaturityDate();
        }

        vm.openCalendarDateFrom = function() {
            vm.openDateFrom = true;
        }

        vm.openCalendarDateTo = function() {
            vm.openDateTo = true;
        }


    }
]);