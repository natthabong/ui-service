angular.module('scfApp').controller('JourneyResultController', ['$scope','JourneyResultService', 'PageNavigation', function($scope, JourneyResultService, PageNavigation){
	var vm = this;
	var compositParent = $scope.$parent;
	var dashboarParent = compositParent.$parent;
	var dahsboarItemParent = dashboarParent.dashboardItem;
	vm.headerLabel = dahsboarItemParent.headerLabel;
	vm.resultModel = {
		transactionSuccess: 0,
		transactionRetry: 0,
		transactionFail: 0
	};
	
	vm.load = function(transactionType){
		var deferred = JourneyResultService.getTransactionResultSummary(transactionType);
		deferred.promise.then(function(response){
			vm.resultModel.transactionSuccess = response.data.totalSuccessTransaction;
			vm.resultModel.transactionRetry = response.data.totalRetriableTransaction;
			vm.resultModel.transactionFail = response.data.totalFailTransaction;
		}).catch(function(response){
			
		});
	}
	

}]);