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
				'$rootScope',
				'$http',
				function($log, $scope, $state, $stateParams, $timeout,
						PageNavigation, Service, $rootScope, $http) {
					var vm = this;
					var organizeId = $rootScope.userInfo.organizeId;
					var log = $log;
					vm.index = 0;
					var dataSource = $http({url:'/api/credit-information/get', method: 'GET',params: {organizeId:organizeId}});
					
					dataSource.success(function(response) {						
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