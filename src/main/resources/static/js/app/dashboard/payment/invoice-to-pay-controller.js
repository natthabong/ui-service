angular
		.module('scfApp')
		.controller(
				'InvoiceToPayDashboardController',
				[
						'$log',
						'$scope',
						'$state',
						'$stateParams',
						'$timeout',
						'PageNavigation',
						'Service',
						'$rootScope', 
						'$http', 
						'$q',
						function($log, $scope, $state, $stateParams, $timeout,
								PageNavigation, Service, $rootScope, $http, $q) {
							var vm = this;
							var log = $log;
							var organizeId = $rootScope.userInfo.organizeId;
							
							vm.getInvoiceToPay = function(){
								var deffered = $q.defer();

						        $http({
						            method: 'GET',
						            url: 'api/v1/create-transaction/document-groupby-duedate',
						            params: {
						            	buyerId: organizeId
						            }
						        }).then(function(response){
						            deffered.resolve(response);
						        }).catch(function(response){
						            deffered.reject(response);
						        });
						        return deffered;
							}
							
							var dataSource = vm.getInvoiceToPay();
							
							dataSource.promise.then(function(response) {
		                        vm.data = response.data;
		                    }).catch();
							
							vm.decodeBase64 = function(data){
								return atob(data);
							}
							
							vm.create = function(data){
								var duedate = moment(data.dueDate);
								PageNavigation.gotoPage('/my-organize/create-payment', {
									dashboardParams: {
										dueDate: duedate.toDate(),
										supplierId: data.supplierId,
										buyerCode: data.buyerCode,
										productType: data.productType
									}
								})
							}
						} ]);