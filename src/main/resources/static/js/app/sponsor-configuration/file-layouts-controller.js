angular
		.module('scfApp')
		.controller(
				'FileLayoutsController',
				[
						'$log',
						'$scope',
						'$state',
						'SCFCommonService',
						'$stateParams',
						'$timeout',
						'PageNavigation',
						'Service',
						function($log, $scope, $state, SCFCommonService, $stateParams, $timeout,
								PageNavigation, Service) {
							var vm = this;
							var log = $log;

//							vm.dashboardItem = $scope.$parent.$parent.layout;
//							var orderItems = splitCriteriaSortOrderData(vm.dashboardItem.orderItems);
//							vm.transactionCriteria.orders = orderItems;
//							splitCriteriaFilterData(vm.dashboardItem.filterItems);
							vm.pageModel = {
								pageSizeSelectModel : '20',
								totalRecord : 0,
								currentPage : 0,
								clearSortOrder : false
							};

							vm.pageSizeList = [ {
								label : '10',
								value : '10'
							}, {
								label : '20',
								value : '20'
							}, {
								label : '50',
								value : '50'
							} ];
							
							vm.config = function(data){		
								SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
								var params = { transactionModel: data,
							            isShowViewHistoryButton: false,
							            isShowBackButton: true
							        }
								PageNavigation.gotoPage('/new-file-layout',params,params)
							}
							
							vm.decodeBase64 = function(data){
								if(angular.isUndefined(data)){
									return '';
								}
								return atob(data);
							}

							vm.dataTable = {
								options : {
								},
								columns : [
										{
											field : 'fileLayoutName',
										    label: 'File layout name',
										    idValueField: 'template',
										    id: 'file-layouts-{value}-file-layout-name-label',
										    sortData: true,
										    cssTemplate: 'text-left',
										}, {
											field: '',
											label: '',
											cssTemplate: 'text-center',
											sortData: false,
											cellTemplate: '<scf-button id="file-layouts-{{data.sponsorIntegrateFileConfigId}}-config-button" class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="New file layout"><i class="fa fa-check-square-o" aria-hidden="true"></i></scf-button>' +
											'<scf-button class="btn-default gec-btn-action" ng-disabled="true" ng-click="ctrl.searchTransaction()" title="Delete file layout"><i class="fa fa-times-circle" aria-hidden="true"></i></scf-button>'
										} ]
							};

//							vm.data = [];
							vm.data = [{
						    	"fileLayoutName" : "Big C file layout"
						    }]

//							function splitCriteriaSortOrderData(data) {
//								var dataSplit = data.split(",");
//								var order = [];
//								dataSplit.forEach(function(orderData) {
//									var orderItem = orderData.split(":");
//									item = {
//										fieldName : orderItem[0],
//										direction : orderItem[1]
//									}
//									order.push(item);
//								});
//
//								return order;
//							}
							
							vm.decodeBase64 = function(data) {
								return atob(data);
							}
							
							vm.initLoad = function() {
				                vm.pageModel.currentPage = 0;
				                vm.pageModel.pageSizeSelectModel = '20';
								vm.pageModel.clearSortOrder = !vm.pageModel.clearSortOrder;
//				                vm.transactionCriteria.page = 0;
//				                vm.transactionCriteria.pageSize = 20;
//								vm.searchTransaction();	
							}
							
//							vm.searchTransactionService = function() {			
//								var dataSource = Service.requestURL('/api/v1/organize-customers/<org id>/sponsor-configs/SFP/layouts',vm.transactionCriteria);
//								dataSource.promise.then(function(response) {
//									vm.data = response.content;
//					                vm.pageModel.totalRecord = response.totalElements;
//					                vm.pageModel.totalPage = response.totalPages;		
//					                vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
//								}).catch();								
//							}

//							vm.searchTransaction = function(criteria){
//						            if (criteria === undefined) {
//						                vm.pageModel.currentPage = 0;
//						                vm.pageModel.pageSizeSelectModel = '20';
//										vm.pageModel.clearSortOrder = !vm.pageModel.clearSortOrder;
//						                vm.transactionCriteria.page = 0;
//						                vm.transactionCriteria.pageSize = 20;
//						            } else {
//						                vm.pageModel.currentPage = criteria.page;
//						                vm.pageModel.pageSizeSelectModel = criteria.pageSize;	
//						                vm.transactionCriteria.page = criteria.page;
//						                vm.transactionCriteria.pageSize = criteria.pageSize;				
//						            }
//						            vm.searchTransactionService();
//							};
							
							vm.initLoad();
							
						} ]);