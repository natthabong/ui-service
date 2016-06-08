angular.module('scfApp').controller('ListTransactionController', ['ListTransactionService', function(ListTransactionService) {
    var vm = this;
    vm.showInfomation = true;
    
    vm.transactionType = {
            transactionDate: 'transactionDate',
            maturityDate: 'maturityDate'
        }
        // Data Sponsor for select box

    vm.transactionStatusGroupDropdown = [];

    vm.sponsorCodeDropdown = [{
		label: 'All',
		value: ''
	}];

    vm.tableRowCollection = [];

	
	// Datepicker
	vm.openDateFrom = false;
	vm.dateFormat = 'dd/MM/yyyy';
	vm.openDateTo = false;
	
	// Model mapping whith page list
   vm.listTransactionModel = {
            dateType: vm.transactionType.transactionDate,
            dateFrom: '',
            dateTo: '',
            sponsorId: '',
            supplierId: '',
            groupStatus: '',
            order: '',
            orderBy:''
        }
        // Init data paging
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
        currentPage: 0
    };

    // Load sponsor Code
    vm.loadSponsorCode = function() {
        var sponsorCodesDefered = ListTransactionService.getSponsors();
        sponsorCodesDefered.promise.then(function(response) {
            var sponsorCodeList = response.data;
            if (sponsorCodeList !== undefined) {
                sponsorCodeList.forEach(function(obj) {
                    var selectObj = {
                        label: obj.sponsorName,
                        value: obj.sponsorId
                    }
                    vm.sponsorCodeDropdown.push(selectObj);
                });
                vm.listTransactionModel.sponsorCode = vm.sponsorCodeDropdown[0].value;
            }
        }).catch(function(response) {
			console.log('Load Sponsor Fail');
        });
    };
    
    vm.loadTransactionGroup = function(){
        var transactionStatusGroupDefered = ListTransactionService.getTransactionStatusGroups();
        transactionStatusGroupDefered.promise.then(function(response) {
            var transactionStatusGroupList = response.data;
            if (transactionStatusGroupList !== undefined) {
                transactionStatusGroupList.forEach(function(obj) {
                    var selectObj = {
                        label: obj.statusMessageKey,
                        value: obj.statusGroup
                    }
                    vm.transactionStatusGroupDropdown.push(selectObj);
                });
                vm.listTransactionModel.groupStatus = vm.transactionStatusGroupDropdown[0].value;
            }
        }).catch(function(response) {
			console.log('Load TransactionStatusGroup Fail');
        });    	
    }

    vm.initLoad = function() {
        vm.loadSponsorCode();
        vm.loadTransactionGroup();
    };

    vm.initLoad();

    vm.dataTable = {
        options: {
            displayRowNo: {}
        },
        columns: [{
            field: 'sponsor',
            label: 'Sponsor',
            sortData: true,
            cssTemplate: 'text-center'
        }, {
            field: 'transactionDate',
            label: 'Transaction Date',
            sortData: true,
            cssTemplate: 'text-center',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy'
        }, {
            field: 'transactionNo',
            label: 'Transaction No',
            sortData: true,
            cssTemplate: 'text-center',
        }, {
            field: 'dradownAmount',
            label: 'Dradown Amount',
            sortData: true,
            cssTemplate: 'text-center',
        }, {
            field: 'interest',
            label: 'interest',
            sortData: false,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        }, {
            field: 'fee',
            label: 'Fee',
            sortData: false,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        }, {
            field: 'bankTransactionNo',
            label: 'Bank Transaction No',
            sortData: true,
            cssTemplate: 'text-center'
        }, {
            field: 'repaymentAmount',
            label: 'Repayment Amount',
            sortData: true,
            cssTemplate: 'text-right',
            filterType: 'number',
            filterFormat: '2'
        }, {
            field: 'maturityDate',
            label: 'Maturity Date',
            sortData: true,
            cssTemplate: 'text-center',
            filterType: 'date',
            filterFormat: 'dd/MM/yyyy'
        }, {
            field: 'statusMessageKey',
            label: 'Status',
            sortData: true,
            cssTemplate: 'text-center',
        }]
    };

	vm.openCalendarDateFrom = function(){
		vm.openDateFrom = true;
	};
	
	vm.openCalendarDateTo = function(){
		vm.openDateTo = true;
	};
	
	vm.searchTransaction = function(){
		var transactionModel = angular.extend(vm.listTransactionModel,{
			page: vm.pageModel.currentPage,
			pageSize: vm.pageModel.pageSizeSelectModel
		});
		var transactionDifferd = ListTransactionService.getTransactionDocument(transactionModel);
		transactionDifferd.promise.then(function(response){
			var transactionDocs = response.data;
			vm.tableRowCollection = transactionDocs.content;
			console.log(response);
		}).catch(function(response){
			console.log('Cannot search document');
		});
	};


}]);