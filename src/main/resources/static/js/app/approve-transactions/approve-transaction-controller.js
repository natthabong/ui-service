angular.module('scfApp').controller('ApproveController', ['$scope', 'ApproveTransactionService', '$stateParams', '$state', '$timeout', 'PageNavigation',

    function($scope, ApproveTransactionService, $stateParams, $state, $timeout, PageNavigation) {
        var vm = this;
        vm.TransactionStatus = {
        		book: 'B'
        }
        vm.disableButton = true;
        vm.transaction = {};
        $scope.approveConfirmPopup = false;
        $scope.successPopup = false;
        vm.reqPass = false;
        vm.showEvidenceForm = false;
        vm.focusOnPassword = false;
        vm.transactionApproveModel = {
            transaction: vm.transactionApproveModel,
            credential: ''
        };

        vm.agreeCondition = function() {
            vm.disableButton = !vm.disableButton;
        };

        vm.confirmPopup = function() {
            $scope.approveConfirmPopup = true;
            vm.focusOnPassword = true;
        };

        vm.approve = function() {
            if (validateCredential(vm.transactionApproveModel.credential)) {
                var deffered = ApproveTransactionService.approve(vm.transactionApproveModel);
                deffered.promise.then(function(response) {
                    vm.transaction = response.data;
                    vm.showEvidenceForm = printEvidence(vm.transaction);
                    $scope.approveConfirmPopup = false;
                    $scope.successPopup = true;

                }).catch(function(response) {
                    console.log('Approve Fail');
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