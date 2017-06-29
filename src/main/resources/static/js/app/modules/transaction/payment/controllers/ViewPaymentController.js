var paymentModule = angular.module('gecscf.transaction');
paymentModule.controller('ViewPaymentController', [
    '$scope',
    '$stateParams',
    'PageNavigation',
    'PagingController',
    '$timeout',
    'SCFCommonService',
    'ViewPaymentService',
    function($scope, $stateParams, UIFactory, PageNavigation, 
        PagingController, $timeout, SCFCommonService, ViewPaymentService) {

            var vm = this;
            vm.transactionModel = $stateParams.transactionModel;

            vm.dataTable = {
                columns: []
            };

            var loadTransaction = function(){

                var deffered = ViewPaymentService.getTransaction(vm.transactionModel);
                deffered.promise.then(function(response){
                    console.log(response);
                    vm.transactionModel = angular.extend(response.data,{sponsor: vm.transactionModel.sponsor, supplier: vm.transactionModel.supplier});
                    
                    vm.pagingController = PagingController.create(vm.transactionModel.documents);
                    vm.searchDocument();
                })
                .catch(function(response){
                    console.log('view payment load error');
                })
            }

            var loadDocumentDisplayConfig = function(ownerId, mode) {
                var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, mode);
                deffered.promise.then(function(response) {
                    vm.dataTable.columns = response.items;
                });
            }

            vm.searchDocument = function(pagingModel) {
                vm.pagingController.search(pagingModel);
            }

            vm.back = function(){
                PageNavigation.gotoPreviousPage();
            }

            var init = function() {
                loadTransaction();
                loadDocumentDisplayConfig(vm.transactionModel.supplierId, 'BFP');
            }();
    }
]);