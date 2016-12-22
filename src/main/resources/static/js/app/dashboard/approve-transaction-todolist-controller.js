angular.module('scfApp').controller(
		'ApproveTransactionTodoListDashboardController',
		[
				'$log',
				'$scope',
				'$state',
				'$stateParams',
				'$timeout',
				'PageNavigation',
				'Service', 'SCFCommonService',
				function($log, $scope, $state, $stateParams, $timeout,
						PageNavigation, Service, SCFCommonService) {
					var vm = this;
					var log = $log;
					var approveTransactionTodoListUrl = 'api/list-transaction/todo-list';

					vm.approve = false;
					vm.splitePageTxt = '';					
					vm.layout = $scope.$parent.$parent.layout;
					var orderItems  = splitCriteriaData(vm.layout.orderItems);
					var filterStatusCodeItem = splitFilterStatusCode(vm.layout.filterItems);
					
					vm.tableRowCollection = [];
					
				    vm.pageModel = {
				            pageSizeSelectModel: '20',
				            totalRecord: 0,
							totalPage: 0,
				    		clearSortOrder: false
				    };

				    vm.pageSizeList = [{
				        label: '10',
				        value: '10'
				    }, {
				        label: '20',
				        value: '20'
				    }, {
				        label: '50',
				        value: '50'
				    }];
					
					vm.statusTransaction = {
						waitForApprove: 'WAIT_FOR_APPROVE'
					}
					
					// Create transactionCriteriaModel for criteria
					vm.transactionCriteriaModel = {
						orders: orderItems,
						statusCode: filterStatusCodeItem,
						page: 0,
						pageSize: 20,
						dateType: 'sponsorPaymentDate'
					};

					vm.searchTransaction = function(criteria){
						if(!angular.isUndefined(criteria)){							
							vm.pageModel.pageSizeSelectModel = criteria.pageSize;
							vm.transactionCriteriaModel.page = criteria.page;
							vm.transactionCriteriaModel.pageSize = criteria.pageSize;
							vm.transactionCriteriaModel.orders = orderItems;
							vm.pageModel.clearSortOrder = !vm.pageModel.clearSortOrder;
						}
						callService(vm.transactionCriteriaModel);						
					};
					
					vm.searchTransaction();
					
					vm.decodeBase64 = function(data){
						if(angular.isUndefined(data)){
							return '';
						}
						return atob(data);
					}
					
					vm.approveTransaction = function(data){
						PageNavigation.gotoPage('/approve-transaction/approve', {
							transaction: data
						});
					}

					function callService(criteria){
						var serviceDiferred = Service.requestURL(approveTransactionTodoListUrl, criteria, 'POST');						
						serviceDiferred.promise.then(function(response){
							vm.data = response.content;
							vm.pageModel.totalRecord = response.totalElements;
							vm.pageModel.totalPage = response.totalPages;
							vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.transactionCriteriaModel.page, vm.pageModel.totalRecord);
						}).catch(function(response){
							log.error('Load Transaction todo list error');
						});
					}
					
					$scope.sortData = function(order, orderBy){
						var orderItem = {
							fieldName: order,
							direction:  orderBy.toUpperCase()
						}						
						var sortOrderItems = [];
						sortOrderItems.push(orderItem);
						vm.transactionCriteriaModel.orders = sortOrderItems;
						vm.searchTransaction(undefined);
					}
				    vm.dataTable = {
				            columns: [
							{
							    fieldName: '$rowNo',
								labelEN: 'No.',
							    labelTH: 'ลำดับที่',
							    idValueField: '$rowNo',
							    id: 'internal-step-{value}-no-label',
							    cssTemplate: 'text-center',	
							},
				            {
				                labelEN: 'TP',
				                labelTH: 'TP',
				                sortData: true,
				                cssTemplate: 'text-center',
								cellTemplate: '<img	title="{{data.sponsor}}" style="height: 32px; width: 32px;"	'+
								'data-ng-src="data:image/png;base64,{{approveTxnTodoListCtrl.decodeBase64(data.sponsorLogo)}}" data-err-src="images/png/avatar.png" />'
				            },{
				                fieldName: 'transactionNo',
				                labelEN: 'Transaction No',
				                labelTH: 'Transaction No',
				                idValueField: '$rowNo',
				                id: 'wait-for-approve-transaction-{value}-transaction-no-label',
				                sortable: true,
				                cssTemplate: 'text-center',
				            },{
				            	fieldName: 'sponsorPaymentDate',
				                labelEN: 'Sponsor payment date',
				                labelTH: 'Sponsor payment date',
				                idValueField: '$rowNo',
				                id: 'wait-for-approve-transaction-{value}-sponsor-payment-date-label',
				                filterType: 'date',
				                filterFormat: 'dd/MM/yyyy',
				                sortable: true,
				                cssTemplate: 'hidden-sm hidden-xs text-center'
				            }, {
				            	fieldName: 'noOfDocument',
				                labelEN: 'No of document',
				                labelTH: 'No of document',
				                idValueField: '$rowNo',
				                id: 'wait-for-approve-transaction-{value}-no-of-document-label',
				                cssTemplate: 'hidden-sm hidden-xs text-center',
				            }, {
				            	fieldName: 'drawdownAmount',
				                labelEN: 'Transaction amount',
				                labelTH: 'Transaction amount',
				                idValueField: '$rowNo',
				                id: 'wait-for-approve-transaction-{value}-transaction-amount-label',
				                sortable: true,
				                cssTemplate: 'text-right',
				                filterType: 'number',
				                filterFormat: '2'
				            },{
				            	fieldName: 'action',
								labelEN: 'Action',
								labelTH: 'Action',
								cssTemplate: 'text-center',
								sortable: false,
								cellTemplate: '<scf-button class="btn-default gec-btn-action" ng-show="(approveTxnTodoListCtrl.approve && (data.statusCode === approveTxnTodoListCtrl.statusTransaction.waitForApprove))" id="wait-for-approve-transaction-{{data.transactionNo}}-button" ng-click="approveTxnTodoListCtrl.approveTransaction(data)" title="Approve a transaction"><i class="fa fa-check-square-o" aria-hidden="true"></i></scf-button>'
							}]
				    };
				    
					function splitCriteriaData(data){
						var dataSplit = data.split(",");
						var order = [];
						dataSplit.forEach(function(orderData){
							var orderItem = orderData.split(":");
							var item = {
									fieldName: orderItem[0],
									direction:  orderItem[1]
							}
							order.push(item);
						});
						
						return order;
					}
					
					function splitFilterStatusCode(data){
						var filterItem = data.split(":");
						return filterItem[1];
					}

				} ]);