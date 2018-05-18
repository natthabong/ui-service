'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BankHolidayListController', [
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
	    var viewMode = $stateParams.viewMode;
	    vm.today = new Date();
	    vm.today.setHours(0,0,0,0);
	    vm.canManage = false;
	    vm.unauthenManage = function() {
            if (vm.canManage) {
                return false;
            } else {
                return true;
            }
        }
	    
	    vm.canDelete = function(date) {
	    	var holidayDate = new Date(date);
	    	holidayDate.setHours(0,0,0,0);
	    	var sameDay = vm.today.getTime() === holidayDate.getTime();

            if (vm.canManage && !sameDay) {
                return true;
            } else {
                return false;
            }
        }
	    
	    vm.showLender = false;
	    vm.lenderDropDownItems = [];
	    vm.yearDropDownItems = [];
	    vm.criteria = {
	    	fundingId: null,
			year : null
	    }

	    vm.pagingController = PagingController.create('api/v1/holidays',
		    vm.criteria, 'GET');

	    vm.searchHoliday = function(pagingModel) {
	    	vm.pagingController.search(pagingModel);
	    }
	    
	    var loadAllLender = function() {
			var diferred = Service.doGet('api/v1/fundings');
			diferred.promise.then(function(response) {
			    response.data.forEach(function(lender) {
					vm.lenderDropDownItems.push({
					    label : lender.fundingName,
					    value : lender.fundingId,
					    valueObject : lender.fundingId
					});
			    });
			    vm.criteria.fundingId = vm.lenderDropDownItems[0].value;
			    vm.loadAllYears();
			});
	    }
	    
	    vm.loadAllYears = function() {
	    	vm.yearDropDownItems = [];
			var diferred = Service.doGet('api/v1/holidays/all-years', vm.criteria);
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
			    	if(currentYearIndex == -1){
			    		currentYearIndex = 0;
			    	}
			    	vm.criteria.year = vm.yearDropDownItems[currentYearIndex].value;
			    }
			    
    			vm.searchHoliday();
			});
	    }
	    
	    vm.openPopupHoliday = function (record) {
			UIFactory.showDialog({
				templateUrl: '/js/app/modules/holiday/templates/dialog-new-holiday.html',
				controller: 'BankHolidayController',
				data: {
					holiday: record
				},
				preCloseCallback: function (data) {
					if (data) {
						initial();
					}
				}
			});
		}
	    
	    vm.deleteHoliday = function (holiday) {
			var preCloseCallback = function (confirm) {
				initial();
			}

			UIFactory.showConfirmDialog({
				data: {
					headerMessage: 'Confirm delete?'
				},
				confirm: function () {
					return BankHolidayService.deleteHoliday({
						holidayDate: holiday.holidayDate,
						version: holiday.version
					});
				},
				onFail: function (response) {
					var msg = {
							409: 'Holiday has been modified.',
							404: 'Holiday has been deleted.',
							406: 'Cannot delete current date.'
					};
					UIFactory.showFailDialog({
						data: {
							headerMessage: 'Delete holiday fail.',
							bodyMessage: msg[response.status] ? msg[response.status]
								: response.data.message
						},
						preCloseCallback: preCloseCallback
					});
				},
				onSuccess: function (response) {
					UIFactory.showSuccessDialog({
						data: {
							headerMessage: 'Delete holiday success.',
							bodyMessage: ''
						},
						preCloseCallback: preCloseCallback
					});
				}
			});
		}

	    var initial = function() {
	    	if(viewMode == 'FUNDING'){
	    		vm.loadAllYears();
	    	}else{
		    	loadAllLender();
	    	}
	    }

	    initial();
	}
]);