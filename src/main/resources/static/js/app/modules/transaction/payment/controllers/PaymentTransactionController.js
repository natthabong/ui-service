var txnMod = angular.module('gecscf.transaction');
txnMod.controller('PaymentTransactionController', ['$rootScope', '$scope', '$log', '$stateParams', 'PaymentTransactionService',
		'PagingController', 'PageNavigation','UIFactory','$http', '$timeout', function($rootScope, $scope, $log, $stateParams, PaymentTransactionService
        , PagingController, PageNavigation, UIFactory,$http, $timeout) {
	
	var vm = this;
	var log = $log;
    var ownerId = $rootScope.userInfo.organizeId;
    vm.sponsor = null;
    vm.supplier = null;
    var organizeInfo = {
        organizeId : $rootScope.userInfo.organizeId,
        organizeName : $rootScope.userInfo.organizeName
    }
    vm.summaryStatusGroup = {};
	vm.statusDocuments = {
		waitForVerify: 'WAIT_FOR_VERIFY',
		waitForApprove: 'WAIT_FOR_APPROVE',
		rejectByChecker: 'REJECT_BY_CHECKER',
		rejectByApprover: 'REJECT_BY_APPROVER',
		canceledBySupplier: 'CANCELLED_BY_SUPPLIER',
		rejectIncomplete: 'REJECT_INCOMPLETE'			
   }
    var _criteria = {};
    
    vm.criteria = {
			sponsorId : ownerId,
			supplierId : null,
			supplierCode : null,
			dateFrom : null,
			dateTo: null,
			transactionNo : null,
			statusGroup : '',
			transactionType: 'PAYMENT'
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
		item.value = item.organizeId;
		return item;
	}

    var querySupplierId = function(value) {
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
        query : querySupplierId
	});

	var queryBuyerId = function(value) {
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
        query : queryBuyerId
	});


    vm.pagingController = PagingController.create('api/v1/list-transaction', _criteria, 'GET');

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
			cellTemplate:
			'<scf-button id="transaction-{{data.transactionNo}}-approve-button" ng-disabled="!(ctrl.approve &&(data.statusCode === ctrl.statusDocuments.waitForApprove))" class="btn-default gec-btn-action"  ng-click="ctrl.approveTransaction(data)" title="Approve"><i class="fa fa-check-square-o" aria-hidden="true"></i></scf-button>' +
			'<scf-button class="btn-default gec-btn-action" id="transaction-{{data.transactionNo}}-view-button" ng-click="ctrl.viewTransaction(data)" title="View"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-re-check-button" class="btn-default gec-btn-action" ng-disabled="{{!(data.retriable && ctrl.canRetry)}}" ng-click="ctrl.retry(data)" title="Re-check"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-print-button"class="btn-default gec-btn-action" ng-disabled="ctrl.disabledPrint(data.returnStatus)" ng-click="ctrl.printEvidenceFormAction(data)" title="Print"><span class="glyphicon glyphicon-print" aria-hidden="true"></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-reject-button"class="btn-default gec-btn-action" ng-disabled="ctrl.disabledReject(data)" ng-click="ctrl.confirmRejectPopup(data,\'clear\')" title="Reject"><i class="fa fa-times-circle" aria-hidden="true"></i></scf-button>'
		}]
    };
    
    
	
    vm.statusStepDropDown = [{
		label: 'All',
		value: ''
	}];

    function _loadTransactionGroup(){
        var transactionStatusGroupDefered = PaymentTransactionService.getTransactionStatusGroups();
        transactionStatusGroupDefered.promise.then(function(response) {
            var transactionStatusGroupList = response.data;
            if (transactionStatusGroupList !== undefined) {
                transactionStatusGroupList.forEach(function(obj) {
                    var selectObj = {
                        label: obj.statusMessageKey,
                        value: obj.statusGroup
                    }
                    vm.statusStepDropDown.push(selectObj);
                });
            }
        }).catch(function(response) {
			$log.error('Load TransactionStatusGroup Fail');
        });    	
    };
    
    function _loadSummaryOfTransaction(criteria){
    	var deffered = PaymentTransactionService.getSummaryOfTransaction(criteria);
    	deffered.promise.then(function(response) {
			var summaryStatusGroup = response.data;
			summaryStatusGroup.forEach(function(summary) {
				if(vm.summaryStatusGroup[summary.statusMessageKey]){
					
					vm.summaryStatusGroup[summary.statusMessageKey].totalRecord = summary.totalRecord;
					vm.summaryStatusGroup[summary.statusMessageKey].totalAmount = summary.totalAmount;
				}
			});
		}).catch(function(response) {
			$log.error('Summary Group Status Error');
		});
    }
   _clearSummaryStatus = function(){
		vm.summaryStatusGroup = {
			wait_for_verify: {
				totalRecord: 0,
				totalAmount: 0
			  },
			 wait_for_approve:{
				  totalRecord: 0,
				  totalAmount: 0
			 },
			 reject_by_checker:{
				  totalRecord: 0,
				  totalAmount: 0
			  },
			 reject_by_approver:{
				  totalRecord: 0,
				  totalAmount: 0
			  },
			  cancelled_by_supplier:{
				  totalRecord: 0,
				  totalAmount: 0              
			  }		
		};
    }
    vm.loadData = function(pagingModel){
    	vm.pagingController.search(pagingModel);
    }
    vm.searchTransaction = function(pagingModel) {
    	angular.copy(vm.criteria, _criteria);
    	if(vm.sponsor){
    		_criteria.sponsorId = vm.sponsor.organizeId;
    	}
    	if(vm.supplier){
    		_criteria.supplierId = vm.supplier.organizeId;
    	}
    	vm.loadData(pagingModel);
    	_loadSummaryOfTransaction(_criteria);
	}
    
    vm.viewTransaction = function(transactionModel){			
		$timeout(function(){		
			PageNavigation.gotoPage('/payment-transaction/view', {transactionModel: transactionModel, isShowViewHistoryButton: false, isShowBackButton: true});
    	}, 10);
	};
	

	vm.approveTransaction = function(data){ 
		var params = {transaction: data};
		PageNavigation.gotoPage('/payment-transaction/approve',params,params)
	}

    vm.initLoad = function() {

        var buyerInfo = prepareAutoSuggestLabel(organizeInfo);
        vm.sponsor = buyerInfo;

        _clearSummaryStatus();
        
        vm.searchTransaction();
        _loadTransactionGroup();
       
    }();

} ]);