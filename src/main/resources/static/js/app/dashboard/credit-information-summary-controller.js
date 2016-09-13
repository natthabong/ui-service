angular.module('scfApp').controller(
		'CreditInformationSummaryDashboardController',
		[
				'$log',
				'$scope',
				'Service', 'ngDialog',
				function($log, $scope, Service, ngDialog) {
					var vm = this;
					var log = $log;
					
					vm.width = 600;
					vm.height = 350;
					
					var legends = {
							"outstanding" : {
								label : "Outstanding",
								color : "#E19D29"
							},
							"futureDrawdown" : {
								label : "Future Drawdown",
								color : "#4298B5"
							},
							"internalStep" : {
								label : "Internal step",
								color : "#FDF200"
							},
							"available" : {
								label : "Available",
								color : "#00A03E"
							}

						};
					vm.data = [];
					var dataSource = Service
					.requestURL('/api/credit-information/summary', {});
					
					dataSource.promise.then(function(response) {						
		            	var creditInformation = response;
		            	vm.data = [];
		            		angular.forEach(creditInformation, function(value, key) {
		            			this.push({
		            				key : key,
		            				y : value
		            			});

		            		}, vm.data);
		            		
		            }).catch();
					
					vm.xFunction = function() {
						return function(d) {
							return legends[d.key].label;
						};
					}
					vm.yFunction = function() {
						return function(d) {
							return d.y;
						};
					}
					vm.colorFunction = function() {
						return function(d, i) {
							return legends[d.data.key].color;
						};
					}
					vm.colorLegendFunction = function() {
						return function(d) {
							return legends[d.key].color;
						};
					}
					$scope.$on('elementClick.directive', function(event) {
						ngDialog.open({
	                         template: '/js/app/dashboard/credit-information-dialog.html',
	                         controller: 'CreditInformationDashboardController',
	                         controllerAs: 'creditInfoCtrl',
	                         width: 900
		       	         });
					
					});
				}]);