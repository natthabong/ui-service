'use strict';
var module = angular.module('gecscf.organize.configuration');
module.controller('TextLayoutConfigController', ['$scope', '$log',
	'UIFactory', 'ngDialog', function ($scope, $log, UIFactory, ngDialog) {
		var vm = this;
		vm.expected = false;
		vm.openExpectedValueField = true;
		vm.openExpectedInField = false;
		vm.model = angular.copy($scope.ngDialogData.record);

		vm.newMapping = function() {
			var dialog = ngDialog.open({
				template: 'js/app/modules/organize/configuration/file-layout/templates/dialog-new-mapping.html',
				controller: 'TextLayoutConfigController',
				controllerAs: 'ctrl',
				data: {

				},
				preCloseCallback: function(value) {

				}
			});
		}

		vm.submit = function() {
			console.log(vm.model)
		}
	}]);