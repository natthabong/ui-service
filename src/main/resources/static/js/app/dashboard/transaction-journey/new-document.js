angular.module('scfApp').controller('JourneyNewDocumentController', ['$scope', 'Service', 'PageNavigation', 'SCFCommonService', '$rootScope', function($scope, Service, PageNavigation, SCFCommonService, $rootScope) {
    var vm = this;
    var compositParent = $scope.$parent;
    var dashboarParent = compositParent.$parent.it;
    var dahsboarItemParent = dashboarParent.dashboardItem;
    vm.headerLabel = dahsboarItemParent.headerLabel;
	vm.isSuppliler = false;
    vm.journeyDocModel = {
        totalDocument: 0,
        totalDocumentAmount: '0',
        canLoanAmount: '0'
    };
	
	
    vm.load = function() {
        var newDocumentDeferred = Service.requestURL('/api/view-summary-new-document/get');
        newDocumentDeferred.promise.then(function(response) {
			vm.journeyDocModel.totalDocument = response.totalDocument;
			vm.journeyDocModel.totalDocumentAmount = SCFCommonService.shortenLargeNumber(response.totalDocumentAmount);
			vm.journeyDocModel.canLoanAmount = SCFCommonService.shortenLargeNumber(response.totalCanLoanAmount);
        }).catch(function(response) {
			
        });
    }
    
    vm.documentList = function(){
    	if($rootScope.isDesktopDevice){
    		if(vm.isSuppliler){
    			PageNavigation.gotoPage('/document-list/supplier');	
    		}    		
    	}
    }
    
}]);