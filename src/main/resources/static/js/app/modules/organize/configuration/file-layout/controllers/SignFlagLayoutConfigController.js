'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.controller("SignFlagLayoutConfigController", [ '$scope', '$rootScope', '$q', 'Service', '$filter', function($scope, $rootScope, $q, Service, $filter) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	vm.config = $scope.ngDialogData.config;

	vm.model.positiveFlag = vm.model.positiveFlag ? vm.model.positiveFlag : 0;
	vm.model.negativeFlag = vm.model.negativeFlag ? vm.model.negativeFlag : 1;
	
	var defaultExampleValue = vm.config.defaultExampleValue;
	$scope.$watch('ctrl.model', function() {
		vm.examplePosDataDisplay = '(flag: '+vm.model.positiveFlag+', amount: '+parseFloat(defaultExampleValue)+') -> '+parseFloat(defaultExampleValue).toLocaleString();
		vm.exampleNegDataDisplay = '(flag: '+vm.model.negativeFlag+', amount: '+parseFloat(defaultExampleValue)+') -> '+parseFloat(-defaultExampleValue).toLocaleString();
	}, true);
} ]);
