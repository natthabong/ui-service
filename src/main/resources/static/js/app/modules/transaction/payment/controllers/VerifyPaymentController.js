var txnMod = angular.module('gecscf.transaction');
txnMod.controller('VerifyPaymentController', ['$rootScope', '$scope', '$log',
    '$stateParams', 'SCFCommonService', 'PageNavigation', 'UIFactory', 'ngDialog', '$timeout',
    'PagingController', 'VerifyPaymentService', '$filter',
    function ($rootScope, $scope, $log, $stateParams, SCFCommonService, PageNavigation, UIFactory, ngDialog, $timeout, PagingController, VerifyPaymentService, $filter) {

        var vm = this;
        var log = $log;
        vm.accountNo = null;
        vm.interestRate = null;
        vm.tenor = null;

        if ($stateParams.transaction == null) {
            $timeout(function () {
                PageNavigation.gotoPage('/my-organize/payment-transaction');
            }, 10);
        }
        vm.transactionModel = $stateParams.transaction;
        vm.isLoanPayment = false;
        vm.isCreateTransWithInvoice = true;
        if (vm.transactionModel.createTransactionType !== undefined && vm.transactionModel.createTransactionType == 'WITHOUT_INVOICE') {
            vm.isCreateTransWithInvoice = false;
        }

        vm.dataTable = {
            expansion: {
                expanded: true,
                exceptedMergeColumn: 0,
                columns: []
            },
            columns: []
        };

        vm.back = function () {
            $timeout(function () {
                PageNavigation.backStep();
            }, 10);
        }

        var _criteria = {
            transactionId: null
        }

        var _loadDocument = function (pagingModel) {
            var diferred = vm.pagingController.search(pagingModel);
            return diferred;
        }

        var loadDocumentDisplayConfig = function (ownerId, productType) {
            var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, 'RECEIVABLE', 'TRANSACTION_DOCUMENT', productType);
            deffered.promise.then(function (response) {
                vm.dataTable.columns = response.items;
                _criteria.sort = response.sort;

                if (response.supportPartial !== undefined && response.supportPartial) {
                    addColumnForCreatePartial();
                }
            });
        }

        var loadAccountDetails = function (sponsorId, supplierId, accountId) {
            var deffered = VerifyPaymentService.getAccountDetails(sponsorId, supplierId, accountId);
            deffered.promise.then(function (response) {
                var account = response.data;
                vm.accountNo = account.format ? ($filter('accountNoDisplay')(account.accountNo)) : account.accountNo;
                vm.interestRate = account.interestRate;
                vm.tenor = account.tenor;
            }).catch(function (response) {
                log.error('load account error');
            });
        }

        var loadTransaction = function (callback) {
            var deffered = VerifyPaymentService.getTransaction(vm.transactionModel);
            deffered.promise.then(function (response) {

                vm.transactionModel = response.data;
                vm.transactionModel.supplier = response.data.supplierOrganize.organizeName;
                vm.transactionModel.sponsor = response.data.sponsorOrganize.organizeName;
                vm.transactionModel.documents = response.data.documents;

                loadAccountDetails(vm.transactionModel.sponsorId, vm.transactionModel.supplierId, vm.transactionModel.payerAccountId);

                if (vm.transactionModel.transactionMethod == 'TERM_LOAN') {
                    vm.isLoanPayment = true;
                }

                if (vm.isCreateTransWithInvoice) {
                    _criteria.transactionId = vm.transactionModel.transactionId;

                    vm.pagingController = PagingController.create('api/v1/transaction-documents', _criteria, 'GET');

                    var deffered = _loadDocument();
                    deffered.promise.then(function (response) {
                        var productType = response.data[0].productType;
                        loadDocumentDisplayConfig(vm.transactionModel.supplierId, productType);
                    });
                }

            })
                .catch(function (response) {
                    log.error('verify payment load error');
                })
        }

        var addColumnForCreatePartial = function () {
            var columnNetAmount = {
                documentField: {
                    displayFieldName: 'Net amount',
                    documentFieldName: 'netAmount'
                },
                fieldName: 'netAmount',
                labelEN: 'Net amount',
                labelTH: 'Net amount',
                filterType: 'number',
                alignment: 'RIGHT'
            }

            var columnPaymentAmount = {
                documentField: {
                    displayFieldName: 'Payment amount',
                    documentFieldName: 'paymentAmount'
                },
                labelEN: 'Payment amount',
                labelTH: 'Payment amount',
                fieldName: 'paymentAmount',
                filterType: 'number',
                alignment: 'RIGHT'

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

        vm.searchDocument = function (pagingModel) {
            _loadDocument(pagingModel);
        }

        var init = function () {
            loadTransaction();
        } ();

        vm.confirmApprove = function () {
            UIFactory.showConfirmDialog({
                data: {
                    headerMessage: 'Confirm approval ?',
                    mode: '',
                    credentialMode: false,
                    transactionModel: vm.transactionModel
                },
                confirm: function () {
                    return vm.approve();
                },
                onFail: function (response) {
                    $scope.response = response.data;
                    UIFactory.showFailDialog({
                        data: {
                            mode: 'concurrency',
                            headerMessage: 'Verify transaction fail.',
                            backAndReset: vm.back,
                            viewHistory: vm.viewHistory,
                            viewRecent: vm.viewRecent,
                            errorCode: response.data.errorCode,
                            action: response.data.attributes.action,
                            actionBy: response.data.attributes.actionBy
                        }
                    });
                },
                onSuccess: function (response) {
                    UIFactory.showSuccessDialog({
                        data: {
                            mode: 'transaction',
                            headerMessage: 'Verify transaction success.',
                            bodyMessage: vm.transactionModel.transactionNo,
                            backAndReset: vm.back,
                            viewRecent: vm.viewRecent,
                            viewHistory: vm.viewHistory
                        },
                    });
                }
            });
        }

        vm.approve = function () {
            var deffered = VerifyPaymentService.approve(vm.transactionModel);
            return deffered;
        }

        vm.confirmReject = function () {
            UIFactory.showConfirmDialog({
                data: {
                    headerMessage: 'Confirm reject ?',
                    mode: 'transaction',
                    credentialMode: false,
                    rejectReason: '',
                    transactionModel: vm.transactionModel
                },
                confirm: function () {
                    return vm.reject();
                },
                onFail: function (response) {
                    $scope.response = response.data;
                    UIFactory.showFailDialog({
                        data: {
                            mode: 'concurrency',
                            headerMessage: 'Reject transaction fail.',
                            backAndReset: vm.back,
                            viewHistory: vm.viewHistory,
                            viewRecent: vm.viewRecent,
                            errorCode: response.data.errorCode,
                            action: response.data.attributes.action,
                            actionBy: response.data.attributes.actionBy
                        }
                    });
                },
                onSuccess: function (response) {
                    UIFactory.showSuccessDialog({
                        data: {
                            mode: 'transaction',
                            headerMessage: 'Reject transaction success.',
                            bodyMessage: vm.transactionModel.transactionNo,
                            backAndReset: vm.back,
                            viewRecent: vm.viewRecent,
                            viewHistory: vm.viewHistory
                        },
                    });
                }
            });
        }

        vm.reject = function () {
            var deffered = VerifyPaymentService.reject(vm.transactionModel);
            return deffered;
        }

        vm.viewRecent = function () {
            $timeout(function () {
                PageNavigation.nextStep('/payment-transaction/view', { transactionModel: vm.transactionModel, isShowViewHistoryButton: true, isShowBackButton: false, viewMode: 'MY_ORGANIZE' });
            }, 10);
        };

        vm.viewHistory = function () {
            $timeout(function () {
                PageNavigation.gotoPage('/my-organize/payment-transaction');
            }, 10);
        };
    }
]);