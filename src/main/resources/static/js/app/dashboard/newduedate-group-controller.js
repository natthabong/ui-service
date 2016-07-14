angular.module('scfApp').controller('NewduedateGroupController', ['NewduedateGroupService', '$state','$translate', '$scope', 'SCFCommonService', '$stateParams', '$cookieStore' , 'PageNavigation' , function(NewduedateGroupService, $state,$translate, $scope, SCFCommonService, $stateParams, $cookieStore, PageNavigation) {
    var vm = this;
    var listStoreKey = 'listrancri';
    vm.model ={};
    vm.showInfomation = false;
//    vm.splitePageTxt = '';
    vm.transactionType = {
            transactionDate: 'transactionDate',
            maturityDate: 'maturityDate'
        }
// // Data Sponsor for select box
//	vm.verify = false;
//	vm.approve = false;
    
//    vm.statusDocuments = {
//    		waitForVerify: 'WAIT_FOR_VERIFY',
//    		waitForApprove: 'WAIT_FOR_APPROVE',
//    		rejectByChecker: 'REJECT_BY_CHECKER',
//    		rejectByApprover: 'REJECT_BY_APPROVER',
//    		canceledBySupplier:'CANCELED_BY_SUPPLIER'
//    	}
    
//	vm.trasnsactionStatus = {
//			book: 'B'
//	}
	
//    vm.transactionStatusGroupDropdown = [{
//		label: 'All',
//		value: ''
//	}];

//    vm.sponsorCodeDropdown = [{
//		label: 'All',
//		value: ''
//	}];

    vm.tableRowCollection = [];
    vm.summaryOutstandingAmount = '';

//	vm.clearInternalStep = function(){
//		vm.summaryInternalStep = {
//				wait_for_verify: {
//					totalRecord: 0,
//					totalAmount: 0
//				  },
//				 wait_for_approve:{
//					  totalRecord: 0,
//					  totalAmount: 0
//				 },
//				 reject_by_checker:{
//					  totalRecord: 0,
//					  totalAmount: 0
//				  },
//				 reject_by_approver:{
//					  totalRecord: 0,
//					  totalAmount: 0
//				  },
//				  canceled_by_supplier:{
//					  totalRecord: 0,
//					  totalAmount: 0              
//				  }		
//		};
//	}
            
//	// Datepicker
//	vm.openDateFrom = false;
//	vm.dateFormat = 'dd/MM/yyyy';
//	vm.openDateTo = false;
	
//	vm.dateModel = {
//		dateFrom: '',
//		dateTo: ''
//	}
    
    // Model mapping with page list
    vm.listDocumentModel = {
//            dateType: vm.transactionType.transactionDate,
            totalRecord: '10',
            orders:[{
        		"fieldName":"sponsorPaymentDate",
        		"direction":"ASC"
        		},{
        		"fieldName":"outstandingAmount",
        		"direction":"DESC"
        	}]
//            order: '',
//            orderBy:''
        }
    
// // Init data paging
//    vm.pageSizeList = [{
//        label: '10',
//        value: '10'
//    }, {
//        label: '20',
//        value: '20'
//    }, {
//        label: '50',
//        value: '50'
//    }];
//
    vm.pageModel = {
//        pageSizeSelectModel: '20',
//        totalRecord: 0,
//        currentPage: 0,
		clearSortOrder: false
    };

//    // Load sponsor Code
//    vm.loadSponsorCode = function() {
//        var sponsorCodesDefered = ListTransactionService.getSponsors();
//        sponsorCodesDefered.promise.then(function(response) {
//            var sponsorCodeList = response.data;
//            if (sponsorCodeList !== undefined) {
//                sponsorCodeList.forEach(function(obj) {
//                    var selectObj = {
//                        label: obj.sponsorName,
//                        value: obj.sponsorId
//                    }
//                    vm.sponsorCodeDropdown.push(selectObj);
//                });
////                vm.listTransactionModel.sponsorCode = vm.sponsorCodeDropdown[0].value;
//            }
//        }).catch(function(response) {
//			console.log('Load Sponsor Fail');
//        });
//    };
    
//    vm.loadTransactionGroup = function(){
//        var transactionStatusGroupDefered = ListTransactionService.getTransactionStatusGroups();
//        transactionStatusGroupDefered.promise.then(function(response) {
//            var transactionStatusGroupList = response.data;
//            if (transactionStatusGroupList !== undefined) {
//                transactionStatusGroupList.forEach(function(obj) {
//                    var selectObj = {
//                        label: obj.statusMessageKey,
//                        value: obj.statusGroup
//                    }
//                    vm.transactionStatusGroupDropdown.push(selectObj);
//                });
////                vm.listTransactionModel.statusGroup = vm.transactionStatusGroupDropdown[0].value;
//            }
//        }).catch(function(response) {
//			console.log('Load TransactionStatusGroup Fail');
//        });    	
//    }

   
    vm.dataTable = {
        options: {
        },
        columns: [{
            field: 'sponsorLogo',
            label: 'TP',
            sortData: true,
            cssTemplate: 'text-center',
            
        }, {
            field: 'sponsorPaymentDate',
            label: 'Sponsor Payment Date',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy',
            sortData: true,
            cssTemplate: 'text-center'
        }, {
            field: 'supplierCode',
            label: 'Supplier Code',
//            id: 'transaction-{value}-transaction-no-label',
            sortData: true,
            cssTemplate: 'text-center',
        }, {
            field: 'noOfDocument',
            label: 'No Of document',
//            idValueField: 'transactionNo',
//            id: 'transaction-{value}-drawdown-amount-label',
            sortData: true,
            cssTemplate: 'text-center',
        }, {
            field: 'outstandingAmount',
            label: 'Outstanding Amount (THB)',
//            idValueField: 'transactionNo',
//            id: 'transaction-{value}-interest-label',
            sortData: true,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        }, {
			field: 'action',
			label: 'Action',
			cssTemplate: 'text-center',
			sortData: false,
			cellTemplate: '<scf-button class="btn-default gec-btn-action" id="doc-group-{rowno}-button" ng-click="ctrl.view(data)"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></scf-button>'
		}]
    };

//	vm.openCalendarDateFrom = function(){
//		vm.openDateFrom = true;
//	};
//	
//	vm.openCalendarDateTo = function(){
//		vm.openDateTo = true;
//	};
	
	vm.searchTransaction = function(criteria){
//		 var dateFrom = vm.dateModel.dateFrom;
//            var dateTo = vm.dateModel.dateTo;
//
//            vm.listTransactionModel.dateFrom = convertDate(dateFrom);
//            vm.listTransactionModel.dateTo = convertDate(dateTo);

            if (criteria === undefined) {
//                vm.pageModel.currentPage = '0';
//                vm.pageModel.pageSizeSelectModel = '20';
				vm.pageModel.clearSortOrder = !vm.pageModel.clearSortOrder;
//				vm.listTransactionModel.order = '';
//            	vm.listTransactionModel.orderBy = '';
            } 
//            else {
//                vm.pageModel.currentPage = criteria.page;
//                vm.pageModel.pageSizeSelectModel = criteria.pageSize;				
//            }
            vm.searchTransactionService();
	};
	
	vm.searchTransactionService = function() {
            var documentModel = angular.extend(vm.listDocumentModel, {
//                page: vm.pageModel.currentPage,
//                pageSize: vm.pageModel.pageSizeSelectModel
            });
            
            var documentDifferd = NewduedateGroupService.getDocumentsGroupbyDuedate(documentModel);
            documentDifferd.promise.then(function(response) {
	            vm.showInfomation = true;
	            var documents = response.data;
	            vm.tableRowCollection = documents.content;
	            vm.summaryOutstandingAmount = documents.totalOutstandingAmount;
            }).catch(function(response) {
            	console.log('Cannot search document');
            });
	};
    
	vm.searchTransaction();
	
	
//	$scope.sortData = function(order, orderBy) {
//            vm.listTransactionModel.order = order;
//            vm.listTransactionModel.orderBy = orderBy;
//            vm.searchTransactionService();
//        };
	
//	vm.exportCSVFile = function(){
//		var dateFrom = vm.dateModel.dateFrom;
//		var dateTo = vm.dateModel.dateTo;
//		
//		vm.listTransactionModel.dateFrom = convertDate(dateFrom);
//		vm.listTransactionModel.dateTo = convertDate(dateTo);
//		
//		var transactionModel = angular.extend(vm.listTransactionModel,{
//			page: 0,
//			pageSize: 0
//		});
//		
//		var transactionDifferd = ListTransactionService.exportCSVFile(transactionModel,$translate);
//	};
//	vm.storeCriteria = function(){
//		$cookieStore.put(listStoreKey, vm.listTransactionModel);
//	}
	
    vm.createTransaction = function(data){
		SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
		vm.storeCriteria();
		PageNavigation.gotoPage('/create-transaction', {
			documentModel: data
        });
	}
        	
//	vm.verifyTransaction = function(data){
//		SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
//		vm.storeCriteria();
//		PageNavigation.gotoPage('/verify-transaction', {
//            transactionModel: data
//        });
//	}
	
//	vm.view = function(data){		
//		SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
//		vm.storeCriteria();
//		var isShowBackButton = true;
//		var isShowBackButton = false;
//		
//		var params = { transactionModel: data,
//	            isShowViewHistoryButton: false,
//	            isShowBackButton: true
//	        }
//		PageNavigation.gotoPage('/view-transaction',params,params)
//	}
//	
	 vm.initLoad = function() {
		var backAction = $stateParams.backAction;
		if(backAction === true){
//			vm.listTransactionModel = $cookieStore.get(listStoreKey);
//			vm.dateModel.dateFrom = convertStringTodate(vm.listTransactionModel.dateFrom);
//			vm.dateModel.dateTo = convertStringTodate(vm.listTransactionModel.dateTo);			
			vm.searchTransaction();
		}
//		$cookieStore.remove(listStoreKey);
//		vm.loadSponsorCode();
        
    };

    vm.initLoad();
//	vm.loadTransactionGroup();
	
//	vm.approveTransaction = function(data){
////		SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
//		vm.storeCriteria();
//		var params = {transaction: data};
//		PageNavigation.gotoPage('/approve-transaction/approve',params,params)
//	}
	
//	vm.printEvidenceFormAction = function(data){    	
//		ListTransactionService.generateEvidenceForm(data);
//
//    }

}]);

//function convertDate(dateTime){
//	var result = '';
//	if(dateTime != undefined && dateTime != ''){
//		var date = dateTime.getDate();		
//		var month = (dateTime.getMonth() + 1);
//		var year = dateTime.getFullYear();
//		result =  date +'/' + month + '/' + year;
//	}
//	return result;
//}
//
//function convertStringTodate(date){
//	result = '';
//	if(date != undefined && date != null && date != ''){
//		var dateSplite = date.split('/');
//		result = new Date(dateSplite[2] + '-'+ dateSplite[1]+ '-' + dateSplite[0]);
//	}
//	return result
//}