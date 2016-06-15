var createapp = angular.module('scfApp');
createapp.controller('ErrorController', [ '$state', '$scope', '$stateParams',
		function($state, $scope, $stateParams) {
			var vm = this;
			vm.errorCode = $stateParams.errorCode;
		} ]);