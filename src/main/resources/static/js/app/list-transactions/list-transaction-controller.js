angular.module('scfApp').controller('ListTransactionController', ['ListTransactionService', '$state', function(ListTransactionService, $state) {
    var vm = this;
    vm.showInfomation = false;
    
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
	
	vm.dateModel = {
		dateFrom: '',
		dateTo: ''
	}
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
            cssTemplate: 'text-center'
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
            cssTemplate: 'text-center'
        }, {
            field: 'statusMessageKey',
            label: 'Status',
            sortData: true,
            cssTemplate: 'text-center',
        },{
			field: 'action',
			label: 'Action',
			cssTemplate: 'text-center',
			sortData: false,
			cellTemplate: '<scf-button class="btn-default gec-btn-action" ng-click="listTransactionController.verify(data)"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span></scf-button>'+
			'<scf-button id="search-button" class="btn-default gec-btn-action" ng-click="listTransactionController.searchTransaction()"><span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span></scf-button>'+
			'<scf-button id="view-button" class="btn-default gec-btn-action" ng-click="listTransactionController.searchTransaction()"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></scf-button>'+
			'<scf-button id="search-button" class="btn-default gec-btn-action" ng-click="listTransactionController.searchTransaction()"><span class="glyphicon glyphicon-print" aria-hidden="true"></scf-button>'+
			'<scf-button id="view-button" class="btn-default gec-btn-action" ng-click="listTransactionController.searchTransaction()"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></scf-button>'
		}]
    };

	vm.openCalendarDateFrom = function(){
		vm.openDateFrom = true;
	};
	
	vm.openCalendarDateTo = function(){
		vm.openDateTo = true;
	};
	
	vm.searchTransaction = function(){
		var dateFrom = vm.dateModel.dateFrom;
		var dateTo = vm.dateModel.dateTo;
		
		vm.listTransactionModel.dateFrom = convertDate(dateFrom);
		vm.listTransactionModel.dateTo = convertDate(dateTo);
		
		var transactionModel = angular.extend(vm.listTransactionModel,{
			page: vm.pageModel.currentPage,
			pageSize: vm.pageModel.pageSizeSelectModel
		});
		
		var transactionDifferd = ListTransactionService.getTransactionDocument(transactionModel);
		transactionDifferd.promise.then(function(response){
			vm.showInfomation = true;
			var transactionDocs = response.data;
			vm.tableRowCollection = transactionDocs.content;
			console.log(response);
		}).catch(function(response){
			console.log('Cannot search document');
		});
	};
	
	vm.verify = function(data){
		$state.go('/verify-transaction', {
            transactionModel: data
        });
	}

}]);

function convertDate(dateTime){
	var result = '';
	if(dateTime != undefined && dateTime != ''){
		var date = dateTime.getDate();		
		var month = (dateTime.getMonth() + 1);
		var year = dateTime.getFullYear();
		result =  date +'/' + month + '/' + year;
	}
	return result;
}