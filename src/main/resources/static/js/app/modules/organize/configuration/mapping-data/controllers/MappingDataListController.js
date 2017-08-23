'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule
		.controller(
				'MappingDataListController',
				[
						'$scope',
						'$rootScope',
						'$stateParams',
						'UIFactory',
						'PageNavigation',
						'PagingController',
						'MappingDataService',
						'MappingDataUtils',
						function($scope, $rootScope, $stateParams, UIFactory,
								PageNavigation, PagingController,
								MappingDataService, MappingDataUtils) {

							var vm = this;

							vm.accountingTransactionType = 'PAYABLE';

							vm.dataTable = {
								identityField : 'mappingDataName',
								columns : [

										{
											fieldName : 'mappingDataName',
											headerId : 'mapping-data-name-header-label',
											labelEN : 'Mapping data name',
											labelTH : 'Mapping data name',
											id : 'AR-mapping-data-{value}',
											sortable : false,
											cssTemplate : 'text-left',
										},
										{
											fieldName : 'action',
											label : '',
											cssTemplate : 'text-center',
											sortData : false,
											cellTemplate : '<scf-button id="AR-mapping-data-{{data.mappingDataName}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.edit(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
													+ '<scf-button id="AR-mapping-data-{{data.mappingDataName}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deleteTP(data)" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
										} ]
							}

							var ownerId = $scope.sponsorId;
							var _criteria = {};

							var loadData = function() {
								vm.pagingController.search();
							}

							vm.edit = function(data) {
								var params = {
									mappingData : data
								};
								PageNavigation
										.gotoPage(
												'/sponsor-configuration/mapping-data/edit',
												params, {});
							}

							vm.addNewMappingData = function(accountingTxnType) {
								MappingDataUtils
										.showCreateMappingDataDialog({
											data : {
												ownerId : ownerId,
												accountingTransactionType : accountingTxnType
											},
											preCloseCallback : function() {
												loadData();
											}
										});
							}

							vm.init = function(accountingTransactionType) {
								var uri = 'api/v1/organize-customers/'
										+ ownerId + '/accounting-transactions/'
										+ accountingTransactionType
										+ '/mapping-datas'
								vm.pagingController = PagingController.create(
										uri, _criteria, 'GET');
								loadData();

							};

						} ]);