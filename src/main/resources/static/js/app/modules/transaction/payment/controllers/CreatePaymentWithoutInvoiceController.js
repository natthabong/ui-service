var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentWithoutInvoiceController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'TransactionService', 'CreatePaymentService',
    'PagingController', 'PageNavigation', '$filter',
    function($rootScope, $scope, $log, $stateParams, SCFCommonService, TransactionService, CreatePaymentService, PagingController, PageNavigation, $filter) {

        var vm = this;
        var _criteria = {};
        var ownerId = $rootScope.userInfo.organizeId;
        vm.suppliers = [];
        vm.criteria = $stateParams.criteria || {
            accountingTransactionType: 'RECEIVABLE',
            supplierId: ownerId,
            buyerId: ownerId,
            documentStatus: 'NEW',
            showOverdue: false
        }

        var _suppliers = $stateParams.tradingpartnerInfoModel;
        if (_suppliers !== undefined) {
            _suppliers.forEach(function(supplier) {
                var selectObj = {
                    label: supplier.supplierName,
                    value: supplier.supplierId
                }
                vm.suppliers.push(selectObj);
            });
        }

        vm.documents = [{
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
            var result = $.grep(_suppliers, function(td) { return td.supplierId == supplierId; });
            if (result[0].createTransactionType !== undefined && result[0].createTransactionType == 'WITH_INVOICE') {
                var params = {
                    tradingpartnerInfoModel: _suppliers,
                    criteria: {
                        accountingTransactionType: 'RECEIVABLE',
                        documentStatus: 'NEW',
                        supplierId: result[0].supplierId,
                        buyerId: ownerId,
                        showOverdue: false
                    }
                }
                PageNavigation.gotoPage('/my-organize/create-payment', params);
            }else {
                _loadAccount(ownerId, supplierId);
            }
        }

        vm.supplierChange = function() {
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
            vm.documents.push(document);
        }

        function _calculateTransactionAmount(documentSelects) {
            vm.transactionModel.transactionAmount = CreatePaymentService.calculateTransactionAmount(documentSelects);
        }

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
                            vm.maturityDateModel = vm.transactionModel.maturityDate;
                        }

                    })
                    .catch(function(response) {
                        log.error(response);
                    });
            }
        }

        function _loadPaymentDate() {
            vm.paymentDropDown = [];
            vm.transactionModel.documents = vm.documents;
            console.log(vm.transactionModel.documents);
            vm.transactionModel.supplierId = vm.criteria.supplierId;
            if (vm.transactionModel.documents != [] && vm.transactionModel.documents.length != 0) {
                var deffered = TransactionService.getPaymentDate(vm.transactionModel);
                deffered.promise.then(function(response) {
                        var paymentDates = response.data;

                        paymentDates.forEach(function(data) {
                            vm.paymentDropDown.push({
                                label: data,
                                value: data
                            })
                        });

                        if ($stateParams.backAction && vm.transactionModel.transactionDate != null) {
                            vm.paymentModel = vm.transactionModel.transactionDate;
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
                    }
                }

                if (accounts.length > 0 && accounts[loanAccountIndex].accountType == 'LOAN') {
                    vm.transactionModel.transactionMethod = 'TERM_LOAN';
                    vm.isLoanPayment = true;
                    _loadMaturityDate();
                }

            }).catch(function(response) {
                log.error(response);
            });
        }
        
        var init = function() {
        	_loadAccount(ownerId, vm.criteria.supplierId);
        }();
    }
]);