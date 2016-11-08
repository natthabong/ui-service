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
	
	
	vm.sponsorModel = {
		sponsorName: '',
		supplierName: '',
		supplierCode: '',
		dateTo: '',
		dateFrom: '',
		documentNo: ''
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
		totalPage: 0,
        currentPage: 0,
        clearSortOrder: false
	};
	
	var loadSponsorURL = '';
	
	vm.dataTable = {
		options: {
        	displayRowNo: {
            	idValueField: 'template',
                id: 'no-{value}-label'
			},
            displaySelect: {
            	label: '<input type="checkbox" id="select-all-checkbox" ng-model="ctrl.checkAllModel" ng-click="ctrl.checkAllDocument()"/>',
				cssTemplate: 'text-center',
                cellTemplate: '<input type="checkbox" ng-show="data.documentStatus==ctrl.documentNewStatus" checklist-model="ctrl.documentSelects" checklist-value="data" ng-click="ctrl.selectDocument()"/>',
                displayPosition: 'first',
				idValueField: 'template',
				id: 'document-{value}-checkbox'
			}
		},
        columns: []
	};
	
	vm.loadDocumentDisplayConfig = function(sponsorId) {
		var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId);
        displayConfig.promise.then(function(response) {
        	vm.dataTable.columns = response;
		});
	}
	
	vm.loadSponsorDisplayName = function(){
		var organizeDisplayName = '';
		var sponsorCodesDeffered = Service.requestURL('/api/me',null, 'GET');
		sponsorCodesDeffered.promise.then(function(response){
			vm.sponsorModel.sponsorName = response.organizeName;
		}).catch(function(response){
			log.error('Sponsor error');
		});
	}
	
	vm.loadSupplierDisplayName = function(){
		var organizeDisplayName = '';
		var sponsorCodesDeffered = Service.requestURL('/api/me',null, 'GET');
		sponsorCodesDeffered.promise.then(function(response){
			vm.sponsorModel.supplierName = response.organizeName;
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
	
	vm.searchDocument = function(){
		var dataParams = {};
		
		var documentDiffered = Service.requestURL('api/create-transaction/documents/get', dataParams, 'POST');
		
		vm.showInfomation = true;
		vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
		vm.loadDocumentDisplayConfig(0123);
	}
	
	vm.openCalendarDateFrom = function(){
		vm.openDateFrom = true;
	}
	
	vm.openCalendarDateTo = function(){
		vm.openDateTo = true;
	}
	
}]);