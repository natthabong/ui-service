'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');

module.controller('CountExportLayoutConfigController', 
	[ '$scope', '$rootScope', '$q', 'Service', '$filter', '$log', 
	function($scope, $rootScope, $q, Service, $filter, $log) {

	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);

	vm.usePadding = vm.model.paddingCharacter ? true : false;
	vm.signFlag = vm.model.hasDecimalSign ? true : false;

	vm.resetPadding = function() {
		if (!vm.usePadding) {
			vm.model.paddingCharacter = null;
		}
	}
	
	vm.resetDecimalSign = function(){
		if (!vm.signFlag) {
			vm.model.hasDecimalSign = false;
		}
	}
} ]);