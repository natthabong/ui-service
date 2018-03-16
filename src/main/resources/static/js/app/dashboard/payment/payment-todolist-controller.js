angular
		.module('scfApp')
		.controller(
				'WaitForPaymentTodoListController',
				[
						'$scope',
						'$rootScope',
						'PageNavigation',
						'PagingController',
						'UIFactory',
						function($scope, $rootScope, PageNavigation,
								PagingController, UIFactory) {
							var vm = this;
							var organizeId = $rootScope.userInfo.organizeId;
							var todoListUrl = 'api/v1/list-transaction/todo-list';
							vm.dashboardItem = $scope.$parent.$parent.dashboardItem;

							vm.criteria = {
								organizeId : organizeId,
								statusCode : 'WAIT_FOR_VERIFY',
								transactionType : 'PAYMENT',
								orders : vm.dashboardItem.orderItems
							}

							vm.statusTransaction = {
								waitForVerify : 'WAIT_FOR_VERIFY'
							}

							vm.decodeBase64 = function (data) {
								return (data ? atob(data) : UIFactory.constants.NOLOGO);
							};

							vm.verifyPayment = function(data) {
								PageNavigation.nextStep(
										'/payment-transaction/verify', {
											transaction : data
										}, {});
							}

							vm.pagingController = PagingController.create(
									todoListUrl, vm.criteria, 'GET');

							vm.dataTable = {
								options : {
									displayRowNo: {
										idValueField: 'template',
										id: 'wait-for-verify-payment-{value}-row-no-label',
										cssTemplate : 'text-right'
									}
								},
								columns : [
									{
						            	fieldName: 'supplier',
							            field: 'supplierLogo',
										label : 'TP',
							            idValueField: 'template',
										sortData : true,
										cssTemplate : 'text-center',
										dataRenderer: function(record){
											return '<img id="supplier-" title="{{data.supplier}}" style="height: 32px; width: 32px;"'+
											'data-ng-src="data:image/png;base64,{{paymentTodoListCtrl.decodeBase64(data.supplierLogo)}}" />';
										}
									},
									{
										fieldName : 'transactionNo',
							            field: 'transactionNo',
										label : 'Transaction No.',
										idValueField : 'template',
										id : 'wait-for-verify-payment-{value}-transaction-no',
										sortable : false,
										cssTemplate : 'text-center',
									},
									{
										fieldName : 'transactionDate',
							            field: 'transactionDate',
										label : 'Payment date',
										idValueField : 'template',
										id : 'wait-for-verify-payment-{value}-payment-date',
										filterType : 'date',
										filterFormat : 'dd/MM/yyyy',
										sortable : false,
										cssTemplate : 'text-center'
									},
									{
										fieldName : 'noOfDocument',
							            field: 'noOfDocument',
										label : 'No of document',
										idValueField : 'template',
										id : 'wait-for-verify-payment-{value}-no-of-document',
										cssTemplate : 'text-right'
									},
									{
										fieldName : 'transactionAmount',
							            field: 'transactionAmount',
										label : 'Payment amount',
										idValueField : 'template',
										id : 'wait-for-verify-payment-{value}-payment-amount',
										sortable : false,
										cssTemplate : 'text-right',
										filterType : 'number',
										filterFormat : '2'
									},
									{
										fieldName : 'action',
										label : '',
										cssTemplate : 'text-center',
										sortable : false,
										cellTemplate : '<scf-button class="btn-default gec-btn-action" ng-show="data.statusCode === paymentTodoListCtrl.statusTransaction.waitForVerify" id="wait-for-verify-payment-{{data.transactionNo}}-button" ng-click="paymentTodoListCtrl.verifyPayment(data)" title="Verify a payment"><i class="fa fa-inbox" aria-hidden="true"></i></scf-button>'
									} ]
							};

							vm.initLoad = function(pagingModel) {
								vm.pagingController.search(pagingModel);
							};

							vm.initLoad();

						} ]);