angular.module('scfApp').controller(
		'JourneyFutureDrawdownController', 
		[
		 	'$scope', 'Service', 'PageNavigation', 'SCFCommonService', '$rootScope', 
		 	function($scope, Service, PageNavigation, SCFCommonService, $rootScope){
				var vm = this;
				var organizeId = $rootScope.userInfo.organizeId;
				var compositParent = $scope.$parent;
				var dashboardParent = compositParent.$parent;
				var dashboardItemParent = dashboardParent.dashboardItem;
				vm.headerLabel = dashboardItemParent.headerLabel;
			
				vm.futureDrawdownModel = {
					totalTransaction: 0,
					totalAmount: '0',
					maxAge: '0'
				};
				
				vm.transactionCriteria = {
					supplierId: organizeId,
					statusCode: 'WAIT_FOR_DRAWDOWN_RESULT',
					transactionType: 'DRAWDOWN'
				}
				
//			    var orderItems = splitCriteriaSortOrderData(dashboardParent.orderItems);
//			    splitCriteriaFilterData(dashboardParent.filterItems);
//			
//			    function splitCriteriaSortOrderData(data) {
//					var dataSplit = data.split(",");
//					var order = [];
//					dataSplit.forEach(function(orderData) {
//						var orderItem = orderData.split(":");
//						item = {
//							fieldName : orderItem[0],
//							direction : orderItem[1]
//						}
//						order.push(item);
//					});
//
//					return order;
//				}
//			    
//			    function splitCriteriaFilterData(data) {
//					var dataSplit = data.split(",");
//					var count = 0;
//					dataSplit.forEach(function(filterData) {
//						var filterItem = filterData.split(":");
//						vm.transactionCriteria[filterItem[0]] = filterItem[1];
//					});
//				}
			    
			    vm.load = function() {
			    	var newDocumentDeferred = Service.doGet('/api/summary-transaction/get', vm.transactionCriteria);
					newDocumentDeferred.promise.then(function(response){
						vm.futureDrawdownModel.totalTransaction = response.data.totalTransaction;
						vm.futureDrawdownModel.totalAmount = SCFCommonService.shortenLargeNumber(response.data.totalAmount);
						vm.futureDrawdownModel.maxAge = SCFCommonService.shortenLargeNumber(response.data.maxAge);
					}).catch(function(response){
						
					});
			    }
	
			    vm.load();
			    
		 	}]);