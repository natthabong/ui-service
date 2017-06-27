var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentController', ['$rootScope', '$scope', 'SCFCommonService', 'CreatePaymentService',
		'PagingController','$log', function($rootScope, $scope, SCFCommonService, CreatePaymentService, PagingController,$log) {
	
	var vm = this;
	var log = $log;

	var ownerId = $rootScope.userInfo.organizeId;
	
	vm.criteria = {

	}

	var pageOptions = {
			
	}
	
	vm.documentSelects = []
	
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
        var deffered = CreatePaymentService.getSuppliers('PAYABLE');
        deffered.promise.then(function(response) {
        	 vm.suppliers = [];
             var _suppliers = response.data;
             if (_suppliers !== undefined) {
            	 _suppliers.forEach(function(supplier) {
                     var selectObj = {
                         label: supplier.sponsorName,
                         value: supplier.sponsorId
                     }
                     vm.suppliers.push(selectObj);
                 });
            	vm.criteria.supplierId = vm.suppliers[0];
            	if(angular.isDefined(vm.criteria.supplierId)){
            		_loadDocumentDisplayConfig(vm.criteria.supplierId);
            	}
             }
        }).catch(function(response) {
            log.error(response);
            _loadDocumentDisplayConfig('DEMO_SUPPLIER1', 'BFP');
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
                		 label: obj,
                         value: obj
                     }
                     vm.buyerCodes.push(selectObj);
                 });
            	vm.criteria.buyerCode = vm.buyerCodes[0];
            	vm.searchDocument();
             }
        }).catch(function(response) {
            log.error(response);
        });
    };

	function _prepareCriteria() {
		
		return vm.criteria;
	}

	vm.pagingController = PagingController.create('api/v1/documents', vm.criteria, 'GET');
	
	vm.searchDocument = function(pagingModel) {

		var criteria = prepareCriteria();
		var diferred = vm.pagingController.search(pagingModel);
		vm.showInfomation = true;
	
	}
	
	var init = function(){
		_loadSuppliers();

	}
	
	init();
	
} ]);