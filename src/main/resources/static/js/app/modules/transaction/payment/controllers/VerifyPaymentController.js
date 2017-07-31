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

	vm.confirmApprove = function(){
		ngDialog.openConfirm({
            template: 'confirmDialogId',
            className: 'ngdialog-theme-default'
        }).then(function (value) {
        	vm.approve();
        }, function (reason) {
            log.error('Modal promise rejected. Reason: ', reason);
        });
	}
	
	vm.approve = function(){
		var deffered = VerifyPaymentService.approve(vm.transactionModel);
        deffered.promise.then(function (response) {
    	  vm.transactionModel = angular.extend(vm.transactionModel, response.data);
    	  vm.transactionNo = vm.transactionModel.transactionNo;
    	  $scope.successPopup = true;
        }).catch(function(response) {
            vm.errorMessageModel = response.data;
            ngDialog.open({
                template: '/js/app/verify-transactions/concurency-dialog.html',
                scope: $scope,
                disableAnimation: true
            });
            
        });
	}
	
	vm.viewRecent = function(){
		$timeout(function(){		
			PageNavigation.nextStep('/payment-transaction/view', 
                {transactionModel: vm.transactionModel, isShowViewHistoryButton: true, isShowBackButton: false});
    	}, 10);
	};
	
	vm.viewHistory = function(){
		$timeout(function(){
			PageNavigation.gotoPage('/payment-transaction/buyer');
		}, 10);
	};	
}]);	