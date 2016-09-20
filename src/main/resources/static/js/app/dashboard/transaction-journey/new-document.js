angular.module('scfApp').controller('JourneyNewDocumentController', ['$scope','Service', 'PageNavigation', function($scope, Service, PageNavigation){
	var vm = this;
	var compositParent = $scope.$parent;
	var dashboarParent = compositParent.$parent.it;
	var dahsboarItemParent = dashboarParent.dashboardItem;
	vm.headerLabel = dahsboarItemParent.headerLabel;
	vm.journeyDocModel = {
		newDocument: 50,
		docValue: '15M',
		canLoan: '14.9M'
	};
	//var newDocumentDeferred = Service.requestURL('/api/');
//	newDocumentDeferred.promise.then(function(){
//		
//	}).catch(function(){
//		
//	});
	vm.createDocument = function(){
		PageNavigation.gotoPage('/create-transaction');
	}

}]);