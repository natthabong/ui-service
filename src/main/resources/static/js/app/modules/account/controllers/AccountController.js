'use strict';
var ac = angular.module('gecscf.account');
ac.controller('AccountController', ['$scope', '$stateParams', '$http', 'UIFactory', 'AccountService',
	function ($scope, $stateParams, $http, UIFactory, AccountService) {

		var vm = this;
		var dialogData = $scope.ngDialogData;
		vm.page = dialogData.page;
		vm.organize = undefined;
		if(vm.page === 'accountList'){
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
		}else{
			vm.organizationLabel = dialogData.organizeCode + ': ' + dialogData.organizeName;
			vm.organize = {memberId: '', memberCode: '', memberName: ''};
			vm.organize.memberId = dialogData.organizeId;
			vm.organize.memberCode = dialogData.organizeCode;
			vm.organize.memberName = dialogData.organizeName;
			
			vm.accountTypeDropDown = [
      			{
      				label : "Overdraft",
      				value : "OVERDRAFT"
      			},{
      				label : "Term loan",
      				value : "LOAN"
      			}
      		]
		}
		
		vm.formatType = {
			ACCOUNT_NO: "ACCOUNT_NO",
			TERM_LOAN: "TERM_LOAN"
		}
		
		vm.format = vm.formatType.ACCOUNT_NO;
		vm.accountType = vm.accountTypeDropDown[0].value;
		vm.accountNo = null;
		vm.termLoan = null;

		var prepareAutoSuggestOrganizeLabel = function(item,module) {
			item.identity = [ module,'-', item.memberId, '-option' ].join('');
			item.label = [ item.memberCode, ': ', item.memberName ].join('');
			item.value = item.memberId;
			return item;
		}
		
		var organizeAutoSuggestServiceUrl = 'api/v1/organizes';
		var searchOrganizeTypeHead = function(value) {
			value = UIFactory.createCriteria(value);
			return $http.get(organizeAutoSuggestServiceUrl, {
				params : {
					q : value,
					founder : false,
					supporter : false,
					offset : 0,
					limit : 5
				}
			}).then(
				function(response) {
					return response.data.map(function(item) {
						item = prepareAutoSuggestOrganizeLabel(item,'organize');
						return item;
					});
			});
		}
		
		var orgAutoSuggest = {
			placeholder : 'Enter organization name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : searchOrganizeTypeHead
		}
		
		vm.organizeAutoSuggestModel = UIFactory.createAutoSuggestModel(orgAutoSuggest);
		
		var _validateOrganize = function (data) {
			$scope.errors = {};
			var valid = true;
			if (!angular.isDefined(data) || data == null || data == "") {
				valid = false;
				$scope.errors.organize = {
					message: 'Organization is required.'
				}
			}
			
			return valid;
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

		vm.save = function (callback) {
			var accountNo = null;
			if (vm.format === vm.formatType.ACCOUNT_NO) {
				accountNo = vm.accountNo;
			} else {
				accountNo = vm.termLoan;
			}
			if(vm.page === 'tradeFinance' || _validateOrganize(vm.organize)){
				if (_validateAccountNo(accountNo)) {
					var data = {
						accountType : vm.accountType,
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
										organizeId: vm.organize.memberId,
										accountNo: data.accountNo,
										format: data.format,
										accountType : data.accountType
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
		}

		vm.changeFormat = function () {
			if (vm.format === vm.formatType.ACCOUNT_NO) {
				vm.termLoan = null;
			} else {
				vm.accountNo = null;
			}
		}
	}]);