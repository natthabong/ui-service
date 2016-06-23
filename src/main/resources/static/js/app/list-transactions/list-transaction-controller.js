angular.module('scfApp').controller('ListTransactionController', ['ListTransactionService', '$state','$translate', '$scope', 'SCFCommonService', '$stateParams', '$cookieStore', function(ListTransactionService, $state,$translate, $scope, SCFCommonService, $stateParams, $cookieStore) {
    var vm = this;
    var listStoreKey = 'listrancri';
    vm.showInfomation = false;
     vm.splitePageTxt = '';
     vm.transactionType = {
            transactionDate: 'transactionDate',
            maturityDate: 'maturityDate'
        }
        // Data Sponsor for select box
	vm.verify = false;
	vm.approve = false;
	
	vm.statusDocuments = {
		waitForVerify: 'WAIT_FOR_VERIFY',
		waitForApprove: 'WAIT_FOR_APPROVE',
		rejectByChecker: 'REJECT_BY_CHECKER',
		rejectByApprover: 'REJECT_BY_APPROVER',
		canceledBySupplier:'CANCELED_BY_SUPPLIER'
	}
	
	vm.trasnsactionStatus = {
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
				  canceled_by_supplier:{
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
            supplierId: '',
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

    // Load sponsor Code
    vm.loadSponsorCode = function() {
        var sponsorCodesDefered = ListTransactionService.getSponsors();
        sponsorCodesDefered.promise.then(function(response) {
            var sponsorCodeList = response.data;
            if (sponsorCodeList !== undefined) {
                sponsorCodeList.forEach(function(obj) {
                    var selectObj = {
                        label: obj.sponsorName,
                        value: obj.sponsorId
                    }
                    vm.sponsorCodeDropdown.push(selectObj);
                });
//                vm.listTransactionModel.sponsorCode = vm.sponsorCodeDropdown[0].value;
            }
        }).catch(function(response) {
			console.log('Load Sponsor Fail');
        });
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
//                vm.listTransactionModel.statusGroup = vm.transactionStatusGroupDropdown[0].value;
            }
        }).catch(function(response) {
			console.log('Load TransactionStatusGroup Fail');
        });    	
    }

   
    vm.dataTable = {
        options: {
            displayRowNo: {}
        },
        columns: [{
            field: 'sponsor',
            label: 'Sponsor',
            sortData: true,
            cssTemplate: 'text-center'
        }, {
            field: 'transactionDate',
            label: 'Transaction Date',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy',
            sortData: true,
            cssTemplate: 'text-center'
        }, {
            field: 'transactionNo',
            label: 'Transaction No',
            sortData: true,
            cssTemplate: 'text-center',
        }, {
            field: 'drawdownAmount',
            label: 'Drawdown Amount',
            filterType: 'number',
            filterFormat: '2',
            sortData: true,
            cssTemplate: 'text-center',
        }, {
            field: 'interest',
            label: 'Interest',
            sortData: false,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        }, {
            field: 'fee',
            label: 'Fee',
            sortData: false,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        }, {
            field: 'bankTransactionNo',
            label: 'Bank Transaction No',
            sortData: true,
            cssTemplate: 'text-center'
        }, {
            field: 'repaymentAmount',
            label: 'Repayment Amount',
            sortData: true,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        }, {
            field: 'maturityDate',
            label: 'Maturity Date',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy',
            sortData: true,
            cssTemplate: 'text-center'
        }, {
            field: 'statusCode',
            label: 'Status',
            sortData: true,
            id: 'status-{value}',
			filterType: 'translate',
            cssTemplate: 'text-center',
        },{
			field: 'action',
			label: 'Action',
			cssTemplate: 'text-center',
			sortData: false,
			cellTemplate: '<scf-button class="btn-default gec-btn-action" ng-disabled="!(listTransactionController.verify && (data.statusCode === listTransactionController.statusDocuments.waitForVerify))" id="transaction-{{data.transactionId}}-verify-button" ng-click="listTransactionController.verifyTransaction(data)"><i class="fa fa-inbox" aria-hidden="true"></i></scf-button>'+
			'<scf-button id="transaction-{{data.transactionId}}-approve-button" ng-disabled="!(listTransactionController.approve &&(data.statusCode === listTransactionController.statusDocuments.waitForApprove))" class="btn-default gec-btn-action" id="transaction-{{data.transactionId}}-approve-button" ng-click="listTransactionController.approveTransaction(data)"><i class="fa fa-check-square-o" aria-hidden="true"></i></scf-button>' +
			'<scf-button class="btn-default gec-btn-action" id="transaction-{{data.transactionId}}-view-button" ng-click="listTransactionController.view(data)"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></scf-button>'+
			'<scf-button class="btn-default gec-btn-action" ng-disabled="true" ng-click="listTransactionController.searchTransaction()"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></scf-button>'+
			'<scf-button class="btn-default gec-btn-action" ng-disabled="!(data.returnStatus === listTransactionController.trasnsactionStatus.book)" ng-click="listTransactionController.printEvidenceFormAction(data)"><span class="glyphicon glyphicon-print" aria-hidden="true"></scf-button>'+
			'<scf-button class="btn-default gec-btn-action" ng-disabled="true" ng-click="listTransactionController.searchTransaction()"><i class="fa fa-times-circle" aria-hidden="true"></i></scf-button>'
		}]
    };

	vm.openCalendarDateFrom = function(){
		vm.openDateFrom = true;
	};
	
	vm.openCalendarDateTo = function(){
		vm.openDateTo = true;
	};
	
	vm.searchTransaction = function(criteria){
		 var dateFrom = vm.dateModel.dateFrom;
            var dateTo = vm.dateModel.dateTo;

            vm.listTransactionModel.dateFrom = convertDate(dateFrom);
            vm.listTransactionModel.dateTo = convertDate(dateTo);

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
            vm.searchTransactionService();
	};

	vm.searchTransactionService = function() {
            var transactionModel = angular.extend(vm.listTransactionModel, {
                page: vm.pageModel.currentPage,
                pageSize: vm.pageModel.pageSizeSelectModel
            });
            var transactionDifferd = ListTransactionService.getTransactionDocument(transactionModel);
            transactionDifferd.promise.then(function(response) {
                vm.showInfomation = true;
                var transactionDocs = response.data;
                vm.tableRowCollection = transactionDocs.content;
                vm.pageModel.totalRecord = transactionDocs.totalElements;
                vm.pageModel.totalPage = transactionDocs.totalPages;

                // Calculate Display page
                vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
				vm.clearInternalStep();
				//reset value of internal step				
				
                if (vm.listTransactionModel.statusGroup === 'INTERNAL_STEP' || vm.listTransactionModel.statusGroup === '') {
                    var internalStepDeffered = ListTransactionService.summaryInternalStep(transactionModel);
                    internalStepDeffered.promise.then(function(response) {
                        var internalStemp = response.data;
						
                        if (internalStemp.length > 0) {
                            internalStemp.forEach(function(summary) {
								if(summary.statusMessageKey === 'wait_for_verify'){
									vm.summaryInternalStep.wait_for_verify.totalRecord = summary.totalRecord;
									vm.summaryInternalStep.wait_for_verify.totalAmount = summary.totalAmount;
								}else if(summary.statusMessageKey === 'wait_for_approve'){
									vm.summaryInternalStep.wait_for_approve.totalRecord = summary.totalRecord;
									vm.summaryInternalStep.wait_for_approve.totalAmount = summary.totalAmount;
								}else if(summary.statusMessageKey === 'reject_by_checker'){
									vm.summaryInternalStep.reject_by_checker.totalRecord = summary.totalRecord;
									vm.summaryInternalStep.reject_by_checker.totalAmount = summary.totalAmount;
								}else if(summary.statusMessageKey === 'reject_by_approver'){
									vm.summaryInternalStep.reject_by_approver.totalRecord = summary.totalRecord;
									vm.summaryInternalStep.reject_by_approver.totalAmount = summary.totalAmount;
								}else if(summary.statusMessageKey === 'canceled_by_supplier'){
									vm.summaryInternalStep.canceled_by_supplier.totalRecord = summary.totalRecord;
									vm.summaryInternalStep.canceled_by_supplier.totalAmount = summary.totalAmount;
								}
                            });
                        }						
                    }).catch(function(response) {
                        console.log('Internal Error');
                    });

                }
            }).catch(function(response) {
                console.log('Cannot search document');
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
		
		vm.listTransactionModel.dateFrom = convertDate(dateFrom);
		vm.listTransactionModel.dateTo = convertDate(dateTo);
		
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
		$state.go('/verify-transaction', {
            transactionModel: data
        });
	}
	
	vm.view = function(data){		
		SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
		vm.storeCriteria();
		var isShowBackButton = true;
		var isShowBackButton = false;
		$state.go('/view-transaction', {
            transactionModel: data,
            isShowViewHistoryButton: false,
            isShowBackButton: true
        });
	}
	
	 vm.initLoad = function() {
		var actionBack = $stateParams.actionBack;
		if(actionBack === true){
			vm.listTransactionModel = $cookieStore.get(listStoreKey);
			vm.dateModel.dateFrom = convertStringTodate(vm.listTransactionModel.dateFrom);
			vm.dateModel.dateTo = convertStringTodate(vm.listTransactionModel.dateTo);			
			vm.searchTransaction();
		}
		$cookieStore.remove(listStoreKey);
		vm.loadSponsorCode();
        
    };

    vm.initLoad();
	vm.loadTransactionGroup();
	
	vm.approveTransaction = function(data){
		SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
		vm.storeCriteria();
		$state.go('/approve-transaction/approve', {transaction: data});
	}
	
	vm.printEvidenceFormAction = function(data){    	
		ListTransactionService.generateEvidenceForm(data);

    }

}]);

function convertDate(dateTime){
	var result = '';
	if(dateTime != undefined && dateTime != ''){
		var date = dateTime.getDate();		
		var month = (dateTime.getMonth() + 1);
		var year = dateTime.getFullYear();
		result =  date +'/' + month + '/' + year;
	}
	return result;
}

function convertStringTodate(date){
	result = '';
	if(date != undefined && date != null && date != ''){
		var dateSplite = date.split('/');
		result = new Date(dateSplite[2] + '-'+ dateSplite[1]+ '-' + dateSplite[0]);
	}
	return result
}