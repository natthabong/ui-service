var paymentModule = angular.module('gecscf.transaction');
paymentModule.controller('ViewPaymentController', [
    '$scope',
    '$stateParams',
    'UIFactory',
    'PageNavigation',
    'PagingController',
    '$timeout',
    'SCFCommonService',
    'ViewPaymentService',
    function($scope, $stateParams, UIFactory, PageNavigation, 
        PagingController, $timeout, SCFCommonService, ViewPaymentService) {

            var vm = this;
            vm.transactionModel = $stateParams.transactionModel;
            vm.isShowViewHistoryButton = $stateParams.isShowViewHistoryButton;
            vm.isShowBackButton = $stateParams.isShowBackButton;

            vm.dataTable = {
                columns: []
            };

            var loadTransaction = function(callback){
            	console.log(vm.transactionModel);
                var deffered = ViewPaymentService.getTransaction(vm.transactionModel);
                deffered.promise.then(function(response){
                	vm.transactionModel = response.data; 
                    vm.transactionModel.supplier =  response.data.supplierOrganize.organizeName;
                    vm.transactionModel.sponsor =  response.data.sponsorOrganize.organizeName;
                    vm.transactionModel.documents = response.data.documents;
                    
                    vm.pagingController = PagingController.create(response.data.documents);
                    
                    loadDocumentDisplayConfig(vm.transactionModel.supplierId, 'BFP', vm.searchDocument);
                    
                })
                .catch(function(response){
                    console.log('view payment load error');
                })
            }

            var loadDocumentDisplayConfig = function(ownerId, mode, callback) {
                var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, mode);
                deffered.promise.then(function(response) {
                    vm.dataTable.columns = response.items;
                    callback();
                });
            }

            vm.searchDocument = function(pagingModel) {
                vm.pagingController.search(pagingModel);
            }

            vm.back = function(){
            	PageNavigation.gotoPreviousPage();
            }
            
            vm.viewHistory = function(){
            	$timeout(function(){		
    				PageNavigation.gotoPage('/payment-transaction/buyer');
    			}, 10);
            }

            var init = function() {
                loadTransaction();
                
            }();
    }
]);