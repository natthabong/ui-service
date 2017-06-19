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
							var _organizeTypeHead = function(query) {
								var deffered = TradingPartnerService
										.getOrganizeByNameOrCodeLike(query);
								deffered.promise.then(function(response) {
									response.data.map(function(item) {
										item.identity = [ 'organize-',
												item.organizeId, '-option' ]
												.join('');
										item.label = [ item.organizeId, ': ',
												item.organizeName ].join('');
										return item;
									});
								});
								return deffered;
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
											fieldName : 'buyer',
											labelEN : 'Buyer',
											labelTH : 'Buyer',
											id : '{value}-buyer',
											sortable : false,
											cssTemplate : 'text-center',
										},
										{
											fieldName : 'supplier',
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
											id : '{value}-status',
											sortable : false,
											cssTemplate : 'text-center'
										},
										{
											fieldName : 'action',
											label : '',
											cssTemplate : 'text-center',
											sortData : false,
											cellTemplate : '<scf-button id="{{$parent.$index + 1}}-edit-button" class="btn-default gec-btn-action" ng-click="ctrl.edit(data)" title="Edit"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
													+ '<scf-button id="{{$parent.$index + 1}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.setup(data)" title="Configure a trade finance"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
													+ '<scf-button id="{{$parent.$index + 1}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.delete(data)" title="Delete"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
										} ]
							}
							// All functions of a controller.
							vm.search = function() {

							}

							vm.createNew = function() {

							}

						} ]);