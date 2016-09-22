angular.module('scfApp').controller('JourneyNewDocumentController', ['$scope', 'Service', 'PageNavigation', 'SCFCommonService', function($scope, Service, PageNavigation, SCFCommonService) {
    var vm = this;
    var compositParent = $scope.$parent;
    var dashboarParent = compositParent.$parent.it;
    var dahsboarItemParent = dashboarParent.dashboardItem;
    vm.headerLabel = dahsboarItemParent.headerLabel;
	
    vm.journeyDocModel = {
        totalDocument: 0,
        totalDocumentAmount: '0M',
        canLoanAmount: '0M'
    };
	
	
    vm.load = function() {
        var newDocumentDeferred = Service.requestURL('/api/view-summary-new-document/get');
        newDocumentDeferred.promise.then(function(response) {
			vm.journeyDocModel.totalDocument = response.totalDocument;
			vm.journeyDocModel.totalDocumentAmount = SCFCommonService.shortenLargeNumber(response.totalDocumentAmount);
			vm.journeyDocModel.canLoanAmount = SCFCommonService.shortenLargeNumber(response.canLoanAmount);
        }).catch(function(response) {
			
        });
    }
    
}]);