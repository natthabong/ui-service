angular.module('gecscf.account').controller('AccountListController', [
	'$filter',
	'$http',
	'$stateParams',
	'AccountService',
	'AccountStatus',
	'PagingController',
	'UIFactory',
	function ($filter, $http, $stateParams, AccountService, AccountStatus, PagingController, UIFactory) {
		var vm = this;

		vm.canManage = false;
		vm.organize = $stateParams.organize || null;
		vm.accountNo = null;
		vm.accountStatusDrpodowns = AccountStatus;

		vm.criteria = $stateParams.criteria || {
			organizeId: undefined,
			suspend: undefined
		};
		vm.pagingController = PagingController.create('/api/v1/accounts', vm.criteria, 'GET');

		// Organization auto suggest
		function prepareOrganizationAutoSuggestItem(item, module) {
			item.identity = [module, '-', item.memberId, '-option'].join('');
			item.label = [item.memberCode, ': ', item.memberName].join('');
			item.value = item.memberId;
			return item;
		}

		var searchOrganizeTypeHead = function (value) {
			var url = 'api/v1/organizes';
			value = UIFactory.createCriteria(value);
			return $http.get(url, {
				params: {
					q: value,
					offset: 0,
					limit: 5
				}
			}).then(function (response) {
				return response.data.map(function (item) {
					return prepareOrganizationAutoSuggestItem(item, 'organize');
				});
			});
		}

		var organizeAutoSuggest = {
			placeholder: 'Enter organization name or code',
			itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
			query: searchOrganizeTypeHead
		}

		vm.organizeAutoSuggestModel = UIFactory.createAutoSuggestModel(organizeAutoSuggest);

		// Account number auto suggest
		function prepareAccountNoAutoSuggestItem(item, module) {
			console.log(vm.pagingController.tableRowCollection)
			item.identity = [module, '-', item.accountId, '-option'].join('');
			if (item.format) {
				item.label = $filter('accountNoDisplay')(item.accountNo);
			} else {
				item.label = item.accountNo;
			}
			item.value = item.accountId;
			return item;
		}

		var searchAccountNoTypeHead = function (value) {
			var url = 'api/v1/accounts';
			value = UIFactory.createCriteria(value);
			return $http.get(url, {
				params: {
					q: value,
					offset: 0,
					limit: 5
				}
			}).then(function (response) {
				return response.data.map(function (item) {
					return prepareAccountNoAutoSuggestItem(item, 'account');
				});
			});
		}

		var accountNoAutoSuggest = {
			placeholder: 'Enter account number',
			itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
			query: searchAccountNoTypeHead
		}

		vm.accountNoAutoSuggestModel = UIFactory.createAutoSuggestModel(accountNoAutoSuggest);

		// Class function
		vm.search = function (pageModel) {
			var organizeId = undefined;

			var accountTypeMapping = {
				'CURRENT_SAVING': 'Current/Saving',
				'OVERDRAFT': 'Overdraft',
				'LOAN': 'Term loan'
			};

			var statusMapping = {
				'ACTIVE': 'Active',
				'SUSPEND': 'Suspend'
			};

			if (angular.isObject(vm.organize)) {
				vm.criteria.organizeId = vm.organize.memberId;
			} else {
				vm.criteria.organizeId = undefined;
			}

			vm.pagingController.search(pageModel ||
				($stateParams.backAction ? {
					offset: vm.criteria.offset,
					limit: vm.criteria.limit
				} : undefined),
				function (criteriaData, response) {
					var data = response.data;
					var existingAccountId = {};
					var pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
					var currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
					var i = 1;
					var baseRowNo = pageSize * currentPage;

					angular.forEach(data, function (value, idx) {
						value.accountNo = $filter('accountNoDisplay')(value.accountNo);

						if (value.accountId in existingAccountId) {
							value.hide = true;
						} else {
							existingAccountId[value.accountId] = null;
							value.hide = false;
						}

						value.rowNo = baseRowNo + i;
						++i;
					})
				}
			);

			if ($stateParams.backAction) {
				$stateParams.backAction = false;
			}
		}

		vm.editAccount = function (record) {
			UIFactory.showDialog({
				templateUrl: '/js/app/modules/organize/configuration/account/templates/dialog-new-account.html',
				controller: 'AccountController',
				data: {
					mode: 'EDIT',
					record: record,
					organizeId: record.organizeId
				},
				preCloseCallback: function (data) {
					vm.search();
				}
			});
		}

		vm.deleteAccount = function (record) {
			var preCloseCallback = function (confirm) {
				vm.search();
			}

			UIFactory.showConfirmDialog({
				data: {
					headerMessage: 'Confirm delete?'
				},
				confirm: function () {
					return AccountService.deleteAccount(record);
				},
				onFail: function (response) {
					var msg = {
						405: 'Account has been used.',
						409: 'Account has been modified.'
					};
					UIFactory.showFailDialog({
						data: {
							headerMessage: 'Delete account fail.',
							bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
						},
						preCloseCallback: preCloseCallback
					});
				},
				onSuccess: function (response) {
					UIFactory.showSuccessDialog({
						data: {
							headerMessage: 'Delete account success.',
							bodyMessage: ''
						},
						preCloseCallback: preCloseCallback
					});
				}
			});
		}

		function init() {
			var backAction = $stateParams.backAction;
			if (backAction) {
				vm.criteria = $stateParams.criteria;
			}
			vm.search();
		}
		init();
	}
]);