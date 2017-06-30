var txnMod = angular.module('gecscf.transaction');
txnMod.controller('ApprovePaymentController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'ApprovePaymentService', function($rootScope, $scope, $log, $stateParams, SCFCommonService, ApprovePaymentService) {

	var vm = this;
	
	vm.agreeCondition = function(){
		
	};
	
	vm.backPage = function(){
		$timeout(function() {
			PageNavigation.gotoPreviousPage(false);
		},10);
	};

	vm.confirmPopup = function(){
		
	};
	
	vm.getTransaction = function(){
        var deffered = ApprovePaymentService.getTransaction(vm.transactionApproveModel.transaction);	
        return deffered;
	};
	
	vm.getRequestForm = function(){
        var deffered = ApprovePaymentService.getRequestForm(vm.transactionApproveModel.transaction);
        return deffered;
	};
	
	vm.init = function(){
		vm.transactionApproveModel.transaction = $stateParams.transaction;
        if (vm.transactionApproveModel.transaction === null) {
        	PageNavigation.gotoPreviousPage();
        }else{
        	vm.displayName = $scope.userInfo.displayName;
        	vm.getRequestForm();
        	var deffered = vm.getTransaction();
            deffered.promise.then(function(response) {
                vm.transaction = response.data;     
            }).catch(function(response) {
                log.error('Get transaction payment fail');
            });	        	
        }	
	};
	
	vm.init();
}]);	