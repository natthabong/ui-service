var accountModule = angular.module('gecscf.account');
accountModule.controller('AccountListController', [
		'AccountService',
		'AccountStatus',
		'UIFactory',
		'PagingController',
		'$stateParams',
		'$http',
		function(AccountService, AccountStatus, UIFactory, PagingController,
				$stateParams, $http) {
			var vm = this;

			vm.accountStatusDrpodowns = AccountStatus;

			vm.criteria = $stateParams.criteria || {
				organizeId : undefined,
				suspend : undefined,
				accountType: 'CURRENT_SAVING'
			};
			
			vm.organize = $stateParams.organize || null;

			// The pagingController is a tool for navigate the
			// page of a table.
			vm.pagingController = PagingController.create('/api/v1/accounts',
					vm.criteria, 'GET');

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
								item.identity = [ 'organize-', item.organizeId,
										'-option' ].join('');
								item.label = [ item.organizeId, ': ',
										item.organizeName ].join('');
								return item;
							});
						});
			}
			
			var orgAutoSuggest = {
				placeholder : 'Enter organize name or code',
				itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
				query : searchOrganizeTypeHead
			}
			
			vm.organizeAutoSuggestModel = UIFactory.createAutoSuggestModel(orgAutoSuggest);

			// Data table model
			vm.dataTable = {
				columns : [ {
					fieldName : '$rowNo',
					labelEN : 'No.',
					headerId : 'no-header-label',
					cssTemplate : 'text-right'
				}, {
					fieldName : 'organizeName',
					headerId : 'organizeName-header-label',
					labelEN : 'Organize name',
					labelTH : 'Organize name',
					id : 'organizeName-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				}, {
					fieldName : 'accountNo',
					headerId : 'accountNo-header-label',
					labelEN : 'Account No.',
					labelTH : 'Account No.',
					filterType : 'accountNo',
					id : 'accountNo-{value}',
					sortable : false,
					cssTemplate : 'text-center'
				}, {
					fieldName : 'status',
					labelEN : 'Status',
					labelTH : 'Status',
					filterType : 'translate',
					id : 'status-{value}',
					sortable : false,
					cssTemplate : 'text-center'
				} ]
			}
			// All functions of a controller.
			vm.search = function(pageModel) {
				var organizeId = undefined;
				if (angular.isObject(vm.organize)) {
					vm.criteria.organizeId = vm.organize.organizeId;
				} else {
					vm.criteria.organizeId = undefined;
				}
				vm.pagingController.search(pageModel
						|| ($stateParams.backAction ? {
							offset : vm.criteria.offset,
							limit : vm.criteria.limit
						} : undefined));
				$stateParams.backAction = false;
			}
			
			var init = function(){
				vm.search();
			}();
		} ]);