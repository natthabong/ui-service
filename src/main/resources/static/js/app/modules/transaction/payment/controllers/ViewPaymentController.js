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
            
            vm.isBuyer = false;
			vm.isSupplier = false;
			vm.isBank = false;
			
			var currentParty = '';
			var partyRole = {
				buyer : 'BUYER',
				supplier : 'SUPPLIER',
				bank : 'BANK'
			}
			
			currentParty = $stateParams.mode;
			
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
                    
                    loadDocumentDisplayConfig(vm.transactionModel.supplierId, vm.searchDocument);
                    
                })
                .catch(function(response){
                    log.error('view payment load error');
                })
            }

            var loadDocumentDisplayConfig = function(ownerId, callback) {
                var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId,'RECEIVABLE','TRANSACTION_DOCUMENT');
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
            	
            	if (currentParty == partyRole.buyer) {
					vm.isBuyer = true;
				} else if (currentParty == partyRole.supplier) {
					vm.isSupplier = true;
				} else if (currentParty == partyRole.bank) {
					vm.isBank = true;
				}
            	console.log(currentParty);
                loadTransaction();
                
            }();
    }
]);