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
    vm.serverTime = '';
    vm.splitePageTxt = '';
    vm.transactionType = {
            transactionDate: 'transactionDate',
            maturityDate: 'maturityDate'
    }
        // Data Sponsor for select box
	vm.verify = false;
	vm.approve = false;
	vm.reject = false;
	vm.transactionIdForRetry = '';
	vm.transaction = {};
	vm.statusDocuments = {
		waitForVerify: 'WAIT_FOR_VERIFY',
		waitForApprove: 'WAIT_FOR_APPROVE',
		rejectByChecker: 'REJECT_BY_CHECKER',
		rejectByApprover: 'REJECT_BY_APPROVER',
		canceledBySupplier: 'CANCELLED_BY_SUPPLIER',
		waitForDrawdownResult: 'WAIT_FOR_DRAWDOWN_RESULT',
		rejectIncomplete: 'REJECT_INCOMPLETE'			
	}

	vm.storeSearchCriteria = undefined;

	vm.displayName = $scope.userInfo.displayName;
	
    vm.transactionPayload = {
		transaction: null,
		credential: ''
	};
	
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
		transactionNo:'',
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
        var transactionStatusGroupDefered = ListTransactionService.getTransactionStatusGroups('DRAWDOWN');
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
    };
    
    var reject = function(transactionPayload) {   	
        var deffered = TransactionService.reject(transactionPayload);
        deffered.promise.then(function(response) {
        	vm.transaction = response.data;
        	vm.searchTransactionService();
        });
        return deffered;
    }   
    
    var retryReject = function(transaction) {   	
        var deffered = TransactionService.retry(transaction);
        deffered.promise.then(function(response) {
        	vm.transaction = response.data;
        	vm.searchTransactionService();
        });
        return deffered;
    }  
    
    vm.retryReject = function() {
    	vm.transaction.transactionId = vm.transactionIdForRetry;
    	var deffered = retryReject(vm.transaction);
    	deffered.promise.then(function(response) {
    		if(response.status == 200){
    			if(vm.transaction.returnStatus == 'C'){
					UIFactory.showSuccessDialog({
						data : {
							mode: 'transaction',
							headerMessage : 'Reject transaction success.',						
							bodyMessage : vm.transaction.transactionNo,
							viewRecent : vm.viewRecent,
							viewHistory: vm.searchTransactionService,
							hideBackButton : true,
							hideViewRecentButton : false,
							hideViewHistoryButton : true,
							showOkButton : true
						},
					});
    			}else{
    				vm.transaction.retriable = true;
    				vm.transaction.rejectReason = null;
    				UIFactory.showIncompleteDialog({
    					data : {
    						mode: 'transaction',
    						headerMessage : 'Reject transaction incomplete.',						
    						transaction : vm.transaction,
    						retry : vm.retryReject,
    						viewHistory: vm.searchTransactionService,
    						hideBackButton : true,
    						hideViewRecentButton : true,								
    						hideViewHistoryButton : true,
    						showOkButton : true
    					},
    				});	    				
    			}
    		}else{
    			vm.handleDialogFail(response);
    		}
        }).catch(function(response) {
        	vm.handleDialogFail(response);
        });    	
    };

	var dialogPopup;

	var closeDialogPopUp = function(){
		dialogPopup.close();
	}

    vm.confirmRejectPopup = function(data, msg) {
 	   if(msg == 'clear'){
			vm.wrongPassword = false;
			vm.passwordErrorMsg = '';	
			vm.transactionPayload.credential = '';
			vm.transactionPayload.rejectReason = '';
			vm.transactionPayload.transaction = null;
 	   }
 	   
	   vm.transaction = {};
	   vm.transaction.transactionId = data.transactionId;
	   vm.transaction.transactionNo = data.transactionNo;
	   vm.transaction.version = data.version;
	   vm.transaction.statusCode = data.statusCode;
	   vm.transaction.rejectReason  = data.rejectReason;
	   vm.transaction.sponsorId = data.sponsorId;
	   vm.transaction.supplierId = data.supplierId;
	   vm.transactionIdForRetry = data.transactionId;
 	   
 	   vm.transactionPayload.transaction = vm.transaction;
 	   dialogPopup = UIFactory.showConfirmDialog({
			data : {
				headerMessage : 'Confirm reject ?',
				mode: 'transaction',
				credentialMode : true,
				displayName : vm.displayName,
				wrongPassword : vm.wrongPassword,
				passwordErrorMsg : vm.passwordErrorMsg,
				rejectReason : null,
				transactionModel : vm.transactionPayload
			},
			confirm : function() {
				if (validateCredential(vm.transactionPayload.credential)) {
					return reject(vm.transactionPayload);
				}else {
					vm.wrongPassword = true;
					vm.passwordErrorMsg = 'Password is required';
					closeDialogPopUp();
					vm.confirmRejectPopup(vm.transactionPayload.transaction,'error');
				}
			},
			onFail : function(response) {	
				vm.handleDialogFail(response);					
			},
			onSuccess : function(response) {
				UIFactory.showSuccessDialog({
					data : {
						mode: 'transaction',
						headerMessage : 'Reject transaction success.',						
						bodyMessage : vm.transaction.transactionNo,
						viewRecent : vm.viewRecent,
						viewHistory: vm.searchTransactionService,
						hideBackButton : true,
						hideViewRecentButton : false,
						hideViewHistoryButton : true,
						showOkButton : true
					},
				});
			}
		});    	   
    };
    
    vm.handleDialogFail = function(response){
    	if(response.status == 400){
			if(response.data.errorCode=='E0400'){
				vm.wrongPassword = true;
				vm.passwordErrorMsg = response.data.errorMessage;						
				vm.confirmRejectPopup(vm.transactionPayload.transaction,'error');
			}
			else if(response.data.errorCode == 'INVALID'){
				UIFactory.showHourDialog({
					data : {
						mode: 'transaction',
						headerMessage : 'Transaction hour.',
						bodyMessage: 'Please reject transaction within',
						startTransactionHour : response.data.attributes.startTransactionHour,
						endTransactionHour : response.data.attributes.endTransactionHour
					},
				});	
			} 
		}else if(response.status == 409){
			if(response.data.errorCode == 'FAILED'){
				UIFactory.showFailDialog({
					data : {
						mode: 'transaction',
						headerMessage : 'Reject transaction fail.',
						backAndReset : vm.backAndReset,
						viewHistory : vm.searchTransactionService,
						errorCode : response.data.errorCode,
						action : response.data.attributes.action,
						actionBy : response.data.attributes.actionBy
					},
				});							
			}
		}else if(response.status == 500){
			if(response.data.errorCode=='INCOMPLETE'){
				vm.transaction.transactionNo = response.data.attributes.transactionNo;
				vm.transaction.returnCode = response.data.attributes.returnCode;
				vm.transaction.returnMessage = response.data.attributes.returnMessage;
		    	vm.transaction.retriable = response.data.attributes.retriable;
		    	vm.transaction.version = response.data.attributes.version;
				vm.transaction.rejectReason  = null;
				UIFactory.showIncompleteDialog({
					data : {
						mode: 'transaction',
						headerMessage : 'Reject transaction incomplete.',						
						transaction : vm.transaction,
						retry : vm.retryReject,
						viewHistory: vm.searchTransactionService,
						hideBackButton : true,
						hideViewRecentButton : true,								
						hideViewHistoryButton : true,
						showOkButton : true
					},
				});										
			}else if(response.data.errorCode=='FAILED'){
				vm.transaction.transactionNo = response.data.attributes.transactionNo;
				vm.transaction.returnCode = response.data.attributes.returnCode;
				vm.transaction.returnMessage = response.data.attributes.returnMessage;
		    	vm.transaction.retriable = response.data.attributes.retriable;
		    	vm.transaction.version = response.data.attributes.version;
				vm.transaction.rejectReason  = null;
				UIFactory.showFailDialog({
					data : {
						mode: 'transaction',
						headerMessage : 'Reject transaction fail.',						
						transaction : vm.transaction,
						retry : vm.retryReject,
						backAndReset : vm.backAndReset,
						viewRecent : vm.viewRecent,
						viewHistory : vm.searchTransactionService,
						hideBackButton : true,
						hideViewRecentButton : true,
						hideViewHistoryButton : true,
						showOkButton : true,
						showContactInfo : true
					},
				});	
			}
		}	
    };
   
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
            field: 'transactionAmount',
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
			'<scf-button id="transaction-{{data.transactionNo}}-re-check-button" class="btn-default gec-btn-action" ng-disabled="{{!(data.retriable && ctrl.canRetry)}}" ng-click="ctrl.retry(data)" title="Re-check"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-print-button"class="btn-default gec-btn-action" ng-disabled="ctrl.disabledPrint(data.returnStatus)" ng-click="ctrl.printEvidenceFormAction(data)" title="Print"><span class="glyphicon glyphicon-print" aria-hidden="true"></scf-button>'+
			'<scf-button id="transaction-{{data.transactionNo}}-reject-button"class="btn-default gec-btn-action" ng-disabled="ctrl.disabledReject(data)" ng-click="ctrl.confirmRejectPopup(data,\'clear\')" title="Reject"><i class="fa fa-times-circle" aria-hidden="true"></i></scf-button>'
		}]
    };
	vm.openCalendarDateFrom = function(){
		vm.openDateFrom = true;
	};
	
	vm.openCalendarDateTo = function(){
		vm.openDateTo = true;
	};
	
	vm.searchTransaction = function(criteria){
		vm.invalidDateCriteria = false;
		vm.invalidDateCriteriaMsg = '';
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
			vm.invalidDateCriteria = true;
			vm.invalidDateCriteriaMsg = {
                message : 'Wrong date format data.'
            }
		}

		if (angular.isUndefined(dateTo)) {
			vm.invalidDateCriteria = true;
			vm.invalidDateCriteriaMsg = {
                message : 'Wrong date format data.'
            }
		}

		if(dateFrom != '' &&  dateFrom != null && dateTo != '' && dateTo != null){

			var dateTimeFrom = new Date(dateFrom);
			var dateTimeTo = new Date(dateTo);

			if(dateTimeFrom > dateTimeTo){
				vm.invalidDateCriteria = true;
				vm.invalidDateCriteriaMsg = {
                    message : 'From date must be less than or equal to To date.'
                }
			}
		}

        if (!vm.invalidDateCriteria) {
        	vm.searchTransactionService();
        }
	};

	var saveSearchCriteriaData = function(){
		vm.storeSearchCriteria = {
			dateFrom : vm.listTransactionModel.dateFrom,
			dateTo : vm.listTransactionModel.dateTo,
			dateType : vm.listTransactionModel.dateType,
			order : vm.listTransactionModel.order,
			page : vm.listTransactionModel.page,
			pageSize : vm.listTransactionModel.pageSize,
			sponsorId : vm.listTransactionModel.sponsorId,
			sponsorInfo : vm.listTransactionModel.sponsorInfo,
			statusCode : vm.listTransactionModel.statusCode,
			statusGroup : vm.listTransactionModel.statusGroup,
			supplier : vm.listTransactionModel.supplier,
			supplierCode : vm.listTransactionModel.supplierCode,
			supplierId : vm.listTransactionModel.supplierId,
			transactionNo : vm.listTransactionModel.transactionNo
		}
	}

	vm.searchTransactionService = function() {
		saveSearchCriteriaData();
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
			vm.serverTime = response.headers('current-date');
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
								if(vm.summaryInternalStep[summary.statusMessageKey]){
									vm.summaryInternalStep[summary.statusMessageKey].totalRecord = summary.totalRecord;
									vm.summaryInternalStep[summary.statusMessageKey].totalAmount = summary.totalAmount;
								}
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
						if(vm.summaryStatusGroup[summary.statusGroup]){
							vm.summaryStatusGroup[summary.statusGroup].totalRecord = summary.totalRecord;
							vm.summaryStatusGroup[summary.statusGroup].totalAmount = summary.totalAmount;	
						}					
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
		$cookieStore.put(listStoreKey, vm.storeSearchCriteria);
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
	
	vm.disabledReject = function(data){
		var condition1 = vm.reject!= undefined && vm.reject == true;
		var condition2 = data.statusCode == vm.statusDocuments.waitForDrawdownResult
		var condition3 = isAfterToday(data);
		if(condition1 && condition2 && condition3){
			return false;
		}else{
			return true;
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
            sponsorAutoSuggestServiceUrl = 'api/v1/buyers';
		} else if (currentParty == partyRole.supplier) {
            vm.supplierTxtDisable = true;
            initSupplierAutoSuggest();
            sponsorAutoSuggestServiceUrl ='api/v1/buyers?supplierId='+organizeId;
            checkSupplierTP(organizeId);
		}else if (currentParty == partyRole.bank) {
			sponsorAutoSuggestServiceUrl = 'api/v1/buyers';
		}
		vm.searchTransaction();
		$cookieStore.remove(listStoreKey);
    };

	vm.disableSupplierSuggest = function() {
		var isDisable = false;
		if (currentParty == partyRole.supplier) {
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

	var placeholder;
	if($stateParams.party == partyRole.bank){
		placeholder = 'Enter organize name or code';
	}else{
		placeholder = 'Please Enter organize name or code';
	}

	vm.sponsorAutoSuggestModel = UIFactory.createAutoSuggestModel({
        placeholder : placeholder,
        itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
        query : querySponsorCode
	});

	var querySupplierCode = function(value) {
		var currentParty = $stateParams.party;
		var buyerId;
		if(currentParty == partyRole.bank){
			buyerId = null;
		}else{
			buyerId = vm.documentListModel.sponsor.organizeId;
		}
        var supplierCodeServiceUrl = 'api/v1/suppliers';
        value = value = UIFactory.createCriteria(value);
                
        return $http.get(supplierCodeServiceUrl, {
            params : {
            q : value,
            buyerId : buyerId,
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
            $scope.response.showViewHistoryBtn = false;           
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

    function validateCredential(data) {
        var result = true;
        if (angular.isUndefined(data) || data === '') {
            result = false;
        }
        return result;
    }
    
    function isAfterToday(data) {
       
        var from_date = data.transactionDate;
        var YYYY = from_date.substring(0, 4);
        var MM = from_date.substring(5, 7);
        var DD = from_date.substring(8,10);
        var txnDate = new Date();
        txnDate.setHours(0);
        txnDate.setMilliseconds(0);
        txnDate.setMinutes(0);
        txnDate.setSeconds(0);
        txnDate.setFullYear(YYYY,(MM-1), DD);

        var now = vm.serverTime;
        var Year = now.substring(0, 4);
        var Month = now.substring(5, 7);
        var Day = now.substring(8,10);
        var todayDate = new Date();
        todayDate.setHours(0);
        todayDate.setMilliseconds(0);
        todayDate.setMinutes(0);
        todayDate.setSeconds(0);
        todayDate.setFullYear(Year,(Month-1), Day);    

        if (txnDate.getTime() > todayDate.getTime()) {
        	return true;
        }else{
        	return false;
        }   
    }
    
}]);

