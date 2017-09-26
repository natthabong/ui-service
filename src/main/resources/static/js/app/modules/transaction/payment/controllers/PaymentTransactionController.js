var txnMod = angular.module('gecscf.transaction');
txnMod.controller('PaymentTransactionController', ['$rootScope', '$scope', '$log', '$stateParams', 'PaymentTransactionService',
		'PagingController', 'PageNavigation','UIFactory','$http', '$timeout','TransactionService', function($rootScope, $scope, $log, $stateParams, PaymentTransactionService
        , PagingController, PageNavigation, UIFactory,$http, $timeout,TransactionService) {
	
	var vm = this;
	var log = $log;

    vm.openDateFrom = false;
	vm.openDateTo = false;

    var viewMode = $stateParams.viewMode;

    var enumViewMode = {
        MY_ORGANIZE : 'MY_ORGANIZE',
        PARTNER : 'PARTNER',
        CUSTOMER : 'CUSTOMER'
    }

    var ownerId = $rootScope.userInfo.organizeId;

    var organizeInfo = {
        organizeId : $rootScope.userInfo.organizeId,
        organizeName : $rootScope.userInfo.organizeName
    }

    _sponsor = null;
    _supplier = null;

    vm.buyer = null;
    vm.supplier = $stateParams.supplier || null;

    var buyerPlaceholder = null;
    var supplierPlaceholder = null;

    vm.disableBuyerAutoSuggest = false;
    vm.disableSupplierAutoSuggest = false;

    vm.statusStepDropDown = [{
		label: 'All',
		value: ''
	}];
	
    vm.verify = false;
    vm.approve = false;
    vm.reject = false;

    vm.statusPaymentSuccess = 'PAYMENT_SUCCESS';
    
    vm.summaryInternalStep = {};
	vm.statusDocuments = {
		waitForVerify: 'WAIT_FOR_VERIFY',
		waitForApprove: 'WAIT_FOR_APPROVE',
		rejectByChecker: 'REJECT_BY_CHECKER',
		rejectByApprover: 'REJECT_BY_APPROVER',
		canceledBySupplier: 'CANCELLED_BY_SUPPLIER',
		rejectIncomplete: 'REJECT_INCOMPLETE'			
   }

    var _criteria = {};
   
    vm.criteria = $stateParams.criteria || {
        sponsorId : ownerId,
        supplierId : null,
        supplierCode : null,
        dateFrom : null,
        dateTo: null,
        transactionNo : null,
        statusGroup : '',
        transactionType: 'PAYMENT'
	}

    

    vm.dataTable = {
        identityField : 'transactionNo',
        options: {
            displayRowNo: {
            	idValueField: 'transactionNo',
            	id: 'transaction-{value}-row-no'
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
            id: 'transaction-{value}',
            sortData: true,
            cssTemplate: 'text-center',
        },{
			fieldName: 'supplier',
            field: 'supplierLogo',
            label: 'Supplier',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-supplier-name',
            sortData: true,
            cssTemplate: 'text-center',
			dataRenderer: function(record){
				return '<img title="'+record.supplier+'" style="height: 32px; width: 32px;" data-ng-src="data:image/png;base64,'+ (record.supplierLogo?atob(record.supplierLogo):UIFactory.constants.NOLOGO) +'"></img>';
			}
        }, {
			fieldName: 'transactionNo',
            field: 'transactionNo',
            label: 'Transaction no',
            id: 'transaction-{value}-transaction-no',
            sortData: true,
            cssTemplate: 'text-center',
        },{
			fieldName: 'transactionDate',
            field: 'transactionDate',
            label: 'Payment date',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-payment-date',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy',
            sortData: true,
            cssTemplate: 'text-center'
        },{
			fieldName: 'transactionAmount',
            field: 'transactionAmount',
            label: 'Payment amount',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-payment-amount',
            sortData: true,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        },{
			fieldName: 'bankTransactionNo',
            field: 'bankTransactionNo',
            label: 'Bank transaction no',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-bank-transaction-no',
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
			cellTemplate:'<scf-button class="btn-default gec-btn-action" ng-disabled="!(ctrl.verify && (data.statusCode === ctrl.statusDocuments.waitForVerify))" id="transaction-{{data.transactionNo}}-verify-button" ng-click="ctrl.verifyTransaction(data)" title="Verify"><i class="fa fa-inbox" aria-hidden="true"></i></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-approve-button" ng-disabled="false" class="btn-default gec-btn-action"  ng-click="ctrl.approveTransaction(data)" title="Approve"><i class="fa fa-check-square-o" aria-hidden="true"></i></scf-button>' +
			'<scf-button class="btn-default gec-btn-action" id="transaction-{{data.transactionNo}}-view-button" ng-disabled="{{!ctrl.canView}}" ng-click="ctrl.viewTransaction(data)" title="View"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-re-check-button" class="btn-default gec-btn-action" ng-disabled="{{!(data.retriable && ctrl.canRetry)}}" ng-click="ctrl.retry(data)" title="Re-check"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></scf-button>'+
            '<scf-button class="btn-default gec-btn-action" ng-show ="data.statusCode == ctrl.statusPaymentSuccess" ng-disabled="data.statusCode != ctrl.statusPaymentSuccess" title="Print">'+
			'<span class="dropdown"><span class="dropdown-toggle" data-toggle="dropdown" id="transaction-{{data.transactionNo}}-print-button">'+
            '<i class="fa fa-print" aria-hidden="true"></i></span>'+
            '<ul class="dropdown-menu">'+
            '<li><a id="evident-form-label" ng-click="ctrl.printEvidence(data)">{{"Evident form" | translate}}</a></li>'+
            '<li role="separator" class="divider"></li>'+
            '<li><a id="credit-advice-form-label" ng-click="ctrl.generateCreditAdviceForm(data)">{{"Credit advice form" | translate}}</a></li></ul></span></scf-button>'+
            '<scf-button class="btn-default gec-btn-action" id="transaction-{{data.transactionNo}}-print-button-disable" ng-hide ="data.statusCode == ctrl.statusPaymentSuccess" ng-disabled="true" title="Print"><i class="fa fa-print" aria-hidden="true"></i></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-reject-button"class="btn-default gec-btn-action" ng-disabled="ctrl.disabledReject(data)" ng-click="ctrl.confirmRejectPopup(data,\'clear\')" title="Reject"><i class="fa fa-times-circle" aria-hidden="true"></i></scf-button>'
		}]
    };

    vm.pagingController = PagingController.create('api/v1/list-transaction', _criteria, 'GET');

    _clearSummaryStatus = function(){
		vm.summaryInternalStep = {
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
			  cancel_by_buyer:{
				  totalRecord: 0,
				  totalAmount: 0              
			  }		
		};
    }

    function _loadSummaryOfTransaction(criteria){
    	
    	_clearSummaryStatus();
    	
    	if(criteria.statusGroup == 'INTERNAL_STEP' || criteria.statusGroup == '' ){
	        var criteriaSummary = {
	            sponsorId : criteria.sponsorId,
	            supplierId : criteria.supplierId,
	            statusGroup : criteria.statusGroup,
	            transactionType : criteria.transactionType,
	            transactionNo : criteria.transactionNo,
	            supplierCode: criteria.supplierCode,
	            dateFrom: criteria.dateFrom,
	            dateTo: criteria.dateTo
	        }
	        
	    	var deffered = PaymentTransactionService.getSummaryOfTransaction(criteriaSummary);
	    	deffered.promise.then(function(response) {
				var summaryInternalStep = response.data;
				summaryInternalStep.forEach(function(summary) {
					if(vm.summaryInternalStep[summary.statusMessageKey]){
						
						vm.summaryInternalStep[summary.statusMessageKey].totalRecord = summary.totalRecord;
						vm.summaryInternalStep[summary.statusMessageKey].totalAmount = summary.totalAmount;
					}
				});
			}).catch(function(response) {
				$log.error('Summary Group Status Error');
			});
    	}
    }

    vm.loadData = function(pagingModel){
    	vm.pagingController.search(pagingModel);
    }

    function _loadTransactionGroup(){
        var transactionStatusGroupDefered = PaymentTransactionService.getTransactionStatusGroups('PAYMENT');
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

    function _validateForSearch(){
    	$scope.errors = {};
    	var valid = true;
    	
    	if((vm.criteria.dateFrom != null && !angular.isDate(vm.criteria.dateFrom)) || !angular.isDefined(vm.criteria.dateFrom)){
			valid = false;
			$scope.errors.transactionDateFormat = {
                message : 'Wrong date format data.'
            }
		}else if((vm.criteria.dateTo != null && !angular.isDate(vm.criteria.dateTo)) || !angular.isDefined(vm.criteria.dateTo)){
			valid = false;
			$scope.errors.transactionDateFormat = {
                message : 'Wrong date format data.'
            }
		}else{
			var isDateFromAfterDateTo = moment(vm.criteria.dateFrom).isAfter(vm.criteria.dateTo);
	    	
            if(isDateFromAfterDateTo){
                valid = false;
                $scope.errors.transactionDateFormat = {
                    message : 'From date must be less than or equal to To date.'
                }
            }
		}
    	
    	return valid;
    }

    vm.searchTransaction = function(pagingModel) {
    	if(_validateForSearch()){
	    	angular.copy(vm.criteria, _criteria);
	    	if(vm.buyer){
	    		_criteria.sponsorId = vm.buyer.organizeId;
	            _sponsor = vm.buyer;
	    	}
	    	if(vm.supplier){
	    		_criteria.supplierId = vm.supplier.organizeId;
	            _supplier = vm.supplier;
	    	}
	    	vm.loadData(pagingModel || ( $stateParams.backAction? {
	    		offset : _criteria.offset,
				limit : _criteria.limit
	    	}: undefined));
	    	if($stateParams.backAction){
	    		$stateParams.backAction = false;
	    	}
	    	_loadSummaryOfTransaction(_criteria);
    	}
	}

    var prepareAutoSuggestLabel = function(item,role) {
		item.identity = [ role,'-', item.organizeId, '-option' ].join('');
		item.label = [ item.organizeId, ': ', item.organizeName ].join('');
		item.value = item.organizeId;
		return item;
	}
    
    var querySupplierAutoSuggest = function(value) {
        value = value = UIFactory.createCriteria(value);
        return $http.get('api/v1/suppliers', {
        params : {
            q : value,
            offset : 0,
            limit : 5
        }
        }).then(function(response) {
            return response.data.map(function(item) {
                item = prepareAutoSuggestLabel(item,'supplier');
                return item;
            });
        });
	};

	var queryBuyerAutoSuggest = function(value) {
        value = value = UIFactory.createCriteria(value);
        return $http.get('api/v1/buyers', {
        params : {
            q : value,
            offset : 0,
            limit : 5
        }
        }).then(function(response) {
            return response.data.map(function(item) {
                item = prepareAutoSuggestLabel(item,'buyer');
                return item;
            });
        });
	};
    
    var initLoad = function() {
        if(viewMode == enumViewMode.MY_ORGANIZE){
            vm.disableBuyerAutoSuggest = true;
            vm.disableSupplierAutoSuggest = false;

            buyerPlaceholder = 'Please Enter organize name or code';
            supplierPlaceholder = 'Enter organize name or code';
            
            vm.buyer = prepareAutoSuggestLabel(organizeInfo,'buyer');

        }else if(viewMode == enumViewMode.PARTNER){
            vm.disableBuyerAutoSuggest = false;
            vm.disableSupplierAutoSuggest = true;

            buyerPlaceholder = 'Enter organize name or code';
            supplierPlaceholder = 'Please Enter organize name or code';
            
            vm.supplier = prepareAutoSuggestLabel(organizeInfo,'supplier');

        }else if(viewMode == enumViewMode.CUSTOMER){

        }

        _clearSummaryStatus();
        
        vm.searchTransaction();
        _loadTransactionGroup();
    }();

    vm.supplierAutoSuggestModel = UIFactory.createAutoSuggestModel({
        placeholder : supplierPlaceholder,
        itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
        query : querySupplierAutoSuggest
	});

    vm.buyerAutoSuggestModel = UIFactory.createAutoSuggestModel({
        placeholder : buyerPlaceholder,
        itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
        query : queryBuyerAutoSuggest
	});

    vm.disabledPrint = function(){
    	return true;
    }
    vm.disabledReject = function(data){
    	return true;
    }
    
    vm.viewTransaction = function(transactionModel){
		$timeout(function(){		
			PageNavigation.nextStep('/payment-transaction/view', 
                {viewMode: viewMode, transactionModel: transactionModel, isShowViewHistoryButton: false, isShowBackButton: true},
                {criteria : _criteria,buyer : _sponsor,supplier : _supplier});
    	}, 10);
	};
	
	vm.verifyTransaction = function(data){
		var params = {transaction: data};
        $timeout(function(){
		    PageNavigation.nextStep('/payment-transaction/verify',params,
            {criteria : _criteria,buyer : _sponsor,supplier : _supplier})
        }, 10);
	}
	
	vm.approveTransaction = function(data){ 
		var params = {transaction: data};
        $timeout(function(){
		    PageNavigation.nextStep('/payment-transaction/approve',params,
            {criteria : _criteria,buyer : _sponsor,supplier : _supplier})
        }, 10);
	}
	
	vm.generateCreditAdviceForm = function(data){
		PaymentTransactionService.generateCreditAdviceForm(data);
	}

    vm.printEvidence = function(transaction){
        console.log(transaction);
        var deffered = TransactionService.getTransaction(transaction);
        deffered.promise.then(function(response){
            TransactionService.generateEvidenceForm(transaction);
        }).catch(function(response){
            log.error("Load transaction fail!");
        });
    }

    vm.openCalendarDateFrom = function() {
		vm.openDateFrom = true;
	}

	vm.openCalendarDateTo = function() {
		vm.openDateTo = true;
	}

} ]);