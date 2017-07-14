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
						'PagingController',
						'Service',
						function($log, $scope, $state, SCFCommonService, $stateParams, $timeout,
								PageNavigation, PagingController, Service) {
							var vm = this;
							var log = $log;
							var organizeId = $scope.userInfo.organizeId;
							vm.dashboardItem = $scope.$parent.$parent.dashboardItem;
							vm.criteria = {
									supplierId: organizeId,
									orders: vm.dashboardItem.orderItems
							}
							
//							vm.transactionCriteria = {
//									dateType: '',
//									dateFrom: '',
//									dateTo: '',
//									sponsorId: '',
//									statusGroup: '',
//									statusCode: '',
//									supplierCode: '',
//									page: 0,
//									pageSize: 20,
//									orders: orderItems
//							}

							
							var orderItems = splitCriteriaSortOrderData(vm.dashboardItem.orderItems);
							
//							vm.transactionCriteria.orders = orderItems;
							//vm.criteria.orders = orderItems;
//							splitCriteriaFilterData(vm.dashboardItem.filterItems);
//							vm.pageModel = {
//								pageSizeSelectModel : '20',
//								totalRecord : 0,
//								currentPage : 0,
//								clearSortOrder : false
//							};

//							vm.pageSizeList = [ {
//								label : '10',
//								value : '10'
//							}, {
//								label : '20',
//								value : '20'
//							}, {
//								label : '50',
//								value : '50'
//							} ];
							
							vm.view = function(data){		
								SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
								var params = { transactionModel: data,
										party: 'supplier',
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
							console.log(vm.criteria);
							vm.pagingController = PagingController.create('api/v1/transactions/internal-step', vm.criteria, 'GET');

							vm.dataTable = {
								columns : [
										{
										    fieldName: '$rowNo',
											labelEN: 'No.',
										    labelTH: 'ลำดับที่',
										    idValueField: '$rowNo',
										    id: 'internal-step-{value}-no',
										    cssTemplate: 'text-center',	
										},
										{
										    labelEN: 'TP',
										    labelTH: 'TP',
										    sortData: true,
										    cssTemplate: 'text-center',
											cellTemplate: '<img	title="{{data.sponsor}}" style="height: 32px; width: 32px;"	'+
											'data-ng-src="data:image/png;base64,{{internalStepCtrl.decodeBase64(data.sponsorLogo)}}" data-err-src="images/png/avatar.png" />'
										}, {
											fieldName: 'transactionNo',
											labelEN: 'Transaction No',
											labelTH: 'Transaction No',
											idValueField: '$rowNo',
							                id: 'internal-step-{value}-transaction-no',
							                sortData : true,
											cssTemplate : 'text-center'
										}, {
											fieldName: 'sponsorPaymentDate',
											labelEN: 'Sponsor payment date',
											labelTH: 'Sponsor payment date',
											idValueField: '$rowNo',
							                id: 'internal-step-{value}-sponsor-payment-date',
							                filterType : 'date',
											filterFormat : 'dd/MM/yyyy',
											sortData : true,
											cssTemplate : 'hidden-xs hidden-sm text-center'
										}, {
											fieldName: 'noOfDocument',
											labelEN: 'No of document',
											labelTH: 'No of document',
											idValueField: '$rowNo',
							                id: 'internal-step-{value}-no-of-document',
							                sortData : true,
											cssTemplate : 'hidden-xs hidden-sm text-center'
										}, {
											fieldName: 'transactionAmount',
											labelEN: 'Transaction amount',
											labelTH: 'Transaction amount',
											idValueField: '$rowNo',
							                id: 'internal-step-{value}-transaction-amount',
							                sortData : true,
											cssTemplate : 'text-right',
											filterType : 'number',
											filterFormat : '2'
										}, {
											fieldName: 'statusCode',
											labelEN: 'Status',
											labelTH: 'Status',
											idValueField: '$rowNo',
							                id: 'internal-step-{value}-transaction-status',
							                sortData : true,
											filterType : 'translate',
											cssTemplate : 'text-center'
										}, {
											fieldName: '',
											labelEN: '',
											labelTH: '',
											cssTemplate: 'hidden-xs hidden-sm text-center',
											sortData: false,
											cellTemplate: '<scf-button class="btn-default gec-btn-action" id="transaction-{{data.transactionNo}}-view-button" title="View a transaction" ng-click="internalStepCtrl.view(data)"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></scf-button>'
										}]
							};

//							vm.data = [];
							
							vm.loadData = function(pagingModel){
						    	vm.pagingController.search(pagingModel);
						    }

							function splitCriteriaSortOrderData(data) {
								var dataSplit = data.split(",");
								var order = [];
								dataSplit.forEach(function(orderData) {
									var orderItem = orderData.split(":");
									var item = {
										fieldName : orderItem[0],
										direction : orderItem[1]
									}
									order.push(item);
								});
								return order;
							}
							
//							function splitCriteriaFilterData(data) {
//								var dataSplit = data.split(",");
//								var count = 0;
//								dataSplit.forEach(function(filterData) {
//									var filterItem = filterData.split(":");
//									vm.transactionCriteria[filterItem[0]] = filterItem[1];
//								});
//							}
							
							vm.decodeBase64 = function(data) {
								return atob(data);
							}
							
							vm.initLoad = function(pagingModel) {
//				                vm.pageModel.currentPage = 0;
//				                vm.pageModel.pageSizeSelectModel = '20';
//								vm.pageModel.clearSortOrder = !vm.pageModel.clearSortOrder;
//				                vm.transactionCriteria.page = 0;
//				                vm.transactionCriteria.pageSize = 20;
//								vm.searchTransaction();	
								vm.loadData(pagingModel);
							}
							
//							vm.searchTransactionService = function() {		
//								vm.transactionCriteria.supplierId = organizeId;
//								var dataSource = Service.requestURL('/api/v1/list-transaction/search',vm.transactionCriteria);
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