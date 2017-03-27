angular
		.module('scfApp')
		.controller(
				'CreditInformationSummaryDashboardController',
				[
						'$log',
						'$scope',
						'Service',
						'ngDialog',
						'$rootScope',
						function($log, $scope, Service, ngDialog, $rootScope) {
							var vm = this;
							var log = $log;
							vm.width = 600;
							vm.height = 350;

							vm.legends = {
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
							vm.labels = [];
							vm.values = [];
							vm.colors = [];
							var dataSource = Service.requestURL(
									'/api/credit-information/summary', {});

							dataSource.promise.then(function(response) {
								var creditInformation = response;
								vm.data = [];
								angular.forEach(creditInformation, function(
										value, key) {
									this.push({
										key : key,
										y : value
									});

								}, vm.data);

								vm.labels = [];
								vm.values = [];
								vm.colors = [];
								angular.forEach(creditInformation, function(
										value, key) {
									this.push(value);
									vm.labels.push(vm.legends[key].label);
									vm.colors.push(vm.legends[key].color);
								}, vm.values);

							});

							vm.xFunction = function() {
								return function(d) {
									return vm.legends[d.key].label;
								};
							}
							vm.yFunction = function() {
								return function(d) {
									return d.y;
								};
							}
							vm.colorFunction = function() {
								return function(d, i) {
									return vm.legends[d.data.key].color;
								};
							}
							vm.colorLegendFunction = function() {
								return function(d) {
									return vm.legends[d.key].color;
								};
							}
							vm.canViewTrading=false;
							$scope.options = { legend: { display: false } };
							vm.isOpenPopup = true;
							$scope
									.$on(
											'elementClick.directive',
											function(event) {
												if (vm.canViewTrading) {
													ngDialog
															.open({
																template : '/js/app/dashboard/credit-information-dialog.html',
																controller : 'CreditInformationDashboardController',
																controllerAs : 'creditInfoCtrl',
																width : 900
															});
												}
											});

						} ]);