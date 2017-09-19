'use strict';
var module = angular.module('gecscf.organize.configuration');
module.controller('TextExportLayoutConfigController', ['$scope', '$log',
	'UIFactory', 'ngDialog', 'PageNavigation',
		function ($scope, $log, UIFactory, ngDialog ,PageNavigation) {
		var vm = this;
		var log = $log;

		vm.model = angular.copy($scope.ngDialogData.record);

	}]);