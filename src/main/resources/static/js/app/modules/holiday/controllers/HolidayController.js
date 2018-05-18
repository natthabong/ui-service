'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BankHolidayController', ['$scope', '$stateParams', '$http', '$q', 'UIFactory', 'blockUI', 'BankHolidayService',
	function ($scope, $stateParams, $http, $q, UIFactory, blockUI, BankHolidayService) {

		var vm = this;
		var dialogData = $scope.ngDialogData;
		var record = dialogData.record;
		vm.mode = dialogData.mode;
		vm.isEditMode = true;
		
		if(vm.mode == 'ADD'){
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
			if(vm.mode == 'ADD'){
				return 'Add holiday';
			}else{
				return 'Edit holiday';
			}
		}
		
		vm.loadHoliday = function() {
	    	if(vm.mode == 'EDIT'){
	    		vm.holiday = new Date(response.data.holidayDate);
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
			if(vm.mode == 'ADD'){
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
							return BankHolidayService
							.save({
								holidayDate: vm.holiday,
								holidayName: vm.holidayName
							});
						},
						onFail: function (response) {
							var msg = {
									400: 'Holiday is existed.',
									406: 'Cannot add current date to the holiday list.'
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
			UIFactory
			.showConfirmDialog({
				data: {
					headerMessage: 'Confirm save?'
				},
				confirm: function () {
					return AccountService
						.update({
							accountId: record.accountId,
							accountNo: record.accountNo,
							organizeId: record.organizeId,
							suspend: vm.isSuspend,
							version: record.version
						});
				},
				onFail: function (response) {
					if (response.status != 400) {
						var msg = {
								409: 'Holiday has been modified.'
						}
						UIFactory.showFailDialog({
							data: {
								headerMessage: 'Edit holiday fail.',
								bodyMessage: msg[response.status] ? msg[response.status]
									: response.data.message
							}
						});
					}
				},
				onSuccess: function (response) {
					UIFactory
						.showSuccessDialog({
							data: {
								headerMessage: 'Edit holiday complete.',
								bodyMessage: ''
							},
							preCloseCallback: function () {
								callback(response.data);
							}
						});
				}
			});
		}
	}]);