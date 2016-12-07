angular.module('scfApp').controller(
		'JourneyWaitForVerifyController', 
		[
		 	'$scope', 'Service', 'PageNavigation', '$cookieStore', '$state', 'SCFCommonService', '$rootScope' , 
		 	function($scope, Service, PageNavigation, $cookieStore, $state, SCFCommonService, $rootScope) {	
			    var vm = this;
			    var compositParent = $scope.$parent;
			    var dashboardParent = compositParent.$parent.it;
			    var dashboardItemParent = dashboardParent.dashboardItem;
			    vm.headerLabel = dashboardItemParent.headerLabel;
			    var listStoreKey = 'listrancri';
			    
			    vm.waitForVerifyModel = {
			        totalTransaction: 0,
			        totalAmount: '0',
			        maxAge: '0'
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
			    
			    vm.transactionCriteria = {
						dateType: '',
						dateFrom: '',
						dateTo: '',
						sponsorId: '',
						statusGroup: '',
						statusCode: '',
						supplierCode: '',
						page: 0,
						pageSize: 20,
						orders: orderItems
				}
			    
			    var orderItems = splitCriteriaSortOrderData(dashboardParent.orderItems);
			    splitCriteriaFilterData(dashboardParent.filterItems);
			
			    function splitCriteriaSortOrderData(data) {
					var dataSplit = data.split(",");
					var order = [];
					dataSplit.forEach(function(orderData) {
						var orderItem = orderData.split(":");
						item = {
							fieldName : orderItem[0],
							direction : orderItem[1]
						}
						order.push(item);
					});

					return order;
				}
			    
			    function splitCriteriaFilterData(data) {
					var dataSplit = data.split(",");
					var count = 0;
					dataSplit.forEach(function(filterData) {
						var filterItem = filterData.split(":");
						vm.transactionCriteria[filterItem[0]] = filterItem[1];
					});
				}
			    
			    vm.load = function() {
			    	var newDocumentDeferred = Service.requestURL('/api/summary-transaction/get', vm.transactionCriteria);
			    	newDocumentDeferred.promise.then(function(response){
			    		vm.waitForVerifyModel.totalTransaction = response.totalTransaction;
			    		vm.waitForVerifyModel.totalAmount = SCFCommonService.shortenLargeNumber(response.totalAmount);
			    		vm.waitForVerifyModel.maxAge = SCFCommonService.shortenLargeNumber(response.maxAge);
			    	}).catch(function(response){
			    		
			    	});
			    }
			    	
			    vm.load();
			    
			    vm.transactionList = function() {
			    	if($rootScope.isDesktopDevice){
			    		$cookieStore.put(listStoreKey, vm.listTransactionModel);
				        $state.go('/transaction-list', {
				            backAction: true
				        });
			    	}
			    }

		 	}]);