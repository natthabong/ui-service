angular.module('scfApp').controller('JourneyFuturePaymentController',
		[ '$scope', '$rootScope', '$state', 'SCFCommonService', 'Service', function($scope, $rootScope, $state, SCFCommonService, Service) {
			var vm = this;
			var organizeId = $rootScope.userInfo.organizeId;
			var compositParent = $scope.$parent;
			var dashboardParent = compositParent.$parent;
			var dashboardItemParent = dashboardParent.dashboardItem;
			vm.headerLabel = dashboardItemParent.headerLabel;

			vm.futurePaymentModel = {
				totalTransaction : 0,
				totalAmount : '0',
				maxAge : '0'
			};

			vm.transactionCriteria = {
				ownerId : organizeId,
				statusCode : 'WAIT_FOR_PAYMENT_RESULT',
				transactionType : 'PAYMENT'
			}
			
		    vm.load = function() {
		    	var waitForFuturePaymentsDeferred = Service.doGet('/api/summary-transaction/get', vm.transactionCriteria);
		    	waitForFuturePaymentsDeferred.promise.then(function(response){
		    		vm.futurePaymentModel.totalTransaction = response.data.totalTransaction;
		    		vm.futurePaymentModel.totalAmount = SCFCommonService.shortenLargeNumber(response.data.totalAmount);
		    		vm.futurePaymentModel.maxAge = SCFCommonService.shortenLargeNumber(response.data.maxAge);
		    	}).catch(function(response){
		    		
		    	});
		    }

		    vm.load();			
		} ]);