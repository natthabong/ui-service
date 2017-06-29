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
        vm.transactionModel = $stateParams.transactionModel;
        vm.tradingpartnerInfoModel = $stateParams.tradingpartnerInfoModel;
        vm.pagingController = PagingController.create(vm.transactionModel.documents);
        
        vm.dataTable = {
            columns: []
        };

        var loadDocumentDisplayConfig = function(ownerId, mode) {
            var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, mode);
            deffered.promise.then(function(response) {
                vm.dataTable.columns = response.items;
            });
        }
        
        vm.searchDocument = function(pagingModel) {
        	vm.pagingController.search(pagingModel);
        }
        
        vm.backToCreate = function(){
            $timeout(function(){
                PageNavigation.backStep();
            }, 10);
        };

        vm.submitTransaction = function() {
        	vm.transactionModel.transactionDate = SCFCommonService.convertStringTodate(vm.transactionModel.transactionDate);
        	var deffered = CreatePaymentService.submitTransaction(vm.transactionModel);
			deffered.promise.then(function(response) {
				vm.transactionModel = response.data;
				vm.transactionNo = vm.transactionModel.transactionNo;
				$scope.confirmPopup = false;
				$scope.validateDataPopup = true;
			}).catch(function(response) {
				$scope.submitFailPopup = true;
				vm.errorMsgPopup = response.data.errorCode;
			});        	
        };

        var init = function() {
            vm.pagingController.search();
            loadDocumentDisplayConfig(vm.transactionModel.supplierId, 'BFP');
        }();
    }
]);