angular.module('scfApp').controller(
		'JourneyFutureDrawdownController', 
		[
		 	'$scope', 'Service', 'PageNavigation', 'SCFCommonService', 
		 	function($scope, Service, PageNavigation, SCFCommonService){
				var vm = this;
				var compositParent = $scope.$parent;
				var dashboardParent = compositParent.$parent.it;
				var dashboardItemParent = dashboardParent.dashboardItem;
				vm.headerLabel = dashboardItemParent.headerLabel;
			
				vm.futureDrawdownModel = {
					totalTransaction: 0,
					totalAmount: '0',
					maxAge: '0'
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
						vm.futureDrawdownModel.totalTransaction = response.totalTransaction;
						vm.futureDrawdownModel.totalAmount = SCFCommonService.shortenLargeNumber(response.totalAmount);
						vm.futureDrawdownModel.maxAge = SCFCommonService.shortenLargeNumber(response.maxAge);
					}).catch(function(response){
						
					});
			    }
	
			    vm.load();
			    
		 	}]);