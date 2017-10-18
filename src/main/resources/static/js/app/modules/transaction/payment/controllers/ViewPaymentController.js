var paymentModule = angular.module('gecscf.transaction');
paymentModule.controller('ViewPaymentController', [
    '$scope',
    '$stateParams',
    'UIFactory',
    'PageNavigation',
    'PagingController',
    '$timeout',
    'SCFCommonService',
    'ViewPaymentService', '$log',
    function($scope, $stateParams, UIFactory, PageNavigation,
        PagingController, $timeout, SCFCommonService, ViewPaymentService, $log) {

        var vm = this;
        var log = $log;
        var viewMode = $stateParams.viewMode;
        var url = '';

        vm.isBuyer = false;
        vm.isSupplier = false;
        vm.isBank = false;
        vm.isCreateTransWithInvoice = true;


        var viewModeData = {
            myOrganize: 'MY_ORGANIZE',
            partner: 'PARTNER',
            customer: 'CUSTOMER'
        }

        vm.isTypeLoan = false;
        vm.transactionModel = $stateParams.transactionModel;
        vm.isShowViewHistoryButton = $stateParams.isShowViewHistoryButton;
        vm.isShowBackButton = $stateParams.isShowBackButton;

        if (vm.transactionModel.createTransactionType !== undefined && vm.transactionModel.createTransactionType == 'WITHOUT_INVOICE') {
            vm.isCreateTransWithInvoice = false;
        }

        vm.dataTable = {
            columns: []
        };

        var _criteria = {
            transactionId: null
        }

        var loadTransaction = function(callback) {
            var deffered = ViewPaymentService.getTransaction(vm.transactionModel);
            deffered.promise.then(function(response) {

                    vm.transactionModel = response.data;
                    vm.transactionModel.supplier = response.data.supplierOrganize.organizeName;
                    vm.transactionModel.sponsor = response.data.sponsorOrganize.organizeName;
                    vm.transactionModel.documents = response.data.documents;

                    if (vm.transactionModel.transactionMethod == 'TERM_LOAN') {
                        vm.isTypeLoan = true;
                    }

                    if (vm.isCreateTransWithInvoice) {
                        _criteria.transactionId = vm.transactionModel.transactionId;

                        vm.pagingController = PagingController.create('api/v1/transaction-documents', _criteria, 'GET');

                        loadDocumentDisplayConfig(vm.transactionModel.supplierId, vm.searchDocument);
                    }


                })
                .catch(function(response) {
                    log.error('view payment load error');
                })
        }

        var loadDocumentDisplayConfig = function(ownerId, callback) {
            var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, 'RECEIVABLE', 'TRANSACTION_DOCUMENT');
            deffered.promise.then(function(response) {
                vm.dataTable.columns = response.items;
                _criteria.sort = response.sort;
                callback();
            });
        }

        vm.searchDocument = function(pagingModel) {
            vm.pagingController.search(pagingModel);
        }

        vm.back = function() {
            $timeout(function() {
                PageNavigation.backStep();
            }, 10);
        }

        vm.viewHistory = function() {
            $timeout(function() {
                PageNavigation.gotoPage(url);
            }, 10);
        }

        var init = function() {
            if (viewMode == viewModeData.myOrganize) {
                vm.isBuyer = true;
                url = '/my-organize/payment-transaction';
            } else if (viewMode == viewModeData.partner) {
                vm.isSupplier = true;
                url = '/partner-organize/payment-transaction';
            } else if (viewMode == viewModeData.customer) {
                vm.isBank = true;
                url = '/customer-organize/payment-transaction';
            }

            if ($stateParams.transactionModel == null) {
                $timeout(function() {
                    PageNavigation.gotoPage(url);
                }, 10);
            }

            loadTransaction();

        }();
    }
]);