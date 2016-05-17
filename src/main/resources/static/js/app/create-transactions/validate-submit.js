var validateandsubmit = angular.module('gecscfApp', [ 'scf-component',
		'ui.bootstrap' ]);
validateandsubmit.controller('ValidateAndSubmitController', [ function() {
	var vm = this;
	vm.pagingList = [ {
		label : '10',
		value : 10
	}, {
		label : '20',
		value : 20
	}, {
		label : '50',
		value : 50
	} ];
	vm.pagingDropDown = '10';
	vm.currentPage = 0;
	vm.searchPage = function(pageModel) {
		vm.currentPage = pageModel.page;
		console.log(pageModel);
	};

	vm.tradingPatnerData = {
		sponsorName : 'TESCO CO,LTD.',
		financingDocuments : '0',
		valueAndDocument : '0',
		sponsorPaymentDate : '-',
		prePercentage : '80.00%',
		transactionDate : '-',
		transactionAmount : '0.00',
		loanMaturityDate : '-',
		selected : '0',
	};

	vm.submitTransaction = function() {
		console.log($state);
	};
} ]);