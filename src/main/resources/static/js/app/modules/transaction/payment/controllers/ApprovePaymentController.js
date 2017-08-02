var txnMod = angular.module('gecscf.transaction');
txnMod.controller('ApprovePaymentController', ['$rootScope', '$scope', '$log', 
	'$stateParams', 'SCFCommonService','PageNavigation', 'UIFactory','ngDialog','$timeout', 'ApprovePaymentService', 
	function($rootScope, $scope, $log, $stateParams, SCFCommonService, PageNavigation, UIFactory, ngDialog, $timeout, ApprovePaymentService) {

	var vm = this;
	var log = $log;

	vm.agreeCondition = false;

	vm.transactionApproveModel = {
		transaction : undefined,
		 credential: ''
	}

	var TransactionStatus = {
		PAID: 'D'
	}
	
	vm.backPage = function(){
		$timeout(function(){
			PageNavigation.backStep();
		}, 10);
	};

	vm.viewRecent = function(){
		$timeout(function(){
        	PageNavigation.gotoPage('/payment-transaction/view', {transactionModel: vm.transaction, isShowViewHistoryButton: true});
    	}, 10);
	};
	
	vm.viewHistory = function(){
		$timeout(function(){
			PageNavigation.gotoPage('/payment-transaction/buyer');
		}, 10);
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
        	var transactionMethod = vm.transactionApproveModel.transaction.transactionMethod;
        	if(transactionMethod == 'DEBIT'){
        		vm.contractHeaderMsg = 'contract header debit';
        		vm.agreeConditionMsg = 'agree condition debit';
        	}else if(transactionMethod == 'TERM_LOAN'){
        		vm.contractHeaderMsg = 'contract header loan';
        		vm.agreeConditionMsg = 'agree condition loan';
        	}
        	
        	_getRequestForm(vm.transactionApproveModel.transaction);
        	var deffered = _getTransaction(vm.transactionApproveModel.transaction);
            deffered.promise.then(function(response) {
                vm.transactionApproveModel.transaction = response.data;
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

	function printEvidence(transaction){
		return false;
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
	
	var reject = function(transactionModel) {
    	var deferred = ApprovePaymentService.reject(transactionModel);
    	deferred.promise.then(function(response) {
    		vm.transaction = response.data;
    	})
    	return deferred;
    }
	
	vm.confirmRejectPopup = function(msg) {
 	   if(msg == 'clear'){
 		   vm.wrongPassword = false;
 		   vm.passwordErrorMsg = '';	
 		   vm.transactionApproveModel.credential = '';
 		   vm.transactionApproveModel.transaction.rejectReason = '';
 	   }
 	   UIFactory.showConfirmDialog({
			data : {
				headerMessage : 'Confirm reject ?',
				mode: 'transaction',
				credentialMode : true,
				displayName : vm.displayName,
				wrongPassword : vm.wrongPassword,
				passwordErrorMsg : vm.passwordErrorMsg,
				rejectReason : '',
				transactionModel : vm.transactionApproveModel
			}, 
			confirm : function() {
				if (_validateCredential(vm.transactionApproveModel.credential)) {
					return reject(vm.transactionApproveModel);
				}else {
	            	vm.wrongPassword = true;
	            	vm.passwordErrorMsg = 'Password is required';						
	            	vm.confirmRejectPopup('error');
	            }
			},
			onFail : function(response) {					
				$scope.response = response.data;
				if($scope.response.errorCode=='E0400'){
            		vm.wrongPassword = true;
	            	vm.passwordErrorMsg = $scope.response.attributes.errorMessage;						
					vm.confirmRejectPopup('error');
				}else{
					UIFactory.showFailDialog({
						data : {
							mode: 'transaction',
							headerMessage : 'Reject transaction fail',
							backAndReset : vm.backPage,
							viewHistory : vm.viewHistory,
							viewRecent : vm.viewRecent,
							errorCode : response.data.errorCode,
							action : response.data.attributes.action,
							actionBy : response.data.attributes.actionBy
						},
					});						
				}			
			},
			onSuccess : function(response) {
				UIFactory.showSuccessDialog({
					data : {
						mode: 'transaction',
						headerMessage : 'Reject transaction success.',						
						bodyMessage : vm.transaction.transactionNo,
						backAndReset : vm.backPage,
						viewRecent : vm.viewRecent,
						viewHistory : vm.viewHistory
					},
				});				
			}
		});    	   
    };
    
//	
//	vm.reject = function() {
//        if (_validateCredential(vm.transactionApproveModel.credential)) {
//            var deffered = ApproveTransactionService.reject(vm.transactionApproveModel);
//            deffered.promise.then(function(response) {
//                vm.transaction = response.data;
//                ngDialog.open({
//                    template: '/js/app/approve-transactions/reject-success-dialog.html',
//                    scope: $scope,
//                    disableAnimation: true
//                });
//
//            }).catch(function(response) {
//            	$scope.response = response.data;
//            	
//                if($scope.response.errorCode=='E0400'){
//		            	vm.confirmRejectPopup();
//	            		vm.wrongPassword = true;
//		            	vm.passwordErrorMsg = $scope.response.attributes.errorMessage;
//	            	}else{
//	            		$scope.response.showViewRecentBtn = false;
//	                    $scope.response.showViewHistoryBtn = true;
//	                    $scope.response.showCloseBtn = $scope.response.errorCode == 'E1012'?true:false;
//	                    $scope.response.showBackBtn = true;
//	                    console.log($scope.response.errorCode);
//	                    if($scope.response.errorCode != 'E0403'){
//	                    	vm.errorMessageModel = response.data;
//	                    	ngDialog.open({
//		                        template: '/js/app/approve-transactions/concurency-dialog.html',
//			                    scope: $scope,
//			                    disableAnimation: true
//		                    });
//	                    }
//	            	}
//            });
//        } else {
//        	vm.confirmRejectPopup();
//        	vm.wrongPassword = true;
//        	vm.passwordErrorMsg = 'Password is required';
//        }
//    };
}]);	