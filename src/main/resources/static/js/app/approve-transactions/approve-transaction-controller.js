angular.module('scfApp').controller('ApproveController', ['$scope', 'ApproveTransactionService', 'TransactionService', 'Service', '$stateParams', '$state', '$timeout', 'PageNavigation', 'UIFactory','ngDialog', '$q', '$log',

    function($scope, ApproveTransactionService, TransactionService, Service, $stateParams, $state, $timeout, PageNavigation, UIFactory, $q, ngDialog, $log) {
        var vm = this;
		var log = $log;
        vm.TransactionStatus = {
        		book: 'B'
        }
        vm.displayName = null;
        vm.agreed = false;
        vm.disableButton = true;
        vm.transaction = {};
        vm.response = {};
        vm.showEvidenceForm = false;
        vm.focusOnPassword = false;
        vm.wrongPassword = false;
        vm.transactionApproveModel = {
            transaction: vm.transactionApproveModel,
            credential: ''
        };
		
		vm.errorMessageCode = {
			timeout: 'TIMEOUT'
		}
        
        vm.errorMessageModel = {
        };
        vm.txnHour = { allowSendToBank: false};

        vm.agreeCondition = function() {
            vm.agreed = !vm.agreed;
            vm.disableButton = !(vm.txnHour.allowSendToBank && vm.agreed);
        };

        vm.confirmPopup = function() {
        	 ngDialog.open({
                 template: '/js/app/approve-transactions/confirm-dialog.html',
                 scope: $scope,
                 disableAnimation: true
             });
        };

        var reject = function(transactionModel) {
        	var deferred = ApproveTransactionService.reject(transactionModel);
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
					if (validateCredential(vm.transactionApproveModel.credential)) {
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
								backAndReset : vm.backAndReset,
								viewHistory : vm.viewHistory,
								errorCode : response.data.errorCode,
								action : response.data.attributes.action,
								actionBy : response.data.attributes.actionBy
							},
						});						
					}
                	
//                    if($scope.response.errorCode=='E0400'){
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
				},
				onSuccess : function(response) {
					UIFactory.showSuccessDialog({
						data : {
							mode: 'transaction',
							headerMessage : 'Reject transaction success',						
							bodyMessage : vm.transaction.transactionId,
							backAndReset : vm.backAndReset,
							viewRecent : vm.viewRecent,
							viewHistory : vm.viewHistory,
							hideBackButton : true
						},
					});				
				}
			});    	   
       };


        vm.approve = function() {
            if (validateCredential(vm.transactionApproveModel.credential)) {
            	vm.wrongPassword = false;
            	
                var deffered = ApproveTransactionService.approve(vm.transactionApproveModel);
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
        
    
        vm.retry = function() {
        	    vm.transaction = vm.transactionApproveModel.transaction;
        	    
                var deffered = TransactionService.retry(vm.transaction);
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
                    $scope.response.showViewRecentBtn = false;
                    $scope.response.showViewHistoryBtn = true;
                    $scope.response.showCloseBtn = $scope.response.errorCode == 'E1012'?true:false;
					$scope.response.showBackBtn = true;
					
					vm.errorMessageModel = response.data;
					var dialogUrl = TransactionService.getTransactionDialogErrorUrl($scope.response.errorCode, 'approve');
                    ngDialog.open({
                        template: dialogUrl,
	                    scope: $scope,
	                    disableAnimation: true
                    });
                    
                });
        }

//        vm.reject = function() {
//            if (validateCredential(vm.transactionApproveModel.credential)) {
//                var deffered = ApproveTransactionService.reject(vm.transactionApproveModel);
//                deffered.promise.then(function(response) {
//                    vm.transaction = response.data;
//                    ngDialog.open({
//                        template: '/js/app/approve-transactions/reject-success-dialog.html',
//                        scope: $scope,
//                        disableAnimation: true
//                    });
//
//                }).catch(function(response) {
//                	$scope.response = response.data;
//                	
//                    if($scope.response.errorCode=='E0400'){
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
//                });
//            } else {
//            	vm.confirmRejectPopup();
//            	vm.wrongPassword = true;
//            	vm.passwordErrorMsg = 'Password is required';
//            }
//        };
        
		 vm.getTransaction = function() {
            var deffered = ApproveTransactionService.getTransaction(vm.transactionApproveModel.transaction);
            deffered.promise.then(function(response) {
                vm.transaction = response.data;
                ApproveTransactionService.generateRequestForm(vm.transactionApproveModel.transaction);
               
            }).catch(function(response) {
                log.error('Get transaction fail');
            });
        }

        vm.init = function() {
            vm.transactionApproveModel.transaction = $stateParams.transaction;
            if (vm.transactionApproveModel.transaction === null) {
            	PageNavigation.gotoPreviousPage();
            }else{
            	 var params = {
            		bankCode: vm.transactionApproveModel.transaction.bankCode,
            		transactionType: 'DRAWDOWN',
            		transactionDate: vm.transactionApproveModel.transaction.transactionDate
            	 };
            	 var deffered = Service.requestURL('/api/transaction/verify-transaction-hour', params);
                 deffered.promise.then(function(response) {
                     vm.txnHour = response;
                     if(!vm.txnHour.allowSendToBank){
	                     ngDialog.open({
	                         template: '/js/app/approve-transactions/warn-txn-hour-dialog.html',
	                         scope: $scope
		       	         });
                     }
                 });
	        	
				 vm.getTransaction();
				 vm.displayName = $scope.userInfo.displayName;
			}
          
        }

        vm.init();

        vm.viewRecent = function(){
        	$timeout(function() {
        		PageNavigation.gotoPage('/view-transaction', {transactionModel: vm.transaction, isShowViewHistoryButton: true});
            }, 10);
        }

        vm.printEvidenceFormAction = function(){
        	if(printEvidence(vm.transaction)){
        		ApproveTransactionService.generateEvidenceForm(vm.transaction);
        	}
        }
       
		vm.backPage = function(){
			$timeout(function() {
				PageNavigation.gotoPreviousPage(false);
			},10);
		}
		
		vm.backAndReset = function(){
			$timeout(function(){
				PageNavigation.gotoPreviousPage(true);
			}, 10);
		}

		vm.viewRecent = function(){
			$timeout(function(){
            	var params = {transactionModel: vm.transaction, isShowViewHistoryButton:'show', isShowViewHistoryButton: true};
            	PageNavigation.gotoPage('/view-transaction', params, params);
        	}, 10);
		};
		
		vm.viewHistory = function(){
			$timeout(function(){
				PageNavigation.gotoPage('/transaction-list/supplier');
			}, 10);
		};	

        function validateCredential(data) {
            var result = true;
            if (angular.isUndefined(data) || data === '') {
                result = false;
            }
            return result;
        }
        
        function printEvidence(transaction){
        	if(transaction.returnStatus === vm.TransactionStatus.book){
        		return true;
        	}
        	return false;
        }
		
		function getTransactionDialogErrorUrl(errorCode){
			var templateUrl = '/js/app/approve-transactions/fail-dialog.html';
			if(angular.isDefined(errorCode)){
				if(errorCode == vm.errorMessageCode.timeout){
					templateUrl = '/js/app/approve-transactions/incomplete-dialog.html';
				}
			}
			return templateUrl;
		}
    }
]);