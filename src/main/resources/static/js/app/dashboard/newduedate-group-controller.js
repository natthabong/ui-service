angular
		.module('scfApp')
		.controller(
				'NewDuedateGroupDashboardController',
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
							
							vm.getNewDueDateGroup = function(){
								var deffered = $q.defer();

						        $http({
						            method: 'GET',
						            url: 'api/v1/create-transaction/document-groupby-duedate',
						            params: {
						            	supplierId: organizeId
						            }
						        }).then(function(response){
						            deffered.resolve(response);
						        }).catch(function(response){
						            deffered.reject(response);
						        });
						        return deffered;
							}
							
							var dataSource = vm.getNewDueDateGroup();
							
							dataSource.promise.then(function(response) {
		                        vm.data = response.data;
		                    }).catch();
							
							vm.decodeBase64 = function(data){
								return atob(data);
							}
							
							vm.create = function(data){
								PageNavigation.gotoPage('/create-transaction', {
									dashboardParams: {
										sponsorPaymentDate: data.sponsorPaymentDate,
										sponsorId: data.sponsorId,
										supplierCode: data.supplierCode
									}
								})
							}
						} ]);