var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentWithoutInvoiceController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'TransactionService',
    'PagingController', 'PageNavigation', '$filter',
    function ($rootScope, $scope, $log, $stateParams, SCFCommonService, TransactionService, PagingController, PageNavigation, $filter) {

        var vm = this;
        var log = $log;
        var _criteria = {};
        var ownerId = $rootScope.userInfo.organizeId;
        var createTransactionType = 'WITHOUT_INVOICE';
        vm.paymentModel = null;

        vm.suppliers = [];
        var tradingPartnerList = [];

        vm.maturityDateErrorDisplay = false;
        vm.errorDisplay = false;

        $scope.errors = {
            message: null
        }

        tradingPartnerList = $stateParams.supplierModel;
        if (tradingPartnerList !== undefined) {
            tradingPartnerList.forEach(function (supplier) {
                var selectObj = {
                    label: supplier.supplierName,
                    value: supplier.supplierId
                }
                vm.suppliers.push(selectObj);
            });
        } else {
            var deffered = TransactionService.getSuppliers('RECEIVABLE');
            deffered.promise.then(function (response) {
                tradingPartnerList = response.data;
                if (tradingPartnerList !== undefined) {
                    vm.suppliers.forEach(function (supplier) {
                        var selectObj = {
                            label: supplier.supplierName,
                            value: supplier.supplierId
                        }
                        vm.suppliers.push(selectObj);
                    });
                }
            }).catch(function (response) {
                log.error(response);
            });
        }

        vm.criteria = $stateParams.criteria || {
            accountingTransactionType: 'RECEIVABLE',
            supplierId: ownerId,
            buyerId: ownerId,
            documentStatus: 'NEW',
            showOverdue: false
        }

        $scope.documents = $stateParams.documents || [{
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

        var _checkCreatePaymentType = function (supplierId) {
            var result = $.grep(tradingPartnerList, function (td) { return td.supplierId == supplierId; });
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
                        vm.maturityDateModel = vm.transactionModel.maturityDate;
                    }

                }).catch(function (response) {
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
            deffered.promise.then(function (response) {
                var paymentDates = response.data;

                paymentDates.forEach(function (data) {
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
            }).catch(function (response) {
                log.error(response);
            });

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
                    }
                } else {

                }

                if (accounts.length > 0 && accounts[loanAccountIndex].accountType == 'LOAN') {
                    vm.transactionModel.transactionMethod = 'TERM_LOAN';
                    vm.isLoanPayment = true;
                    // _loadMaturityDate();
                }
                _loadPaymentDate();

            }).catch(function (response) {
                log.error(response);
            });
        }


        var init = function () {
            _loadAccount(ownerId, vm.criteria.supplierId);
        } ();

        $scope.sum = function (documents) {
            var total = 0;
            documents.forEach(function (document) {
                total = parseFloat(total) + (parseFloat(document.netAmount) || 0);
            });
            vm.transactionModel.transactionAmount = total;
            return total;
        };

        var validate = function () {
            var valid = true;
            vm.errorDisplay = false;
            if ($scope.documents == [] || $scope.documents.length == 0) {
                valid = false;
                vm.errorDisplay = true;
                $scope.errors.message = "Document is required."
            } else {
                $scope.documents.forEach(function (document) {
                    if (document.optionVarcharField1 == null || document.optionVarcharField1 == "") {
                        valid = false;
                        vm.errorDisplay = true;
                        $scope.errors.message = "Description is required."
                    }
                });
            }

            return valid;
        }

        var validateDocument = function () {
            var valid = true;
            vm.errorDisplay = false;
            vm.maturityDateErrorDisplay = false;

            if ($scope.documents == [] || $scope.documents.length == 0) {
                valid = false;
                vm.errorDisplay = true;
                $scope.errors.message = "Document is required."
            } else {
                $scope.documents.forEach(function (document) {
                    if (document.optionVarcharField1 == null || document.optionVarcharField1 == "") {
                        valid = false;
                        vm.errorDisplay = true;
                        $scope.errors.message = "Description is required."
                    }
                });
            }
            return valid;
        }

        var validateMaturityDate = function () {
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

        var objectToSend = {
            transactionModel: vm.transactionModel,
            tradingpartnerInfoModel: vm.tradingpartnerInfoModel
        };

        var defaultEmptyValue = function (documents) {
            documents.forEach(function (document) {
                if (document.netAmount == null || document.netAmount == "") {
                    document.netAmount = 0;
                }
            });
            return documents;
        }

        // <---------------------------------- User Action ---------------------------------->


        vm.nextStep = function () {
            if (validateDocument()) {
                if (validateMaturityDate()) {
                    var supplier = $.grep(vm.suppliers, function (td) { return td.value == vm.criteria.supplierId; });

                    vm.transactionModel.documents = defaultEmptyValue($scope.documents);
                    vm.transactionModel.supplierName = supplier[0].label;
                    vm.tradingpartnerInfoModel.createTransactionType = createTransactionType;
                    vm.transactionModel.supplierId = vm.criteria.supplierId;
                    vm.transactionModel.transactionDate = vm.paymentModel;
                    vm.transactionModel.maturityDate = vm.maturityDateModel;

                    PageNavigation.nextStep('/create-payment/validate-submit', objectToSend, {
                        transactionModel: vm.transactionModel,
                        tradingpartnerInfoModel: vm.tradingpartnerInfoModel,
                        criteria: vm.criteria,
                        supplierModel: tradingPartnerList,
                        documents: $scope.documents
                    });
                }
            }
        }

        vm.supplierChange = function () {
            $scope.documents = [{
                optionVarcharField1: null,
                optionVarcharField2: null,
                netAmount: null
            }];
            _checkCreatePaymentType(vm.criteria.supplierId);

        }

        vm.removeDocumentItem = function (documents, item) {
            var index = documents.indexOf(item);
            documents.splice(index, 1);
        }

        vm.addItem = function () {
            var document = {
                optionVarcharField1: null,
                optionVarcharField2: null,
                netAmount: null
            }
            $scope.documents.push(document);
        }

        vm.paymentDateChange = function () {
            _loadMaturityDate();
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

        // <---------------------------------- User Action ---------------------------------->
    }
]).constant('formatFactory', {
    currency: {
        pattern: /^[\(\-\+]?\d*,?\d*\.?\d+[\)]/,
        patternError: 'This field must be formatted as Currency.<br/>A sample valid input looks like: 1000.00',
        replaceDollar: /[\$]/g,
        replaceComma: /[,]/g
    }
}).directive('format', function ($filter, formatFactory) {
    return {
        scope: true,
        restrict: 'A',
        require: ['ngModel'],
        link: function (scope, element, attrs, ctrls) {
            var ngModelCtrl = ctrls[0],
                thisFormat = formatFactory[attrs.format];

            var ctrl = ctrls[1];

            // This is the toModel routine
            var parser = function (value) {
                var removeParens;
                if (!value) {
                    return undefined;
                }
                // get rid of currency indicators
                value = value.toString().replace(thisFormat.replaceComma, '');
                // Check for parens, currency filter (5) is -5
                removeParens = value.replace(/[\(\)]/g, '');
                // having parens indicates the number is negative
                if (value.length !== removeParens.length) {
                    value = -removeParens;
                }
                return value || undefined;
            },
                // This is the toView routine
                formatter = function (value) {
                    // the currency filter returns undefined if parse error
                    value = $filter(attrs.format)(parser(value)) || '';
                    value = value.toString().replace(thisFormat.replaceDollar, '');
                    return value;
                };

            // This sets the format/parse to happen on blur/focus
            element.on("blur", function () {
                ngModelCtrl.$setViewValue(formatter(this.value));
                ngModelCtrl.$render();
            }).on("focus", function () {
                ngModelCtrl.$setViewValue(parser(this.value));
                ngModelCtrl.$render();
            });

            // Model Formatter
            ngModelCtrl.$formatters.push(formatter);
            // Model Parser
            ngModelCtrl.$parsers.push(parser);
        }
    }
});