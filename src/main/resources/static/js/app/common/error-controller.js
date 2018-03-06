var createapp = angular.module('scfApp');
createapp.controller('ErrorController', [ '$state', '$scope', '$stateParams', '$http',
		function($state, $scope, $stateParams, $http) {
			var vm = this;
			vm.errorCode = $stateParams.errorCode;
			
			vm.title = '';
			vm.banner = 'Loading...';
	
			$http.get('../assets/theme.json').then(function (res) {
				vm.title = res.data.title;
				console.log(vm.title);
				vm.banner = res.data.banner;
			});
		} 
]);