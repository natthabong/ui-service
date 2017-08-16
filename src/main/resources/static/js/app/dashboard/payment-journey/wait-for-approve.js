angular.module('scfApp').controller('JourneyWaitForApprovePaymentController',
		[ '$scope', '$rootScope', '$state', 'SCFCommonService', 'Service', function($scope, $rootScope, $state, SCFCommonService, Service) {
			var vm = this;
			var organizeId = $rootScope.userInfo.organizeId;
			var compositParent = $scope.$parent;
			var dashboardParent = compositParent.$parent;
			var dashboardItemParent = dashboardParent.dashboardItem;
			vm.headerLabel = dashboardItemParent.headerLabel;

			vm.waitForApproveModel = {
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
				statusCode : 'WAIT_FOR_APPROVE'
			};

			vm.transactionCriteria = {
				ownerId : organizeId,
				statusCode : 'WAIT_FOR_APPROVE',
				transactionType : 'PAYMENT'
			}
			
		    vm.load = function() {
		    	var waitForApprovePaymentsDeferred = Service.doGet('/api/summary-transaction/get', vm.transactionCriteria);
		    	waitForApprovePaymentsDeferred.promise.then(function(response){
		    		vm.waitForApproveModel.totalTransaction = response.data.totalTransaction;
					vm.waitForApproveModel.totalAmount = SCFCommonService.shortenLargeNumber(response.data.totalAmount);
					vm.waitForApproveModel.maxAge = SCFCommonService.shortenLargeNumber(response.data.maxAge);
		    	}).catch(function(response){
		    		
		    	});
		    }

		    vm.paymentList = function() {
		    	if($rootScope.isDesktopDevice){
			        $state.go('/payment-transaction/buyer');
		    	}
		    }
		    
		    vm.load();			
		} ]);