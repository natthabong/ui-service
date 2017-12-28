'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BankHolidayController', [
	'$scope',
	'$stateParams',
	'$log',
	'$q',
	'$rootScope',
	'$http',
	'Service',
	'SCFCommonService',
	'UIFactory',
	'PagingController',
	function($scope, $stateParams, $log, $q, $rootScope, $http, Service,
		SCFCommonService, UIFactory, PagingController) {

	    var vm = this;
	    var log = $log;

	    vm.yearDropDownItems = [];
	    vm.criteria = {
			year : null
	    }

	    vm.dataTable = {
			identityField : 'holidayDate',
			columns : [ {
			    fieldName : '$rowNo',
			    labelEN : 'No.',
			    labelTH : 'ลำดับที่',
			    sortable : false,
			    cssTemplate : 'text-right'
			}, {
			    fieldName : 'holidayDate',
			    labelEN : 'Date',
			    labelTH : 'วันที่',
			    sortable : false,
			    filterType : 'date',
			    format: 'EEEE d LLLL',
			    cssTemplate : 'text-left'
			}, {
			    fieldName : 'holidayName',
			    labelEN : 'Description',
			    labelTH : 'คำอธิบาย',
			    sortable : false,
			    cssTemplate : 'text-left'
			} ]
	    };

	    vm.pagingController = PagingController.create('api/v1/holidays',
		    vm.criteria, 'GET');

	    vm.searchHoliday = function(pagingModel) {
	    	vm.pagingController.search(pagingModel);
	    }

	    var loadAllYears = function(callback) {
			var diferred = Service.doGet('api/holidays/all-years');
			diferred.promise.then(function(response) {
				var currentYear = new Date().getFullYear();
				var i = 0;
				var currentYearIndex = -1;
			    response.data.forEach(function(year) {
					vm.yearDropDownItems.push({
					    label : year,
					    value : year,
					    valueObject : year
					});

					if (year === currentYear) {
						currentYearIndex = i;
					}
					++i;
			    });
			    if (vm.yearDropDownItems.length > 0) {
			    	vm.criteria.year = vm.yearDropDownItems[currentYearIndex].value;
			    }
			    callback();
			});
	    }

	    var initial = function() {
			loadAllYears(function() {
			    vm.searchHoliday();
			})
	    }

	    initial();
	}
]);