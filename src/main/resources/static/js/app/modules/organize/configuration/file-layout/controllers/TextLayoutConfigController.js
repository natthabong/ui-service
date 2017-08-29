'use strict';
var module = angular.module('gecscf.organize.configuration');
module.controller('TextLayoutConfigController', ['$scope', '$log',
	'UIFactory', 'ngDialog', 'MappingDataUtils', 'MappingDataService', 'FileLayoutService','PageNavigation',
		function ($scope, $log, UIFactory, ngDialog, MappingDataUtils, MappingDataService, FileLayoutService,PageNavigation) {
		var vm = this;
		var log = $log;

		vm.expected = false;
		vm.openExpectedValueField = true;
		vm.openExpectedInField = false;

		vm.model = angular.copy($scope.ngDialogData.record);
		console.log(vm.model)
		console.log($scope.record)
		var owner = angular.copy($scope.ngDialogData.owner);
		var processType = angular.copy( $scope.ngDialogData.processType);
		var accountingTransactionType = processType == "AP_DOCUMENT" ? "PAYABLE" : "RECEIVABLE";

		vm.mappingToDropDown = [];

		vm.expectedInDropDown = [
			{
				label : "Please select",
				value : ''
			}
		];


		// mappingToFieldName
		
		vm.loadMappingData = function(){
			var deffered = MappingDataService.loadMappingData(owner,accountingTransactionType);
			deffered.promise.then(function(response) {
				var expectedInData = response.data;
				console.log(expectedInData)
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
				console.log(mappingTo)
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
					ownerId: owner,
					accountingTransactionType: accountingTransactionType
				},
				preCloseCallback: function (response) {
					console.log(response)
					vm.expectedInDropDown = [
						{
							label : "Please select",
							value : ''
						}
					];
					vm.loadMappingData();
				}
			});
		}

	}]);