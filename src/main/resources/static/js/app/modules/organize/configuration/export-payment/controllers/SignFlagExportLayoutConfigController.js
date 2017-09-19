'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.controller("SignFlagExportLayoutConfigController", [ '$scope', '$rootScope', '$q', 'Service', '$filter', function($scope, $rootScope, $q, Service, $filter) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	vm.model.positiveFlag = vm.model.positiveFlag ? vm.model.positiveFlag : 0;
	vm.model.negativeFlag = vm.model.negativeFlag ? vm.model.negativeFlag : 1;
} ]);
