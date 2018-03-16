angular.module('scfApp').controller('JourneyNewDocumentController', ['$scope', 'Service', 'PageNavigation', 'SCFCommonService', '$rootScope', function($scope, Service, PageNavigation, SCFCommonService, $rootScope) {
    var vm = this;
    var compositParent = $scope.$parent;
    var dashboarParent = compositParent.$parent;
    var dahsboarItemParent = dashboarParent.dashboardItem;
    vm.headerLabel = dahsboarItemParent.headerLabel;
    vm.isMaker = false;
	vm.isSuppliler = false;
    vm.journeyDocModel = {
        totalDocument: 0,
        totalDocumentAmount: '0',
        canLoanAmount: '0'
    };
	
	
    vm.load = function() {
        var newDocumentDeferred = Service.requestURL('/api/v1/view-summary-ap-document', {}, 'GET');
        newDocumentDeferred.promise.then(function(response) {
			vm.journeyDocModel.totalDocument = response.totalDocument;
			vm.journeyDocModel.totalDocumentAmount = SCFCommonService.shortenLargeNumber(response.totalDocumentAmount);
			vm.journeyDocModel.canLoanAmount = SCFCommonService.shortenLargeNumber(response.totalCanLoanAmount);
        }).catch(function(response) {
			
        });
    }
    
    vm.documentList = function(){
    	if($rootScope.isDesktopDevice){
    		if(vm.isMaker){
    			PageNavigation.gotoPage('/my-organize/create-transaction');	
    		}else if(vm.isSuppliler){
    			PageNavigation.gotoPage('/partner-organize/ap-document-list');	
    		}   		
    	}
    }
    
}]);