'use strict';
var module = angular.module('gecscf.organize.configuration');
module.controller('TextLayoutConfigController', ['$scope', '$log',
	'UIFactory', 'ngDialog', 'MappingDataUtils', 'MappingDataService', 'FileLayoutService','PageNavigation','SCFCommonService',
		function ($scope, $log, UIFactory, ngDialog, MappingDataUtils, MappingDataService, FileLayoutService,PageNavigation,SCFCommonService) {
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
				
		var validationTypeText = "IN_MAPPING_TYPE_TEXT";
		var validationTypeSignFlag = "IN_MAPPING_TYPE_SIGN_FLAG";

		var expectedInMapping =  (vm.model.validationType == validationTypeText || vm.model.validationType == validationTypeSignFlag);
		
		vm.expected = angular.isDefined(vm.model.expectedValue) && vm.model.expectedValue != null ? true : false;
		vm.openExpectedValueField = expectedInMapping  ? false : true;
		
		vm.expectedInDataList = [];

		vm.expectedInValue = expectedInMapping ? angular.copy(vm.model.expectedValue) : null;
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
			var mappingTypeList = ["SIGN_FLAG_MAPPING","TEXT_MAPPING"];
			var deffered = SCFCommonService.loadMappingData(owner,accountingTransactionType,mappingTypeList);
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
			var deffered = FileLayoutService.loadDataMappingToDropDown(vm.model.recordType);
			deffered.promise.then(function(response) {
				var mappingTo = response.data;
				mappingTo.forEach(function(data){
					vm.mappingToDropDown.push({
						label:data.displayFieldName,
						value:data.documentFieldId
					});
				});
				if(angular.isUndefined(vm.model.mappingToFieldName)){
					vm.model.mappingToFieldName = null;
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

			if(vm.mappingType == 'TEXT_MAPPING'){
				vm.model.validationType = validationTypeText;
			}else if(vm.mappingType == 'SIGN_FLAG_MAPPING'){
				vm.model.validationType = validationTypeSignFlag;
			}
			vm.error.msg = null;
			vm.error.require = false;
			vm.error.duplicate = false;
		}

		vm.changeExpected = function(){
			vm.model.mappingToFieldName = null;
			vm.expectedInValue = null;
			vm.expectedValue = null;
			vm.mappingType = null;
		}

		vm.newMapping = function () {
			MappingDataUtils.showCreateMappingDataDialog({
				data: {
					ownerId: owner,
					accountingTransactionType: accountingTransactionType,
					showAll: true
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
			if((!vm.openExpectedValueField) && (vm.expectedInValue == null || vm.expectedInValue == '') && vm.expected){
				vm.error.msg = "Expected in is required.";
				vm.error.expectedInRequire = true;
				valid = false;
			}

			// //Check duplicate
			if(valid){
				if(!vm.openExpectedValueField && vm.expected){
					var count = 0;
					fieldList.forEach(function(data){
						if((data.validationType == validationTypeText||data.validationType == validationTypeSignFlag) && data.expectedValue == vm.expectedInValue){
							count++;
						}
					})
					if(count != 0){
						vm.error.msg = "Expected in is duplicate.";
						vm.error.expectedInRequire = true;
						valid = false;
					}
				}
			}

			//Check required
			if(valid){
				if((angular.isUndefined(vm.model.mappingToFieldName) || vm.model.mappingToFieldName == null || vm.model.mappingToFieldName == '') 
					&& (!vm.openExpectedValueField) && vm.expected){
					vm.error.msg = "Mapping to is required.";
					vm.error.mappingToRequire = true;
					valid = false;
				}
			}

			//Check duplicate
			if(valid){
				if(!vm.openExpectedValueField && vm.expected){
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