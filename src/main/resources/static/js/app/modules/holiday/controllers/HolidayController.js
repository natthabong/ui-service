'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BankHolidayController', ['$scope', '$stateParams', '$http', '$q', 'UIFactory', 'blockUI', 'BankHolidayService',
	function ($scope, $stateParams, $http, $q, UIFactory, blockUI, BankHolidayService) {

		var vm = this;
		var dialogData = $scope.ngDialogData;
		var holiday = dialogData.holiday;
		vm.isEditMode = true;
		if(!angular.isDefined(holiday)){
			vm.isEditMode = false;
		}
		
		vm.tomorrow = new Date();
		vm.tomorrow.setDate(vm.tomorrow.getDate() + 1);
		vm.dateFormat = "dd/MM/yyyy";
		vm.openDate = false;
		vm.openCalendarDate = function() {
			vm.openDate = true;
		}
		
		vm.getHeaderMessage = function(){
			if(!vm.isEditMode){
				return 'Add holiday';
			}else{
				return 'Edit holiday';
			}
		}
		
		vm.loadHoliday = function() {
	    	if(vm.isEditMode){
	    		vm.holiday = new Date(holiday.holidayDate);
	    		vm.holidayName = holiday.holidayName;
	    	}
		};
		vm.loadHoliday();

		var _validateHoliday = function (data) {
			$scope.errors = {};
			var valid = true;

			if (!angular.isDefined(data) || data == null || data == "") {
				valid = false;
				$scope.errors.holiday = {
					message: 'Holiday is required.'
				}
			}
			
			return valid;
		}
		
		vm.save = function (callback){
			if(!vm.isEditMode){
				vm.add(callback);
			}else{
				vm.edit(callback);
			}
		}
		
		vm.add = function (callback) {
			if (_validateHoliday(vm.holiday)) {
				var preCloseCallback = function (holiday) {
					callback(holiday);
				}
				var headerMessage = 'Confirm save?';
				var bodyMessage = null;
				UIFactory
					.showConfirmDialog({
						data: {
							headerMessage: headerMessage,
							bodyMessage: bodyMessage,
						},
						confirm: function () {
							return BankHolidayService.save({
								holidayDate: vm.holiday,
								holidayName: vm.holidayName
							});
						},
						onFail: function (response) {
							var msg = {
									400: 'Holiday is existed.',
									405: 'Holiday cannot be Sat, Sun. or less than or equal to the current date.',
									409: 'Cannot add holiday to the holiday modified list.'
							};
							UIFactory.showFailDialog({
								data: {
									headerMessage: 'Add holiday fail.',
									bodyMessage: msg[response.status] ? msg[response.status]
										: response.data.message
								}
							});
						},
						onSuccess: function (response) {
							if(response.status == 202){
								vm.add(callback);
							}else{
								UIFactory
								.showSuccessDialog({
									data: {
										headerMessage: 'Add holiday success.',
										bodyMessage: ''
									},
									preCloseCallback: function () {
										preCloseCallback(response.data);
									}
								});
							}
						}
					});
			}
		}
		
		vm.edit = function(callback){
			var preCloseCallback = function (holiday) {
				callback(holiday);
			}
			UIFactory
			.showConfirmDialog({
				data: {
					headerMessage: 'Confirm save?'
				},
				confirm: function () {
					return BankHolidayService.update({
						holidayDate: holiday.holidayDate,
						holidayName: vm.holidayName,
						version: holiday.version
					});
				},
				onFail: function (response) {
					if (response.status != 400) {
						var msg = {
								409: 'Holiday has been modified.',
								404: 'Holiday has been deleted.'
						};
						UIFactory.showFailDialog({
							data: {
								headerMessage: 'Edit holiday fail.',
								bodyMessage: msg[response.status] ? msg[response.status]
									: response.data.message
							},
							preCloseCallback: function () {
								preCloseCallback(response.data);
							}
						});
					}
				},
				onSuccess: function (response) {
					UIFactory.showSuccessDialog({
							data: {
								headerMessage: 'Edit holiday complete.',
								bodyMessage: ''
							},
							preCloseCallback: function () {
								preCloseCallback(response.data);
							}
						});
				}
			});
		}
	}]);