'use strict';
var ac = angular.module('gecscf.account');
ac.controller('AccountController', ['$scope', '$stateParams', '$http', 'UIFactory', 'blockUI', 'AccountService',
	function ($scope, $stateParams, $http, UIFactory, blockUI, AccountService) {

		var vm = this;
		var dialogData = $scope.ngDialogData;
		vm.organizeId = dialogData.organizeId;
		var record = dialogData.record;
		vm.mode = dialogData.mode;
		vm.isEditMode = true;
		
		if(vm.mode == 'ADD'){
			vm.isEditMode = false;
		}
		
		vm.formatType = {
			ACCOUNT_NO: "ACCOUNT_NO",
			ACCOUNT_NAME: "ACCOUNT_NAME"
		}
		
		vm.getHeaderMessage = function(){
			if(vm.mode == 'ADD'){
				return 'Add new account';
			}else{
				return 'Edit account';
			}
		}
		
		vm.accountTypeDropDown = [
  			{
  				label : "Current/Saving",
  				value : "CURRENT_SAVING"
  			},{
  				label : "Overdraft",
  				value : "OVERDRAFT"
  			},{
  				label : "Term loan",
  				value : "LOAN"
  			}
  		];
		
		init();
		function init(){
			if(vm.mode == 'ADD'){
				vm.accountTypeDropDown = [
	      			{
	      				label : "Current/Saving",
	      				value : "CURRENT_SAVING"
	      			},{
	      				label : "Overdraft",
	      				value : "OVERDRAFT"
	      			},{
	      				label : "Term loan",
	      				value : "LOAN"
	      			}
	      		]
				
				vm.format = vm.formatType.ACCOUNT_NO;
				vm.accountType = vm.accountTypeDropDown[0].value;
				vm.accountNo = null;
				vm.accountName = null;
				vm.isSuspend = false;
				
			}else if(vm.mode == 'EDIT'){
				vm.accountType = record.accountType;
				
				if(record.format){
					vm.format = vm.formatType.ACCOUNT_NO;
					vm.accountNo = record.accountNo;
				}else{
					vm.format = vm.formatType.ACCOUNT_NAME;
					vm.accountName = record.accountNo;
				}
		
				vm.isSuspend = record.suspend;
			}
		}

		var _validateAccountNo = function (data) {
			$scope.errors = {};
			var valid = true;

			if (!angular.isDefined(data) || data == null || data == "") {
				valid = false;
				if (vm.format == vm.formatType.ACCOUNT_NO) {
					$scope.errors.accountNo = {
						message: 'Account No. is required.'
					}
				} else {
					$scope.errors.accountNo = {
						message: 'Term loan is required.'
					}
				}

			}
			
			return valid;
		}
		
		var confirmSave = function (data) {
			blockUI.start();
			return AccountService
				.save({
					organizeId: data.organizeId,
					accountNo: data.accountNo,
					format: data.format,
					accountType: data.accountType,
					suspend: false
				});
		}
		
		var _validateOrganizationAccount = function (data) {
			var valid = false;
			
			var deffered = AccountService.verifyAccount({
				organizeId: data.organizeId,
				accountNo: data.accountNo,
				format: data.format,
				accountType: data.accountType,
				suspend: false,
				showShareAccount: true
			});
			deffered.promise.then(function (response) {
				valid = true;
			}).catch(function (response) {
				if(response.status == 202){
					UIFactory
					.showConfirmDialog({
						data: {
							headerMessage: 'Do you want to share account with another organization ?',
							bodyMessage: 'Press \'Yes\' to confirm.'
						},
						confirm: confirmSave,
						onFail: function (response) {
							blockUI.stop();
							if (response.status != 400) {
								var msg = {
										400: 'Account No. is wrong format.',
										404: 'Account No. is existed but account type mismatch.',
										409: 'Organization account is existed.'
								};
								UIFactory.showFailDialog({
									data: {
										headerMessage: 'Add new account fail.',
										bodyMessage: msg[response.status] ? msg[response.status]
											: response.data.message
									}
								});
							}
						},
						onSuccess: function (response) {
							blockUI.stop();
							UIFactory
								.showSuccessDialog({
									data: {
										headerMessage: 'Add new account success.',
										bodyMessage: ''
									},
									preCloseCallback: function () {
										preCloseCallback(response.data);
									}
								});
						}
					});
				}
				if (response.status != 400) {
					var msg = {
							400: 'Account No. is wrong format.',
							404: 'Add organization account fail. Account No. is existed but account type mismatch. ('+data.accountNo+')',
							409: 'Organization account is existed.'
					};
					UIFactory.showFailDialog({
						data: {
							headerMessage: 'Add new account fail.',
							bodyMessage: msg[response.status] ? msg[response.status]
								: response.data.message
						}
					});
				}
			});
			
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
			var accountData = {
				organizeId: vm.organizeId,
				accountNo: null,
				format: null,
				accountType : vm.accountType
			}
			if (vm.format === vm.formatType.ACCOUNT_NO) {
				accountData.accountNo = vm.accountNo;
				accountData.format = true;
			} else {
				accountData.accountNo = vm.accountName;
				accountData.format = false;
			}
			
			if (_validateAccountNo(accountData.accountNo) && _validateOrganizationAccount(accountData)) {

				var preCloseCallback = function (account) {
					callback(account);
				}
				UIFactory
					.showConfirmDialog({
						data: {
							headerMessage: 'Confirm save?'
						},
						confirm: confirmSave(accountData),
						onFail: function (response) {
							if (response.status != 400) {
								var msg = {
										409: 'Account No. is existed.'
								};
								UIFactory.showFailDialog({
									data: {
										headerMessage: 'Add new account fail.',
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
										headerMessage: 'Add new account success.',
										bodyMessage: ''
									},
									preCloseCallback: function () {
										preCloseCallback(response.data);
									}
								});
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
								409: 'Account has been modified.'
						}
						UIFactory.showFailDialog({
							data: {
								headerMessage: 'Edit account fail.',
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
								headerMessage: 'Edit account complete.',
								bodyMessage: ''
							},
							preCloseCallback: function () {
								callback(response.data);
							}
						});
				}
			});
		}

		vm.changeFormat = function () {
			if (vm.format === vm.formatType.ACCOUNT_NO) {
				vm.accountName = null;
			} else {
				vm.accountNo = null;
			}
		}
	}]);