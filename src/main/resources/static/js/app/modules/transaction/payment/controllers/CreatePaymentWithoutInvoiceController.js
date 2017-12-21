var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentWithoutInvoiceController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'TransactionService',
    'PagingController', 'PageNavigation', '$filter',
    function($rootScope, $scope, $log, $stateParams, SCFCommonService, TransactionService, PagingController, PageNavigation, $filter) {

        var vm = this;
        var log = $log;
        var _criteria = {};
        var ownerId = $stateParams.buyerId;
        var createTransactionType = 'WITHOUT_INVOICE';
        vm.paymentModel = null;
        $scope.validateDataFailPopup = false;

        vm.suppliers = [];
        var tradingPartnerList = [];
        var accountList = [];

        vm.maturityDateErrorDisplay = false;
        vm.errorDisplay = false;

        $scope.errors = {
            message: null
        }

        //        tradingPartnerList = $stateParams.supplierModel;
        //        if (tradingPartnerList !== undefined) {
        //            tradingPartnerList.forEach(function (supplier) {
        //                var selectObj = {
        //                    label: supplier.supplierName,
        //                    value: supplier.supplierId
        //                }
        //                vm.suppliers.push(selectObj);
        //            });
        //        } else {
        var deffered = TransactionService.getSuppliers($stateParams.accountingTransactionType);
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
            }
        }).catch(function(response) {
            log.error(response);
        });
        //}

        vm.criteria = {
            accountingTransactionType: $stateParams.accountingTransactionType,
            supplierId: $stateParams.supplierId,
            buyerId: $stateParams.buyerId,
            documentStatus: 'NEW',
            showOverdue: false,
            viewMyOrganize: false
        }

        $scope.documents = $stateParams.documents || [{
            documentNo: null,
            optionVarcharField1: null,
            optionVarcharField2: null,
            netAmount: null
        }];

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

        var _checkCreatePaymentType = function(supplierId) {
            var result = $.grep(tradingPartnerList, function(td) { return td.supplierId == supplierId; });
            if (result[0].createTransactionType !== undefined && result[0].createTransactionType == 'WITH_INVOICE') {
                var params = {
                    supplierModel: tradingPartnerList,
                    criteria: {
                        accountingTransactionType: 'RECEIVABLE',
                        documentStatus: 'NEW',
                        supplierId: result[0].supplierId,
                        buyerId: ownerId,
                        showOverdue: false
                    }
                }
                PageNavigation.gotoPage('/my-organize/create-payment', params);
            } else {
                _loadAccount(ownerId, supplierId);
            }
        }

        function _loadMaturityDate() {
            vm.maturityDateDropDown = [];
            if (angular.isDefined(vm.paymentModel) && vm.paymentModel != null) {
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

                }).catch(function(response) {
                    log.error(response);
                });
            }
            $stateParams.backAction = false;
        }

        function _loadPaymentDate() {
            vm.paymentDropDown = [];
            vm.transactionModel.documents = $scope.documents;
            vm.transactionModel.supplierId = vm.criteria.supplierId;
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
                    vm.accountChange();
                } else {
                    vm.paymentModel = vm.paymentDropDown[0].value;
                }
                _loadMaturityDate();
            }).catch(function(response) {
                log.error(response);
            });

        }

        function _loadAccount(ownerId, supplierId) {
            vm.accountDropDown = [];
            var deffered = TransactionService.getAccounts(ownerId, supplierId);
            deffered.promise.then(function(response) {
                var accounts = response.data;
                accountList = accounts;
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
                    }
                }

                if (accounts.length > 0) {
                    if (accounts[loanAccountIndex].accountType == 'LOAN') {
                        vm.transactionModel.transactionMethod = 'TERM_LOAN';
                        vm.isLoanPayment = true;
                    } else {
                        vm.transactionModel.transactionMethod = 'DEBIT';
                        vm.isLoanPayment = false;
                    }
                }
                _loadPaymentDate();

            }).catch(function(response) {
                log.error(response);
            });
        }


        var init = function() {
            _loadAccount(ownerId, vm.criteria.supplierId);
        }();

        $scope.sum = function(documents) {
            var total = 0;
            documents.forEach(function(document) {
                total = parseFloat(total) + (parseFloat(document.netAmount) || 0);
            });
            vm.transactionModel.transactionAmount = total;
            return total;
        };

        var validateDocument = function() {
            var valid = true;
            vm.errorDisplay = false;
            vm.maturityDateErrorDisplay = false;

            if ($scope.documents == [] || $scope.documents.length == 0) {
                valid = false;
                vm.errorDisplay = true;
                $scope.errors.message = "Document is required."
            } else {
                var index = 0;
                $scope.documents.forEach(function(document) {
                    if (document.optionVarcharField1 == null || document.optionVarcharField1 == "") {
                        valid = false;
                        vm.errorDisplay = true;
                        $scope.errors.message = "Description is required."
                    } else if (document.netAmount == null || document.netAmount == "") {
                        valid = false;
                        vm.errorDisplay = true;
                        $scope.errors.message = "Payment amount is required."
                    }
                    $scope.documents[index].documentNo = ++index;
                });
            }
            return valid;
        }

        var validateMaturityDate = function() {
            var valid = true;
            vm.errorDisplay = false;
            vm.maturityDateErrorDisplay = false;

            if (vm.isLoanPayment && (vm.maturityDateModel == null || vm.maturityDateModel == '' || vm.maturityDateModel === undefined)) {
                valid = false;
                vm.maturityDateErrorDisplay = true;
                $scope.errors.message = 'Maturity date is required.';
            }
            return valid;
        }

        var defaultEmptyValue = function(documents) {
            documents.forEach(function(document) {
                if (document.netAmount == null || document.netAmount == "") {
                    document.netAmount = 0;
                }
            });
            return documents;
        }

        // <---------------------------------- User Action ---------------------------------->
        vm.nextStep = function() {
            if (validateDocument()) {
                if (validateMaturityDate()) {
                    vm.transactionModel.supplierId = vm.criteria.supplierId;
                    vm.transactionModel.sponsorId = ownerId;
                    vm.transactionModel.documents = defaultEmptyValue($scope.documents);
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

                        var accountSelected = $.grep(accountList, function(account) { return account.accountId == vm.transactionModel.payerAccountId; });
                        var formatAccount = accountSelected[0].format || false;

                        var supplier = $.grep(vm.suppliers, function(td) { return td.value == vm.criteria.supplierId; });

                        var objectToSend = {
                            transactionModel: vm.transactionModel,
                            tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                            formatAccount: formatAccount
                        };

                        PageNavigation.nextStep('/create-payment/validate-submit', objectToSend, {
                            transactionModel: vm.transactionModel,
                            tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                            criteria: vm.criteria,
                            supplierModel: tradingPartnerList,
                            documents: $scope.documents
                        });
                    }).catch(function(response) {
                        vm.errorMsgPopup = response.data.errorCode;
                        $scope.validateDataFailPopup = true;
                    });
                }
            }
        }

        vm.supplierChange = function() {
            $scope.documents = [{
                optionVarcharField1: null,
                optionVarcharField2: null,
                netAmount: null
            }];
            _checkCreatePaymentType(vm.criteria.supplierId);

        }

        vm.removeDocumentItem = function(documents, item) {
            var index = documents.indexOf(item);
            documents.splice(index, 1);
        }

        vm.addItem = function() {
            var document = {
                optionVarcharField1: null,
                optionVarcharField2: null,
                netAmount: null
            }
            $scope.documents.push(document);
        }

        vm.paymentDateChange = function() {
            _loadMaturityDate();
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

        function getSupplierName(supplierId) {
            var supplierName = null;
            vm.suppliers.map(function(obj) {
                if (obj.value == supplierId) {
                    supplierName = obj.label;
                }
            });
            return supplierName;
        }

        // <---------------------------------- User Action ---------------------------------->
    }
]);