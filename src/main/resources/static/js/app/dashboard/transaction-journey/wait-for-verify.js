angular.module('scfApp').controller(
		'JourneyWaitForVerifyController', 
		[
		 	'$scope', 'Service', 'PageNavigation', '$cookieStore', '$state', 'SCFCommonService', 
		 	function($scope, Service, PageNavigation, $cookieStore, $state, SCFCommonService) {	
			    var vm = this;
			    var compositParent = $scope.$parent;
			    var dashboardParent = compositParent.$parent.it;
			    var dashboardItemParent = dashboardParent.dashboardItem;
			    vm.headerLabel = dashboardItemParent.headerLabel;
			    var listStoreKey = 'listrancri';
			    
			    vm.waitForVerifyModel = {
			        totalTransaction: 0,
			        totalAmount: '',
			        maxAge: ''
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
			
			    var filterStatusCode = splitFilterStatusCode(dashboardParent.filterItems);
			    
			    function splitFilterStatusCode(data){
					var filterItem = data.split(":");
					return filterItem[1];
				}
			    
			    vm.load = function() {
			    	var newDocumentDeferred = Service.requestURL('/api/summary-transaction/get', filterStatusCode, 'POST');
			    	newDocumentDeferred.promise.then(function(response){
			    		vm.waitForVerifyModel.totalTransaction = response.totalTransaction;
			    		vm.waitForVerifyModel.totalAmount = SCFCommonService.shortenLargeNumber(response.totalAmount);
			    		vm.waitForVerifyModel.maxAge = SCFCommonService.shortenLargeNumber(response.maxAge);
			    	}).catch(function(response){
			    		
			    	});
			    }
			    	
			    vm.load();
			    
			    vm.transactionList = function() {
			        $cookieStore.put(listStoreKey, vm.listTransactionModel);
			        $state.go('/transaction-list', {
			            backAction: true
			        });
			
			    }

		 	}]);