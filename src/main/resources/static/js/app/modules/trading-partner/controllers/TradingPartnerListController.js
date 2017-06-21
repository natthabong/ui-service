'use strict';
var tpModule = angular.module('gecscf.tradingPartner');
tpModule
		.controller(
				'TradingPartnerListController',
				[
						'$scope',
						'$stateParams',
						'UIFactory',
						'PageNavigation',
						'PagingController',
						'TradingPartnerService',
						'$timeout',
						'$cookieStore','SCFCommonService','$state',
						function($scope, $stateParams, UIFactory,
								PageNavigation, PagingController,
								TradingPartnerService, $timeout,$cookieStore,SCFCommonService,$state) {

							var vm = this;
							vm.criteria = {
								organizeId : null,
							};
							var listStoreKey = 'listrancri';

							// The pagingController is a tool for navigate the
							// page of a table.
							vm.pagingController = PagingController.create(
									'/api/v1/trading-partners', vm.criteria,
									'GET');

							// Organize auto suggestion model.
							var _organizeTypeHead = function(q) {
								q = UIFactory.createCriteria(q);
								return TradingPartnerService
										.getOrganizeByNameOrCodeLike(q);
							}
							vm.organizeAutoSuggestModel = UIFactory
									.createAutoSuggestModel({
										placeholder : 'Enter organize name or code',
										itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
										query : _organizeTypeHead
									});
							// Data table model
							vm.dataTable = {
								columns : [
										{
											fieldName : '$rowNo',
											labelEN : 'No.',
											cssTemplate : 'text-right'
										},
										{
											fieldName : 'sponsorName',
											headerId : 'buyer-header-label',
											labelEN : 'Buyer',
											labelTH : 'Buyer',
											id : 'buyer-{value}',
											sortable : false,
											cssTemplate : 'text-center',
										},
										{
											fieldName : 'supplierName',
											headerId : 'supplier-header-label',
											labelEN : 'Supplier',
											labelTH : 'Supplier',
											id : 'supplier-{value}',
											sortable : false,
											cssTemplate : 'text-left'
										},
										{
											fieldName : 'status',
											labelEN : 'Status',
											labelTH : 'Status',
											filterType : 'translate',
											id : 'status-{value}',
											sortable : false,
											cssTemplate : 'text-center'
										},
										{
											fieldName : 'action',
											label : '',
											cssTemplate : 'text-center',
											sortData : false,
											cellTemplate : '<scf-button id="{{$parent.$index + 1}}-edit-button" class="btn-default gec-btn-action" ng-click="ctrl.edit(data)" title="Edit"><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></scf-button>'
													+ '<scf-button id="{{$parent.$index + 1}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.setup(data)" title="Configure a trade finance"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>'
													+ '<scf-button id="{{$parent.$index + 1}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deleteTP(data)" title="Delete"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
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

								vm.pagingController.search(pageModel);
							}
							vm.createNew = function() {
								var params = {
									selectedItem : null
								};

								PageNavigation
										.gotoPage('/trading-partners/new',
												params, params);

							}
							var storeCriteria = function(){
								$cookieStore.put(listStoreKey, vm.organize);
							}
							vm.edit = function(record) {
								SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
								storeCriteria();
								var params = {
									selectedItem : record
								};
								$timeout(function() {
									PageNavigation.gotoPage('/trading-partners/edit', params, params);
								}, 10);
							}

							vm.setup = function(data){
								SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
								storeCriteria();
								var params = {
									setupModel : data
								};
								$timeout(function() {
									PageNavigation.gotoPage('/trade-finance/config', params, params);
								}, 10);
							}
							
							vm.deleteTP = function(trading) {
								var preCloseCallback = function(confirm) {
									vm.pagingController.reload();
								}

								UIFactory.showConfirmDialog({
									data : {
										headerMessage : 'Confirm delete?'
									},
									confirm : function() {
										return TradingPartnerService.deleteTradingPartner(trading);
									},
									onFail : function(response) {
										var msg = {
												404 : 'Trading partner has been deleted.',
												409 : 'Trading partner has been modified.',
												405 : 'Trading partner has been used.'
										};
										UIFactory.showFailDialog({
											data : {
												headerMessage : 'Delete trading partner fail.',
												bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
											},
											preCloseCallback : preCloseCallback
										});
									},
									onSuccess : function(response) {
										UIFactory.showSuccessDialog({
											data : {
												headerMessage : 'Delete trading partner success.',
												bodyMessage : ''
											},
											preCloseCallback : preCloseCallback
										});
									}
								});
							}
							

							// Main of program
							var initLoad = function() {
								var backAction = $stateParams.backAction;
								if(backAction === true){
									vm.organize = $cookieStore.get(listStoreKey);
								}
								vm.search();
							}
							initLoad();

						} ]);