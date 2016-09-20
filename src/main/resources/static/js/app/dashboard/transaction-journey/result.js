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
//	newDocumentDeferred.promise.then(function(){
//		
//	}).catch(function(){
//		
//	});
	vm.transactionList = function(){
		PageNavigation.gotoPage('/transaction-list');
	}

}]);