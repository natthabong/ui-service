var txnMod = angular.module('gecscf.transaction');
txnMod.controller('PaymentTransactionController', ['$rootScope', '$scope', '$log', '$stateParams', 'PaymentTransactionService',
		'PagingController', 'PageNavigation','UIFactory','$http', '$timeout','TransactionService','SCFCommonService','scfFactory', function($rootScope, $scope, $log, $stateParams, PaymentTransactionService
        , PagingController, PageNavigation, UIFactory,$http, $timeout,TransactionService,SCFCommonService,scfFactory) {
	
	var vm = this;
	var log = $log;
	vm.getUserInfoSuccess = false;
    vm.approve = false;
    vm.verify = false;
    vm.reject = false;
    vm.canRetry = false;
    vm.canView = false;
    vm.resend = false;
    vm.rejectInsufficientFunds = false;
    vm.canAdjustStatus = false;
    
    var defered = scfFactory.getUserInfo();
    defered.promise.then(function(response) {
        vm.getUserInfoSuccess = true;
	    vm.openDateFrom = false;
		vm.openDateTo = false;
		    
	    vm.serverTime = '';
	
	    var viewMode = $stateParams.viewMode;
	
	    var enumViewMode = {
	        MY_ORGANIZE : 'MY_ORGANIZE',
	        PARTNER : 'PARTNER',
	        CUSTOMER : 'CUSTOMER'
	    }
	
	    var ownerId = $rootScope.userInfo.organizeId;
	
	    var organizeInfo = {
	    	memberId : $rootScope.userInfo.organizeId,
	    	memberCode : $rootScope.userInfo.organizeId,
	        memberName : $rootScope.userInfo.organizeName
	    }
	
	    _sponsor = null;
	    _supplier = null;
	
	    vm.buyer = $stateParams.buyer || null;
	    vm.supplier = $stateParams.supplier || null;
	
	    var buyerPlaceholder = null;
	    var supplierPlaceholder = null;
	
	    vm.disableBuyerAutoSuggest = false;
	    vm.disableSupplierAutoSuggest = false;
	
	    vm.statusStepDropDown = [{
			label: 'All',
			value: ''
		}];
	
	    vm.statusPaymentSuccess = 'PAYMENT_SUCCESS';
	    
	    vm.summaryInternalStep = {};
	    vm.summaryStatusGroup = {};
	
		vm.statusDocuments = {
			waitForVerify: 'WAIT_FOR_VERIFY',
			waitForApprove: 'WAIT_FOR_APPROVE',
			rejectByChecker: 'REJECT_BY_CHECKER',
			rejectByApprover: 'REJECT_BY_APPROVER',
			canceledBySupplier: 'CANCELLED_BY_SUPPLIER',
			rejectIncomplete: 'REJECT_INCOMPLETE',
			waitForPaymentResult: 'WAIT_FOR_PAYMENT_RESULT',
			incomplete: 'INCOMPLETE',
			insufficientFunds: 'INSUFFICIENT_FUNDS'
	   }
	
	    var _criteria = {};
		vm.criteria = $stateParams.criteria;
		
	    if(!$stateParams.criteria || !$stateParams.criteria.offset){
	    	vm.criteria = {
	    	    	sponsorId : null,
	    	        supplierId : null,
	    	        supplierCode : null,
	    	        dateFrom : null,
	    	        dateTo: null,
	    	        transactionNo : null,
	    	        statusGroup : '',
	    	        transactionType: 'PAYMENT',
	    	        offset : 0,
	    	        limit : "20",
	    		}
		}
		
		if($stateParams.criteria && $stateParams.criteria.statusGroup){
			vm.criteria.statusGroup = $stateParams.criteria.statusGroup;
		}
		
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
	
	    _clearSummaryStatusGroup = function(){
	        vm.summaryStatusGroup = {
				INTERNAL_STEP: {
					totalRecord: 0,
					totalAmount: 0
				  },
				  WAIT_FOR_PAYMENT_RESULT:{
					  totalRecord: 0,
					  totalAmount: 0
				 },
				 PAYMENT_SUCCESS:{
					  totalRecord: 0,
					  totalAmount: 0
				  },
				  PAYMENT_FAIL:{
					  totalRecord: 0,
					  totalAmount: 0
				  },
				  GRAND_TOTAL:{
					  totalRecord: 0,
					  totalAmount: 0              
				  }		
			};
	    }
	
	    
	    function _loadSummaryStatusGroup(criteria){
	        _clearSummaryStatusGroup();
	
	        var criteriaSummary = {
	            sponsorId : criteria.sponsorId,
	            supplierId : criteria.supplierId,
	            statusGroup : criteria.statusGroup,
	            transactionType : 'PAYMENT',
	            dateType : "transactionDate",
	            transactionNo : criteria.transactionNo,
	            supplierCode: criteria.supplierCode,
	            dateFrom: SCFCommonService.convertDate(criteria.dateFrom),
	            dateTo: SCFCommonService.convertDate(criteria.dateTo)
	        }
	        var deferred = TransactionService.summaryStatusGroup(criteriaSummary);
	        deferred.promise.then(function(response) {
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
					$log.error('Summary Internal Step Error');
				});
	    	}
	    }
	
	    vm.loadData = function(pagingModel){
	    	var diferred = vm.pagingController.search(pagingModel);
	    	diferred.promise.then(function(response) {
				vm.serverTime = response.headers('current-date');
			});
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
	
	    vm.pagingController = PagingController.create('api/v1/list-transaction', _criteria, 'GET');
	
	    vm.searchTransaction = function(pagingModel) {
	    	if(_validateForSearch()){
		    	angular.copy(vm.criteria, _criteria);
		    	if(vm.buyer){
		    		_criteria.sponsorId = vm.buyer.memberId;
		            _sponsor = vm.buyer;
		    	}
		    	if(vm.supplier){
		    		_criteria.supplierId = vm.supplier.memberId;
		            _supplier = vm.supplier;
		    	}
		    	vm.loadData(pagingModel || ( $stateParams.backAction? {
		    		offset : _criteria.offset,
					limit : _criteria.limit
		    	}: undefined));
		    	if($stateParams.backAction){
		    		$stateParams.backAction = false;
		    	}

	            if(viewMode != enumViewMode.CUSTOMER){
	                _loadSummaryOfTransaction(_criteria);
	            }else{
	                _loadSummaryStatusGroup(_criteria);
	            }
		    	
	    	}
		}
	
	    var prepareAutoSuggestLabel = function(item,role) {
			item.identity = [ role,'-', item.memberId, '-option' ].join('');
			item.label = [ item.memberCode, ': ', item.memberName ].join('');
			item.value = item.memberId;
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
	    
	    var initial = function() {
	    	var backAction = $stateParams.backAction;
			if(backAction){
				vm.criteria = $stateParams.criteria;
			}
	        if(viewMode == enumViewMode.MY_ORGANIZE){
	            hideSupplierCol = false;
	            hideBuyerCol = true;
	
	            vm.disableBuyerAutoSuggest = true;
	            vm.disableSupplierAutoSuggest = false;
	            
	            vm.buyer = prepareAutoSuggestLabel(organizeInfo,'buyer');
	            
	
	        }else if(viewMode == enumViewMode.PARTNER){
	            hideSupplierCol = true;
	            hideBuyerCol = false;
	
	            vm.disableBuyerAutoSuggest = false;
	            vm.disableSupplierAutoSuggest = true;
	            
	            vm.supplier = prepareAutoSuggestLabel(organizeInfo,'supplier');
	
	        }else if(viewMode == enumViewMode.CUSTOMER){
	            hideSupplierCol = false;
	            hideBuyerCol = false;
	
	            vm.disableBuyerAutoSuggest = false;
	            vm.disableSupplierAutoSuggest = false;
	        }

	        _loadTransactionGroup();
	        vm.searchTransaction();
	    }();
	
		var dialogPopup;
	
		var closeDialogPopUp = function(){
			dialogPopup.close();
		}
	
		vm.displayName = $scope.userInfo.displayName;
		vm.transactionPayload = {
			transaction: null,
			credential: ''
		};
		
		vm.viewRecent = function () {
			$timeout(function () {
				PageNavigation.gotoPage('/payment-transaction/view', { transactionModel: vm.transaction, isShowViewHistoryButton: true, viewMode: 'CUSTOMER' });
			}, 10);
		};
		
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
	
	        var deffered = TransactionService.retry(vm.transaction);
	        deffered.promise.then(function(response) {
	        	 vm.searchTransaction();
	        }).catch(function(response) {
	        	vm.handleDialogFail(response,"Recheck transaction");
	        });
	    }
		
	    var reject = function(transactionPayload) {   
	        var deffered = TransactionService.reject(transactionPayload);
	        deffered.promise.then(function(response) {
	        	vm.transaction = response.data;
	        	vm.searchTransaction();
	        });
	        return deffered;
	    }   
	    
	    var retryReject = function(transaction) {   	
	        var deffered = TransactionService.retry(transaction);
	        deffered.promise.then(function(response) {
	        	vm.transaction = response.data;
	        	vm.searchTransaction();
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
	    			vm.handleDialogFail(response,'Reject transaction');
	    		}
	        }).catch(function(response) {
	        	vm.handleDialogFail(response,'Reject transaction');
	        });    	
	    };   
	    
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
		   vm.transaction.transactionType = data.transactionType;
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
					if (TransactionService.validateCredential(vm.transactionPayload.credential)) {
						return reject(vm.transactionPayload);
					}else {
						vm.wrongPassword = true;
						vm.passwordErrorMsg = 'Password is required';
						closeDialogPopUp();
						vm.confirmRejectPopup(vm.transactionPayload.transaction,'error');
					}
				},
				onFail : function(response) {	
					vm.handleDialogFail(response, 'Reject transaction');					
				},
				onSuccess : function(response) {
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
//					UIFactory.showSuccessDialog({
//						data : {
//							mode: 'transaction',
//							headerMessage : 'Reject transaction success.',						
//							bodyMessage : vm.transaction.transactionNo,
//							viewRecent : vm.viewRecent,
//							viewHistory: vm.searchTransactionService,
//							hideBackButton : true,
//							hideViewRecentButton : false,
//							hideViewHistoryButton : true,
//							showOkButton : true
//						},
//					});
				}
			});    	   
	    };
	    
	    vm.resendPayment = function(data) {	
			vm.transaction = {};
			if (angular.isUndefined(data)) {
				vm.transaction.transactionId = vm.transactionIdForRetry;
			} else {
				vm.transaction.transactionId = data.transactionId;
				vm.transaction.transactionNo = data.transactionNo;
				vm.transaction.version = data.version;
				vm.transaction.statusCode = data.statusCode;
				vm.transactionIdForRetry = vm.transaction.transactionId;
			}

	        var deffered = TransactionService.resend(vm.transaction);
	        deffered.promise.then(function(response) {
				UIFactory.showSuccessDialog({
                    data: {
                        mode: 'transactionComplete',
                        headerMessage: 'Resend transaction success.',
                        bodyMessage: vm.transaction,
                        viewRecent: vm.viewRecent,
                        viewHistory: vm.viewHistory,
                        backAndReset: vm.backPage,
                        hideBackButton: true,
                        hideViewRecentButton: false,
                        hideViewHistoryButton: true,
                        showOkButton: true
                    },
                });	        	
	        	vm.searchTransaction();
	        }).catch(function(response) {
	        	vm.handleDialogFail(response,'Resend transaction');
	        });	    	
	    };
	    
	    vm.handleDialogFail = function(response, action){
	    	vm.searchTransaction();
	    	
	    	if(response.status == 400){
				if(response.data.errorCode=='E0400'){
					vm.wrongPassword = true;
					vm.passwordErrorMsg = response.data.errorMessage;						
					vm.confirmRejectPopup(vm.transactionPayload.transaction,'error');
				}
				else if(response.data.errorCode == 'INVALID'){
					var message = response.data.attributes.suspend?'Please try again later.':'Please approve transaction within';
					UIFactory.showHourDialog({
						data : {
							mode: 'transaction',
							headerMessage : 'Service unavailable.',
							bodyMessage: message,
							startTransactionHour : response.data.attributes.startTransactionHour,
							endTransactionHour : response.data.attributes.endTransactionHour,
                            suspend: response.data.attributes.isSuspend
						},
					});	
				} 
			}else if(response.status == 402){
				vm.transaction.transactionNo = response.data.attributes.transactionNo;
				vm.transaction.returnCode = response.data.attributes.returnCode;
				vm.transaction.returnMessage = response.data.attributes.returnMessage;
		    	vm.transaction.retriable = response.data.attributes.retriable;
		    	vm.transaction.version = response.data.attributes.version;
				UIFactory.showFailDialog({
					data: {
						mode: 'transaction',
						headerMessage: action+' fail.',
						transaction: vm.transaction,
						resend: vm.resendPayment,
						backAndReset: vm.backAndReset,
						viewRecent: vm.viewRecent,
						viewHistory: vm.searchTransactionService,
						hideBackButton: true,
						hideViewRecentButton: true,
						hideViewHistoryButton: true,
						showOkButton: true,
						showContactInfo: true,
						showResend: true
					},
				});	
			}
			else if(response.status == 409){
				if(response.data.errorCode == 'FAILED'){
					UIFactory.showFailDialog({
						data : {
							mode: 'transaction',
							headerMessage : action+' fail.',
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
					vm.transaction.returnMessage = response.data.attributes.returnMessage;
			    	vm.transaction.retriable = response.data.attributes.retriable;
			    	vm.transaction.version = response.data.attributes.version;
					vm.transaction.rejectReason  = null;
					UIFactory.showIncompleteDialog({
						data : {
							mode: 'transaction',
							headerMessage : action+' incomplete.',						
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
							headerMessage : action+' fail.',						
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
			else{
				UIFactory.showFailDialog({
					data : {
						mode: 'transaction',
						headerMessage : action+' fail',
						backAndReset : vm.backAndReset,
						viewHistory : vm.searchTransactionService,
						errorCode : response.data.errorCode,
						action : response.data.attributes.action,
						actionBy : response.data.attributes.actionBy
					},
				});						
			}
	    	
	    };    
	    
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
				},
	            hiddenColumn : hideSupplierCol
	        },{
				fieldName: 'sponsor',
	            field: 'sponsor',
	            label: 'Buyer',
	            idValueField: 'transactionNo',
	            id: 'transaction-{value}-buyer-name',
	            sortData: true,
	            cssTemplate: 'text-center',
	            hiddenColumn : hideBuyerCol
	        },{
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
				cellTemplate:'<scf-button class="btn-sm btn-default gec-btn-action" ng-disabled="!(ctrl.verify && (data.statusCode === ctrl.statusDocuments.waitForVerify))" id="transaction-{{data.transactionNo}}-verify-button" ng-click="ctrl.verifyTransaction(data)" title="Verify"><i class="fa fa-inbox" aria-hidden="true"></i></scf-button>'+
				'<scf-button id="transaction-{{data.transactionNo}}-approve-button" ng-disabled="!(ctrl.approve &&(data.statusCode === ctrl.statusDocuments.waitForApprove))" class="btn-sm btn-default gec-btn-action"  ng-click="ctrl.approveTransaction(data)" title="Approve"><i class="fa fa-check-square-o" aria-hidden="true"></i></scf-button>' +
				'<scf-button class="btn-sm btn-default gec-btn-action" id="transaction-{{data.transactionNo}}-view-button" ng-disabled="{{!ctrl.canView}}" ng-click="ctrl.viewTransaction(data)" title="View"><i class="fa fa-search" aria-hidden="true"></i></scf-button>'+
				'<scf-button id="transaction-{{data.transactionNo}}-re-check-button" class="btn-sm btn-default gec-btn-action" ng-disabled="{{!(data.retriable && ctrl.canRetry && (data.statusCode != ctrl.statusDocuments.insufficientFunds))}}" ng-click="ctrl.retry(data)" title="Re-check"><i class="fa fa-refresh" aria-hidden="true"></i></scf-button>'+
	            '<scf-button class="btn-sm btn-default gec-btn-action" ng-show ="data.statusCode == ctrl.statusPaymentSuccess" ng-disabled="data.statusCode != ctrl.statusPaymentSuccess" title="Print">'+
				'<span class="dropdown"><span class="dropdown-toggle" data-toggle="dropdown" id="transaction-{{data.transactionNo}}-print-button">'+
	            '<i class="fa fa-print" aria-hidden="true"></i></span>'+
	            '<ul class="dropdown-menu">'+
	            '<li><a id="evident-form-button" ng-click="ctrl.printEvidence(data)">{{"Evidence form" | translate}}</a></li>'+
	            '<li role="separator" class="divider"></li>'+
	            '<li><a id="credit-advice-form-button" ng-click="ctrl.generateCreditAdviceForm(data)">{{"Credit advice form" | translate}}</a></li></ul></span></scf-button>'+
	            '<scf-button class="btn-sm btn-default gec-btn-action" id="transaction-{{data.transactionNo}}-print-button-disable" ng-hide ="data.statusCode == ctrl.statusPaymentSuccess" ng-disabled="true" title="Print"><i class="fa fa-print" aria-hidden="true"></i></scf-button>'+
				'<scf-button id="transaction-{{data.transactionNo}}-reject-button"class="btn-sm btn-default gec-btn-action" ng-disabled="ctrl.disabledReject(data)" ng-click="ctrl.confirmRejectPopup(data,\'clear\')" title="Reject"><i class="fa fa-times-circle" aria-hidden="true"></i></scf-button>'+
	            //+ '<scf-button id="transaction-{{data.transactionNo}}-resend-button"class="btn-sm btn-default gec-btn-action" ng-disabled="ctrl.disabledResend(data)" ng-click="ctrl.resendPayment(data)" title="Resend"><i class="fa fa-share" aria-hidden="true"></i></scf-button>'
				'<scf-button class="btn btn-sm" id="transaction-{{data.transactionNo}}-adjust-status-button" ng-if="ctrl.showAdjustStatus(data)" ng-click="ctrl.adjustStatus(data)" title="Adjustment status"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
				
			}]
	    };
	
	    vm.supplierAutoSuggestModel = UIFactory.createAutoSuggestModel({
	        placeholder : 'Enter organization name or code',
	        itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
	        query : querySupplierAutoSuggest
		});
	
	    vm.buyerAutoSuggestModel = UIFactory.createAutoSuggestModel({
	        placeholder : 'Enter organization name or code',
	        itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
	        query : queryBuyerAutoSuggest
		});
	
	    vm.disabledPrint = function(){
	    	return true;
	    }
	    
	    vm.disabledReject = function(data){
			var hasReject = vm.reject != undefined && vm.reject == true;
			var isWaitForPaymentResult = data.statusCode == vm.statusDocuments.waitForPaymentResult;
			var isAfterToday = TransactionService.isAfterToday(data, vm.serverTime);
		
			var hasRejectInsufficientFunds = vm.rejectInsufficientFunds != undefined && vm.rejectInsufficientFunds == true;
			var isInsufficientFunds = data.statusCode == vm.statusDocuments.insufficientFunds;
			
			if (hasReject && isWaitForPaymentResult && isAfterToday) {
				return false;
			}else if(hasRejectInsufficientFunds && isInsufficientFunds){
				return false;
			} else {
				return true;
			}
	    }
	    
	    vm.disabledResend = function(data){
			var condition1 = vm.resend!= undefined && vm.resend == true;
			var condition2 = data.statusCode == vm.statusDocuments.insufficientFunds;
			if(condition1 && condition2){
				return false;
			}else{
				return true;
			}
	    }
	    
	    vm.showAdjustStatus = function (data) {
			var condition1 = vm.canAdjustStatus != undefined && vm.canAdjustStatus == true;
			var condition2 = data.statusCode == vm.statusDocuments.incomplete
			if (condition1 && condition2) {
				return true;
			} else {
				return false;
			}
		}
	    
	    vm.adjustStatus = function (transactionModel) {
			$timeout(function(){		
				PageNavigation.nextStep('/payment-transaction/adjust-status', 
	                {
						viewMode: viewMode,
						transactionModel: transactionModel,
						isShowViewHistoryButton: false,
						isShowBackButton: true,
						isAdjustStatus: true
	                },
	                {criteria : _criteria,buyer : _sponsor,supplier : _supplier});
	    	}, 10);
		}
	    
	    vm.viewTransaction = function(transactionModel){
			$timeout(function(){		
				PageNavigation.nextStep('/payment-transaction/view', 
	                {viewMode: viewMode, transactionModel: transactionModel, isShowViewHistoryButton: false, isShowBackButton: true, isAdjustStatus: false},
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
    });
} ]);