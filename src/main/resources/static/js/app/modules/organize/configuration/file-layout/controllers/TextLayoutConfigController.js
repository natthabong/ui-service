'use strict';
var module = angular.module('gecscf.organize.configuration');
module.controller('TextLayoutConfigController', ['$scope', '$log',
	'UIFactory', 'ngDialog', 'MappingDataUtils', 'MappingDataService', 
		function ($scope, $log, UIFactory, ngDialog, MappingDataUtils, MappingDataService) {
		var vm = this;
		vm.expected = false;
		vm.openExpectedValueField = true;
		vm.openExpectedInField = false;
		vm.model = angular.copy($scope.ngDialogData.record);
		console.log(vm.model)
		var ownerId = '00020330';
		var accountingTransactionType = 'PAYABLE';
		
		vm.loadMappingData = function(){
			var deffered = MappingDataService.loadMappingData(ownerId,accountingTransactionType);
			deffered.promise.then(function(response) {
				vm.mappingData = response.data;
				console.log(vm.mappingData)
			}).catch(function(response) {

			});
		}
		
		var init = function(){
			vm.loadMappingData();
		}();

		vm.newMapping = function () {
			MappingDataUtils.showCreateMappingDataDialog({
				data: {
					ownerId: ownerId,
					accountingTransactionType: accountingTransactionType
				},
				preCloseCallback: function () {
					// loadData();
				}
			});
		}

	}]);