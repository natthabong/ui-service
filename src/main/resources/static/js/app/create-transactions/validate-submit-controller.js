<<<<<<< .minevar gecscf = angular.module('gecscfApp', ['scf-component', 'ui.bootstrap']);
gecscf.controller('PagingController', [function(){
    var vm = this;
    vm.pagingList = [{label: '10', value: 10}, {label: '20', value: 20}, {label: '50', value: 50}];
    vm.pagingDropDown = '10';
    vm.currentPage = 0;
    vm.searchPage = function(pageModel){
        vm.currentPage = pageModel.page;
        console.log( pageModel);
    };
}]);=======var validateandsubmit = angular.module('gecscfApp', [ 'scf-component',
		'ui.bootstrap' ]);
validateandsubmit.controller('ValidateAndSubmitController', [ function() {
	var vm = this;
	
    vm.pageSizeList = [{
        label: '10',
        value: '10'
    }];
    vm.pageSizeSelectModel = '10';
    vm.pageModel = {
        pageSizeSelectModel: '10',
        totalRecord: '10',
        currentPage: 0
    };

	vm.tradingPatnerData = {
		sponsorName : 'TESCO CO,LTD.',
		financingDocuments : '3',
		valueOfDocument : '58069.44',
		sponsorPaymentDate : '25/05/2016',
		prePercentage : '80.00%',
		transactionDate : '23/05/2016',
		transactionAmount : '46455.55',
		loanMaturityDate : '25/05/2016',
		selected : '3',
	};

	vm.document = {
		no : '',
		paymentDate : '',
		documentDate : '',
		documentNo : '',
		documentType : '',
		supplierCode : '',
		documentAmount : '',
	};

	vm.selectedDocuments = [ {
		no : '1',
		paymentDate : '30/06/2016',
		documentDate : '10/05/2016',
		documentNo : '463868',
		documentType : 'RV',
		supplierCode : '30001',
		documentAmount : '19356.48'
	}, {
		no : '2',
		paymentDate : '30/06/2016',
		documentDate : '10/05/2016',
		documentNo : '463867',
		documentType : 'RV',
		supplierCode : '30001',
		documentAmount : '19356.48'
	}, {
		no : '3',
		paymentDate : '30/06/2016',
		documentDate : '10/05/2016',
		documentNo : '463866',
		documentType : 'RV',
		supplierCode : '30001',
		documentAmount : '19356.48'
	} ];

	vm.submitTransaction = function() {
		console.log($state);
	};
} ]);>>>>>>> .theirs