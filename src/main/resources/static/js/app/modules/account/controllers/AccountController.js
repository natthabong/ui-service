'use strict';
var ac = angular.module('gecscf.account');
ac.controller('AccountController', ['$scope', '$stateParams', '$http', 'UIFactory', 'AccountService',
	function ($scope, $stateParams, $http, UIFactory, AccountService) {

		var vm = this;
		var dialogData = $scope.ngDialogData;
		vm.page = dialogData.page;
		vm.organize = {memberId: '', memberCode: '', memberName: ''};
		vm.organize.memberId = dialogData.organizeId;
		vm.organize.memberCode = dialogData.organizeCode;
		vm.organize.memberName = dialogData.organizeName;
		var record = dialogData.record;
		var mode = dialogData.mode;
		vm.isEditMode = true;
		
		if(mode == 'ADD'){
			vm.isEditMode = false;
		}
		
		vm.formatType = {
			ACCOUNT_NO: "ACCOUNT_NO",
			ACCOUNT_NAME: "ACCOUNT_NAME"
		}
		
		
		
		vm.getHeaderMessage = function(){
			if(mode == 'ADD'){
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
			if(mode == 'ADD'){
				if(vm.page === 'accountList'){
					vm.organize = undefined;
				}
				
				if(vm.page === 'tradeFinance'){
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
				
				vm.format = vm.formatType.ACCOUNT_NO;
				vm.accountType = vm.accountTypeDropDown[0].value;
				vm.accountNo = null;
				vm.accountName = null;
				vm.isSuspend = false;
				
			}else if(mode == 'EDIT'){
				vm.organize = vm.organize.memberCode + ": " + vm.organize.memberName;
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
		
		
		vm.save = function (callback){
			if(mode == 'ADD'){
				vm.add(callback);
			}else{
				vm.edit(callback);
			}
		}
		
		vm.add = function (callback) {
			var accountNo = null;
			if (vm.format === vm.formatType.ACCOUNT_NO) {
				accountNo = vm.accountNo;
			} else {
				accountNo = vm.accountName;
			}
			if(vm.page !== 'accountList' || _validateOrganize(vm.organize)){
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
								console.log(vm.organize.memberId);
								return AccountService
									.save({
										organizeId: vm.organize.memberId,
										accountNo: data.accountNo,
										format: data.format,
										accountType: data.accountType,
										suspend: vm.isSuspend
									});
							},
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
								404: 'Account has been deleted.',
								405: 'Account has been used.',
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