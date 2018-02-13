angular
		.module('gecscf.organize')
		.controller(
				'OrganizeListAllFundingController',
				[
						'$scope',
						'Service',
						'$stateParams',
						'$log',
						'SCFCommonService',
						'PagingController',
						'PageNavigation',
						'$state',
						'UIFactory',
						'$http',
						function($scope, Service, $stateParams, $log,
								SCFCommonService, PagingController,
								PageNavigation, $state, UIFactory, $http) {

							var vm = this;
							var log = $log;

							var _criteria = {};
							vm.criteria = $stateParams.criteria || {
								organizeId : undefined,
								taxId : undefined
							}
							vm.organize = $stateParams.organize || undefined;

							vm.sponsorConfig = function(data) {
								var params = {
									organizeId : data.memberId
								};
								PageNavigation.nextStep(
										'/sponsor-configuration', params, {
											criteria : _criteria,
											organize : vm.organize
										});
							}

							var searchOrganizeTypeHead = function(value) {
								value = UIFactory.createCriteria(value);
								return $http.get('api/v1/organizes', {
									params : {
										q : value,
										founder : false,
										supporter : false,
										offset : 0,
										limit : 5
									}
								}).then(
										function(response) {
											return response.data.map(function(
													item) {
												item.identity = [ 'organize-',
														item.memberId, '-',
														item.memberCode,
														'-option' ].join('');
												item.label = [ item.memberCode,
														': ', item.memberName ]
														.join('');
												return item;
											});
										});
							}

							vm.organizeAutoSuggestModel = UIFactory
									.createAutoSuggestModel({
										placeholder : 'Enter organization name or code',
										itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
										query : searchOrganizeTypeHead
									});

							vm.pagingController = PagingController.create(
									'/api/v1/organize-customers/', _criteria,
									'GET');
							vm.loadData = function(pageModel) {
								vm.pagingController.search(pageModel
										|| ($stateParams.backAction ? {
											offset : _criteria.offset,
											limit : _criteria.limit,
											organizeId : _criteria.organizeId,
											taxId : _criteria.taxId
										} : undefined));

								if ($stateParams.backAction) {
									$stateParams.backAction = false;
								}
							}

							vm.searchOrganize = function(pageModel) {
								var organizeId = undefined;
								if (angular.isObject(vm.organize)) {
									vm.criteria.organizeId = vm.organize.memberId;
								} else {
									vm.criteria.organizeId = undefined;
								}
								_storeCriteria();
								vm.loadData(pageModel);
							}

							function _storeCriteria() {
								angular.copy(vm.criteria, _criteria);
							}

							vm.organizeCriteria = {
								organizeId : undefined,
								taxId : undefined
							}

							vm.initLoad = function() {
								var backAction = $stateParams.backAction;

								if (backAction
										&& Object.keys($stateParams.criteria).length != 0) {
									vm.organizeCriteria = $stateParams.criteria;
								}
								vm.searchOrganize();
							}

							vm.initLoad();

						} ]);