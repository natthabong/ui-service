'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.controller('DataLayoutConfigController', [ '$scope', function($scope) {
	var vm = this;

	vm.model = angular.copy($scope.ngDialogData.record);

	vm.initial = function() {
		vm.defaultValue = '';
		vm.DataTypeDisplay = $scope.ngDialogData.config.displayFieldName;
		if (vm.model.defaultValue != null) {
			vm.defaultValue = vm.model.defaultValue;
			
		} 
	}
	vm.initial();

	vm.saveData = function() {
		vm.model.defaultValue = vm.defaultValue;
	}
	
} ]);