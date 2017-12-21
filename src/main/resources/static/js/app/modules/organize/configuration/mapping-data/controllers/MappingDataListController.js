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
						'ConfigurationUtils',
						function($scope, $rootScope, $stateParams, UIFactory,
								PageNavigation, PagingController,
								MappingDataService, ConfigurationUtils) {

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
											sortable : false,
											cssTemplate : 'text-left',
											cellTemplate : '<span id="{{ctrl.accountingTransactionType}}-mapping-data-{{data.mappingDataName}}-label">{{data.mappingDataName}}</span>'
										},
										{
											fieldName : 'action',
											label : '',
											cssTemplate : 'text-center',
											sortData : false,
											cellTemplate : '<scf-button id="{{ctrl.accountingTransactionType}}-mapping-data-{{data.mappingDataName}}-edit-button" class="btn-default gec-btn-action" ng-click="ctrl.edit(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
													+ '<scf-button id="{{ctrl.accountingTransactionType}}-mapping-data-{{data.mappingDataName}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deleteMappingData(data)" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
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
								ConfigurationUtils
										.showCreateMappingDataDialog({
											data : {
												ownerId : ownerId,
												accountingTransactionType : accountingTxnType,
												showAll: true
											},
											preCloseCallback : function() {
												loadData();
											}
										});
							}

							vm.deleteMappingData = function(data) {
								UIFactory
										.showConfirmDialog({
											data : {
												headerMessage : 'Confirm delete?'
											},
											confirm : function() {
												return MappingDataService
														.remove(data);
											},
											onFail : function(response) {
												var status = response.status;
												if (status != 400) {
													var msg = {
														404 : "Mapping data has been deleted."
													}
													UIFactory
															.showFailDialog({
																data : {
																	headerMessage : 'Delete mapping data fail.',
																	bodyMessage : msg[status] ? msg[status]
																			: response.errorMessage
																},
																preCloseCallback : loadData
															});
												}

											},
											onSuccess : function(response) {
												UIFactory
														.showSuccessDialog({
															data : {
																headerMessage : 'Delete mapping data success.',
																bodyMessage : ''
															},
															preCloseCallback : loadData
														});
											}
										});
							}

							vm.init = function(accountingTransactionType) {
								vm.accountingTransactionType = accountingTransactionType;
								var uri = 'api/v1/organize-customers/'
										+ ownerId + '/accounting-transactions/'
										+ accountingTransactionType
										+ '/mapping-datas'
								vm.pagingController = PagingController.create(
										uri, _criteria, 'GET');
								loadData();

							};

						} ]);