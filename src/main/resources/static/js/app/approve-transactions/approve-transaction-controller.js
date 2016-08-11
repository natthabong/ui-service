angular.module('scfApp').controller('ApproveController', ['$scope', 'ApproveTransactionService', 'Service', '$stateParams', '$state', '$timeout', 'PageNavigation','ngDialog',

    function($scope, ApproveTransactionService, Service, $stateParams, $state, $timeout, PageNavigation, ngDialog) {
        var vm = this;
        vm.TransactionStatus = {
        		book: 'B'
        }
        vm.displayName = null;
        vm.agreed = false;
        vm.disableButton = true;
        vm.transaction = {};
        vm.response = {};
        vm.reqPass = false;
        vm.showEvidenceForm = false;
        vm.focusOnPassword = false;
        vm.transactionApproveModel = {
            transaction: vm.transactionApproveModel,
            credential: ''
        };
        vm.txnHour = { allowSendToBank: false};

        vm.agreeCondition = function() {
        	console.log(vm.agreed);
            vm.agreed = !vm.agreed;
            vm.disableButton = !(vm.txnHour.allowSendToBank && vm.agreed);
            console.log(vm.disableButton)
        };

        vm.confirmPopup = function() {
        	 ngDialog.open({
                 template: '/js/app/approve-transactions/confirm-dialog.html',
                 scope: $scope,
                 disableAnimation: true
             });
        };

        vm.approve = function() {
            if (validateCredential(vm.transactionApproveModel.credential)) {
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
                    ngDialog.open({
                        template: '/js/app/approve-transactions/fail-dialog.html',
	                    scope: $scope,
	                    disableAnimation: true
                    });
                    
                });
            } else {
            	vm.reqPass = true;
            }
        };
		
		 vm.getTransaction = function() {
            var deffered = ApproveTransactionService.getTransaction(vm.transactionApproveModel.transaction);
            deffered.promise.then(function(response) {
                vm.transaction = response.data;
                ApproveTransactionService.generateRequestForm(vm.transactionApproveModel.transaction);
               
            }).catch(function(response) {
                console.log('Get transaction fail');
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

        vm.viewHistory = function() {
            $timeout(function() {
            	PageNavigation.gotoPreviousPage();
            }, 10);
        }
        
        vm.viewRecent= function(){
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

        function validateCredential(data) {
            var result = true;
            if (angular.isUndefined(data) || data === '') {
                result = false;
            }
            return result;
        }
        
        function printEvidence(transaction){
        	console.log(transaction);
        	if(transaction.returnStatus === vm.TransactionStatus.book){
        		return true;
        	}
        	return false;
        }
    }
]);