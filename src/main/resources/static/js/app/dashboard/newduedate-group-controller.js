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
						function($log, $scope, $state, $stateParams, $timeout,
								PageNavigation, Service) {
							var vm = this;
							var log = $log;

							var dataSource = Service
									.requestURL('/api/create-transaction/document-groupby-duedate', {
										totalRecord: 10,
										orders: [{
											fieldName: 'sponsorPaymentDate',
											direction: 'ASC'
										},{
											fieldName: 'outstandingAmount',
											direction: 'DESC'
										}]
									});
							
							dataSource.promise.then(function(response) {
		                        vm.data = response;
		                    }).catch();
							
							vm.create = function(data){
								PageNavigation.gotoPage('/create-transaction', data)
							}
						} ]);