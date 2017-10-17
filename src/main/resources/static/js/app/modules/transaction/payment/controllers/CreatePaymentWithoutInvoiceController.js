var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentWithoutInvoiceController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'TransactionService',
    'PagingController', 'PageNavigation', '$filter',
    function($rootScope, $scope, $log, $stateParams, SCFCommonService, TransactionService, PagingController, PageNavigation, $filter) {

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

        vm.supplierChange = function() {

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

        var init = function() {

        }();
    }
]);