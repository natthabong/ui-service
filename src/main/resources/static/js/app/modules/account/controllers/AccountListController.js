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
					cellTemplate: '<scf-button id="{{$parent.$index + 1}}-edit-button" class="btn-default gec-btn-action" ng-disabled="!ctrl.canManage" ng-click="ctrl.edit(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
					+ '<scf-button id="{{$parent.$index + 1}}-delete-button" class="btn-default gec-btn-action" ng-disabled="!ctrl.canManage" ng-click="ctrl.deleteTradeFinance(data)" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
				} ]
			}
			// All functions of a controller.
			vm.search = function(pageModel) {
				var organizeId = undefined;
				if (angular.isObject(vm.criteria.organize)) {
					vm.criteria.organizeId = vm.criteria.organize.memberId;
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
			
			vm.addAccount = function () {
				UIFactory.showDialog({
					templateUrl: '/js/app/modules/trading-partner/financing/templates/dialog-new-account.html',
					controller: 'AccountController',
					data: {
						page: 'accountList'
					},
					preCloseCallback: function (data) {
						if (data) {
							vm.search();
						}
					}
				});
			}
		} ]);