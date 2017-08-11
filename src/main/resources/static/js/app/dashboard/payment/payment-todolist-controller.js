angular.module('scfApp').controller('WaitForPaymentTodoListController',['$scope','$rootScope','PageNavigation','PagingController',
		function($scope,$rootScope,PageNavigation,PagingController){
	var vm = this;
	var organizeId = $rootScope.userInfo.organizeId;
	var todoListUrl = 'api/v1/list-transaction/todo-list';
	vm.dashboardItem = $scope.$parent.$parent.dashboardItem;
	
	vm.verify = false;

	vm.criteria = {
			organizeId: organizeId,
			statusCode: 'WAIT_FOR_VERIFY',
			transactionType: 'PAYMENT',
			orders: vm.dashboardItem.orderItems
	}

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

	vm.verifyPayment = function(data){
		PageNavigation.gotoPage('/payment-transaction/verify', {
			transactionModel: data
		});
	}
	
	vm.pagingController = PagingController.create(todoListUrl, vm.criteria, 'GET');

    vm.dataTable = {
            options: {
                displayRowNo: {
                	idValueField: 'template',
                	id: 'wait-for-verify-payment-{value}-row-no-label'
                }
            },
            columns: [{
                label: 'TP',
                sortData: true,
                cssTemplate: 'text-center',
				cellTemplate: '<img	title="{{data.supplier}}" style="height: 32px; width: 32px;"	'+
				'data-ng-src="data:image/png;base64,{{paymentTodoListCtrl.decodeBase64(data.supplierLogo)}}" data-err-src="images/png/avatar.png" />'
            },{
            	fieldName: 'transactionNo',
                label: 'Transaction No',
                idValueField: 'template',
                id: 'wait-for-verify-payment-{value}-transaction-no',
                sortable: false,
                cssTemplate: 'text-center',
            },{
            	fieldName: 'transactionDate',
                label: 'Payment date',
                idValueField: 'template',
                id: 'wait-for-verify-payment-{value}-payment-date',
                filterType: 'date',
                filterFormat: 'dd/MM/yyyy',
                sortable: false,
                cssTemplate: 'text-center'
            }, {
            	fieldName: 'noOfDocument',
                label: 'No of document',
                idValueField: 'template',
                id: 'wait-for-verify-payment-{value}-no-of-document',
                cssTemplate: 'text-right',
            }, {
            	fieldName: 'transactionAmount',
                label: 'Payment amount',
                idValueField: 'template',
                id: 'wait-for-verify-payment-{value}-payment-amount',
                sortable: false,
                cssTemplate: 'text-right',
                filterType: 'number',
                filterFormat: '2'
            },{
            	fieldName: 'action',
				label: '',
				cssTemplate: 'text-center',
				sortable: false,
				cellTemplate: '<scf-button class="btn-default gec-btn-action" ng-show="(paymentTodoListCtrl.verify && (data.statusCode === paymentTodoListCtrl.statusTransaction.waitForVerify))" id="wait-for-verify-payment-{{data.transactionNo}}-button" ng-click="paymentTodoListCtrl.verifyPayment(data)" title="Verify a payment"><i class="fa fa-inbox" aria-hidden="true"></i></scf-button>'
			}]
    };
    
	vm.initLoad = function(pagingModel){
		vm.pagingController.search(pagingModel);
	};
	
	vm.initLoad();
	
}]);