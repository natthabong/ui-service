var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentWithoutInvoiceController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'TransactionService',
    'PagingController', 'PageNavigation', '$filter', 'CreatePaymentService',
    function($rootScope, $scope, $log, $stateParams, SCFCommonService, TransactionService, PagingController, PageNavigation, $filter, CreatePaymentService) {

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

        var init = function() {

        }();
    }
]);