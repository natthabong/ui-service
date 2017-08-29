'use strict';
var module = angular.module('gecscf.organize.configuration');
module.controller('TextLayoutConfigController', ['$scope', '$log',
	'UIFactory', 'ngDialog', 'MappingDataUtils', 'MappingDataService', 'FileLayoutService',
		function ($scope, $log, UIFactory, ngDialog, MappingDataUtils, MappingDataService, FileLayoutService) {
		var vm = this;
		var log = $log;

		vm.expected = false;
		vm.openExpectedValueField = true;
		vm.openExpectedInField = false;

		vm.model = angular.copy($scope.ngDialogData.record);
		// console.log(vm.model)
		var ownerId = '00020330';
		var accountingTransactionType = 'PAYABLE';
		vm.mappingToDropDown = [];

		vm.expectedInDropDown = [
			{
				label : "Please select",
				value : ''
			}
		];
		
		vm.loadMappingData = function(){
			var deffered = MappingDataService.loadMappingData(ownerId,accountingTransactionType);
			deffered.promise.then(function(response) {
				var expectedInData = response.data;
				expectedInData.forEach(function(data){
					vm.expectedInDropDown.push({
						label : data.mappingDataName,
						value : data.mappingDataId
					});
				});
			}).catch(function(response) {
				log.error("Can not load mapping data!");
			});
		}

		vm.loadDataMappingTo = function(){
			var deffered = FileLayoutService.loadDataMappingTo();
			deffered.promise.then(function(response) {
				var mappingTo = response.data;
				mappingTo.forEach(function(data){
					vm.mappingToDropDown.push({
						label:data.displayFieldName,
						value:data.layoutFileDataTypeId
					});
				});
			}).catch(function(response) {
				log.error("Can not load mapping data to!");
			});
		}
		
		var init = function(){
			vm.loadMappingData();
			vm.loadDataMappingTo();
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