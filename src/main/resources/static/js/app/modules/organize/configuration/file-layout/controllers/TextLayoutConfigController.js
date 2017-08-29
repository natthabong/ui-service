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
		vm.expectedInDataList = [];
		vm.expectedInValue = null;
		vm.mappingType = null;

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

		
		
		vm.loadMappingData = function(newData){
			var deffered = MappingDataService.loadMappingData(owner,accountingTransactionType);
			deffered.promise.then(function(response) {
				vm.expectedInDataList = response.data;
				console.log(vm.expectedInDataList)
				vm.expectedInDataList.forEach(function(data){
					vm.expectedInDropDown.push({
						label : data.mappingDataName,
						value : data.mappingDataId
					});
				});
				if(angular.isDefined(newData)){
					vm.expectedInValue = newData.toString();
					vm.changeExpectedInValue();
				}else{
					vm.expectedInValue = null;
				}
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
				vm.model.mappingToFieldName = vm.mappingToDropDown[0].value.toString();
				
			}).catch(function(response) {
				log.error("Can not load mapping data to!");
			});
		}
		
		var init = function(){
			vm.loadMappingData();
			vm.loadDataMappingTo();
		}();

		vm.clearExpectedValue = function(){
			vm.model.expectedValue = null;
			vm.expectedInValue = null;
			vm.mappingType = null;
		}
		
		vm.changeExpectedInValue = function(){
			vm.mappingType = null;
			vm.expectedInDataList.forEach(function(data){
				if(data.mappingDataId == vm.expectedInValue){
					vm.mappingType = data.mappingType;
				}
			})
		}

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
					var newData = response.data.mappingDataId;
					vm.loadMappingData(newData);
					vm.changeExpectedInValue();
				}
			});
		}

	}]);