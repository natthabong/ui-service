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