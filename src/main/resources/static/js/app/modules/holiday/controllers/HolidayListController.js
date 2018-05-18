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
	    vm.canManage = false;
	    vm.unauthenManage = function() {
            if (vm.canManage) {
                return false;
            } else {
                return true;
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
	    
	    vm.deleteAccount = function (record) {
			var preCloseCallback = function (confirm) {
				loadTableData();
			}

			UIFactory.showConfirmDialog({
				data: {
					headerMessage: 'Confirm delete?'
				},
				confirm: function () {
					return AccountService.deleteAccountOwner(vm.criteria.organizeId, record);
				},
				onFail: function (response) {
					var msg = {
						404: 'Organization account has been deleted.',
						405: 'Organization account has been used.'
					};
					UIFactory.showFailDialog({
						data: {
							headerMessage: 'Delete organization account fail.',
							bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
						}
					});
				},
				onSuccess: function (response) {
					UIFactory.showSuccessDialog({
						data: {
							headerMessage: 'Delete organization account success.',
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