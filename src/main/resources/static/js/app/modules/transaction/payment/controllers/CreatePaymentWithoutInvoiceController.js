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

        vm.documentItems = [{
            optionVarcharField1: "",
            optionVarcharField2: "",
            netAmount: ""
        }];

        vm.removeDocumentItem = function(documentItem, item) {

        }

        // function _loadSuppliers(dashboardParams) {
        //     var deffered = TransactionService.getSuppliers('RECEIVABLE');
        //     deffered.promise.then(function(response) {
        //         vm.suppliers = [];
        //         var _suppliers = response.data;
        //         if (_suppliers !== undefined) {

        //             _suppliers.forEach(function(supplier) {
        //                 var selectObj = {
        //                     label: supplier.supplierName,
        //                     value: supplier.supplierId
        //                 }
        //                 vm.suppliers.push(selectObj);
        //             });
        //         }
        //     }).catch(function(response) {
        //         log.error(response);
        //     });
        //     return deffered;
        // };

        var init = function() {
            // _loadSuppliers();

        }();
    }
]);