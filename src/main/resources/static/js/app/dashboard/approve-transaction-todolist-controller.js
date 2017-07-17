angular.module('scfApp').controller(
		'ApproveTransactionTodoListDashboardController',
		[
				'$log',
				'$scope',
				'$state',
				'$stateParams',
				'$timeout',
				'PageNavigation',
				'PagingController',
				'Service', 
				'SCFCommonService',
				'$rootScope', 
				function($log, $scope, $state, $stateParams, $timeout,
						PageNavigation, PagingController, Service, SCFCommonService, $rootScope) {
					var vm = this;
					var log = $log;
					var organizeId = $rootScope.userInfo.organizeId;
					var approveTransactionTodoListUrl = 'api/v1/list-transaction/todo-list';

					vm.approve = false;
					vm.splitePageTxt = '';					
					vm.dashboardItem = $scope.$parent.$parent.dashboardItem;
					
					vm.criteria = {
							supplierId: organizeId,
							statusCode: 'WAIT_FOR_APPROVE',
							transactionType: 'DRAWDOWN',
							orders: vm.dashboardItem.orderItems,
					}
					
					vm.statusTransaction = {
						waitForApprove: 'WAIT_FOR_APPROVE'
					}
					
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
					
					vm.pagingController = PagingController.create(approveTransactionTodoListUrl, vm.criteria, 'GET');
					
				    vm.dataTable = {
				            columns: [
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
								'data-ng-src="data:image/png;base64,{{approveTxnTodoListCtrl.decodeBase64(data.sponsorLogo)}}" data-err-src="images/png/avatar.png" />'
				            },{
				                fieldName: 'transactionNo',
				                labelEN: 'Transaction No',
				                labelTH: 'Transaction No',
				                idValueField: '$rowNo',
				                id: 'wait-for-approve-transaction-{value}-transaction-no',
				                sortable: true,
				                cssTemplate: 'text-center',
				            },{
				            	fieldName: 'sponsorPaymentDate',
				                labelEN: 'Sponsor payment date',
				                labelTH: 'Sponsor payment date',
				                idValueField: '$rowNo',
				                id: 'wait-for-approve-transaction-{value}-sponsor-payment-date',
				                filterType: 'date',
				                filterFormat: 'dd/MM/yyyy',
				                sortable: true,
				                cssTemplate: 'hidden-sm hidden-xs text-center'
				            }, {
				            	fieldName: 'noOfDocument',
				                labelEN: 'No of document',
				                labelTH: 'No of document',
				                idValueField: '$rowNo',
				                id: 'wait-for-approve-transaction-{value}-no-of-document',
				                cssTemplate: 'hidden-sm hidden-xs text-center',
				            }, {
				            	fieldName: 'transactionAmount',
				                labelEN: 'Transaction amount',
				                labelTH: 'Transaction amount',
				                idValueField: '$rowNo',
				                id: 'wait-for-approve-transaction-{value}-transaction-amount',
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
				    
				    vm.loadData = function(pagingModel){
				    	vm.pagingController.search(pagingModel);
				    }

					
					vm.initLoad = function(pagingModel){
						vm.loadData(pagingModel);
					};
					
					vm.initLoad();

				} ]);