angular.module('scfApp').controller('JourneyFutureDrawdownController', ['$scope','Service', 'PageNavigation', function($scope, Service, PageNavigation){
	var vm = this;
	var compositParent = $scope.$parent;
	var dashboarParent = compositParent.$parent.it;
	var dahsboarItemParent = dashboarParent.dashboardItem;
	vm.headerLabel = dahsboarItemParent.headerLabel;

	vm.futureDrawdownModel = {
		totalTransaction: 50,
		totalAmount: '15M',
		maxAge: '2'
	};
	//var newDocumentDeferred = Service.requestURL('/api/');
//	newDocumentDeferred.promise.then(function(response){
//		vm.futureDrawdownModel.totalTransaction = response.totalTransaction;
//			vm.futureDrawdownModel.totalAmount = SCFCommonService.shortenLargeNumber(response.totalAmount);
//			vm.futureDrawdownModel.maxAge = SCFCommonService.shortenLargeNumber(response.maxAge);
//	}).catch(function(response){
//		
//	});
	
}]);