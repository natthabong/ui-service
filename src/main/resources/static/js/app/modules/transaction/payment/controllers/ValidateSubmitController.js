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
            expansion: {
                expanded: true,
                exceptedMergeColumn: 0,
                columns: []
            },
            columns: []
        };

        var addColumnForCreatePartial = function () {

            var columnNetAmount = {
                documentField: {
                    displayFieldName: 'Net amount',
                    documentFieldName: 'calculatedNetAmount'
                },
                fieldName: 'netAmount',
                labelEN: 'Net amount',
                labelTH: 'Net amount',
                filterType: 'number',
                alignment: 'RIGHT'
            }

            var columnPaymentAmount = {
                labelEN: 'Payment amount',
                labelTH: 'Payment amount',
                filterType: 'number',
                cssTemplate: 'text-right',
                documentField: {
                    displayFieldName: 'Payment amount',
                    documentFieldName: 'paymentAmount'
                },
                fieldName: 'paymentAmount'

            }

            if (vm.dataTable.columns.indexOf(columnNetAmount) == -1) {
                vm.dataTable.columns.push(columnNetAmount);
                vm.dataTable.columns.push(columnPaymentAmount);
            }

            var columnReasonCodeLabel = {
                labelEN: 'Reason code',
                labelTH: 'Reason code',
                cssTemplate: 'text-left',
                idValueField: '$rowNo',
                id: 'reasonCode-{value}-label',
                fieldName: 'reasonCode',
                dataRenderer: function (record) {
                    return '<span id="reason-code-{{$parent.$index+1}}-value"><b>Reason code</b>&nbsp;&nbsp;' + record.reasonCode + ' : ' + record.reasonCodeDisplay + '</span>';
                },
                component: true
            }

            vm.dataTable.expansion.columns.push(columnReasonCodeLabel);
        }

        var loadDocumentDisplayConfig = function (ownerId) {
            var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, 'RECEIVABLE', 'TRANSACTION_DOCUMENT');
            deffered.promise.then(function (response) {
                vm.dataTable.columns = response.items;
                supportPartial = response.supportPartial;
                if (supportPartial) {
                    // vm.reasonCodeMappingId = response.reasonCodeMappingId;
                    // _loadReasonCodeMappingDatas();
                    addColumnForCreatePartial();
                }
            });
        }

        var init = function () {
            if (vm.isCreateTransWithInvoice) {
                vm.pagingController.search();
                loadDocumentDisplayConfig(vm.transactionModel.supplierId);
            }


            if (vm.transactionModel.transactionMethod != 'TERM_LOAN') {
                vm.isLoanPayment = false;
            }
        } ();

        // <----------------------------- User Action ------------------------->
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
                PageNavigation.gotoPage('/my-organize/create-payment');
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
                    document.documentNo = document.documentNo;
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

        // <----------------------------- User Action ------------------------->
    }
]);