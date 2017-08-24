'use strict';
var module = angular.module('gecscf.organize.configuration');
module.controller('TextLayoutConfigController', [ '$scope', '$log',
		'UIFactory', function($scope, $log, UIFactory) {
				this.model = angular.copy($scope.ngDialogData.record);
		} ]);