var txnMod = angular.module('gecscf.transaction');
txnMod.controller('PaymentTransactionController', ['$rootScope', '$scope', '$log', '$stateParams', 'SCFCommonService', 'PaymentTransactionService',
		'PagingController', 'PageNavigation', function($rootScope, $scope, $log, $stateParams, SCFCommonService, PaymentTransactionService, PagingController, PageNavigation) {
	
	var vm = this;
	var log = $log;

    vm.criteria = $stateParams.criteria || {

	}

    vm.openDateFrom = false;
	vm.openDateTo = false;
	
	vm.openCalendarDateFrom = function() {
		vm.openDateFrom = true;
	}

	vm.openCalendarDateTo = function() {
		vm.openDateTo = true;
	}
} ]);