angular.module('scfApp').controller(
		'CreditInformationDashboardController',
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
					vm.index = 0;
					var dataSource = Service
					.requestURL('/api/credit-information/get', {});
					
					dataSource.promise.then(function(response) {						
		                vm.data = response.content;
		                i = 0;
		                angular.forEach(vm.data, function(value, idx) {
		                	if(vm.isSameAccount(value.accountId, vm.data, idx)){
		                		value.rowNo = ++i;
		                		value.showAccountFlag = true;
		                	}
		                });
		            });
					
					vm.decodeBase64 = function(data){
						return atob(data);
					}
					
					vm.isSameAccount = function(accountId, data, index){
						if(index == 0 ){
							return true;
						}
						else{
							return accountId != data[index-1].accountId;
						}
					}
				}]);