angular.module('scfApp').controller('JourneyNewDocumentPaymentController', ['$scope', 'Service', 'PageNavigation', 'SCFCommonService', '$rootScope', function($scope, Service, PageNavigation, SCFCommonService, $rootScope) {
    var vm = this;
    var compositParent = $scope.$parent;
    var dashboarParent = compositParent.$parent;
    var dahsboarItemParent = dashboarParent.dashboardItem;
    vm.headerLabel = dahsboarItemParent.headerLabel;

    vm.journeyDocModel = {
        totalDocument: 0,
        totalDocumentAmount: '0',
        canLoanAmount: '0'
    };
	
    vm.load = function() {
        var newDocumentDeferred = Service.doGet('/api/view-summary-new-ar-document');
        newDocumentDeferred.promise.then(function(response) {
            console.log(response)
			vm.totalDocument = response.data.totalDocument;
			vm.payableAmount = SCFCommonService.shortenLargeNumber(response.data.payableAmount);
        }).catch(function(response) {
			
        });
    }
    
    vm.documentList = function(){
    	PageNavigation.gotoPage('/create-payment');
    }
    
}]);