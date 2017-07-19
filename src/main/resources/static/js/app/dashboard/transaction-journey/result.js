angular.module('scfApp').controller('JourneyResultController', ['$scope','Service', 'PageNavigation', function($scope, Service, PageNavigation){
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
	var newDocumentDeferred = Service.requestURL('/api/summary-transaction-result/get', {}, 'GET');
	newDocumentDeferred.promise.then(function(response){
		vm.resultModel.transactionSuccess = response.totalSuccessTransaction;
		vm.resultModel.transactionRetry = response.totalRetriableTransaction;
		vm.resultModel.transactionFail = response.totalFailTransaction;
	}).catch(function(response){
		
	});
	vm.transactionList = function(){
		PageNavigation.gotoPage('/transaction-list');
	}

}]);