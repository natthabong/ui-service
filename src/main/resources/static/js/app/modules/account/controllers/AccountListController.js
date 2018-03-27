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

		// Data table model
		vm.dataTable = {
			options: {
				displayRowNo: {
					idValueField: 'template',
					id: '$rowNo-{value}-label',
					cssTemplate: 'text-right'
				}
			},
			columns: [{
				label: 'Organization name',
				field: 'organizeName',
				fieldName: 'organizeName',
				headerId: 'organizeName-header-label',
				idValueField: 'template',
				id: 'organizeName-{value}-label',
				sortable: false,
				cssTemplate: 'text-left',
			}, {
				label: 'Account No.',
				field: 'accountNo',
				fieldName: 'accountNo',
				headerId: 'accountNo-header-label',
				idValueField: 'template',
				id: 'accountNo-{value}-label',
				sortable: false,
				dataRenderer: function (record) {
					if (record.format) {
						return ($filter('accountNoDisplay')(record.accountNo));
					} else {
						return record.accountNo;
					}
				}
			}, {
				label: 'Account type',
				field: 'accountType',
				fieldName: 'accountType',
				headerId: 'accountType-header-label',
				idValueField: 'template',
				filterType: 'translate',
				id: 'accountType-{value}-label',
				sortable: false,
				cssTemplate: 'text-center',
			}, {
				label: 'Status',
				field: 'actualStatus',
				fieldName: 'actualStatus',
				headerId: 'status-header-label',
				idValueField: 'template',
				filterType: 'translate',
				id: 'status-{value}-label',
				sortable: false,
				cssTemplate: 'text-center'
			}, {
				cssTemplate: 'text-center',
				sortable: false,
				cellTemplate: '<scf-button id="{{$parent.$index + 1}}-edit-button" class="btn-default gec-btn-action" ng-disabled="!ctrl.canManage" ng-click="ctrl.editAccount(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>' +
					'<scf-button id="{{$parent.$index + 1}}-delete-button" class="btn-default gec-btn-action" ng-disabled="!ctrl.canManage" ng-click="ctrl.deleteAccount(data)" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
			}]
		}

		function prepareAutoSuggestOrganizeLabel(item, module) {
			item.identity = [module, '-', item.memberId, '-option'].join('');
			item.label = [item.memberCode, ': ', item.memberName].join('');
			item.value = item.memberId;
			return item;
		}

		// Organization auto suggest
		var searchOrganizeTypeHead = function (value) {
			var url = 'api/v1/organizes';
			value = UIFactory.createCriteria(value);
			return $http.get(url, {
				params: {
					q: value,
					founder: false,
					supporter: false,
					offset: 0,
					limit: 5
				}
			}).then(function (response) {
				return response.data.map(function (item) {
					return prepareAutoSuggestOrganizeLabel(item, 'organize');
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
		var searchAccountNoTypeHead = function (value) {
			var url = 'api/v1/organizes';
			value = UIFactory.createCriteria(value);
			return $http.get(url, {
				params: {
					q: value,
					founder: false,
					supporter: false,
					offset: 0,
					limit: 5
				}
			}).then(function (response) {
				return response.data.map(function (item) {
					return prepareAutoSuggestOrganizeLabel(item, 'account');
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
			if (angular.isObject(vm.organize)) {
				vm.criteria.organizeId = vm.organize.memberId;
			} else {
				vm.criteria.organizeId = undefined;
			}

			vm.pagingController.search(pageModel ||
				($stateParams.backAction ? {
					offset: vm.criteria.offset,
					limit: vm.criteria.limit
				} : undefined));
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
				prepareAutoSuggestOrganizeLabel(vm.criteria.organize, 'organize');
			}
			vm.search();
		}
		init();
	}
]);