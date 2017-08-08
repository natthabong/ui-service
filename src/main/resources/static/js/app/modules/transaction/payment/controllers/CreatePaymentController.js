var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'TransactionService',
		'PagingController', 'PageNavigation', function($rootScope, $scope, $log, $stateParams, SCFCommonService, TransactionService, PagingController, PageNavigation) {
	
	var vm = this;
	var log = $log;

	var ownerId = $rootScope.userInfo.organizeId;
//    var backAction = $stateParams.backAction;
    var fristTime = true;
    vm.isLoanPayment = false;
	
    var _criteria = {};
    
	var enterPageByBackAction = $stateParams.backAction || false;
	vm.criteria = $stateParams.criteria || {
		accountingTransactionType: 'RECEIVABLE',
		sponsorId: ownerId,
		buyerId: ownerId,
		documentStatus: 'NEW',
		showOverdue: false
	}
	
	vm.transactionModel =  $stateParams.transactionModel || {
		sponsorId: ownerId,
		transactionAmount: 0.0,
        documents : [],
        transactionDate : null,
        maturityDate : null
	}
	
	vm.tradingpartnerInfoModel = $stateParams.tradingpartnerInfoModel || {
		available : '0.00',
		tenor : null,
		interestRate : null
	}
	
	$scope.errors = {
			
	}

	var pageOptions = {
			
	}
	
	vm.documentSelects = $stateParams.documentSelects || [];
    vm.selectAllModel = false;
	vm.display = false;
	vm.openDateFrom = false;
	vm.openDateTo = false;
	
	vm.openCalendarDateFrom = function() {
		vm.openDateFrom = true;
	}

	vm.openCalendarDateTo = function() {
		vm.openDateTo = true;
	}
	
	vm.dataTable = {
        options: {
            displaySelect: {
                label: '<input type="checkbox" id="select-all-checkbox" ng-model="ctrl.checkAllModel" ng-click="ctrl.checkAllDocument()"/>',
                cssTemplate: 'text-center',
                cellTemplate: '<input type="checkbox" checklist-model="ctrl.documentSelects" checklist-value="data" ng-click="ctrl.selectDocument(data)"/>',
                displayPosition: 'first',
				idValueField: '$rowNo',
				id: 'document-{value}-checkbox'
            }
        },
        columns: []
    };

	var _loadDocumentDisplayConfig = function(ownerId, mode) {
        var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId, mode);
        deffered.promise.then(function(response) {
            vm.dataTable.columns = response.items;
            pageOptions.loanRequestMode = response.loanRequestMode;
            pageOptions.documentSelection = response.documentSelection;
            pageOptions.buyerCodeSelectionMode = response.buyerCodeSelectionMode;
            _loadBuyerCodes(ownerId);
        });
    }
	
	function _loadTradingPartnerInfo(sponsorId, supplierId){
		vm.tradingpartnerInfoModel.supplierId = supplierId;
        vm.tradingpartnerInfoModel.supplierName = getSupplierName(supplierId);
    	var deffered = TransactionService.getTradingInfo(sponsorId, supplierId);
    	deffered.promise.then(function(response){
    		vm.tradingpartnerInfoModel.tenor = response.data.tenor;
    		vm.tradingpartnerInfoModel.interestRate = response.data.interestRate;
    	}).catch(function(response) {
            log.error(response);
        });
    }

    function getSupplierName(supplierId){
        var supplierName = null;
        vm.suppliers.map(function(obj) { 
            if(obj.value == supplierId){
                supplierName = obj.label;
            }
        });
        return supplierName;
    }
	
	function _loadSuppliers() {
        var deffered = TransactionService.getSuppliers('RECEIVABLE');
        deffered.promise.then(function(response) {
        	 vm.suppliers = [];
             var _suppliers = response.data;
             if (_suppliers !== undefined) {
            	 _suppliers.forEach(function(supplier) {
                     var selectObj = {
                         label: supplier.supplierName,
                         value: supplier.supplierId
                     }
                     vm.suppliers.push(selectObj);
                 });

                if(!$stateParams.backAction){
                    vm.criteria.supplierId = _suppliers[0].supplierId;
                }
            	
            	if(angular.isDefined(vm.criteria.supplierId)){
            		_loadTradingPartnerInfo(ownerId, vm.criteria.supplierId);
            		_loadAccount(ownerId, vm.criteria.supplierId);
            		_loadDocumentDisplayConfig(vm.criteria.supplierId, 'BFP');
            	}
             }
        }).catch(function(response) {
            log.error(response);
        });
        return deffered;
    };
    
    function _loadBuyerCodes(supplierId) {
        var deffered = TransactionService.getBuyerCodes(supplierId);
        deffered.promise.then(function(response) {
        	 vm.customerCodes = [];
             var _buyerCodes = response.data;
             if (angular.isDefined(_buyerCodes)) {
            	 _buyerCodes.forEach(function(code) {
                     var selectObj = {
                		 label: code,
                         value: code
                     }
                     vm.customerCodes.push(selectObj);
                 });

                 if(!$stateParams.backAction){
                	vm.criteria.customerCode = _buyerCodes[0];
                 }

                 if(fristTime){
                    vm.display = true;
                    vm.searchDocument();
                    fristTime = false;
                 }
                 
             }
        }).catch(function(response) {
            log.error(response);
        });
    };
    
    function _validateForSearch(){
    	$scope.errors = {};
    	var valid = true;
    	if(!angular.isDefined(vm.criteria.dueDateFrom) || vm.criteria.dueDateFrom == null){
            var dueDateFrom = document.getElementById("due-date-from-textbox").value;
            if(dueDateFrom != null && dueDateFrom != ''){
                valid = false;
                $scope.errors.dueDateFormat = {
                    message : 'Wrong date format data.'
                }
            }
        }
    	if(!angular.isDefined(vm.criteria.dueDateTo) || vm.criteria.dueDateTo == null){
            var dueDateTo = document.getElementById("due-date-to-textbox").value;
            if(dueDateTo != null && dueDateTo != ''){
                valid = false;
                $scope.errors.dueDateFormat = {
                    message : 'Wrong date format data.'
                }
            }
        }
    	
        if(angular.isDefined(vm.criteria.dueDateFrom) && angular.isDefined(vm.criteria.dueDateTo)){
            var isDueDateFromAfterDueDateFrom = moment(vm.criteria.dueDateFrom).isAfter(vm.criteria.dueDateTo);
    	
            if(isDueDateFromAfterDueDateFrom){
                valid = false;
                $scope.errors.dueDateToLessThanFrom = {
                    message : 'From date must be less than or equal to To date.'
                }
            }
        }
    	
    	return valid;
    }
	function _prepareCriteria() {
		angular.copy(vm.criteria, _criteria);
		
	}

	vm.pagingController = PagingController.create('api/v1/documents', _criteria, 'GET');
	vm.display = false;
	
	vm.loadData = function(pagingModel){
		var diferred = vm.pagingController.search(pagingModel);
        diferred.promise.then(function(response) {
            if(!vm.display){
                vm.clearSelectDocument();
            }
            vm.watchCheckAll();
            var totalRecord = vm.pagingController.pagingModel.totalRecord;
            if(vm.documentSelects.length == totalRecord && vm.documentSelects.length > 0){
            	vm.selectAllModel = true;
            }
            vm.showInfomation = true;
        }).catch(function(response) {
            log.error(response);
        });
	}
	vm.searchDocument = function(pagingModel) {
		if(_validateForSearch()){
			_prepareCriteria();

			vm.loadData(pagingModel || ($stateParams.backAction? {
				limit: _criteria.limit,
				offset: _criteria.offset
			}:undefined));
			if($stateParams.backAction){
	    		$stateParams.backAction = false;
	    	}
		}else{
            vm.display = false;
        }
	
	}
	
	vm.clearSelectDocument = function(){
        if(_validateForSearch()){
            vm.display = true;
        }else{
            vm.display = false;
        }
		vm.paymentDropDown = [];
		vm.documentSelects = [];
		vm.transactionModel.transactionAmount = '0.00';
		vm.showErrorMsg = false;
        vm.selectAllModel = false;
        vm.checkAllModel = false;
        
	}
   
    function _loadAccount(ownerId, supplierId){
    	vm.accountDropDown = [];
        var deffered = TransactionService.getAccounts(ownerId, supplierId);
        deffered.promise.then(function(response) {
            var accounts = response.data;
            vm.isLoanPayment = false;
            accounts.forEach(function(account) {
            	if(account.accountNo == 'LOAN'){
                    vm.accountDropDown.push({
                        label : "Loan",
                        value : account.accountId,
                        item : account
                    })
            	}else{
                    vm.accountDropDown.push({
                        label : account.accountNo,
                        value : account.accountId,
                        item : account
                    })
                }
                
            });

            if(!$stateParams.backAction){
                vm.transactionModel.payerAccountId = accounts[0].accountId;
                vm.transactionModel.payerAccountNo = accounts[0].accountNo;
                vm.tradingpartnerInfoModel.available = accounts[0].remainingAmount - accounts[0].pendingAmount;
            }

            if(vm.transactionModel.payerAccountNo == 'LOAN'){
                vm.isLoanPayment = true;
            }
            
        }).catch(function(response) {
            log.error(response);
        });
    }

    vm.accountChange = function() {
    	var accountId = vm.transactionModel.payerAccountId;
    	vm.accountDropDown.forEach(function(account) {
    		if(accountId == account.item.accountId){
    			vm.transactionModel.payerAccountNo = account.item.accountNo;
    			vm.tradingpartnerInfoModel.available = account.item.remainingAmount - account.item.pendingAmount;
    			if(account.item.accountNo != 'LOAN'){
    				vm.isLoanPayment = false;
    			}else{
    				vm.isLoanPayment = true;
    				_loadMaturityDate();
    			}
    		}
        });    	
    }
    
    function _loadMaturityDate(){
    	vm.maturityDateDropDown = [];
    	if(angular.isDefined(vm.paymentModel) && vm.transactionModel.documents != [] && vm.transactionModel.documents.length != 0){
    		
    		var deffered = TransactionService.getAvailableMaturityDates(vm.paymentModel, vm.tradingpartnerInfoModel.tenor);
    		deffered.promise.then(function(response){
    			var maturityDates = response.data;
    			
    			maturityDates.forEach(function(data){
    				vm.maturityDateDropDown.push({
    					label: data,
                        value: data
    				});
    			});
    			if(vm.maturityDateDropDown.length != 0){
    				vm.maturityDateModel = vm.maturityDateDropDown[0].value;
    			}
    			
				 if($stateParams.backAction && vm.transactionModel.maturityDate != null){
	             	vm.maturityDateModel = vm.transactionModel.maturityDate;
	             }

    		})
    		.catch(function(response) {
                log.error(response);
            });
    	}
    }

    vm.paymentDropDown = [];

    function _loadPaymentDate() {
        vm.paymentDropDown = [];
        vm.transactionModel.documents = vm.documentSelects;
        vm.transactionModel.supplierId = vm.criteria.supplierId;
        if(vm.transactionModel.documents != [] && vm.transactionModel.documents.length != 0){
            var deffered = TransactionService.getPaymentDate(vm.transactionModel);
            deffered.promise.then(function(response) {
                var paymentDates = response.data;

                paymentDates.forEach(function(data) {
                    vm.paymentDropDown.push({
                        label: data,
                        value: data
                    })
                });

                if($stateParams.backAction && vm.transactionModel.transactionDate != null){
                	vm.paymentModel = vm.transactionModel.transactionDate;
                }else{
                    vm.paymentModel = vm.paymentDropDown[0].value;
                }
                _loadMaturityDate();
            })
            .catch(function(response) {
                log.error(response);
            });
        }else{
        	_loadMaturityDate();
        }
    }
    
    vm.paymentDateChange = function() {
    	_loadMaturityDate();
    }
    
    function _calculateTransactionAmount(documentSelects) {
        var sumAmount = 0;
        documentSelects.forEach(function(document) {
            sumAmount += document.paymentAmount;
        });
        vm.transactionModel.transactionAmount = sumAmount;
    }

    vm.selectDocument = function(data) {
    	vm.transactionModel.transactionDate = null;
        vm.checkAllModel = false;
        vm.selectAllModel = false;
        vm.watchCheckAll();
        _calculateTransactionAmount(vm.documentSelects);
        _loadPaymentDate();
        
    }

    vm.checkAllDocument = function() {
    	vm.transactionModel.transactionDate = null;
        if (vm.checkAllModel) {
            vm.pagingController.tableRowCollection.forEach(function(document) {
                var foundDataSelect = (vm.documentSelects.map(function(o) {
                        return o.documentId;
                    }).indexOf(document.documentId) > -1);
                if (!foundDataSelect){
                    vm.documentSelects.push(document);
                    _calculateTransactionAmount(vm.documentSelects);
                }
            });            
        } else {
            vm.selectAllModel = false;
            vm.pagingController.tableRowCollection.forEach(function(document) { 
                for (var index = vm.documentSelects.length-1; index > -1;index--) {
                    if(document.documentId === vm.documentSelects[index].documentId){
                        vm.documentSelects.splice(index, 1);
                    }
                }
            });
            _calculateTransactionAmount(vm.documentSelects);           
        }
        vm.watchCheckAll();
        _loadPaymentDate();
    };

    vm.selectAllDocument = function() {
    	vm.transactionModel.transactionDate = null;
        var pagingModel = vm.pagingController.pagingModel;
        if(!vm.selectAllModel){
            vm.documentSelects = [];
            var searchDocumentCriteria = {
                accountingTransactionType: _criteria.accountingTransactionType,
                customerCode: _criteria.customerCode,
                dueDateFrom: _criteria.dueDateFrom,
                dueDateTo: _criteria.dueDateTo,
                documentStatus: _criteria.documentStatus,
                limit: pagingModel.totalRecord,
                offset: 0,
                buyerId: ownerId,
                supplierId: _criteria.supplierId,
                showOverdue: false
            }
            var diferredDocumentAll = TransactionService.getDocuments(searchDocumentCriteria);
            diferredDocumentAll.promise.then(function(response){
                vm.documentSelects = response.data;
                _calculateTransactionAmount(vm.documentSelects);
                vm.selectAllModel = true;
                vm.checkAllModel = true;
                _loadPaymentDate();
            }).catch(function(response){
                log.error('Select all document error')
            });       		
        }else{
            vm.documentSelects = [];
            vm.selectAllModel = false;
            vm.checkAllModel = false;
            _calculateTransactionAmount(vm.documentSelects);
            _loadPaymentDate();
        }
    }

    vm.watchCheckAll = function() {
        vm.checkAllModel = false;
        var comparator = angular.equals;
        var countRecordData = 0;
        vm.pagingController.tableRowCollection.forEach(function(document) {
            for (var index = vm.documentSelects.length; index--;) {
                if (comparator(document, vm.documentSelects[index])) {
                    countRecordData++;
                    break;
                }
            }
        });
        if (countRecordData === vm.pagingController.tableRowCollection.length && countRecordData > 0) {
            vm.checkAllModel = true;
        }
        vm.watchSelectAll();
    }

    vm.watchSelectAll = function() {
        vm.selectAllModel = false;
        var pageSize = vm.pagingController.splitePageTxt.split("of ")[1];
        if (vm.documentSelects.length > 0 && vm.documentSelects.length == pageSize) {
            vm.selectAllModel = true;
        }
    }


    // next to page verify and submit
    vm.nextStep = function() {
    	if (vm.documentSelects.length === 0) {
            vm.errorMsgGroups = 'Please select document.';
            vm.showErrorMsg = true;
    	}else if(vm.isLoanPayment && !angular.isDefined(vm.maturityDateModel) || vm.maturityDateModel == ''){
    		vm.errorMsgGroups = 'Maturity date is required.';
            vm.showErrorMsg = true;
        } else {                
            vm.transactionModel.supplierId = vm.criteria.supplierId;
            vm.transactionModel.documents = vm.documentSelects;
            vm.transactionModel.transactionDate = vm.paymentModel;
            vm.transactionModel.maturityDate = vm.maturityDateModel;
            
            var objectToSend = {
                transactionModel: vm.transactionModel,
                tradingpartnerInfoModel: vm.tradingpartnerInfoModel
            };

            PageNavigation.nextStep('/create-payment/validate-submit', objectToSend,{
            	transactionModel: vm.transactionModel,
            	tradingpartnerInfoModel : vm.tradingpartnerInfoModel,
                criteria: _criteria,
                documentSelects: vm.documentSelects
            });
        }
    }
    
	var init = function(){
		_loadSuppliers();
        if(vm.documentSelects.length > 0){
        	_loadPaymentDate();
        }
	}();

    vm.supplierChange = function() {
    	vm.showErrorMsg = false;
    	vm.display = false;
    	_loadTradingPartnerInfo(ownerId, vm.criteria.supplierId);
    	_loadAccount(ownerId, vm.criteria.supplierId);
        _loadDocumentDisplayConfig(vm.criteria.supplierId, 'BFP');
        vm.maturityDateModel = null;
        
    }
	
    vm.customerCodeChange = function() {
		vm.showErrorMsg = false;
		vm.display = false;
    }
    
} ]);