var createapp = angular.module('scfApp');
createapp.controller('CreateTransactionController', [function(){
	var vm = this;
	vm.sponsorCodes = [{label: 'TESCO CO,LTD.', value: '0017551'}];
	vm.supplierCodes = [{label: 'JINTANA INTERTRADE CO,LTD.', value: '0017551'}];
	
	vm.createTransactionModel = {
		sponsorCode: vm.sponsorCode[0].value,
		supplierCode: vm.supplierCodes[0].value
	};
}]);