var paymentModule = angular.module('gecscf.transaction');
paymentModule.controller('ViewPaymentController', [
    '$scope',
    '$stateParams',
    'UIFactory',
    'PageNavigation',
    'PagingController',
    '$timeout',
    'SCFCommonService',
    'ViewPaymentService','$log',
    function($scope, $stateParams, UIFactory, PageNavigation, 
        PagingController, $timeout, SCFCommonService, ViewPaymentService,$log) {

            var vm = this;
            var log = $log;
            if($stateParams.transactionModel == null){
                $timeout(function(){		
    				PageNavigation.gotoPage('/payment-transaction/buyer');
    			}, 10);
            }
            vm.isTypeLoan = false;
            vm.transactionModel = $stateParams.transactionModel;
            vm.isShowViewHistoryButton = $stateParams.isShowViewHistoryButton;
            vm.isShowBackButton = $stateParams.isShowBackButton;

            vm.dataTable = {
                columns: []
            };

            var loadTransaction = function(callback){
                var deffered = ViewPaymentService.getTransaction(vm.transactionModel);
                deffered.promise.then(function(response){
                    
                	vm.transactionModel = response.data;
                    vm.transactionModel.supplier =  response.data.supplierOrganize.organizeName;
                    vm.transactionModel.sponsor =  response.data.sponsorOrganize.organizeName;
                    vm.transactionModel.documents = response.data.documents;
                    
                    if(vm.transactionModel.transactionMethod == 'TERM_LOAN'){
                    	vm.isTypeLoan = true;
                    }

                    var _criteria = {
                        transactionId : vm.transactionModel.transactionId
                    }
                    
                    vm.pagingController = PagingController.create('api/v1/transaction-documents', _criteria, 'GET');
                    
                    loadDocumentDisplayConfig(vm.transactionModel.supplierId, 'BFP', vm.searchDocument);
                    
                })
                .catch(function(response){
                    log.error('view payment load error');
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
            	$timeout(function(){
                    PageNavigation.backStep();
                }, 10);
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