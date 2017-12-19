'use strict';
var ac = angular.module('gecscf.account');
ac.controller('AccountController', ['$scope', '$stateParams', 'UIFactory', 'AccountService',
	function ($scope, $stateParams, UIFactory, AccountService) {

		var vm = this;
		var dialogData = $scope.ngDialogData;

		vm.formatType = {
			ACCOUNT_NO: "ACCOUNT_NO",
			TERM_LOAN: "TERM_LOAN"
		}

		vm.format = vm.formatType.ACCOUNT_NO;
		vm.accountNo = null;
		vm.termLoan = null;

		var _validate = function (data) {
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
			if (vm.format === vm.formatType.ACCOUNT_NO) {
				if (data.length != 10) {
					valid = false;
					$scope.errors.accountNo = {
						message: 'Account No. must be 10-digit number.'
					}
				}
			}
			return valid;
		}

		vm.save = function (callback) {
			var accountNo = null;
			if (vm.format === vm.formatType.ACCOUNT_NO) {
				accountNo = vm.accountNo;
			} else {
				accountNo = vm.termLoan;
			}
			if (_validate(accountNo)) {
				var data = {
					accountNo: accountNo
				}

				if (vm.format == vm.formatType.ACCOUNT_NO) {
					data.format = true;
				} else {
					data.format = false;
				}

				var preCloseCallback = function (account) {
					callback(account);
				}
				UIFactory
					.showConfirmDialog({
						data: {
							headerMessage: 'Confirm save?'
						},
						confirm: function () {
							return AccountService
								.save({
									organizeId: dialogData.organizeId,
									accountNo: data.accountNo,
									format: data.format
								});
						},
						onFail: function (response) {
							if (response.status != 400) {
								var msg = {
								};
								UIFactory
									.showFailDialog({
										data: {
											headerMessage: 'Add new account fail.',
											bodyMessage: msg[response.status] ? msg[response.status]
												: response.data.message
										},
										preCloseCallback: preCloseCallback
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

		vm.changeFormat = function () {
			if (vm.format === vm.formatType.ACCOUNT_NO) {
				vm.termLoan = null;
			} else {
				vm.accountNo = null;
			}
		}
	}]);