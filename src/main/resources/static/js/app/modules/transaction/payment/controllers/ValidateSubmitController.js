var paymentModule = angular.module('gecscf.transaction');
paymentModule.controller('ValidateSubmitController', [
    '$scope',
    '$stateParams',
    'UIFactory',
    'PageNavigation',
    'PagingController',
    '$timeout',
    'SCFCommonService',
    'TransactionService',
    function ($scope, $stateParams, UIFactory, PageNavigation,
        PagingController, $timeout, SCFCommonService, TransactionService) {

        var vm = this;
        vm.transactionModel = $stateParams.transactionModel;
        vm.tradingpartnerInfoModel = $stateParams.tradingpartnerInfoModel;

        vm.isCreateTransWithInvoice = true;
        if (vm.tradingpartnerInfoModel.createTransactionType !== undefined && vm.tradingpartnerInfoModel.createTransactionType == 'WITHOUT_INVOICE') {
            vm.isCreateTransWithInvoice = false;
        }

        if (vm.transactionModel == null || vm.tradingpartnerInfoModel == null) {
            PageNavigation.gotoPage('/my-organize/create-payment');
        }

        vm.pagingController = PagingController.create(vm.transactionModel.documents);
        vm.isLoanPayment = true;

        vm.dataTable = {
            columns: []
        };

        var loadDocumentDisplayConfig = function (ownerId) {
            var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, 'RECEIVABLE', 'TRANSACTION_DOCUMENT');
            deffered.promise.then(function (response) {
                vm.dataTable.columns = response.items;
            });
        }

        vm.searchDocument = function (pagingModel) {
            vm.pagingController.search(pagingModel);
        }

        vm.backToCreate = function () {
            $timeout(function () {
                PageNavigation.backStep();
            }, 10);
        };

        vm.createNewAction = function () {
            $timeout(function () {
                PageNavigation.backStep(true);
            }, 10);
        };

        vm.viewRecent = function () {
            $timeout(function () {
                PageNavigation.gotoPage('/payment-transaction/view', { transactionModel: vm.transactionModel, isShowViewHistoryButton: true, viewMode: 'MY_ORGANIZE' });
            }, 10);
        };

        vm.viewHistory = function () {
            $timeout(function () {
                PageNavigation.gotoPage('/my-organize/payment-transaction');
            }, 10);
        };

        vm.homeAction = function () {
            $timeout(function () {
                PageNavigation.gotoPage('/home');
            }, 10);
        };

        vm.submitTransaction = function () {
            if (vm.isCreateTransWithInvoice) {
                vm.transactionModel.transactionDate = SCFCommonService.convertStringTodate(vm.transactionModel.transactionDate);
                vm.transactionModel.maturityDate = SCFCommonService.convertStringTodate(vm.transactionModel.maturityDate);

                vm.transactionModel.documents.forEach(function (document) {
                    document.paymentAmount = document.netAmount;
                    document.paymentDate = vm.transactionModel.transactionDate;
                });
                vm.transactionModel.createTransactionType = "WITH_INVOICE";
                var deffered = TransactionService.submitTransaction(vm.transactionModel);
                deffered.promise.then(function (response) {
                    var storeAccount = vm.transactionModel.payerAccountNo;
                    vm.transactionModel = response.data;
                    if (storeAccount == 'LOAN') {
                        vm.transactionModel.payerAccountNo = 'LOAN';
                    }
                    vm.transactionNo = vm.transactionModel.transactionNo;
                    $scope.confirmPopup = false;
                    $scope.validateDataPopup = true;
                }).catch(function (response) {
                    $scope.submitFailPopup = true;
                    vm.errorMsgPopup = response.data.errorCode;
                });
            } else {
                vm.transactionModel.transactionDate = SCFCommonService.convertStringTodate(vm.transactionModel.transactionDate);
                vm.transactionModel.maturityDate = SCFCommonService.convertStringTodate(vm.transactionModel.maturityDate);

                vm.transactionModel.documents.forEach(function (document) {
                    document.documentId = null;
                    document.documentNo = null;
                    document.documentType = null;
                    document.customerCode = null;
                    document.paymentAmount = document.netAmount;
                    document.paymentDate = vm.transactionModel.transactionDate;
                });
                vm.transactionModel.createTransactionType = "WITHOUT_INVOICE";
                var deffered = TransactionService.submitTransaction(vm.transactionModel);
                deffered.promise.then(function (response) {
                    var storeAccount = vm.transactionModel.payerAccountNo;
                    vm.transactionModel = response.data;
                    if (storeAccount == 'LOAN') {
                        vm.transactionModel.payerAccountNo = 'LOAN';
                    }
                    vm.transactionNo = vm.transactionModel.transactionNo;
                    $scope.confirmPopup = false;
                    $scope.validateDataPopup = true;
                }).catch(function (response) {
                    $scope.submitFailPopup = true;
                    vm.errorMsgPopup = response.data.errorCode;
                });
            }

        };

        var init = function () {
            if (vm.isCreateTransWithInvoice) {
                vm.pagingController.search();
                loadDocumentDisplayConfig(vm.transactionModel.supplierId);
            }


            if (vm.transactionModel.payerAccountNo != 'LOAN') {
                vm.isLoanPayment = false;
            }
        } ();
    }
]);