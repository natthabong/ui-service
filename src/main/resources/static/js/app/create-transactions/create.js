var createapp = angular.module('scfApp');
createapp.controller('CreateTransactionController', ['CreateTransactionService', '$state', function(CreateTransactionService, $state) {
    var vm = this;
    vm.sponsorCodes = [{
        label: 'TESCO CO,LTD.',
        value: '0017551'
    }];
    vm.supplierCodes = [{
        label: 'JINTANA INTERTRADE CO,LTD.',
        value: '0017551'
    }];
    vm.sponsorPaymentDates = [{
        label: 'Please Select',
        value: 'Please Select'
    }];

    vm.createTransactionModel = {
        sponsorCode: vm.sponsorCodes[0].value,
        supplierCode: vm.supplierCodes[0].value,
        sponsorPaymentDate: vm.sponsorPaymentDates[0].value
    };

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

	//Search Document
    vm.searchDocument = function(pagingModel) {
		console.log(pagingModel);
    };

    vm.loadSupplierDate = function() {
        var sponsorCode = vm.createTransactionModel.sponsorCode;
        var supplierCode = vm.createTransactionModel.supplierCode;

        var deffered = CreateTransactionService.getSponsorPaymentDate(sponsorCode, supplierCode);
        deffered.promise.then(function(response) {
                console.log(response);
            })
            .catch(function(response) {
                console.log(response);
            });
    }
    vm.loadSupplierDate();
	
	vm.nextStep = function(){
		console.log($state);
		$state.go('/create-transaction/validate-submit');
	};
}]);