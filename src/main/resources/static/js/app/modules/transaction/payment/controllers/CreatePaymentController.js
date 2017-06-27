var txnMod = angular.module('gecscf.transaction');
txnMod.controller('CreatePaymentController', [ 'CreatePaymentService',
		'$scope','$rootScope','SCFCommonService', function(CreatePaymentService, $scope,$rootScope,SCFCommonService) {
	
	var vm = this;

	var sponsorId = $rootScope.userInfo.organizeId;
	console.log(sponsorId)
	
	var criteria = {
			
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

	vm.loadDocument = function() {
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
			vm.loadDocument();
		} else {
			vm.pageModel.pageSizeSelectModel = pagingModel.pageSize;
			vm.pageModel.currentPage = pagingModel.page;
			vm.loadDocument();
		}
		return searchDocumentDeferred;
	};


	var loadDocumentDisplayConfig = function(sponsorId) {
		var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId);
		displayConfig.promise.then(function(response) {
			vm.dataTable.columns = response.items;
			vm.searchDocument();
		});
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
	
	var init = function(){
		loadDocumentDisplayConfig();
	}
	
	init();
	
} ]);