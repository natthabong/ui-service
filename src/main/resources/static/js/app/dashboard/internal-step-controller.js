angular
		.module('scfApp')
		.controller(
				'InternalStepDashboardController',
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
							
							vm.transactionCriteria = {
									dateType: '',
									dateFrom: '',
									dateTo: '',
									sponsorId: '',
									statusGroup: '',
									statusCode: '',
									supplierCode: '',
									page: 0,
									pageSize: 20,
									orders: orderItems
							}

							vm.dashboardItem = $scope.$parent.$parent.dashboardItem;
							var orderItems = splitCriteriaSortOrderData(vm.dashboardItem.orderItems);
							vm.transactionCriteria.orders = orderItems;
							splitCriteriaFilterData(vm.dashboardItem.filterItems);
							vm.pageModel = {
								pageSizeSelectModel : '20',
								totalRecord : 0,
								currentPage : 1,
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
							
							vm.view = function(data){		
								SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
								var params = { transactionModel: data,
							            isShowViewHistoryButton: false,
							            isShowBackButton: true
							        }
								PageNavigation.gotoPage('/view-transaction',params,params)
							}
							
							vm.decodeBase64 = function(data){
								if(angular.isUndefined(data)){
									return '';
								}
								return atob(data);
							}

							vm.dataTable = {
								options : {
									displayRowNo : {}
								},
								columns : [
										{
										    label: 'TP',
										    sortData: true,
										    cssTemplate: 'text-center',
											cellTemplate: '<img	title="{{data.sponsor}}" style="height: 32px; width: 32px;"	'+
											'data-ng-src="data:image/png;base64,{{internalStepCtrl.decodeBase64(data.sponsorLogo)}}" data-err-src="images/png/avatar.png" />'
										}, {
											field : 'transactionNo',
											label : 'Transaction No',
											id : 'transaction-{value}-transaction-no-label',
											sortData : true,
											cssTemplate : 'text-center'
										}, {
											field : 'sponsorPaymentDate',
											label : 'SponsorPayment Date',
											filterType : 'date',
											filterFormat : 'dd/MM/yyyy',
											sortData : true,
											cssTemplate : 'text-center'
										}, {
											field : 'noOfDocument',
											label : 'No of document',
											sortData : true,
											cssTemplate : 'text-center'
										}, {
											field : 'drawdownAmount',
											label : 'Transaction amount',
											sortData : true,
											cssTemplate : 'text-right',
											filterType : 'number',
											filterFormat : '2'
										}, {
											field : 'statusCode',
											label : 'Status',
											sortData : true,
											idValueField : 'transactionNo',
											id : 'status-{value}',
											filterType : 'translate',
											cssTemplate : 'text-center'
										}, {
											field: '',
											label: '',
											cssTemplate: 'text-center',
											sortData: false,
											cellTemplate: '<scf-button class="btn-default gec-btn-action" id="view-transaction-{{data.transactionNo}}-button" title="View a transaction" ng-click="internalStepCtrl.view(data)"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></scf-button>'
										} ]
							};

							vm.data = [];

							function splitCriteriaSortOrderData(data) {
								var dataSplit = data.split(",");
								var order = [];
								dataSplit.forEach(function(orderData) {
									var orderItem = orderData.split(":");
									item = {
										fieldName : orderItem[0],
										direction : orderItem[1]
									}
									order.push(item);
								});

								return order;
							}
							
							function splitCriteriaFilterData(data) {
								var dataSplit = data.split(",");
								var count = 0;
								dataSplit.forEach(function(filterData) {
									var filterItem = filterData.split(":");
									vm.transactionCriteria[filterItem[0]] = filterItem[1];
								});
							}
							
							vm.decodeBase64 = function(data) {
								return atob(data);
							}
							
							vm.initLoad = function() {
								vm.searchTransaction();	
							}
							
							vm.searchTransactionService = function() {			
								var dataSource = Service.requestURL('/api/list-transaction/search',vm.transactionCriteria);
								dataSource.promise.then(function(response) {
									vm.data = response.content;
					                vm.pageModel.totalRecord = response.totalElements;
					                vm.pageModel.totalPage = response.totalPages;		
					                vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
								}).catch();								
							}

							vm.searchTransaction = function(criteria){
						            if (criteria === undefined) {
						                vm.pageModel.currentPage = '0';
						                vm.pageModel.pageSizeSelectModel = '20';
										vm.pageModel.clearSortOrder = !vm.pageModel.clearSortOrder;
						                vm.transactionCriteria.page = '0';
						                vm.transactionCriteria.pageSize = '20';
						            } else {
						                vm.pageModel.currentPage = criteria.page;
						                vm.pageModel.pageSizeSelectModel = criteria.pageSize;	
						                vm.transactionCriteria.page = criteria.page;
						                vm.transactionCriteria.pageSize = criteria.pageSize;				
						            }
						            vm.searchTransactionService();
							};
							
							vm.initLoad();
							
						} ]);