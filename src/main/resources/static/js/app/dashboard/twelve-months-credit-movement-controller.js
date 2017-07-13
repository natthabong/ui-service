angular.module('scfApp').controller(
		'TwelveMonthsCreditMovementDashboardController',
		[
				'$log',
				'$scope',
				'Service',
				function($log, $scope, Service) {
					var vm = this;
					var log = $log;
					
					vm.data =[];
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
					
					
					var dataSource = Service
					.requestURL('/api/credit-information/twelve-months-movement', {}, 'GET');
					
					dataSource.promise.then(function(response) {	
						
						vm.data = [];
						var tempData = [];
	            		angular.forEach(response, function(value, key) {
	            			
	            			for (var k in value) {
	            				var o = legends[k];
	            				if(o!=null){ 
	            					if(!this[k]){
	            						this[k] = []
	            					}
	            					this[k].push({
		            					"x" : value['current']? (value['noOfMonth'] + ' (Now)'):value['noOfMonth'],
		            					"y" : value[k]
		            				})
	            				}
	            			}
	            		}, tempData);
	            		for (var tempKey in tempData) {
	            			vm.data.push({
								"key" : tempKey,
								"label" : legends[tempKey].label,
								"values" : tempData[tempKey]
							})
            			}	            		
		            }).catch();
					
					
					vm.xAxisTickFormatFunction = function() {
						return function(d) {
							return d;
						};
					};
					
					vm.yFunction = function() {
						return function(d) {
							return d.y;
						};
					}
					
					vm.xFunction = function() {
						return function(d) {
							return d.x;
						};
					}
					
					vm.stackColorFunction = function() {

						return function(d, i) {
							return legends[d.key].color;
						};
					}
					vm.colorLegendFunction = function() {
						return function(d) {
							return legends[d.key].color;
						};
					}
					
					vm.labelLegendFunction = function() {
						return function(d) {
							return legends[d.key].label;
						};
					}
				}]);