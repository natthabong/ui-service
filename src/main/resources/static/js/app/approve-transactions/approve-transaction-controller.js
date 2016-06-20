angular.module('scfApp').controller('ApproveController', ['$scope', 'ApproveTransactionService', '$stateParams', '$state', '$timeout',

    function($scope, ApproveTransactionService, $stateParams, $state, $timeout) {
        var vm = this;

        vm.disableButton = true;
        vm.transactionModel = {};
        $scope.approveConfirmPopup = false;
        $scope.successPopup = false;
        vm.transactionApproveModel = {
            transactionModel: vm.transactionApproveModel,
            credential: ''
        };

        vm.agreeCondition = function() {
            vm.disableButton = !vm.disableButton;
        };

        vm.confirmPopup = function() {
            $scope.approveConfirmPopup = true;
        };

        vm.approve = function() {
            if (validateCredential(vm.transactionApproveModel.credential)) {
                var deffered = ApproveTransactionService.approve(vm.transactionApproveModel);
                deffered.promise.then(function(response) {
                    vm.transactionModel = response.data;

                    $scope.approveConfirmPopup = false;
                    $scope.successPopup = true;

                }).catch(function(response) {
                    console.log('Approve Fail');
                });
            } else {
                console.log('Password is required');
            }
        };

        vm.init = function() {
            vm.transactionApproveModel.transactionModel = $stateParams.transactionModel;
            if (vm.transactionApproveModel.transactionModel === null) {
                $state.go('/transaction-list');
            }
        }

        vm.init();
		
		vm.viewHistory = function(){
			$timeout(function(){
				$state.go('/transaction-list');	
			}, 10);			
		}

        function validateCredential(data) {
            var result = true;
            if (angular.isUndefined(data) || data === '') {
                result = false;
            }
            return result;
        }
    }
]);