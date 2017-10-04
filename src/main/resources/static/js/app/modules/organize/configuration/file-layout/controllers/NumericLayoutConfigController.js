'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');

module.controller('NumericLayoutConfigController', 
	[ '$scope', '$rootScope', '$q', 'Service', '$filter', '$log', 'MappingDataService', 
	function($scope, $rootScope, $q, Service, $filter, $log, MappingDataService) {

	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	
	vm.config = $scope.ngDialogData.config;
	var headerItems = $scope.ngDialogData.headerItems;
	var detailItems = $scope.ngDialogData.detailItems;
	var footerItems = $scope.ngDialogData.footerItems;
	var dataTypeByIds = $scope.ngDialogData.dataTypeByIds;
	var accountingTransactionType = $scope.ngDialogData.processType == 'AP_DOCUMENT' ? 'PAYABLE' : 'RECEIVABLE';
	var owner = $scope.ngDialogData.owner;
	
	vm.requiredRelationalSummary = false;
	vm.relationalSummary = [];
	var diferred = $q.defer();
		
	var serviceUrl = 'js/app/modules/organize/configuration/file-layout/data/numeric_relational_summary.json';
	var serviceDiferred = Service.doGet(serviceUrl);
	serviceDiferred.promise.then(function(response) {
		var dateRelationalSummaryList = response.data;
		if (dateRelationalSummaryList !== undefined) {
			dateRelationalSummaryList.forEach(function(obj) {
				var selectObj = {
					label : obj.dateRelationalSummaryName,
					value : obj.dateRelationalSummaryId
				}
				vm.relationalSummary.push(selectObj);
			});
			if(vm.model.validationType == null){
				vm.selectedRelationalSummary = vm.relationalSummary[0].value;
			}else{
				vm.requiredRelationalSummary = true;
				vm.selectedRelationalSummary = vm.model.validationType;
			}
		}
		diferred.resolve(vm.relationalOperators);

	}).catch(function(response) {
		$log.error('Load relational operators format Fail');
		diferred.reject();
	});

	vm.clearRelationField = function(){
		vm.selectedRelationalField = null;
	}
	
	vm.numericeModel = {
		numericTypeFormat : '',
		signFlagTypeFormat : '',
		disableCustomField : true,
		usePadding : false,
		signFlag : '',
		signFlagId : null
	}

	vm.numericType = {
		anyNumericFormat : 'ANY',
		customNumericFormat : 'CUSTOM'
	}

	vm.signFlagType = {
		ignorePlusSymbol : 'IGNORE_PLUS',
		needPlusSymbol : 'NEES_PLUS',
		avoidPlusSymbol : 'AVOID_PLUS'
	}

	vm.checkCustomNumeric = function() {
		if (vm.numericeModel.numericTypeFormat == 'ANY') {
			vm.numericeModel.disableCustomField = true;
			vm.numericeModel.usePadding = false;

			vm.model.has1000Separator = null;
			vm.model.hasDecimalPlace = null;
			vm.model.decimalPlace = 2;
			vm.model.paddingCharacter = null;
		} else if (vm.numericeModel.numericTypeFormat == 'CUSTOM') {
			vm.numericeModel.disableCustomField = false;
		}
	};

	vm.loadSignFlagList = function() {
		var diferred = $q.defer();
		vm.signFlagDropdown = [];

		var serviceUrl = 'js/app/modules/organize/configuration/file-layout/data/sign_flag_list.json';
		var serviceDiferred = Service.doGet(serviceUrl);
		serviceDiferred.promise.then(function(response) {

			var signFlagList = response.data;
			if (signFlagList !== undefined) {
				signFlagList.forEach(function(obj) {
					var selectObj = {
						label : obj.signFlagName,
						value : obj.signFlagName
					}
					vm.signFlagDropdown.push(selectObj);
				});
				
				if(vm.model.signFlagConfig != null){
					vm.numericeModel.signFlag = vm.signFlagDropdown[1].value;
					vm.numericeModel.signFlagId = vm.model.signFlagConfig.displayValue;
				}else{
					if(vm.model.expectedValue == null && vm.model.validationType == null){
						vm.numericeModel.signFlag = vm.signFlagDropdown[0].value;
					}else{
						vm.numericeModel.signFlag = vm.signFlagDropdown[1].value;
						vm.numericeModel.signFlagId = vm.model.expectedValue;
					}
				}		
			}
			diferred.resolve(vm.signFlagDropdown);
		}).catch(function(response) {
			$log.error('Load date time format Fail');
			diferred.reject();
		});
		return diferred;
	}
	
	vm.loadSignFlagFieldList = function() {
		var diferred = $q.defer();
		vm.signFlagFieldDropdown = [];
		var pleaseSelect = {
				label : 'Please select',
				value : null,
				item: null			
		}
		vm.signFlagFieldDropdown.push(pleaseSelect);
		vm.numericeModel.signFlagId = null;		
		
		if(vm.model.recordType == 'HEADER'){
			headerFlagList();
		}else if(vm.model.recordType == 'FOOTER'){
			footerFlagList();
		}else{
			detailFlagList();
		}
	}

	vm.signFlagDataChange = function() {
		
		vm.numericeModel.signFlagId = null;
		vm.model.signFlagTypeFormat = null;
		
		if(vm.numericeModel.signFlag == vm.signFlagDropdown[1].value){
			vm.loadSignFlagFieldList();
			vm.numericeModel.signFlagId = vm.signFlagFieldDropdown[0].value;
		}else if(vm.numericeModel.signFlag == vm.signFlagDropdown[0].value){
			vm.numericeModel.signFlagTypeFormat = vm.signFlagType.ignorePlusSymbol;
		}
	}
	
	var headerFlagList = function() {		
		headerItems.forEach(function(item , index) {
			var dataType = dataTypeByIds[item.documentFieldId];
			if (dataType.dataType == 'SIGN_FLAG') {
				var itemDropdown = {
					label : item.displayValue,
					value : item.displayValue,
					item: item
				}
				vm.signFlagFieldDropdown.push(itemDropdown);
			}
		});		
	}
	
	var detailFlagList = function() {
		detailItems.forEach(function(item , index) {
			var dataType = dataTypeByIds[item.documentFieldId];
			if (dataType.dataType == 'SIGN_FLAG' || (dataType.dataType == 'TEXT' && item.expectedValue != null && item.validationType == 'IN_MAPPING_TYPE_SIGN_FLAG')) {
				var itemDropdown = {
					label : item.displayValue,
					value : item.displayValue,
					item: item
				}
				vm.signFlagFieldDropdown.push(itemDropdown);
			}
		});
	}

	var footerFlagList = function() {		
		footerItems.forEach(function(item , index) {
			var dataType = dataTypeByIds[item.documentFieldId];
			if (dataType.dataType == 'SIGN_FLAG') {
				var itemDropdown = {
					label : item.displayValue,
					value : item.displayValue,
					item: item
				}
				vm.signFlagFieldDropdown.push(itemDropdown);
			}
		});	
	}

	
	vm.relationalField = [];
	var pleaseSelect = {
			label : 'Please select',
			value : null
	}	
	vm.relationalField.push(pleaseSelect);
	
	vm.detailNumericList = function() {
		var diferred = $q.defer();
		vm.relationalField = [];
		var pleaseSelect = {
				label : 'Please select',
				value : null
		}	
		vm.relationalField.push(pleaseSelect);
		
		detailItems.forEach(function(item , index) {
			var dataType = dataTypeByIds[item.documentFieldId];
			if (dataType.dataType == 'NUMERIC') {
				var itemDropdown = {
					label : item.displayValue,
					value : item.displayValue,
					item: item
				}
				vm.relationalField.push(itemDropdown);
			}
		});
		
		diferred.resolve(vm.relationalField);
		return diferred;
	}

	vm.initLoad = function() {
		if (isDefaultCusomNumeric(vm.model)) {
			vm.numericeModel.numericTypeFormat = vm.numericType.customNumericFormat;
		} else {
			vm.numericeModel.numericTypeFormat = vm.numericType.anyNumericFormat;
		}
		
		vm.checkCustomNumeric();
		vm.loadSignFlagList();
		vm.loadSignFlagFieldList();
		vm.detailNumericList();
		
		if (vm.model.signFlagConfig == null) {
				vm.numericeModel.signFlag = "Within field";
				if (isValueEmpty(vm.model.hasDecimalSign)) {
					vm.numericeModel.signFlagTypeFormat = vm.signFlagType.ignorePlusSymbol;
				}else if(vm.model.hasDecimalSign == true){
					vm.numericeModel.signFlagTypeFormat = vm.signFlagType.needPlusSymbol;
				}else{
					vm.numericeModel.signFlagTypeFormat = vm.signFlagType.avoidPlusSymbol;
				}
		}else{
			vm.numericeModel.signFlag = "Sign flag field";
			vm.numericeModel.signFlagId = vm.model.signFlagConfig;
		}

		if(angular.isDefined(vm.model.validationRecordFieldConfig) && vm.model.validationRecordFieldConfig != null && vm.model.validationType != null){
			vm.requiredRelationalSummary = true;
			vm.selectedRelationalSummary = vm.model.validationType;
			vm.selectedRelationalField = vm.model.validationRecordFieldConfig.displayValue;
		}	

	}

	function mapSignFlag(signFlagConfig){
		console.log(signFlagConfig);
	} 

	vm.changeDropDown = function(){
		console.log(vm.numericeModel.signFlagId);
	}
	
	vm.initLoad();
	
	vm.disableRelationDropdown = function() {
		var isDisable = false;
		if (vm.selectedRelationalSummary == 'SUMMARY_OF_FIELD' && vm.requiredRelationalSummary) {
			isDisable = false;
		} else {
			isDisable = true;
		}
		return isDisable;
	};

	vm.resetPadding = function() {
		if (!vm.numericeModel.usePadding) {
			vm.model.paddingCharacter = null;
		}
	}
	
	vm.saveNumericValidation = function() {
		if(vm.numericeModel.signFlag == 'Within field'){
			vm.model.signFlagConfig = null;
			
			if(vm.numericeModel.signFlagTypeFormat == vm.signFlagType.ignorePlusSymbol){
				vm.model.hasDecimalSign = null;
			}else if(vm.numericeModel.signFlagTypeFormat == vm.signFlagType.needPlusSymbol){
				vm.model.hasDecimalSign = true;
			}else{
				vm.model.hasDecimalSign = false;
			}
			
		}else{
			vm.model.hasDecimalSign = null;
			vm.model.signFlagTypeFormat = null;
			vm.signFlagFieldDropdown.forEach(function(dropdownItem) {
				if(vm.numericeModel.signFlagId == dropdownItem.value){
					if(typeof dropdownItem.item === "object"){
						vm.model.signFlagConfig = dropdownItem.item;
						vm.model.validationType = null;
					}else{
						vm.model.expectedValue = vm.numericeModel.signFlagId;
						vm.model.validationType = "IN_MAPPING_TYPE_AMOUNT";
						vm.model.signFlagConfig = null;
					}
					
				}
			});
		}
		console.log(vm.model);

		if(vm.requiredRelationalSummary){
			vm.model.validationType = vm.selectedRelationalSummary;
			if(vm.selectedRelationalSummary == 'SUMMARY_OF_FIELD'){
				vm.relationalField.forEach(function(dropdownItem) {			
					if(vm.selectedRelationalField == dropdownItem.value){
						vm.model.validationRecordFieldConfig = dropdownItem.item;
					}
				});		
			}else{
				vm.model.validationRecordFieldId = null;
				vm.model.validationRecordFieldConfig = null;
			}
		}else{
			vm.model.validationType = vm.model.validationType == 'IN_MAPPING_TYPE_AMOUNT' ? 'IN_MAPPING_TYPE_AMOUNT' : null;
			vm.model.validationRecordFieldConfig = null;
		}
	}
	
	var defaultExampleValue = vm.config.defaultExampleValue;
	$scope.$watch('ctrl.model', function() {
		vm.examplePosDataDisplay = parseFloat(defaultExampleValue).toFixed(vm.model.decimalPlace);
		vm.exampleNegDataDisplay = parseFloat(-defaultExampleValue).toFixed(vm.model.decimalPlace);
	}, true);

	function isDefaultCusomNumeric(model) {
		var isCustomField = false;
		if (!isValueEmpty(model.paddingCharacter)) {
			isCustomField = true;
			vm.numericeModel.usePadding = true;
		}

		if (model.has1000Separator) {
			isCustomField = true;
		}

		if (model.hasDecimalPlace) {
			isCustomField = true;
		}
		return isCustomField;
	}

	function isValueEmpty(value) {
		if (angular.isUndefined(value) || value == null || value.length == 0) {
			return true;
		}
		return false;
	}

} ]);