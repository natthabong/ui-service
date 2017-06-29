var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'CreatePaymentService',
		'PagingController', 'PageNavigation', function($rootScope, $scope, $log, $stateParams, SCFCommonService, CreatePaymentService, PagingController, PageNavigation) {
	
	var vm = this;
	var log = $log;

	var ownerId = $rootScope.userInfo.organizeId;
	
	var enterPageByBackAction = $stateParams.backAction || false;
	vm.criteria = $stateParams.criteria || {
		accountingTransactionType: 'RECEIVABLE',
		sponsorId: ownerId
	}
	
	vm.transactionModel =  $stateParams.transactionModel || {
		sponsorId: ownerId,
		transactionAmount: 0.0,
        documents : [],
        transactionDate : null
	}
	
	vm.tradingpartnerInfoModel = {
		available : '0.00'		
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
            	vm.tradingpartnerInfoModel.supplierId = _suppliers[0].supplierId;
            	vm.tradingpartnerInfoModel.supplierName = _suppliers[0].supplierName;
            	if(angular.isDefined(vm.criteria.supplierId)){
            		_loadDocumentDisplayConfig(vm.criteria.supplierId, 'BFP');
            	}
             }
        }).catch(function(response) {
            log.error(response);
        });
        return deffered;
    };
    
    function _loadBuyerCodes(supplierId) {
        var deffered = CreatePaymentService.getBuyerCodes(supplierId);
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
            	vm.criteria.customerCode = _buyerCodes[0];
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
    	
    	var isDueDateFromAfterDueDateFrom = moment(vm.criteria.dueDateFrom).isAfter(vm.criteria.dueDateTo);
    	
    	if(isDueDateFromAfterDueDateFrom){
    		 valid = false;
    		 $scope.errors.dueDateToLessThanFrom = {
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
            diferred.promise.then(function(response) {
                vm.watchCheckAll();
                var pageSize = vm.pagingController.splitePageTxt.split("of ");
                if(vm.documentSelects.length == pageSize[1]){
                	vm.selectAllModel = true;
                }                
            }).catch(function(response) {
                log.error(response);
            });
			vm.showInfomation = true;
		}
	
	}
	
	vm.clearSelectDocument = function(){
		vm.paymentDropDown = [];
		vm.documentSelects = [];
		vm.transactionModel.transactionAmount = '0.00';
		vm.showErrorMsg = false;
        vm.selectAllModel = false;
        vm.checkAllModel = false;
        vm.display = true;
	}

    vm.accountDropDown = [];
    function _loadAccount(ownerId){
        var deffered = CreatePaymentService.getAccounts(ownerId);
        deffered.promise.then(function(response) {
            var accounts = response.data;
            accounts.forEach(function(account) {
                vm.accountDropDown.push({
                    label : account.accountNo,
                    value : account.accountId,
                    item : account
                })
            });
            vm.transactionModel.payerAccountId = accounts[0].accountId;
            vm.transactionModel.payerAccountNo = accounts[0].accountNo;
            vm.tradingpartnerInfoModel.available = accounts[0].remainingAmount - accounts[0].pendingAmount;
        }).catch(function(response) {
            log.error(response);
        });
    }

    vm.accountChange = function() {
    	var accountId = vm.transactionModel.payerAccountId;
    	vm.accountDropDown.forEach(function(account) {
    		if(accountId == account.item.accountId){
    			vm.tradingpartnerInfoModel.available = account.item.remainingAmount - account.item.pendingAmount;
    		}
        });    	
    }

    vm.paymentDropDown = [];

    function _loadPaymentDate() {
        vm.paymentDropDown = [];
        vm.transactionModel.documents = vm.documentSelects;
        vm.transactionModel.supplierId = vm.criteria.supplierId;
        if(vm.transactionModel.documents != [] && vm.transactionModel.documents.length != 0){
            var deffered = CreatePaymentService.getPaymentDate(vm.transactionModel);
            deffered.promise.then(function(response) {
                var paymentDates = response.data;

                paymentDates.forEach(function(data) {
                    vm.paymentDropDown.push({
                        label: data,
                        value: data
                    })
                });
                vm.paymentModel = vm.paymentDropDown[0].value;
                if(vm.transactionModel.transactionDate != null){
                	vm.paymentModel = vm.transactionModel.transactionDate;
                }
            })
            .catch(function(response) {
                log.error(response);
            });
        }
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
        _calculateTransactionAmount(vm.documentSelects);
        _loadPaymentDate();
    }

    vm.checkAllDocument = function() {
    	vm.transactionModel.transactionDate = null;
        if (vm.checkAllModel) {
            vm.pagingController.tableRowCollection.forEach(function(document) {
                var foundDataSelect = (vm.documentSelects.indexOf(document) > -1);
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
            _loadPaymentDate();
        }
    };

    vm.selectAllDocument = function() {
    	vm.transactionModel.transactionDate = null;
        var pageSize = vm.pagingController.splitePageTxt.split("of ");
        if(!vm.selectAllModel){
            vm.documentSelects = [];
            var searchDocumentCriteria = {
                accountingTransactionType: vm.criteria.accountingTransactionType,
                customerCode: vm.criteria.customerCode,
                limit: pageSize[1],
                offset: 0,
                sponsorId: ownerId,
                supplierId: vm.criteria.supplierId,
            }
            var diferredDocumentAll = CreatePaymentService.getDocument(searchDocumentCriteria);
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
    }

    // next to page verify and submit
    vm.nextStep = function() {
    	if (vm.documentSelects.length === 0) {
            vm.errorMsgGroups = 'Please select document.';
            vm.showErrorMsg = true;
        } else {                
            vm.transactionModel.supplierId = vm.criteria.supplierId;
            vm.transactionModel.documents = vm.documentSelects;
            vm.transactionModel.transactionDate = vm.paymentModel;
            var objectToSend = {
                transactionModel: vm.transactionModel,
                tradingpartnerInfoModel: vm.tradingpartnerInfoModel
            };
            PageNavigation.nextStep('/create-payment/validate-submit', objectToSend,{
            	transactionModel: vm.transactionModel,
                criteria: vm.criteria,
                documentSelects: vm.documentSelects
            });
        }
    }
    
	var init = function(){
		var deffered = _loadSuppliers();		
		deffered.promise.then(function(response){
			if(vm.pagingController.tableRowCollection.size == undefined){	
				vm.searchDocument();
				vm.display = true;
			}
		});			
        _loadAccount(ownerId);
        if(vm.documentSelects.length > 0){
        	_loadPaymentDate();
        }
	}();

    vm.supplierChange = function() {
    	vm.showErrorMsg = false;
    	vm.display = false;
        _loadDocumentDisplayConfig(vm.criteria.supplierId, 'BFP');      
    }
	
    vm.customerCodeChange = function() {
		vm.showErrorMsg = false;
		vm.display = false;
    }
} ]);