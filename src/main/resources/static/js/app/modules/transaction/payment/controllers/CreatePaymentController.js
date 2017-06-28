var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentController', ['$rootScope', '$scope', 'SCFCommonService', 'CreatePaymentService',
		'PagingController', 'PageNavigation', '$log', function($rootScope, $scope, SCFCommonService, CreatePaymentService, PagingController, PageNavigation, $log) {
	
	var vm = this;
	var log = $log;

	var ownerId = $rootScope.userInfo.organizeId;
	
	vm.criteria = {
		accountingTransactionType: 'RECEIVABLE',
		sponsorId: ownerId
	}
	
	vm.transactionModel = {
		sponsorId: ownerId,
		transactionAmount: 0.0,
	}
	
	$scope.errors = {
			
	}

	var pageOptions = {
			
	}
	
	vm.documentSelects = [];
    vm.totalDocumentAmount = 0.00;
	
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
	
	function _loadSuppliers() {
        var deffered = CreatePaymentService.getSuppliers('RECEIVABLE');
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
            	vm.criteria.supplierId = _suppliers[0].supplierId;
            	if(angular.isDefined(vm.criteria.supplierId)){
            		_loadDocumentDisplayConfig(vm.criteria.supplierId, 'BFP');
            	}
             }
        }).catch(function(response) {
            log.error(response);
        });
    };
    
    function _loadBuyerCodes(supplierId) {
        var deffered = CreatePaymentService.getBuyerCodes(supplierId);
        deffered.promise.then(function(response) {
        	 vm.buyerCodes = [];
             var _buyerCodes = response.data;
             if (angular.isDefined(_buyerCodes)) {
            	 _buyerCodes.forEach(function(code) {
                     var selectObj = {
                		 label: code,
                         value: code
                     }
                     vm.buyerCodes.push(selectObj);
                 });
            	vm.criteria.buyerCode = _buyerCodes[0];
            	vm.searchDocument();
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
                $scope.errors.dueDateFrom = {
                    message : 'Wrong date format data.'
                }
            }
        }
    	if(!angular.isDefined(vm.criteria.dueDateTo) || vm.criteria.dueDateTo == null){
            var dueDateTo = document.getElementById("due-date-to-textbox").value;
            if(dueDateTo != null && dueDateTo != ''){
                valid = false;
                $scope.errors.dueDateTo = {
                    message : 'Wrong date format data.'
                }
            }
        }
    	
    	var isDueDateFromAfterDueDateFrom = moment(vm.criteria.dueDateFrom).isAfter(vm.criteria.dueDateTo);
    	
    	if(isDueDateFromAfterDueDateFrom){
    		 valid = false;
    		 $scope.errors.dueDateFrom = {
                 message : 'From date must be less than or equal to To date.'
             }
    	}

    	return valid;
    }
	function _prepareCriteria() {
		
		return vm.criteria;
	}

	vm.pagingController = PagingController.create('api/v1/documents', vm.criteria, 'GET');
	
	vm.searchDocument = function(pagingModel) {
		
		if(_validateForSearch()){
			var criteria = _prepareCriteria();
			var diferred = vm.pagingController.search(pagingModel);
			vm.showInfomation = true;
		}
	
	}

    vm.accountDropDown = [];
    function _loadAccount(ownerId){
        var deffered = CreatePaymentService.getAccounts(ownerId);
        deffered.promise.then(function(response) {
            var accounts = response.data;
            accounts.forEach(function(account) {
                vm.accountDropDown.push({
                    label : account.accountNo,
                    value : account.accountId
                })
            });
            vm.transactionModel.payerAccountId = accounts[0].accountId;
        }).catch(function(response) {
            log.error(response);
        });
    }

    function _calculateTransactionAmount(documentSelects, prepercentagDrawdown) {
        var sumAmount = 0;
        documentSelects.forEach(function(document) {
            sumAmount += document.outstandingAmount;
        });
        vm.totalDocumentAmount = sumAmount;
        // vm.submitTransactionAmount =
		// TransactionService.calculateTransactionAmount(sumAmount,
		// prepercentagDrawdown);
    }

    vm.checkAllDocument = function() {
        if (vm.checkAllModel) {
            vm.pagingController.tableRowCollection.forEach(function(document) {
                var foundDataSelect = (vm.documentSelects.indexOf(document) > -1);
                if (!foundDataSelect){
                    vm.documentSelects.push(document);
                    _calculateTransactionAmount(vm.documentSelects, null);
                    // calculateTransactionAmount(vm.documentSelects,
					// vm.tradingpartnerInfoModel.prePercentageDrawdown);
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
            _calculateTransactionAmount(vm.documentSelects, null);
            // calculateTransactionAmount(vm.documentSelects,
			// vm.tradingpartnerInfoModel.prePercentageDrawdown);
        }
    };

    vm.selectAllDocument = function() {
        var pageSize = vm.pagingController.splitePageTxt.split("of ");
        if(!vm.selectAllModel){
            vm.documentSelects = [];
            var searchDocumentCriteria = {
                accountingTransactionType: vm.criteria.accountingTransactionType,
                buyerCode: vm.criteria.buyerCode,
                limit: pageSize[1],
                offset: 0,
                sponsorId: ownerId,
                supplierId: vm.criteria.supplierId,
            }
            var diferredDocumentAll = CreatePaymentService.getDocument(searchDocumentCriteria);
            diferredDocumentAll.promise.then(function(response){
                vm.documentSelects = response.data;
                _calculateTransactionAmount(vm.documentSelects, null);
        // // calculateTransactionAmount(vm.documentSelects,
		// vm.tradingpartnerInfoModel.prePercentageDrawdown);
                vm.selectAllModel = true;
                vm.checkAllModel = true;
            }).catch(function(response){
                log.error('Select all document error')
            });       		
        }else{
            vm.documentSelects = [];
            vm.selectAllModel = false;
            vm.checkAllModel = false;
            _calculateTransactionAmount(vm.documentSelects, null);
            // calculateTransactionAmount(vm.documentSelects,
			// vm.tradingpartnerInfoModel.prePercentageDrawdown);
        }
    }
    // next to page verify and submit
    vm.nextStep = function() {
    	if (vm.documentSelects.length === 0) {
           // TODO: write validation when no select documents.
        } else {
                        
            vm.transactionModel.supplierId = vm.criteria.supplierId;
            vm.transactionModel.documents = vm.documentSelects;
            
            PageNavigation.nextStep('/create-transaction/validate-submit', {
                transactionModel: vm.transactionModel,
                tradingpartnerInfoModel: vm.tradingpartnerInfoModel
            },{
            	transactionModel: vm.transactionModel,
                criteria: vm.criteria,
                selectedDocuments: vm.documentSelects
            });
        }
    }
    
	var init = function(){
		_loadSuppliers();
        _loadAccount(ownerId);

	}
	
	init();
	
} ]);