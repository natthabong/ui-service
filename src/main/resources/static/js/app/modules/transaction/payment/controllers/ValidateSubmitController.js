var paymentModule = angular.module('gecscf.transaction');
paymentModule.controller('ValidateSubmitController', [
	'$scope',
    '$stateParams',
    'UIFactory',
    'PageNavigation',
    'PagingController',
    '$timeout',
    'SCFCommonService',
    'CreatePaymentService',
    function($scope, $stateParams, UIFactory, PageNavigation, 
        PagingController, $timeout, SCFCommonService, CreatePaymentService) {
        var vm = this;
        vm.transactionModel = {};
        vm.tradingpartnerInfoModel = {};

        vm.initLoadData = function() {
            vm.transactionModel = $stateParams.transactionModel;
            vm.tradingpartnerInfoModel = $stateParams.tradingpartnerInfoModel;

            if(vm.transactionModel.payerAccount != null && vm.transactionModel.payerAccount != ''){
                var payerAccount = vm.transactionModel.payerAccount;
                var word1 = payerAccount.substring(0,3);
                var word2 = payerAccount.substring(3,4);
                var word3 = payerAccount.substring(4, 9);
                var word4 = payerAccount.substring(9,10);
                vm.transactionModel.payerAccount = word1+'-'+word2+'-'+word3+'-'+word4;
            }
        }

        vm.pagingController = PagingController.create(vm.transactionModel.documents);

        vm.backToCreate = function(){
            $timeout(function(){
                PageNavigation.backStep();
            }, 10);
        };

        vm.submitTransaction = function() {

        };

        var init = function() {
            vm.initLoadData();
        }();
    }
]);