var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentController', ['$rootScope', '$scope', 'SCFCommonService', 'CreatePaymentService',
		'PagingController', function($rootScope, $scope, SCFCommonService, CreatePaymentService, PagingController) {
	
	var vm = this;

	var sponsorId = $rootScope.userInfo.organizeId;
	console.log(sponsorId)
	
	var pageOptions = {
			
	}

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

	var _loadDocument = function() {
		var loadDocumentDiferred = $q.defer();
		var deffered = CreatePaymentService.getDocument(criteria);
		deffered.promise
			.then(function(response) {
				// response success
				vm.pageModel.totalRecord = response.headers('X-Total-Count');
				vm.pageModel.totalPage = response.headers('X-Total-Page');
				// Generate Document for display
				vm.tableRowCollection = response.data;
				
				// Calculate Display page
				vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
				loadDocumentDiferred.resolve('Success');
			})
			.catch(function(response) {
				log.error(response);
				loadDocumentDiferred.reject('Fail');
			});
		return loadDocumentDiferred;
	}

	vm.searchDocument = function(pagingModel) {
		var searchDocumentDeferred = $q.defer();

		if (pagingModel === undefined) {
			vm.pageModel.clearSortOrder = !vm.pageModel.clearSortOrder;
			vm.createTransactionModel.order = '';
			vm.createTransactionModel.orderBy = '';
			vm.pageModel.pageSizeSelectModel = '20';
			vm.pageModel.currentPage = 0;
			_loadDocument();
		} else {
			vm.pageModel.pageSizeSelectModel = pagingModel.pageSize;
			vm.pageModel.currentPage = pagingModel.page;
			_loadDocument();
		}
		return searchDocumentDeferred;
	};


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
	

	vm.criteria = {
			
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

	var _loadDocumentDisplayConfig = function(ownerId) {
        var deffered = SCFCommonService.getDocumentDisplayConfig(ownerId);
        deffered.promise.then(function(response) {
            vm.dataTable.columns = response.items;
            pageOptions.loanRequestMode = response.loanRequestMode;
            pageOptions.documentSelection = response.documentSelection;
            pageOptions.buyerCodeSelectionMode = response.buyerCodeSelectionMode;
            _loadBuyerCodes(vm.criteria.supplierId);
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
            		_loadDocumentDisplayConfig('00025408');
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
                		 label: obj,
                         value: obj
                     }
                     vm.buyerCodes.push(selectObj);
                 });
            	vm.criteria.buyerCode = vm.buyerCodes[0];
             }
        }).catch(function(response) {
            log.error(response);
        });
    };
	function _prepareCriteria() {
		
		return {
			
		};
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