angular.module('scfApp').controller('JourneyFutureDrawdownController', ['$scope','Service', 'PageNavigation', function($scope, Service, PageNavigation){
	var vm = this;
	var compositParent = $scope.$parent;
	var dashboarParent = compositParent.$parent.it;
	var dahsboarItemParent = dashboarParent.dashboardItem;
	vm.headerLabel = dahsboarItemParent.headerLabel;
	vm.headerCss = "#5B9BD5";
	vm.futureDrawdownModel = {
		transaction: 50,
		amount: '15M',
		maxAge: '2'
	};
	//var newDocumentDeferred = Service.requestURL('/api/');
//	newDocumentDeferred.promise.then(function(){
//		
//	}).catch(function(){
//		
//	});
	
}]);