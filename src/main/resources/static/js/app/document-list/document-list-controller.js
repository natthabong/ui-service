angular.module('scfApp').controller('DocumentListController',['Service', '$stateParams', '$log', 'SCFCommonService', function(Service, $stateParams, $log, SCFCommonService ){
	var vm = this;
	var log = $log;
	
	vm.sponsorTxtDisable = false;
	vm.supplierTxtDisable = false;	
	vm.showInfomation = false;
	vm.documentNewStatus = "NEW";
	vm.splitePageTxt = '';
	
	vm.dateFormat = "dd/MM/yyyy";
	vm.openDateFrom = false;
	vm.openDateTo = false;
	vm.defaultPageSize = '20';
	vm.defaultPage = 0;
	
	vm.documentStatusDrpodowns = [{'label':'All', 'value': ''}];
	vm.documentSummaryDisplay = {
		totalAmount: 0,
		documentBook: 0,
		documentUnbook: 0
	};
	
	vm.pageModel = {
    	pageSizeSelectModel: vm.defaultPageSize,
        totalRecord: 0,
		totalPage: 0,
        currentPage: vm.defaultPage,
        clearSortOrder: false
	};
	
	vm.documentListModel = {
		sponsorIdName: '',
		sponsorId: '',
		supplierIdName: '',
		supplierId: '',
		supplierCode: '',
		uploadDateFrom: '',
		uploadDateTo: '',		
		documentNo: '',
		documentStatus: vm.documentStatusDrpodowns[0].value,
		page: vm.defaultPage,
		pageSize: vm.pageModel.pageSizeSelectModel
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
	
	
	
	var loadSponsorURL = '';
	
	vm.dataTable = {
		options: {
        	displayRowNo: {
            	idValueField: 'template',
                id: 'no-{value}-label'
			},
            displaySelect: {
            	label: '<input type="checkbox" ng-disabled="true" id="select-all-checkbox" ng-model="ctrl.checkAllModel" ng-click="ctrl.checkAllDocument()"/>',
				cssTemplate: 'text-center',
                cellTemplate: '<input type="checkbox" ng-show="data.documentStatus==ctrl.documentNewStatus" checklist-model="ctrl.documentSelects" checklist-value="data" ng-click="ctrl.selectDocument()"/>',
                displayPosition: 'first',
				idValueField: 'template',
				id: 'document-{value}-checkbox'
			}
		},
        columns: []
	};
	
	var columnStatus = {		
            field: 'statusMessageKey',
            label: 'Status',
            sortData: true,
            idValueField: 'transactionNo',
            id: 'status-{value}',
			filterType: 'translate',
            cssTemplate: 'text-center'        
	};
	
	vm.loadDocumentDisplayConfig = function(sponsorId) {
		var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId);
        displayConfig.promise.then(function(response) {
        	vm.dataTable.columns = response;
			
			vm.dataTable.columns.push(columnStatus);
		});
	}
	
	vm.loadSponsorDisplayName = function(){
		var organizeDisplayName = '';
		var sponsorCodesDeffered = Service.requestURL('/api/me',null, 'GET');
		sponsorCodesDeffered.promise.then(function(response){
			var organizeName = response.organizeName;
			var organizeId = response.organizeId;
			vm.documentListModel.sponsorIdName = organizeId + " : " + organizeName;
			vm.documentListModel.sponsorId = organizeId;
			vm.loadDocumentDisplayConfig(organizeId);
		}).catch(function(response){
			log.error('Sponsor error');
		});
	}
	
	vm.loadSupplierDisplayName = function(){
		var organizeDisplayName = '';
		var sponsorCodesDeffered = Service.requestURL('/api/me',null, 'GET');
		sponsorCodesDeffered.promise.then(function(response){
			var organizeName = response.organizeName;
			var organizeId = response.organizeId;
								
			vm.documentListModel.supplierIdName = organizeId + " : " + organizeName;
			vm.documentListModel.supplierId = organizeId;
			
		}).catch(function(response){
			log.error('Supplier error');
		});
	}
	
	vm.initLoad = function(){
		var party = $stateParams.party;

		if(party == 'sponsor'){
			vm.sponsorTxtDisable = true;
			vm.loadSponsorDisplayName();			
		}else if(party == 'supplier'){			
			vm.supplierTxtDisable = true;
			vm.loadSupplierDisplayName();			
		}		
	}
	
	vm.initLoad();
	
	vm.searchDocument = function(pagingModel){

		if (pagingModel === undefined) {
			vm.pageModel.pageSizeSelectModel = vm.defaultPageSize;
			vm.pageModel.currentPage = vm.defaultPage;
		}else{
			vm.pageModel.pageSizeSelectModel = pagingModel.pageSize;
			vm.pageModel.currentPage = pagingModel.page;
		}
		var dataParams = getDataCriteria();
		
		var documentDiffered = Service.requestURL('api/documents/get', dataParams, 'POST');
		
		documentDiffered.promise.then(function(response){
			vm.showInfomation = true;
			
			 // response success
			vm.pageModel.totalRecord = response.totalElements;
            vm.pageModel.currentPage = response.number;
            vm.pageModel.totalPage = response.totalPages;
			
			vm.tableRowCollection = response.content;
			vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
			vm.getDocumentSummary();
		}).catch(function(response){
			log.error('Search document error');
		});
		
	}
	
	vm.getDocumentSummary = function(){
		var dataParams = getDataCriteria();
		var documentSummaryDiffered = Service.requestURL('/api/summary-document-status/get', dataParams, 'POST');
		documentSummaryDiffered.promise.then(function(response){
			
		}).catch(function(response){
			log.error("Document summary error");
		});
		vm.documentSummaryDisplay.totalAmount = 100000000;
		vm.documentSummaryDisplay.documentBook = 10000000;
		vm.documentSummaryDisplay.documentUnbook = 100000000;

	}
	
	vm.openCalendarDateFrom = function(){
		vm.openDateFrom = true;
	}
	
	vm.openCalendarDateTo = function(){
		vm.openDateTo = true;
	}
	
	function getDataCriteria (){
		var supplierCri = vm.documentListModel.supplierId || vm.documentListModel.supplierIdName;
		var sponsorCri = vm.documentListModel.sponsorId || vm.documentListModel.sponsorIdName;
		
		var dataParams = {
			sponsorId: sponsorCri,
			supllierId: supplierCri,
			supplierCode: vm.documentListModel.supplierCode,
			uploadDateFrom: SCFCommonService.convertDate(vm.documentListModel.uploadDateFrom),
			uploadDateTo: SCFCommonService.convertDate(vm.documentListModel.uploadDateTo),
			documentNo: vm.documentListModel.documentNo,
			page: vm.pageModel.currentPage,
			pageSize: vm.pageModel.pageSizeSelectModel,
			documentStatus: vm.documentListModel.documentStatus || null
		};
		
		return dataParams;
	}
	
}]);