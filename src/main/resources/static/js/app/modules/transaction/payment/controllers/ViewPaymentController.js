var paymentModule = angular.module('gecscf.transaction');
paymentModule.controller('ViewPaymentController', [
    '$scope',
    '$stateParams',
    'PageNavigation',
    'PagingController',
    '$timeout',
    'SCFCommonService',
    function($scope, $stateParams, UIFactory, PageNavigation, 
        PagingController, $timeout, SCFCommonService) {

            var vm = this;
            vm.transactionModel = $stateParams.transactionModel;

            var loadDocumentDisplayConfig = function(ownerId, mode) {
                var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, mode);
                deffered.promise.then(function(response) {
                    vm.dataTable.columns = response.items;
                });
            }

            vm.searchDocument = function(pagingModel) {
                vm.pagingController.search(pagingModel);
            }

            var init = function() {
                vm.pagingController.search();
                loadDocumentDisplayConfig(vm.transactionModel.supplierId, 'BFP');
            }();
    }
]);