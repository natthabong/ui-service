var accountModule = angular.module('gecscf.account');
accountModule.controller('AccountListController', [
		'AccountService',
		'AccountStatus',
		'UIFactory',
		'PagingController',
		'$stateParams',
		'$http',
		'$filter',
		function(AccountService, AccountStatus, UIFactory, PagingController,
				$stateParams, $http, $filter) {
			var vm = this;

			vm.accountStatusDrpodowns = AccountStatus;

			vm.criteria = $stateParams.criteria || {
				organizeId : undefined,
				suspend : undefined
			};

			vm.canManage=false;
			vm.organize = $stateParams.organize || null;

			// The pagingController is a tool for navigate the
			// page of a table.
			vm.pagingController = PagingController.create('/api/v1/accounts',
					vm.criteria, 'GET');

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

			// Data table model
			vm.dataTable = {
				options : {
					displayRowNo: {
						idValueField: 'template',
						id: '$rowNo-{value}-label',
						cssTemplate : 'text-right'
					}
				},
				columns : [ {
					label : 'Organization name',
					field: 'organizeName',
					fieldName : 'organizeName',
					headerId : 'organizeName-header-label',
					idValueField : 'template',
					id : 'organizeName-{value}-label',
					sortable : false,
					cssTemplate : 'text-left',
				}, {
					label : 'Account No.',
					field : 'accountNo',
					fieldName : 'accountNo',
					headerId : 'accountNo-header-label',
					idValueField : 'template',
					id : 'accountNo-{value}-label',
					sortable : false,
					dataRenderer: function (record) {
						if (record.format) {
							return ($filter('accountNoDisplay')(record.accountNo));
						} else {
							return record.accountNo;
						}
					}
				}, {
					label : 'Account type',
					field: 'accountType',
					fieldName : 'accountType',
					headerId : 'accountType-header-label',
					idValueField : 'template',
					filterType : 'translate',
					id : 'accountType-{value}-label',
					sortable : false,
					cssTemplate : 'text-center',
				}, {
					label : 'Status',
					field : 'actualStatus',
					fieldName : 'actualStatus',
					headerId : 'status-header-label',
					idValueField : 'template',
					filterType : 'translate',
					id : 'status-{value}-label',
					sortable : false,
					cssTemplate : 'text-center'
				}, {
					cssTemplate: 'text-center',
					sortable: false,
					cellTemplate: '<scf-button id="{{$parent.$index + 1}}-edit-button" class="btn-default gec-btn-action" ng-disabled="!ctrl.canManage" ng-click="ctrl.editAccount(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
					+ '<scf-button id="{{$parent.$index + 1}}-delete-button" class="btn-default gec-btn-action" ng-disabled="!ctrl.canManage" ng-click="ctrl.deleteAccount(data)" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
				} ]
			}
			// All functions of a controller.
			vm.search = function(pageModel) {
				var organizeId = undefined;
				if (angular.isObject(vm.organize)) {
					vm.criteria.organizeId = vm.organize.memberId;
				} else {
					vm.criteria.organizeId = undefined;
				}
				
				vm.pagingController.search(pageModel
						|| ($stateParams.backAction ? {
							offset : vm.criteria.offset,
							limit : vm.criteria.limit
						} : undefined));
				if($stateParams.backAction){
		    		$stateParams.backAction = false;
		    	}
			}
			
			var init = function(){
				var backAction = $stateParams.backAction;
				if(backAction){
					vm.criteria = $stateParams.criteria;
					prepareAutoSuggestOrganizeLabel(vm.criteria.organize,'organize');
				}
				vm.search();
			}();
			
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
		} ]);