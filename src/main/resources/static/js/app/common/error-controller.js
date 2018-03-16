var createapp = angular.module('scfApp');
createapp.controller('ErrorController', [
	'$http',
	'$scope',
	'$state',
	'$stateParams',
	function ($http, $scope, $state, $stateParams) {
		var vm = this;
		vm.errorCode = $stateParams.errorCode;

		vm.title = '';
		vm.banner = 'Loading...';

		$http.get('../assets/theme.json').then(function (res) {
			vm.title = res.data.title;
			vm.banner = res.data.banner;
		});
	}
]);