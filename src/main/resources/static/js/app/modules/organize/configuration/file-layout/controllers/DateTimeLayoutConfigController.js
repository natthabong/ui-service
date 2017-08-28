'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.controller('DateTimeLayoutConfigController', [ '$scope', '$rootScope', '$q', 'Service', function($scope, $rootScope, $q, Service) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);
	vm.config = $scope.ngDialogData.config;
	var headerItems = $scope.ngDialogData.headerItems;

	vm.requiredRelationalOperators = false;
	vm.relationalOperators = [];
	vm.loadRelationalOperator = function() {

		var diferred = $q.defer();
		vm.relationalOperators = [];

		var serviceUrl = 'js/app/sponsor-configuration/file-layouts/date_relational_operators.json';
		var serviceDiferred = Service.doGet(serviceUrl);
		serviceDiferred.promise.then(function(response) {
			var dateRelationalOperatorList = response.data;
			if (dateRelationalOperatorList !== undefined) {
				dateRelationalOperatorList.forEach(function(obj) {
					var selectObj = {
						label : obj.dateRelationalOperatorName,
						value : obj.dateRelationalOperatorId
					}
					vm.relationalOperators.push(selectObj);
				});
				if (vm.model.recordType == 'FOOTER') {
					var equalToHeadderField = {
						label : 'Equal to header field',
						value : 'EQUAL_TO_HEADER_FIELD'
					}
					vm.relationalOperators.push(equalToHeadderField);
				}
				vm.selectedRelationalOperators = vm.relationalOperators[0].value;
				initDateTime();
			}
			diferred.resolve(vm.relationalOperators);

		}).catch(function(response) {
			$log.error('Load relational operators format Fail');
			diferred.reject();
		});
	}

	vm.relationalField = [];
	var pleaseSelect = {
		label : 'Please select',
		value : null
	}
	vm.relationalField.push(pleaseSelect);

	vm.calendarType = {
		christCalendar : 'A.D.',
		buddhistCalendar : 'B.E.'
	};

	vm.defaultCalendarType = function() {
		if (angular.isUndefined(vm.model.calendarEra)
			|| vm.model.calendarEra == null
			|| vm.model.calendarEra.length == 0) {
			vm.model.calendarEra = vm.calendarType.christCalendar;
			vm.model.datetimeFormat = 'dd/MM/yyyy';
		}
	};

	vm.exampleDateTime = Date.parse('04/13/2016 13:30:55');

	vm.loadDateTimeFormat = function() {

		var diferred = $q.defer();
		vm.dateTimeDropdown = [];

		var serviceUrl = 'js/app/sponsor-configuration/file-layouts/date_time_format.json';
		var serviceDiferred = Service.doGet(serviceUrl);
		serviceDiferred.promise.then(function(response) {
			var dateTimeDropdownList = response.data;
			if (dateTimeDropdownList !== undefined) {
				dateTimeDropdownList.forEach(function(obj) {
					var selectObj = {
						label : obj.dateTimeName,
						value : obj.dateTimeId
					}
					vm.dateTimeDropdown.push(selectObj);
				});
			}
			diferred.resolve(vm.dateTimeDropdown);

		}).catch(function(response) {
			$log.error('Load date time format Fail');
			diferred.reject();
		});
		return diferred;
	};

	vm.loadDateTimeFormat();
	vm.defaultCalendarType();
	vm.loadRelationalOperator();

	vm.disableRelationDropdown = function() {
		var isDisable = false;
		if (vm.selectedRelationalOperators == 'EQUAL_TO_HEADER_FIELD' && vm.requiredRelationalOperators) {
			isDisable = false;
		} else {
			isDisable = true;
		}
		return isDisable;
	};

	vm.saveDateTimeValidation = function() {
		
		if(vm.requiredRelationalOperators){
			vm.model.validationType = vm.selectedRelationalOperators;
			if(vm.selectedRelationalOperators == 'EQUAL_TO_HEADER_FIELD'){
				vm.relationalField.forEach(function(dropdownItem) {			
					if(vm.selectedRelationalField == dropdownItem.label){
						vm.model.validationRecordFieldConfig = dropdownItem.item;
					}
				});		
			}else{
				vm.model.validationRecordFieldId = null;
				vm.model.validationRecordFieldConfig = null;
			}
		}else{
			vm.model.validationType = null;
		}
		
	}
	
	vm.clearRelationField = function(){
		vm.selectedRelationalField = null;
	}

	var headerDatetimeList = function() {		
		headerItems.forEach(function(item) {
			if (item.completed && item.dataType == 'DATE_TIME') {
				var itemDropdown = {
					label : item.displayValue,
					value : item.displayValue,
					item: item
				}
				vm.relationalField.push(itemDropdown);
			}
		});
	}
	headerDatetimeList();
	
	var initDateTime = function(){
		if(angular.isDefined(vm.model.validationType) && vm.model.validationType != null){
			 vm.selectedRelationalOperators = vm.model.validationType;
			 vm.requiredRelationalOperators = true;
		}
		
		if(angular.isDefined(vm.model.validationRecordFieldConfig) && vm.model.validationRecordFieldConfig != null){			
			vm.selectedRelationalField = vm.model.validationRecordFieldConfig.displayValue;
		}
	}
	
	
} ]);