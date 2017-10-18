'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');

module.controller('NumericExportLayoutConfigController', 
	[ '$scope', '$rootScope', '$q', 'Service', '$filter', '$log', 
	function($scope, $rootScope, $q, Service, $filter, $log) {

	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	
	if(!$scope.ngDialogData.isDelimited){
		if(vm.model.paddingCharacter.length == 0){
			vm.model.paddingCharacter = "0";
			vm.usePadding = true;
		}else{
			vm.usePadding = vm.model.paddingCharacter ? true : false;
		}
	}else{
		vm.model.paddingCharacter = "";
		vm.usePadding = false;
	}
	
	vm.signFlag = vm.model.hasDecimalSign ? true : false;

	vm.resetDecimalSign = function(){
		if (!vm.signFlag) {
			vm.model.hasDecimalSign = false;
		}
	}
} ]);