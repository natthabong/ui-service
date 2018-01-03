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
            expansion: {
                expanded: true,
                exceptedMergeColumn: 0,
                columns: []
            },
            columns: []
        };

        var _criteria = {
            transactionId: null
        }
        
        var _loadDocument = function(pagingModel){
        	var diferred = vm.pagingController.search(pagingModel);
            return diferred;
        }

        var loadDocumentDisplayConfig = function(ownerId, productType) {
            var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, 'RECEIVABLE', 'TRANSACTION_DOCUMENT', productType);
            deffered.promise.then(function(response) {
                vm.dataTable.columns = response.items;
                _criteria.sort = response.sort;
                if (response.supportPartial !== undefined && response.supportPartial) {
                    addColumnForCreatePartial();
                }
            });
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

                        var deffered = _loadDocument();
                        deffered.promise.then(function(response) {
                            var productType = response.data[0].productType;
                            loadDocumentDisplayConfig(vm.transactionModel.supplierId,productType);
                        });
                    }


                })
                .catch(function(response) {
                    log.error('view payment load error');
                })
        }
        
        var addColumnForCreatePartial = function() {
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
                dataRenderer: function(record) {
                    return '<span id="reason-code-{{$parent.$index+1}}-value"><b>Reason code</b>&nbsp;&nbsp;' + record.reasonCode + ' : ' + record.reasonCodeDisplay + '</span>';
                },
                component: true
            }

            vm.dataTable.expansion.columns.push(columnReasonCodeLabel);
        }

        vm.searchDocument = function(pagingModel) {
            _loadDocument(pagingModel);
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