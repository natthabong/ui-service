'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.controller('DateTimeExportLayoutConfigController', [ '$scope', '$rootScope', '$q', 'Service','$log', function($scope, $rootScope, $q, Service, $log) {
	var vm = this;
	vm.model = angular.copy($scope.ngDialogData.record);

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
} ]);