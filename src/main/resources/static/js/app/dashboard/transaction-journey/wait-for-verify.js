angular.module('scfApp').controller('JourneyWaitForVerifyController', ['$scope', 'Service', 'PageNavigation', '$cookieStore', '$state', 'SCFCommonService', function($scope, Service, PageNavigation, $cookieStore, $state, SCFCommonService) {
    var vm = this;
    var compositParent = $scope.$parent;
    var dashboarParent = compositParent.$parent.it;
    var dahsboarItemParent = dashboarParent.dashboardItem;
    vm.headerLabel = dahsboarItemParent.headerLabel;
    var listStoreKey = 'listrancri';
    vm.waitForVerifyModel = {
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
        statusCode: 'WAIT_FOR_VERIFY'
    };


    //var newDocumentDeferred = Service.requestURL('/api/');
    //	newDocumentDeferred.promise.then(function(response){
    //		vm.waitForVerifyModel.totalTransaction = response.totalTransaction;
    //			vm.waitForVerifyModel.totalAmount = SCFCommonService.shortenLargeNumber(response.totalAmount);
    //			vm.waitForVerifyModel.maxAge = SCFCommonService.shortenLargeNumber(response.maxAge);
    //	}).catch(function(response){
    //		
    //	});
    vm.transactionList = function() {
        $cookieStore.put(listStoreKey, vm.listTransactionModel);
        $state.go('/transaction-list', {
            backAction: true
        });

    }

}]);