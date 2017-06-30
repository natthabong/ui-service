var txnMod = angular.module('gecscf.transaction');
txnMod.controller('ApprovePaymentController', ['$rootScope', '$scope', '$log', 
	'$stateParams', 'SCFCommonService','PageNavigation','ngDialog','$timeout', 'ApprovePaymentService', 
	function($rootScope, $scope, $log, $stateParams, SCFCommonService, PageNavigation, ngDialog, $timeout, ApprovePaymentService) {

	var vm = this;
	var log = $log;

	vm.agreeCondition = false;

	vm.transactionApproveModel = {
		transaction : undefined,
		 credential: ''
	}
	
	vm.backPage = function(){
		$timeout(function() {
			PageNavigation.gotoPreviousPage(false);
		},10);
	};

	vm.confirmPopup = function() {
		ngDialog.open({
			template: '/js/app/approve-transactions/confirm-dialog.html',
			scope: $scope,
			disableAnimation: true
		});
	};
	
	function _getTransaction(transaction){
        var deffered = ApprovePaymentService.getTransaction(transaction);	
        return deffered;
	};
	
	function _getRequestForm(transaction){
        var deffered = ApprovePaymentService.getRequestForm(transaction);
        return deffered;
	};
	
	var init = function(){
		vm.transactionApproveModel.transaction = $stateParams.transaction;
        if (vm.transactionApproveModel.transaction == null) {
        	PageNavigation.gotoPage('/payment-transaction/buyer');
        }else{
        	vm.displayName = $scope.userInfo.displayName;
        	_getRequestForm(vm.transactionApproveModel.transaction);
        	var deffered = _getTransaction(vm.transactionApproveModel.transaction);
            deffered.promise.then(function(response) {
                vm.transaction = response.data;     
            }).catch(function(response) {
                log.error('Get transaction payment fail');
            });
        }	
	}();

	function _validateCredential(data) {
		var result = true;
		if (angular.isUndefined(data) || data === '') {
			result = false;
		}
		return result;
	}

	vm.approve = function() {
		if (_validateCredential(vm.transactionApproveModel.credential)) {
			vm.wrongPassword = false;
			
			var deffered = ApprovePaymentService.approve(vm.transactionApproveModel);
			deffered.promise.then(function(response) {
				vm.transaction = response.data;
				vm.showEvidenceForm = printEvidence(vm.transaction);
				ngDialog.open({
					template: '/js/app/approve-transactions/success-dialog.html',
					scope: $scope,
					disableAnimation: true
				});

			}).catch(function(response) {
				
				$scope.response = response.data;
				if($scope.response.errorCode=='E0400'){
					vm.confirmPopup();
					vm.wrongPassword = true;
					vm.passwordErrorMsg = $scope.response.attributes.errorMessage;
				}else{
					$scope.response.showViewRecentBtn = false;
					$scope.response.showViewHistoryBtn = true;
					$scope.response.showCloseBtn = $scope.response.errorCode == 'E1012'?true:false;
					if($scope.response.errorCode == 'E1012'){
						vm.txnHour.allowSendToBank = false;
						vm.disableButton = true;
					}
					$scope.response.showBackBtn = true;
					
					if($scope.response.errorCode != 'E0403'){
						vm.errorMessageModel = response.data;
						var dialogUrl = TransactionService.getTransactionDialogErrorUrl($scope.response.errorCode, 'approve');
						ngDialog.open({
							template: dialogUrl,
							scope: $scope,
							disableAnimation: true
						});
					}
				}
			});
		} else {
			vm.confirmPopup();
			vm.wrongPassword = true;
			vm.passwordErrorMsg = 'Password is required';
		}         
	};
}]);	