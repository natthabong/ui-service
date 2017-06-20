'use strict';
var tradeFinanceModule = angular.module('scfApp');
tradeFinanceModule.factory('ConfigTradeFinanceService', [ '$http', '$q', 'Service', function($http, $q, Service) {
	
	function getTradeFinanceInfo(sponsorId,supplierId){
		var url = '/api/v1/organize-customers/'+sponsorId+'/trading-partners/'+supplierId+'/trade-finance';
		return Service.doGet(url);
	}

	return {
		getTradeFinanceInfo : getTradeFinanceInfo
	}
} ]);