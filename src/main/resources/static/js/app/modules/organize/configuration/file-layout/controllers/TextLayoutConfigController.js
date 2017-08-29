'use strict';
var module = angular.module('gecscf.organize.configuration');
module.controller('TextLayoutConfigController', ['$scope', '$log',
	'UIFactory', 'ngDialog', 'MappingDataUtils', 'MappingDataService', 'FileLayoutService','PageNavigation',
		function ($scope, $log, UIFactory, ngDialog, MappingDataUtils, MappingDataService, FileLayoutService,PageNavigation) {
		var vm = this;
		var log = $log;

		vm.error ={
			msg : null
		}

		vm.model = angular.copy($scope.ngDialogData.record);
		var detailItems = angular.copy($scope.ngDialogData.detailItems);
		var headerItems = angular.copy($scope.ngDialogData.headerItems);
		var footerItems = angular.copy($scope.ngDialogData.footerItems);
		var index = angular.copy($scope.ngDialogData.index);
		var fieldList = [];
		
		var validationType = "IN_MAPPING_TYPE";

		vm.expected = angular.isDefined(vm.model.expectedValue) ? true : false;
		vm.openExpectedValueField = vm.model.validationType == validationType ? false : true;
		
		vm.expectedInDataList = [];

		vm.expectedInValue = vm.model.validationType == validationType ? angular.copy(vm.model.expectedValue) : null;
		vm.expectedValue = vm.model.validationType == null ? angular.copy(vm.model.expectedValue) : null;

		vm.mappingType = null;

		var owner = angular.copy($scope.ngDialogData.owner);
		var processType = angular.copy( $scope.ngDialogData.processType);
		var accountingTransactionType = processType == "AP_DOCUMENT" ? "PAYABLE" : "RECEIVABLE";

		vm.mappingToDropDown = [
			{
				label : "Please select",
				value : ''
			}
		];

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
				vm.expectedInDataList.forEach(function(data){
					vm.expectedInDropDown.push({
						label : data.mappingDataName,
						value : data.mappingDataId
					});
				});
				if(angular.isDefined(newData)){
					vm.expectedInValue = newData.toString();
					vm.changeExpectedInValue();
				}

				if(vm.expectedInValue != null){
					vm.changeExpectedInValue();
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
				if(angular.isUndefined(vm.model.mappingToFieldName)){
					vm.model.mappingToFieldName = vm.mappingToDropDown[0].value.toString();
				}
				
			}).catch(function(response) {
				log.error("Can not load mapping data to!");
			});
		}
		
		var init = function(){
			vm.loadMappingData();
			vm.loadDataMappingTo();
		}();

		vm.clearExpectedValue = function(){
			vm.expectedValue = null;
			vm.expectedInValue = null;
			vm.mappingType = null;
			vm.model.validationType = null;
			vm.error.msg = null;
			vm.error.require = false;
			vm.error.duplicate = false;
		}
		
		vm.changeExpectedInValue = function(){
			vm.mappingType = null;
			vm.expectedInDataList.forEach(function(data){
				if(data.mappingDataId == vm.expectedInValue){
					vm.mappingType = data.mappingType;
				}
			})
			vm.model.validationType = validationType;
			vm.error.msg = null;
			vm.error.require = false;
			vm.error.duplicate = false;
		}

		vm.newMapping = function () {
			MappingDataUtils.showCreateMappingDataDialog({
				data: {
					ownerId: owner,
					accountingTransactionType: accountingTransactionType
				},
				preCloseCallback: function (response) {
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

		var prepareValidDuppicate = function(){
			var temp = [];
			if(vm.model.recordType == "DETAIL"){
				for(var i=0;i<detailItems.length;i++){
					if(i!=index){
						temp.push(detailItems[i]);
					}
				}
				headerItems.forEach(function(data){
					fieldList.push(data);
				})
				footerItems.forEach(function(data){
					fieldList.push(data);
				});
				temp.forEach(function(data){
					fieldList.push(data);
				});

			}else if(vm.model.recordType == "HEADER"){
				for(var i=0;i<headerItems.length;i++){
					if(i!=index){
						temp.push(headerItems[i]);
					}
				}
				detailItems.forEach(function(data){
					fieldList.push(data);
				})
				footerItems.forEach(function(data){
					fieldList.push(data);
				});
				temp.forEach(function(data){
					fieldList.push(data);
				});
			}else{
				for(var i=0;i<footerItems.length;i++){
					if(i!=index){
						temp.push(footerItems[i]);
					}
				}
				detailItems.forEach(function(data){
					fieldList.push(data);
				})
				headerItems.forEach(function(data){
					fieldList.push(data);
				});
				temp.forEach(function(data){
					fieldList.push(data);
				});
			}
		}();

		var validate = function(){
			var valid = true;
			vm.error.msg = null;
			vm.error.expectedInRequire = false;
			vm.error.duplicate = false;
			vm.error.mappingToRequire = false;

			//Check required
			if((!vm.openExpectedValueField) && (vm.expectedInValue == null || vm.expectedInValue == '')){
				vm.error.msg = "Expected in is required.";
				vm.error.expectedInRequire = true;
				valid = false;
			}

			// //Check duplicate
			if(valid){
				var count = 0;
				fieldList.forEach(function(data){
					if(data.validationType == validationType && data.expectedValue == vm.expectedInValue){
						count++;
					}
				})
				if(count != 0){
					vm.error.msg = "Expected in is duplicate.";
					vm.error.expectedInRequire = true;
					valid = false;
				}
			}

			//Check required
			if(valid){
				if((angular.isUndefined(vm.model.mappingToFieldName) || vm.model.mappingToFieldName == null || vm.model.mappingToFieldName == '') 
					&& (!vm.openExpectedValueField)){
					vm.error.msg = "Mapping to is required.";
					vm.error.mappingToRequire = true;
					valid = false;
				}
			}

			//Check duplicate
			if(valid){
				var count = 0;
				fieldList.forEach(function(data){
					if(data.mappingToFieldName == vm.model.mappingToFieldName){
						count++;
					}
				})
				if(count != 0){
					vm.error.msg = "Mapping to is duplicate.";
					vm.error.duplicate = true;
					valid = false;
				}
			}

			return valid;
		}

		vm.submit = function(){
			if(validate()){
				if(vm.model.validationType != null){
					vm.model.expectedValue = vm.expectedInValue;
				}else{
					vm.model.expectedValue = vm.expectedValue;
				}
				vm.model.dataType = "TEXT";
				$scope.closeThisDialog(vm.model)
			}
		}

	}]);