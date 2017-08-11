angular.module('scfApp').controller(
		'TransactionTodoListDashboardController',
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
					var transactionTodoListUrl = 'api/v1/list-transaction/todo-list';
					vm.dashboardItem = $scope.$parent.$parent.dashboardItem;
					
					vm.criteria = {
							organizeId: organizeId,
							statusCode: 'WAIT_FOR_VERIFY',
							transactionType: 'DRAWDOWN',
							orders: vm.dashboardItem.orderItems,
					}
					
					vm.verify = false;
					vm.approve = false;
					
					vm.statusTransaction = {
						waitForVerify: 'WAIT_FOR_VERIFY',
						waitForApprove: 'WAIT_FOR_APPROVE'
					}
					
					vm.decodeBase64 = function(data){
						if(angular.isUndefined(data)){
							return '';
						}
						return atob(data);
					}
					
					vm.verifyTransaction = function(data){
						PageNavigation.gotoPage('/verify-transaction', {
							transactionModel: data
						});
					}
					
					vm.pagingController = PagingController.create(transactionTodoListUrl, vm.criteria, 'GET');
					
				    vm.dataTable = {
				            options: {
				                displayRowNo: {
				                	idValueField: 'template',
				                	id: 'wait-for-verify-transaction-{value}-row-no-label'
				                }
				            },
				            columns: [{
				                label: 'TP',
				                sortData: true,
				                cssTemplate: 'text-center',
								cellTemplate: '<img	title="{{data.sponsor}}" style="height: 32px; width: 32px;"	'+
								'data-ng-src="data:image/png;base64,{{txnTodoListCtrl.decodeBase64(data.sponsorLogo)}}" data-err-src="images/png/avatar.png" />'
				            },{
				            	fieldName: 'transactionNo',
				                label: 'Transaction No',
				                idValueField: 'template',
				                id: 'wait-for-verify-transaction-{value}-transaction-no',
				                sortable: false,
				                cssTemplate: 'text-center',
				            },{
				            	fieldName: 'sponsorPaymentDate',
				                label: 'Sponsor payment date',
				                idValueField: 'template',
				                id: 'wait-for-verify-transaction-{value}-sponsor-payment-date',
				                filterType: 'date',
				                filterFormat: 'dd/MM/yyyy',
				                sortable: false,
				                cssTemplate: 'text-center'
				            }, {
				            	fieldName: 'noOfDocument',
				                label: 'No of document',
				                idValueField: 'template',
				                id: 'wait-for-verify-transaction-{value}-no-of-document',
				                cssTemplate: 'text-right',
				            }, {
				            	fieldName: 'transactionAmount',
				                label: 'Transaction amount',
				                idValueField: 'template',
				                id: 'wait-for-verify-transaction-{value}-transaction-amount',
				                sortable: false,
				                cssTemplate: 'text-right',
				                filterType: 'number',
				                filterFormat: '2'
				            },{
				            	fieldName: 'action',
								label: '',
								cssTemplate: 'text-center',
								sortable: false,
								cellTemplate: '<scf-button class="btn-default gec-btn-action" ng-show="(txnTodoListCtrl.verify && (data.statusCode === txnTodoListCtrl.statusTransaction.waitForVerify))" id="wait-for-verify-transaction-{{data.transactionNo}}-button" ng-click="txnTodoListCtrl.verifyTransaction(data)" title="Verify a transaction"><i class="fa fa-inbox" aria-hidden="true"></i></scf-button>'
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