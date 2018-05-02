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
				'UIFactory',
				function($log, $scope, $state, $stateParams, $timeout,
						PageNavigation, PagingController, Service, SCFCommonService, $rootScope, UIFactory) {
					var vm = this;
					var log = $log;
					var organizeId = $rootScope.userInfo.organizeId;
					var approveTransactionTodoListUrl = 'api/v1/list-transaction/todo-list';

					vm.splitePageTxt = '';					
					vm.dashboardItem = $scope.$parent.$parent.dashboardItem;
					
					vm.criteria = {
							organizeId: organizeId,
							statusCode: 'WAIT_FOR_APPROVE',
							transactionType: 'DRAWDOWN',
							orders: vm.dashboardItem.orderItems,
					}
					
					vm.statusTransaction = {
						waitForApprove: 'WAIT_FOR_APPROVE'
					}
					
					vm.decodeBase64 = function (data) {
						return (data ? atob(data) : UIFactory.constants.NOLOGO);
					};
					
					vm.approveTransaction = function(data){
						PageNavigation.gotoPage('/approve-transaction/approve', {
							transaction: data
						});
					}
					
					vm.pagingController = PagingController.create(approveTransactionTodoListUrl, vm.criteria, 'GET');
					
				    vm.dataTable = {
				    		options : {
								displayRowNo: {
									idValueField: 'template',
									id: 'wait-for-approve-transaction-{value}-row-no-label',
									cssTemplate : 'text-right'
								}
							},
				            columns: [
							{
				            	fieldName: 'sponsor',
					            field: 'sponsorLogo',
					            label: 'TP',
					            idValueField: 'template',
					            sortData: true,
					            cssTemplate: 'text-center',
								dataRenderer: function(record){
									return '<img id="buyer-" title="{{data.sponsor}}" style="height: 32px; width: 32px;"'+
									'data-ng-src="data:image/png;base64,{{approveTxnTodoListCtrl.decodeBase64(data.sponsorLogo)}}" />';
								}
				            },{
				                fieldName: 'transactionNo',
					            field: 'transactionNo',
				                label: 'Transaction No.',
				                idValueField: 'template',
				                id: 'wait-for-approve-transaction-{value}-transaction-no',
				                cssTemplate: 'text-center',
				            },{
				            	fieldName: 'sponsorPaymentDate',
					            field: 'sponsorPaymentDate',
				                label: 'Buyer payment date',
				                idValueField: 'template',
				                id: 'wait-for-approve-transaction-{value}-sponsor-payment-date',
				                filterType: 'date',
				                filterFormat: 'dd/MM/yyyy',
				                cssTemplate: 'hidden-sm hidden-xs text-center'
				            },{
				            	fieldName: 'noOfDocument',
					            field: 'noOfDocument',
				                label: 'No of document',
				                idValueField: 'template',
				                id: 'wait-for-approve-transaction-{value}-no-of-document',
				                cssTemplate: 'hidden-sm hidden-xs text-right',
				            },{
				            	fieldName: 'transactionAmount',
					            field: 'transactionAmount',
				                label: 'Transaction amount',
				                idValueField: 'template',
				                id: 'wait-for-approve-transaction-{value}-transaction-amount',
				                cssTemplate: 'text-right',
				                filterType: 'number',
				                filterFormat: '2'
				            },{
				            	fieldName: 'action',
								label: '',
								cssTemplate: 'text-center',
								sortable: false,
								cellTemplate: '<scf-button class="btn-sm btn-default gec-btn-action" ng-show="data.statusCode === approveTxnTodoListCtrl.statusTransaction.waitForApprove" id="wait-for-approve-transaction-{{data.transactionNo}}-button" ng-click="approveTxnTodoListCtrl.approveTransaction(data)" title="Approve a transaction"><i class="fa fa-check-square-o" aria-hidden="true"></i></scf-button>'
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