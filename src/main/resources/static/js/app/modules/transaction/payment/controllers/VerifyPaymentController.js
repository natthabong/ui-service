var txnMod = angular.module('gecscf.transaction');
txnMod.controller('VerifyPaymentController', ['$rootScope', '$scope', '$log', 
	'$stateParams', 'SCFCommonService','PageNavigation','ngDialog','$timeout', 
    'PagingController', 'VerifyPaymentService', 
	function($rootScope, $scope, $log, $stateParams, SCFCommonService, PageNavigation, ngDialog, $timeout, PagingController, VerifyPaymentService) {

	var vm = this;
	var log = $log;
	
	if($stateParams.transaction == null){
        $timeout(function(){		
			PageNavigation.gotoPage('/payment-transaction/buyer');
		}, 10);
    }
	vm.transactionModel = $stateParams.transaction;
	vm.isLoanPayment = false;
	
	vm.dataTable = {
        columns: []
    };

	vm.back = function(){
    	$timeout(function(){
            PageNavigation.backStep();
        }, 10);
    }

	var loadTransaction = function(callback){
        var deffered = VerifyPaymentService.getTransaction(vm.transactionModel);
        deffered.promise.then(function(response){
            
        	vm.transactionModel = response.data;
            vm.transactionModel.supplier =  response.data.supplierOrganize.organizeName;
            vm.transactionModel.sponsor =  response.data.sponsorOrganize.organizeName;
            vm.transactionModel.documents = response.data.documents;
            
            if(vm.transactionModel.transactionMethod == 'TERM_LOAN'){
            	vm.isLoanPayment = true;
            }
            
            var _criteria = {
                transactionId : vm.transactionModel.transactionId
            }
            
            vm.pagingController = PagingController.create('api/v1/transaction-documents', _criteria, 'GET');
            
            loadDocumentDisplayConfig(vm.transactionModel.supplierId, 'BFP', vm.searchDocument);
            
        })
        .catch(function(response){
            log.error('verify payment load error');
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
	
	var init = function(){
		loadTransaction();
	}();

}]);	