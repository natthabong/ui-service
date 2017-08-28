'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.controller('RecordTypeLayoutConfigController', [ '$scope', '$rootScope', function($scope, $rootScope) {
	this.model = angular.copy($scope.ngDialogData.record);
	this.model.required = true;
} ]);
