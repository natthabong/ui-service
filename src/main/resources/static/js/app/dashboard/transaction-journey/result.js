angular.module('scfApp').controller('JourneyResultController', ['$scope','Service', 'PageNavigation', function($scope, Service, PageNavigation){
	var vm = this;
	var compositParent = $scope.$parent;
	var dashboarParent = compositParent.$parent.it;
	var dahsboarItemParent = dashboarParent.dashboardItem;
	vm.headerLabel = dahsboarItemParent.headerLabel;
	vm.resultModel = {
		transactionSuccess: 50,
		transactionRetry: '1',
		transactionFail: '2'
	};
	//var newDocumentDeferred = Service.requestURL('/api/');
//	newDocumentDeferred.promise.then(function(response){
//		vm.resultModel.transactionSuccess = response.transactionSuccess;
//			vm.resultModel.transactionRetry = SCFCommonService.shortenLargeNumber(response.transactionRetry);
//			vm.resultModel.transactionFail = SCFCommonService.shortenLargeNumber(response.transactionFail);
//	}).catch(function(response){
//		
//	});
	vm.transactionList = function(){
		PageNavigation.gotoPage('/transaction-list');
	}

}]);