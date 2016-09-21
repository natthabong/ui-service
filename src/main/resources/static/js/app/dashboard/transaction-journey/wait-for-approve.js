angular.module('scfApp').controller('JourneyWaitForApproveController', ['$scope', 'Service', 'PageNavigation', '$cookieStore', '$state', function($scope, Service, PageNavigation, $cookieStore, $state) {
    var vm = this;
    var compositParent = $scope.$parent;
    var dashboarParent = compositParent.$parent.it;
    var dahsboarItemParent = dashboarParent.dashboardItem;
    vm.headerLabel = dahsboarItemParent.headerLabel;
    var listStoreKey = 'listrancri';
    vm.waitForApproveModel = {
        totalTransaction: 50,
        totalAmount: '15M',
        maxAge: '2'
    };
    vm.listTransactionModel = {
        dateType: 'transactionDate',
        dateFrom: '',
        dateTo: '',
        sponsorId: '',
        supplierId: '',
        statusGroup: 'INTERNAL_STEP',
        order: '',
        orderBy: '',
		statusCode: 'WAIT_FOR_APPROVE'
    };
	
    //var newDocumentDeferred = Service.requestURL('/api/');
    //	newDocumentDeferred.promise.then(function(response){
//		vm.waitForApproveModel.totalTransaction = response.totalTransaction;
//			vm.waitForApproveModel.totalAmount = SCFCommonService.shortenLargeNumber(response.totalAmount);
//			vm.waitForApproveModel.maxAge = SCFCommonService.shortenLargeNumber(response.maxAge);
    //	}).catch(function(response){
    //		
    //	});
    vm.transactionList = function() {
		$cookieStore.put(listStoreKey, vm.listTransactionModel);
		$state.go('/transaction-list',  {backAction: true});
    }

}]);