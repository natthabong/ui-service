angular.module('scfApp').controller('JourneyWaitForVerifyPaymentController',
		[ '$scope', '$rootScope', '$state', 'SCFCommonService', 'Service', function($scope, $rootScope, $state, SCFCommonService, Service) {
			var vm = this;
			var organizeId = $rootScope.userInfo.organizeId;
			var compositParent = $scope.$parent;
			var dashboardParent = compositParent.$parent;
			var dashboardItemParent = dashboardParent.dashboardItem;
			vm.headerLabel = dashboardItemParent.headerLabel;

			vm.waitForVerifyModel = {
				totalTransaction : 0,
				totalAmount : '0',
				maxAge : '0'
			};

			vm.listTransactionModel = {
				dateType : 'transactionDate',
				dateFrom : '',
				dateTo : '',
				sponsorId : '',
				supplierId : '',
				statusGroup : 'INTERNAL_STEP',
				order : '',
				orderBy : '',
				statusCode : 'WAIT_FOR_VERIFY'
			};

			vm.transactionCriteria = {
				ownerId : organizeId,
				statusCode : 'WAIT_FOR_VERIFY',
				transactionType : 'PAYMENT'
			}
			
		    vm.load = function() {
		    	var waitForVerifyPaymentsDeferred = Service.doGet('/api/summary-transaction/get', vm.transactionCriteria);
		    	waitForVerifyPaymentsDeferred.promise.then(function(response){
		    		vm.waitForVerifyModel.totalTransaction = response.data.totalTransaction;
		    		vm.waitForVerifyModel.totalAmount = SCFCommonService.shortenLargeNumber(response.data.totalAmount);
		    		vm.waitForVerifyModel.maxAge = SCFCommonService.shortenLargeNumber(response.data.maxAge);
		    	}).catch(function(response){
		    		
		    	});
		    }

		    vm.paymentList = function() {
		    	var criteria = {
					statusGroup: 'INTERNAL_STEP'
				}
				
		    	if($rootScope.isDesktopDevice){
			        $state.go('/my-organize/payment-transaction', {
                    	criteria: criteria
                	});
		    	}
		    }
		    
		    vm.load();			
		} ]);