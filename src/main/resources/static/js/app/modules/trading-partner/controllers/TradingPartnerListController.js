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
						function($scope, $stateParams, UIFactory,
								PageNavigation, PagingController,
								TradingPartnerService) {

							var vm = this;
							vm.criteria = {
								organizeId : null,
							};

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
											labelEN : 'Buyer',
											labelTH : 'Buyer',
											id : '{value}-buyer',
											sortable : false,
											cssTemplate : 'text-center',
										},
										{
											fieldName : 'supplierName',
											labelEN : 'Supplier',
											labelTH : 'Supplier',
											id : '{value}-supplier',
											sortable : false,
											cssTemplate : 'text-left'
										},
										{
											fieldName : 'status',
											labelEN : 'Status',
											labelTH : 'Status',
											filterType : 'translate',
											id : '{value}-status',
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
													+ '<scf-button id="{{$parent.$index + 1}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.delete(data)" title="Delete"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
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
								
								PageNavigation.gotoPage('/trading-partners/new', params, params);
							
							}

							// Main of program
							var initLoad = function() {

								vm.search();
							}
							initLoad();

						} ]);