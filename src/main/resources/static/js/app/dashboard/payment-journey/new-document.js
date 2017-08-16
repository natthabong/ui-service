angular.module('scfApp').controller('JourneyNewDocumentPaymentController', ['$scope', 'Service', 'PageNavigation', 'SCFCommonService', '$rootScope', function($scope, Service, PageNavigation, SCFCommonService, $rootScope) {
    var vm = this;
    var compositParent = $scope.$parent;
    var dashboarParent = compositParent.$parent;
    var dahsboarItemParent = dashboarParent.dashboardItem;
    vm.headerLabel = dahsboarItemParent.headerLabel;

    vm.totalDocument = 0;
    vm.payableAmount = '0';
	
    vm.load = function() {
        var newDocumentDeferred = Service.doGet('/api/view-summary-new-ar-document');
        newDocumentDeferred.promise.then(function(response) {
            if(response.data != ""){
                vm.totalDocument = response.data.totalDocument;
			    vm.payableAmount = SCFCommonService.shortenLargeNumber(response.data.payableAmount);
            }
        }).catch(function(response) {
			
        });
    }
    
    vm.documentList = function(){
    	PageNavigation.gotoPage('/create-payment');
    }
    
}]);