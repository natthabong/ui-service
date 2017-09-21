'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.controller('FillerExportLayoutConfigController', [ '$scope', function($scope) {
	var vm = this;

	vm.model = angular.copy($scope.ngDialogData.record);

	vm.fillerTypeDropdown = [
		{
			label : 'Space',
			value : 'space'
		},
		{
			label : 'Zero (0)',
			value : 'zero'
		},
		{
			label : 'Other',
			value : 'other'
		}
	];

	vm.initial = function() {
		vm.fillerType = null;
		if (vm.model.expectedValue == null) {
			vm.fillerType = null;
		} else if (vm.model.expectedValue == ' ') {
			vm.fillerType = 'space';
		} else if (vm.model.expectedValue == 0) {
			vm.fillerType = 'zero';
			
			// reset value for display
			vm.model.expectedValue = null;
		} else {
			vm.fillerType = 'other';
		}
	}
	vm.initial();

	vm.disabledOtherFiller = function() {
		if (vm.fillerType != 'other') {
			return true;
		}
		return false;
	}

	vm.changeFiller = function() {
		vm.model.expectedValue = null;
	}

	vm.saveFiller = function() {
		if (vm.fillerType == null) {
			vm.model.expectedValue = null;
		} else if (vm.fillerType == 'space') {
			vm.model.expectedValue = ' ';
		} else if (vm.fillerType == 'zero') {
			vm.model.expectedValue = '0';
		}
	}
} ]);
