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
							splitCriteriaFilterData(vm.dashboardItem.filterItems);
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
							
//							vm.storeCriteria = function(){
//								$cookieStore.put(listStoreKey, vm.listTransactionModel);
//							}

							vm.view = function(data){		
								SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
								//vm.storeCriteria();
								var params = { transactionModel: data,
							            isShowViewHistoryButton: false,
							            isShowBackButton: true
							        }
								PageNavigation.gotoPage('/view-transaction',params,params)
							}

							vm.dataTable = {
								options : {
									displayRowNo : {}
								},
								columns : [
										{
											// field : 'sponsorLogo',
											label : 'TP',
											// sortData : true,
											cssTemplate : 'text-center'
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
								dataSplit.forEach(function(filterData) {
									var filterItem = filterData.split(":");
									if("statusGroup" == filterItem[0]){
										vm.transactionCriteria.statusGroup = filterItem[1];
									}else if("statusCode" == filterItem[0]){
										vm.transactionCriteria.statusCode = filterItem[1];
									}
								});
							}

							vm.decodeBase64 = function(data) {
								return atob(data);
							}
							vm.searchTransactionService = function() {									
								var dataSource = Service.requestURL('/api/list-transaction/search',vm.transactionCriteria);
								dataSource.promise.then(function(response) {
									vm.data = response.content;
					                vm.pageModel.totalRecord = response.totalElements;
					                vm.pageModel.totalPage = response.totalPages;
								}).catch();
							}
							
							vm.searchTransactionService();						
							vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
							
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
							
						} ]);