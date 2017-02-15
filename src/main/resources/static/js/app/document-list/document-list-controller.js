angular.module('scfApp').controller('DocumentListController', [ '$scope', 'Service', '$stateParams', '$log', 'SCFCommonService', 'PagingController', function($scope, Service, $stateParams, $log, SCFCommonService, PagingController) {
	var vm = this;
	var log = $log;

	vm.sponsorTxtDisable = false;
	vm.supplierTxtDisable = false;
	vm.searchBtnDisable = true;
	vm.showInfomation = false;
	vm.documentNewStatus = "NEW";
	vm.splitePageTxt = '';

	vm.dateFormat = "dd/MM/yyyy";
	vm.openDateFrom = false;
	vm.openDateTo = false;
	vm.defaultPageSize = '20';
	vm.defaultPage = 0;

	var currentParty = '';
	var partyRole = {
		sponsor : 'sponsor',
		supplier : 'supplier',
		bank : 'bank'
	}

	vm.documentStatusDrpodowns = [ {
		'label' : 'All',
		'value' : ''
	} ];

	vm.documentSummaryDisplay = {
		totalDocumentAmount : 0,
		documents : [ {
			'status' : 'BOOKED',
			'totalOutstandingAmount' : 0
		}, {
			'status' : 'UNBOOK',
			'totalOutstandingAmount' : 0
		} ]
	};

	vm.pageModel = {
		pageSizeSelectModel : vm.defaultPageSize,
		totalRecord : 0,
		totalPage : 0,
		currentPage : vm.defaultPage,
		clearSortOrder : false
	};

	vm.documentListModel = {
		sponsorIdName : '',
		sponsorId : '',
		supplierIdName : '',
		supplierId : '',
		supplierCode : '',
		uploadDateFrom : '',
		uploadDateTo : '',
		documentNo : '',
		documentStatus : vm.documentStatusDrpodowns[0].value
	}

	vm.pageSizeList = [ {
		label : '10',
		value : '10'
	}, {
		label : '20',
		value : '20'
	}, {
		label : '50',
		value : '50'
	} ];

	vm.dataTable = {
//		options : {
//			displaySelect : {
//				label : '<input type="checkbox" ng-show="false" id="select-all-checkbox" ng-model="ctrl.checkAllModel" ng-click="ctrl.checkAllDocument()"/>',
//				cssTemplate : 'text-center',
//				cellTemplate : '<input type="checkbox" ng-show="false" checklist-model="ctrl.documentSelects" checklist-value="data" ng-click="ctrl.selectDocument()"/>',
//				displayPosition : 'first',
//				idValueField : 'template',
//				id : 'document-{value}-checkbox'
//			}
//		},
		columns : []
	};

	var columnStatus = {
		fieldName : 'statusMessageKey',
		labelEN : 'Status',
		labelTH : 'สถานะ',
		sortable : true,
		idValueField : 'transactionNo',
		id : 'status-{value}',
		filterType : 'translate',
		cssTemplate : 'text-center'
	};

	vm.loadDocumentDisplayConfig = function(sponsorId) {
		var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId);
		displayConfig.promise.then(function(response) {
			vm.dataTable.columns = response.items;
			vm.dataTable.columns.push(columnStatus);
		});
	}

	vm.loadSponsorDisplayName = function() {
		var organizeDisplayName = '';
		var sponsorCodesDeffered = Service.requestURL('/api/me', null, 'GET');
		sponsorCodesDeffered.promise.then(function(response) {
			var organizeName = response.organizeName;
			var organizeId = response.organizeId;
			vm.documentListModel.sponsorIdName = organizeId + ":" + organizeName;
			vm.documentListModel.sponsorId = organizeId;

			vm.loadDocumentDisplayConfig(organizeId);
			vm.searchBtnDisable = false;
		}).catch(function(response) {
			log.error('Sponsor error');
		});
	}

	vm.loadSupplierDisplayName = function() {
		var organizeDisplayName = '';
		var sponsorCodesDeffered = Service.requestURL('/api/me', null, 'GET');
		sponsorCodesDeffered.promise.then(function(response) {
			var organizeName = response.organizeName;
			var organizeId = response.organizeId;
			vm.documentListModel.supplierIdName = organizeId + ":" + organizeName;
			vm.documentListModel.supplierId = organizeId;
		}).catch(function(response) {
			log.error('Supplier error');
		});
	}

	vm.initLoad = function() {
		currentParty = $stateParams.party;

		if (currentParty == partyRole.sponsor) {
			vm.sponsorTxtDisable = true;
			vm.loadSponsorDisplayName();
		} else if (currentParty == partyRole.supplier) {
			vm.supplierTxtDisable = true;
			vm.loadSupplierDisplayName();
		}
	}

	vm.initLoad();

	vm.documentListCriterial = {
		sponsorId : '',
		supplierId : '',
		supplierCode : '',
		uploadDateFrom : '',
		uploadDateTo : '',
		documentNo : '',
		documentStatus : ''
	}

	function prepareCriteria() {
		var sponsorIdCri = vm.documentListModel.sponsorId || vm.documentListModel.sponsorIdName;
		var supplierIdCri = vm.documentListModel.supplierId || vm.documentListModel.supplierIdName;

		vm.documentListCriterial.sponsorId = sponsorIdCri;
		vm.documentListCriterial.supplierId = supplierIdCri;
		vm.documentListCriterial.supplierCode = vm.documentListModel.supplierCode;
		vm.documentListCriterial.uploadDateFrom = SCFCommonService.convertDate(vm.documentListModel.uploadDateFrom);
		vm.documentListCriterial.uploadDateTo = SCFCommonService.convertDate(vm.documentListModel.uploadDateTo);
		vm.documentListCriterial.documentNo = vm.documentListModel.documentNo;
		vm.documentListCriterial.documentStatus = vm.documentListModel.documentStatus || null;
	}

	vm.pagingCongroller = PagingController.create('api/documents/get', vm.documentListCriterial);

	vm.searchDocument = function(pagingModel) {
		prepareCriteria();
		var documentListDiferred = vm.pagingCongroller.search(pagingModel);
		documentListDiferred.promise.then(function(response) {
			vm.getDocumentSummary();
		}).catch(function(response) {
			log.error("Search error");
		});
		vm.showInfomation = true;
	}

	vm.getDocumentSummary = function() {
		var documentSummaryDiffered = Service.requestURL('/api/documents/status-summary/get', vm.documentListCriterial, 'POST');
		documentSummaryDiffered.promise.then(function(response) {
			if (response.length == 0) {
				vm.documentSummaryDisplay.documents[0].totalOutstandingAmount = 0;
				vm.documentSummaryDisplay.documents[1].totalOutstandingAmount = 0;
			}
			response.forEach(function(data) {
				if (data.status == 'BOOKED') {
					vm.documentSummaryDisplay.documents[0].totalOutstandingAmount = data.totalOutstandingAmount;
				} else if (data.status == 'UNBOOK') {
					vm.documentSummaryDisplay.documents[1].totalOutstandingAmount = data.totalOutstandingAmount;
				}
			});
			vm.documentSummaryDisplay.totalDocumentAmount = summaryTotalDocumentAmount(vm.documentSummaryDisplay.documents);
		//			if(response.length > 0){
		//				vm.documentSummaryDisplay.documents = response;
		//				vm.documentSummaryDisplay.totalDocumentAmount = summaryTotalDocumentAmount(vm.documentSummaryDisplay.documents);
		//			}			
		}).catch(function(response) {
			log.error("Document summary error");
		});
	}

	vm.openCalendarDateFrom = function() {
		vm.openDateFrom = true;
	}

	vm.openCalendarDateTo = function() {
		vm.openDateTo = true;
	}



	function summaryTotalDocumentAmount(documents) {
		var summaryAmount = 0;
		documents.forEach(function(document) {
			summaryAmount += document.totalOutstandingAmount;
		});

		return summaryAmount;
	}

} ]);