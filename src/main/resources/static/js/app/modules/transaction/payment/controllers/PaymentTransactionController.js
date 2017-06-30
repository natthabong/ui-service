var txnMod = angular.module('gecscf.transaction');
txnMod.controller('PaymentTransactionController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'PaymentTransactionService',
		'PagingController', 'PageNavigation','UIFactory','$http', function($rootScope, $scope, $log, $stateParams, SCFCommonService, PaymentTransactionService
        , PagingController, PageNavigation, UIFactory,$http) {
	
	var vm = this;
	var log = $log;
    var ownerId = $rootScope.userInfo.organizeId;

    var organizeInfo = {
        organizeId : $rootScope.userInfo.organizeId,
        organizeName : $rootScope.userInfo.organizeName
    }

    vm.criteria = {
        dateFrom: '',
        dateTo: '',
        buyer: null,
        supplier: null,
        buyerCode: null,
		transactionNo: null,
        statusGroup: ''
	}

    vm.openDateFrom = false;
	vm.openDateTo = false;
	
	vm.openCalendarDateFrom = function() {
		vm.openDateFrom = true;
	}

	vm.openCalendarDateTo = function() {
		vm.openDateTo = true;
	}

    var prepareAutoSuggestLabel = function(item) {
		item.identity = [ 'sponsor-', item.organizeId, '-option' ].join('');
		item.label = [ item.organizeId, ': ', item.organizeName ].join('');
		return item;
	}

    var querySupplierCode = function(value) {
        var supplierCodeServiceUrl = 'api/v1/suppliers';
        value = value = UIFactory.createCriteria(value);
                
        return $http.get(supplierCodeServiceUrl, {
            params : {
            q : value,
            sponsorId : ownerId,
            offset : 0,
            limit : 5
        }
        }).then(function(response) {
            return response.data.map(function(item) {
                item.identity = [ 'supplier-', item.organizeId, '-option' ].join('');
                item.label = [ item.organizeId, ': ', item.organizeName ].join('');
                return item;
            });
        });
	};

	vm.supplierAutoSuggestModel = UIFactory.createAutoSuggestModel({
        placeholder : 'Enter organize name or code',
        itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
        query : querySupplierCode
	});

	var queryBuyerCode = function(value) {
        value = value = UIFactory.createCriteria(value);
        return $http.get('api/v1/sponsors', {
        params : {
            q : value,
            offset : 0,
            limit : 5
        }
        }).then(function(response) {
            return response.data.map(function(item) {
                item = prepareAutoSuggestLabel(item);
                return item;
            });
        });
	};

    vm.buyerAutoSuggestModel = UIFactory.createAutoSuggestModel({
        placeholder : 'Please Enter organize name or code',
        itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
        query : queryBuyerCode
	});

    var searchModel = {
			sponsorId : ownerId,
			supplierId : null,
			supplierCode : null,
			dateFrom : null,
			dateTo: null,
			transactionNo : null,
			statusGroup : '',
			transactionType: 'PAYMENT',
	}

    vm.pagingController = PagingController.create('api/v1/list-transaction/search', searchModel, 'GET');

    vm.dataTable = {
        options: {
            displayRowNo: {
            	idValueField: 'transactionNo',
            	id: 'transaction-{value}-row-no-label'
            }
        },
        expansion:{
        	expanded: true
        },
        columns: [{
			fieldName: '$rowNo',
            field: '$rowNo',
            label: 'No.',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-label',
            sortData: true,
            cssTemplate: 'text-center',
        },{
			fieldName: 'supplier',
            field: 'supplierLogo',
            label: 'Supplier',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-supplier-name-label',
            sortData: true,
            cssTemplate: 'text-center',
			dataRenderer: function(record){
				return '<img style="height: 32px; width: 32px;" data-ng-src="data:image/png;base64,'+atob(record.sponsorLogo)+'"></img>';
			}
        }, {
			fieldName: 'transactionNo',
            field: 'transactionNo',
            label: 'Transaction No',
            id: 'transaction-{value}-transaction-no-label',
            sortData: true,
            cssTemplate: 'text-center',
        },{
			fieldName: 'transactionDate',
            field: 'transactionDate',
            label: 'Payment Date',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-payment-date-label',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy',
            sortData: true,
            cssTemplate: 'text-center'
        },{
			fieldName: 'transactionAmount',
            field: 'transactionAmount',
            label: 'Payment Amount',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-payment-amount-label',
            sortData: true,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        },{
			fieldName: 'bankTransactionNo',
            field: 'bankTransactionNo',
            label: 'Bank Transaction No',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-bank-transaction-no-label',
            sortData: true,
            cssTemplate: 'text-center'
        },{
			fieldName: 'statusMessageKey',
            field: 'statusCode',
            label: 'Status',
            sortData: true,
            idValueField: 'transactionNo',
            id: 'status-{value}',
			filterType: 'translate',
            cssTemplate: 'text-center',
        },{
			fieldName: 'action',
			field: 'action',
			label: 'Action',
			cssTemplate: 'text-center',
			sortData: false,
			cellTemplate: '<scf-button class="btn-default gec-btn-action" ng-disabled="!(ctrl.verify && (data.statusCode === ctrl.statusDocuments.waitForVerify))" id="transaction-{{data.transactionNo}}-verify-button" ng-click="ctrl.verifyTransaction(data)" title="Verify"><i class="fa fa-inbox" aria-hidden="true"></i></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-approve-button" ng-disabled="!(ctrl.approve &&(data.statusCode === ctrl.statusDocuments.waitForApprove))" class="btn-default gec-btn-action"  ng-click="ctrl.approveTransaction(data)" title="Approve"><i class="fa fa-check-square-o" aria-hidden="true"></i></scf-button>' +
			'<scf-button class="btn-default gec-btn-action" id="transaction-{{data.transactionNo}}-view-button" ng-disabled="{{!ctrl.canView}}" ng-click="ctrl.view(data)" title="View"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-re-check-button" class="btn-default gec-btn-action" ng-disabled="{{!(data.retriable && ctrl.canRetry)}}" ng-click="ctrl.retry(data)" title="Re-check"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-print-button"class="btn-default gec-btn-action" ng-disabled="ctrl.disabledPrint(data.returnStatus)" ng-click="ctrl.printEvidenceFormAction(data)" title="Print"><span class="glyphicon glyphicon-print" aria-hidden="true"></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-reject-button"class="btn-default gec-btn-action" ng-disabled="ctrl.disabledReject(data)" ng-click="ctrl.confirmRejectPopup(data,\'clear\')" title="Reject"><i class="fa fa-times-circle" aria-hidden="true"></i></scf-button>'
		}]
    };

    vm.statusStepDropDown = [{
		label: 'All',
		value: ''
	}];

    vm.searchTrransaction = function(pagingModel) {
		vm.pagingController.search(pagingModel);
	}

    vm.initLoad = function() {

        var buyerInfo = prepareAutoSuggestLabel(organizeInfo);
        vm.criteria.sponsor = buyerInfo;

        vm.searchTrransaction();
        
		// var backAction = $stateParams.backAction;

		// if(backAction === true){
		// 	vm.listTransactionModel = $cookieStore.get(listStoreKey);
		// 	vm.dateModel.dateFrom = SCFCommonService.convertStringTodate(vm.listTransactionModel.dateFrom);
		// 	vm.dateModel.dateTo = SCFCommonService.convertStringTodate(vm.listTransactionModel.dateTo);			

		// 	if(vm.listTransactionModel.sponsorInfo != undefined){
				
		// 		vm.documentListModel.sponsor = sponsorInfo;
		// 	}
			
		// 	if(vm.listTransactionModel.supplierInfo != undefined){
		// 		var supplierInfo = prepareAutoSuggestLabel(vm.listTransactionModel.supplierInfo);
		// 		vm.documentListModel.supplier = supplierInfo;
		// 	}
		// }
    }();

} ]);