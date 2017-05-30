angular.module('scfApp').controller('ListTransactionController', ['ListTransactionService', 'TransactionService', '$state', '$timeout','$translate', 
'$rootScope', '$scope', 'SCFCommonService', '$stateParams', '$cookieStore' , 'UIFactory', 'PageNavigation','ngDialog','$log','$http','$q','Service',
function(ListTransactionService, TransactionService, $state, $timeout,$translate, 
$rootScope, $scope, SCFCommonService, $stateParams, $cookieStore, UIFactory, PageNavigation, ngDialog, $log, $http, $q, Service) {
    var vm = this;
	var log = $log;
    var listStoreKey = 'listrancri';
    var organizeId = $rootScope.userInfo.organizeId;
    var sponsorAutoSuggestServiceUrl;
    var displayBank = false;
	var displaySponsor = false;
	var displaySupplier = false;
    vm.showInfomation = false;
    var sponsorInfo = null;
    var supplierInfo = null;
    vm.splitePageTxt = '';
    vm.transactionType = {
            transactionDate: 'transactionDate',
            maturityDate: 'maturityDate'
    }
        // Data Sponsor for select box
	vm.verify = false;
	vm.approve = false;
	vm.transactionIdForRetry = '';
	vm.transaction = {};
	vm.statusDocuments = {
		waitForVerify: 'WAIT_FOR_VERIFY',
		waitForApprove: 'WAIT_FOR_APPROVE',
		rejectByChecker: 'REJECT_BY_CHECKER',
		rejectByApprover: 'REJECT_BY_APPROVER',
		canceledBySupplier: 'CANCELLED_BY_SUPPLIER',
		waitForDrawdownResult: 'WAIT_FOR_DRAWDOWN_RESULT'
	}
	var currentParty = '';
    var partyRole = {
		sponsor : 'sponsor',
		supplier : 'supplier',
		bank : 'bank'
	}
	var hiddenSponsor = function(){
		var isHidden = false;
		if (currentParty == partyRole.bank) {
			isHidden = true;
		}else if(currentParty == partyRole.sponsor){
			isHidden = true;
		}else if(currentParty == partyRole.supplier){
			isHidden = false;
		}
		return isHidden;
	}

	var hiddenSponsorPic = function(){
		var isHidden = false;
		if (currentParty == partyRole.bank) {
			isHidden = false;
		}else if(currentParty == partyRole.sponsor){
			isHidden = true;
		}else if(currentParty == partyRole.supplier){
			isHidden = true;
		}
		return isHidden;
	}

	var hiddenSupplier = function(){
		var isHidden = false;
		if (currentParty == partyRole.bank) {
			isHidden = false;
		}else if(currentParty == partyRole.sponsor){
			isHidden = false;
		}else if(currentParty == partyRole.supplier){
			isHidden = true;
		}
		return isHidden;
	}
    vm.documentListModel = {
		sponsor : undefined,
		supplier : undefined,
		supplierCode : undefined,
		uploadDateFrom : '',
		uploadDateTo : '',
	}

	vm.transactionStatus = {
			book: 'B'
	}
	
    vm.transactionStatusGroupDropdown = [{
		label: 'All',
		value: ''
	}];

    vm.sponsorCodeDropdown = [{
		label: 'All',
		value: ''
	}];

    vm.tableRowCollection = [];

	vm.clearInternalStep = function(){
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
			  cancelled_by_supplier:{
				  totalRecord: 0,
				  totalAmount: 0              
			  }		
		};
		vm.summaryStatusGroup = {
			INTERNAL_STEP: {
				totalRecord: 0,
				totalAmount: 0
			  },
			  WAIT_FOR_DRAWDOWN_RESULT:{
				  totalRecord: 0,
				  totalAmount: 0
			 },
			 DRAWDOWN_SUCCESS:{
				  totalRecord: 0,
				  totalAmount: 0
			  },
			  DRAWDOWN_FAIL:{
				  totalRecord: 0,
				  totalAmount: 0
			  },
			  GRAND_TOTAL:{
				  totalRecord: 0,
				  totalAmount: 0              
			  }		
		};
	}
            
	// Datepicker
	vm.openDateFrom = false;
	vm.dateFormat = 'dd/MM/yyyy';
	vm.openDateTo = false;
	
	vm.dateModel = {
		dateFrom: '',
		dateTo: ''
	}
	// Model mapping whith page list
   vm.listTransactionModel = {
        dateType: vm.transactionType.transactionDate,
        dateFrom: '',
        dateTo: '',
        sponsorId: '',
        supplierId:'',
        supplierCode: '',
        statusGroup: '',
        order: '',
        orderBy:''
    }
	
    // Init data paging
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

    vm.pageModel = {
        pageSizeSelectModel: '20',
        totalRecord: 0,
        currentPage: 0,
		clearSortOrder: false
    };
    vm.loadTransactionGroup = function(){
        var transactionStatusGroupDefered = ListTransactionService.getTransactionStatusGroups();
        transactionStatusGroupDefered.promise.then(function(response) {
            var transactionStatusGroupList = response.data;
            if (transactionStatusGroupList !== undefined) {
                transactionStatusGroupList.forEach(function(obj) {
                    var selectObj = {
                        label: obj.statusMessageKey,
                        value: obj.statusGroup
                    }
                    vm.transactionStatusGroupDropdown.push(selectObj);
                });
            }
        }).catch(function(response) {
			$log.error('Load TransactionStatusGroup Fail');
        });    	
    }

   
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
			fieldName: 'sponsor',
            field: 'sponsorLogo',
            label: 'Sponsor',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-sponsor-name-label',
            sortData: true,
            cssTemplate: 'text-center',
			dataRenderer: function(record){
				return '<img style="height: 32px; width: 32px;" data-ng-src="data:image/png;base64,'+atob(record.sponsorLogo)+'"></img>';
			},
			hidden : hiddenSponsorPic
        },{
			fieldName: 'sponsor',
            field: 'sponsor',
            label: 'Sponsor',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-sponsor-name-label',
            sortData: true,
            cssTemplate: 'text-center',
			hidden : hiddenSponsor
        },{
			fieldName: 'supplier',
            field: 'supplier',
            label: 'Supplier',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-supplier-name-label',
            sortData: true,
            cssTemplate: 'text-center',
			hidden : hiddenSupplier
        },{
			fieldName: 'transactionDate',
            field: 'transactionDate',
            label: 'Transaction Date',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-transaction-date-label',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy',
            sortData: true,
            cssTemplate: 'text-center'
        }, {
			fieldName: 'transactionNo',
            field: 'transactionNo',
            label: 'Transaction No',
            id: 'transaction-{value}-transaction-no-label',
            sortData: true,
            cssTemplate: 'text-center',
        }, {
			fieldName: 'drawdownAmount',
            field: 'drawdownAmount',
            label: 'Drawdown Amount',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-drawdown-amount-label',
            filterType: 'number',
            filterFormat: '2',
            sortData: true,
            cssTemplate: 'text-center',
        }, {
			fieldName: 'interest',
            field: 'interest',
            label: 'Interest',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-interest-label',
            sortData: false,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        }, {
			fieldName: 'fee',
            field: 'fee',
            label: 'Fee',
            sortData: false,
            idValueField: 'transactionNo',
            id: 'transaction-{value}-fee-label',
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        }, {
			fieldName: 'bankTransactionNo',
            field: 'bankTransactionNo',
            label: 'Bank Transaction No',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-bank-transaction-no-label',
            sortData: true,
            cssTemplate: 'text-center'
        }, {
			fieldName: 'repaymentAmount',
            field: 'repaymentAmount',
            label: 'Repayment Amount',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-repayment-amount-label',
            sortData: true,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        }, {
			fieldName: 'maturityDate',
            field: 'maturityDate',
            label: 'Maturity Date',
            idValueField: 'transactionNo',
            id: 'transaction-{value}-maturity-date-label',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy',
            sortData: true,
            cssTemplate: 'text-center'
        }, {
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
			'<scf-button id="transaction-{{data.transactionNo}}-retry-button" class="btn-default gec-btn-action" ng-disabled="{{!(data.retriable && ctrl.canRetry)}}" ng-click="ctrl.retry(data)" title="Re-check"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-print-button"class="btn-default gec-btn-action" ng-disabled="ctrl.disabledPrint(data.returnStatus)" ng-click="ctrl.printEvidenceFormAction(data)" title="Print"><span class="glyphicon glyphicon-print" aria-hidden="true"></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-reject-button"class="btn-default gec-btn-action" ng-disabled="{{!(ctrl.reject && (data.statusCode === ctrl.statusDocuments.waitForDrawdownResult))}}" ng-click="ctrl.searchTransaction()" title="Reject"><i class="fa fa-times-circle" aria-hidden="true"></i></scf-button>'
		}]
    };
	vm.openCalendarDateFrom = function(){
		vm.openDateFrom = true;
	};
	
	vm.openCalendarDateTo = function(){
		vm.openDateTo = true;
	};
	
	vm.searchTransaction = function(criteria){
		vm.wrongDateFormat = false;
		var dateFrom = vm.dateModel.dateFrom;
        var dateTo = vm.dateModel.dateTo;
        
		vm.listTransactionModel.sponsorId = '';
		vm.listTransactionModel.supplierId = '';
        vm.listTransactionModel.dateFrom = SCFCommonService.convertDate(dateFrom);
        vm.listTransactionModel.dateTo = SCFCommonService.convertDate(dateTo);

        if(typeof vm.documentListModel.sponsor == 'object' && vm.documentListModel.sponsor != undefined){
            vm.listTransactionModel.sponsorId = vm.documentListModel.sponsor.organizeId;
            vm.listTransactionModel.sponsorInfo = {
            	organizeId: vm.documentListModel.sponsor.organizeId,
            	organizeName: vm.documentListModel.sponsor.organizeName
            };
        }else{
        	vm.listTransactionModel.sponsorInfo = null;
        }
        
        if(typeof vm.documentListModel.supplier == 'object' && vm.documentListModel.supplier != undefined){
            vm.listTransactionModel.supplierId = vm.documentListModel.supplier.organizeId;
            vm.listTransactionModel.supplierInfo = {
            	organizeId: vm.documentListModel.supplier.organizeId,
            	organizeName: vm.documentListModel.supplier.organizeName
            };
        }else{
        	vm.listTransactionModel.supplier = null;
        }
        
        if (criteria === undefined) {
            vm.pageModel.currentPage = '0';
            vm.pageModel.pageSizeSelectModel = '20';
			vm.pageModel.clearSortOrder = !vm.pageModel.clearSortOrder;
			vm.listTransactionModel.order = '';
        	vm.listTransactionModel.orderBy = '';
        } else {
            vm.pageModel.currentPage = criteria.page;
            vm.pageModel.pageSizeSelectModel = criteria.pageSize;				
        }
        
        if (angular.isUndefined(dateFrom)) {
			vm.wrongDateFormat = true;
		}

		if (angular.isUndefined(dateTo)) {
			vm.wrongDateFormat = true;
		}

		if(dateFrom != '' &&  dateFrom != null && dateTo != '' && dateTo != null){

			var dateTimeFrom = new Date(dateFrom);
			var dateTimeTo = new Date(dateTo);

			if(dateTimeFrom > dateTimeTo){
				vm.wrongDateFormat = true;
			}
		}

        if (!vm.wrongDateFormat) {
        	vm.searchTransactionService();
        }
	};

	vm.searchTransactionService = function() {
            var transactionModel = angular.extend(vm.listTransactionModel, {
                page: vm.pageModel.currentPage,
                pageSize: vm.pageModel.pageSizeSelectModel
            });
            
            currentParty = $stateParams.party;
			if (currentParty == partyRole.sponsor) {
				transactionModel.sponsorId = organizeId;
			}else if (currentParty == partyRole.supplier) {
				transactionModel.supplierId = organizeId;
			} else if (currentParty == partyRole.bank) {

			}
			
            var transactionDifferd = ListTransactionService.getTransactionDocument(transactionModel);
            transactionDifferd.promise.then(function(response) {
				vm.listTransactionModel.statusCode = '';
                vm.showInfomation = true;
                var transactionDocs = response.data;
                vm.tableRowCollection = transactionDocs.content;
                vm.pageModel.totalRecord = transactionDocs.totalElements;
                vm.pageModel.totalPage = transactionDocs.totalPages;

                // Calculate Display page
                vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
				vm.clearInternalStep();
				// reset value of internal step
				if (currentParty == partyRole.supplier || currentParty == partyRole.sponsor) {
	                if (vm.listTransactionModel.statusGroup === 'INTERNAL_STEP' || vm.listTransactionModel.statusGroup === '') {
	                    var internalStepDeffered = ListTransactionService.summaryInternalStep(transactionModel);
	                    internalStepDeffered.promise.then(function(response) {
	                        var internalStemp = response.data;							
	                        if (internalStemp.length > 0) {
	                            internalStemp.forEach(function(summary) {
	                        	vm.summaryInternalStep[summary.statusMessageKey].totalRecord = summary.totalRecord;
	                        	vm.summaryInternalStep[summary.statusMessageKey].totalAmount = summary.totalAmount;
								// if(summary.statusMessageKey ===
								// 'wait_for_verify'){
								// vm.summaryInternalStep.wait_for_verify.totalRecord
								// = summary.totalRecord;
								// vm.summaryInternalStep.wait_for_verify.totalAmount
								// = summary.totalAmount;
								// }else if(summary.statusMessageKey ===
								// 'wait_for_approve'){
								// vm.summaryInternalStep.wait_for_approve.totalRecord
								// = summary.totalRecord;
								// vm.summaryInternalStep.wait_for_approve.totalAmount
								// = summary.totalAmount;
								// }else if(summary.statusMessageKey ===
								// 'reject_by_checker'){
								// vm.summaryInternalStep.reject_by_checker.totalRecord
								// = summary.totalRecord;
								// vm.summaryInternalStep.reject_by_checker.totalAmount
								// = summary.totalAmount;
								// }else if(summary.statusMessageKey ===
								// 'reject_by_approver'){
								// vm.summaryInternalStep.reject_by_approver.totalRecord
								// = summary.totalRecord;
								// vm.summaryInternalStep.reject_by_approver.totalAmount
								// = summary.totalAmount;
								// }else if(summary.statusMessageKey ===
								// 'cancelled_by_supplier'){
								// vm.summaryInternalStep.cancelled_by_supplier.totalRecord
								// =
								// summary.totalRecord;
								// vm.summaryInternalStep.cancelled_by_supplier.totalAmount
								// =
								// summary.totalAmount;
								// }
	                            });
	                        }						
	                    }).catch(function(response) {
	                        $log.error('Internal Error');
	                    });
	
	                }
				}else if (currentParty == partyRole.bank) {
					var summaryStatusGroupDeffered = ListTransactionService.summaryStatusGroup(transactionModel);
					summaryStatusGroupDeffered.promise.then(function(response) {
						var summaryStatusGroup = response.data;
						summaryStatusGroup.forEach(function(summary) {
                        	vm.summaryStatusGroup[summary.statusGroup].totalRecord = summary.totalRecord;
                        	vm.summaryStatusGroup[summary.statusGroup].totalAmount = summary.totalAmount;							
						});
					}).catch(function(response) {
                        $log.error('Summary Group Status Error');
                    });
				}
            }).catch(function(response) {
                $log.error('Cannot search document');
            });
		
			
        };
	
	$scope.sortData = function(order, orderBy) {
            vm.listTransactionModel.order = order;
            vm.listTransactionModel.orderBy = orderBy;
            vm.searchTransactionService();
        };
	
	vm.exportCSVFile = function(){
		var dateFrom = vm.dateModel.dateFrom;
		var dateTo = vm.dateModel.dateTo;
		
		vm.listTransactionModel.dateFrom = SCFCommonService.convertDate(dateFrom);
		vm.listTransactionModel.dateTo = SCFCommonService.convertDate(dateTo);
		
		var transactionModel = angular.extend(vm.listTransactionModel,{
			page: 0,
			pageSize: 0
		});
		
		var transactionDifferd = ListTransactionService.exportCSVFile(transactionModel,$translate);
	};
	vm.storeCriteria = function(){
		$cookieStore.put(listStoreKey, vm.listTransactionModel);
	}
	
	vm.verifyTransaction = function(data){
		SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
		vm.storeCriteria();
		PageNavigation.gotoPage('/verify-transaction', {
            transactionModel: data
        });
	}
	
	vm.view = function(data){		
		SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
		vm.storeCriteria();
		var isShowBackButton = true;
		var isShowBackButton = false;
		
		var params = { transactionModel: data,
				party: currentParty,
	            isShowViewHistoryButton: false,
	            isShowBackButton: true
	        }
		PageNavigation.gotoPage('/view-transaction',params,params)
	}
	
	vm.disabledPrint = function(returnStatus){
		if(!vm.canPrint || returnStatus !== vm.transactionStatus.book){
			return true;
		}else{
			return false;
		}
	}
	
	 vm.initLoad = function() {
		var backAction = $stateParams.backAction;

		if(backAction === true){
			vm.listTransactionModel = $cookieStore.get(listStoreKey);
			vm.dateModel.dateFrom = SCFCommonService.convertStringTodate(vm.listTransactionModel.dateFrom);
			vm.dateModel.dateTo = SCFCommonService.convertStringTodate(vm.listTransactionModel.dateTo);			

			if(vm.listTransactionModel.sponsorInfo != undefined){
				var sponsorInfo = prepareAutoSuggestLabel(vm.listTransactionModel.sponsorInfo);
				vm.documentListModel.sponsor = sponsorInfo;
			}
			
			if(vm.listTransactionModel.supplierInfo != undefined){
				var supplierInfo = prepareAutoSuggestLabel(vm.listTransactionModel.supplierInfo);
				vm.documentListModel.supplier = supplierInfo;
			}
		}

        currentParty = $stateParams.party;
        if (currentParty == partyRole.sponsor) {
            vm.sponsorTxtDisable = true;
            initSponsorAutoSuggest();
            sponsorAutoSuggestServiceUrl = 'api/v1/sponsors';
		} else if (currentParty == partyRole.supplier) {
            vm.supplierTxtDisable = true;
            initSupplierAutoSuggest();
            sponsorAutoSuggestServiceUrl ='api/v1/sponsors?supplierId='+organizeId;
            checkSupplierTP(organizeId);
		}else if (currentParty == partyRole.bank) {
			sponsorAutoSuggestServiceUrl = 'api/v1/sponsors';
		}
		vm.searchTransaction();
		$cookieStore.remove(listStoreKey);
    };

	vm.disableSupplierSuggest = function() {
		var isDisable = false;
		if (currentParty == partyRole.bank) {
			if (angular.isUndefined(vm.documentListModel.sponsor) || !angular.isObject(vm.documentListModel.sponsor)) {
				isDisable = true;
			} else {
				isDisable = false;
			}
		} else if (currentParty == partyRole.supplier) {
			isDisable = true;
		}
		return isDisable;
	};

    var prepareAutoSuggestLabel = function(item) {
		item.identity = [ 'sponsor-', item.organizeId, '-option' ].join('');
		item.label = [ item.organizeId, ': ', item.organizeName ].join('');
		return item;
	}

    var checkSupplierTP = function(organizeId){
		var supplierTPDeferred = Service.doGet(sponsorAutoSuggestServiceUrl, {q:'',offset : 0, limit : 5});
		supplierTPDeferred.promise.then(function(response){
			if(response.data.length == 1){
				var sponsorInfo = response.data[0];
				sponsorInfo = prepareAutoSuggestLabel(sponsorInfo);
				vm.documentListModel.sponsor = sponsorInfo;
				vm.searchDocument();
			}
		});
	}

    var initSponsorAutoSuggest = function() {
        var sponsorInfo = angular.copy($rootScope.userInfo);
        sponsorInfo = prepareAutoSuggestLabel(sponsorInfo);
        vm.documentListModel.sponsor = sponsorInfo;
	}

	var initSupplierAutoSuggest = function() {
        var supplierInfo = angular.copy($rootScope.userInfo);
        supplierInfo = prepareAutoSuggestLabel(supplierInfo);
        vm.documentListModel.supplier = supplierInfo;
	}

    var querySponsorCode = function(value) {
        value = value = UIFactory.createCriteria(value);
        return $http.get(sponsorAutoSuggestServiceUrl, {
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

	vm.sponsorAutoSuggestModel = UIFactory.createAutoSuggestModel({
        placeholder : 'Please Enter organize name or code',
        itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
        query : querySponsorCode
	});

	var querySupplierCode = function(value) {
        var sponsorId = vm.documentListModel.sponsor.organizeId;
        var supplierCodeServiceUrl = 'api/v1/suppliers';
        value = value = UIFactory.createCriteria(value);
                
        return $http.get(supplierCodeServiceUrl, {
            params : {
            q : value,
            sponsorId : sponsorId,
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

    vm.initLoad();
	vm.loadTransactionGroup();
	
	vm.approveTransaction = function(data){
		vm.storeCriteria();
		var params = {transaction: data};
		PageNavigation.gotoPage('/approve-transaction/approve',params,params)
	}
	
    vm.retry = function(data) {
    	vm.transaction = {};
    	if(angular.isUndefined(data)){
    		 vm.transaction.transactionId = vm.transactionIdForRetry;
    	}else{
    		vm.transaction.transactionId = data.transactionId;
    		vm.transaction.version = data.version;
    		vm.transaction.statusCode = data.statusCode;
    		vm.transactionIdForRetry = vm.transaction.transactionId;
    	}
	    vm.storeCriteria();

        var deffered = TransactionService.retry(vm.transaction);
        deffered.promise.then(function(response) {
        	 vm.searchTransactionService();
        }).catch(function(response) {
            $scope.response = response.data;
            $scope.response.showViewRecentBtn = false;
            $scope.response.showViewHistoryBtn = true;           
            $scope.response.showCloseBtn = true;
			$scope.response.showBackBtn = false;
			var dialogUrl = TransactionService.getTransactionDialogErrorUrl($scope.response.errorCode, 'retry');
            ngDialog.open({
                template: dialogUrl,
                scope: $scope,
                disableAnimation: true
            });
            
        });
    }
    vm.viewRecent= function(){
    	$timeout(function() {
    		PageNavigation.gotoPage('/view-transaction', {transactionModel: vm.transaction, isShowViewHistoryButton: true});
        }, 10);
    }
	
	vm.printEvidenceFormAction = function(data){    	
		ListTransactionService.generateEvidenceForm(data);

    }
	
    function printEvidence(transaction){
    	if(transaction.returnStatus === vm.transactionStatus.book){
    		return true;
    	}
    	return false;
    }

}]);

// function convertDate(dateTime){
// var result = '';
// if(dateTime != undefined && dateTime != ''){
// var date = dateTime.getDate();
// var month = (dateTime.getMonth() + 1);
// var year = dateTime.getFullYear();
// result = date +'/' + month + '/' + year;
// }
// return result;
// }

// function convertStringTodate(date){
// result = '';
// if(date != undefined && date != null && date != ''){
// var dateSplite = date.split('/');
// result = new Date(dateSplite[2] + '-'+ dateSplite[1]+ '-' + dateSplite[0]);
// }
// return result
// }
