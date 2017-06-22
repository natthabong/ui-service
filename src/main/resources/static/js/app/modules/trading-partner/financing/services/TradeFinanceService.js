'use strict';
var tradeFinanceModule = angular.module('gecscf.tradingPartner.financing');
tradeFinanceModule.factory('TradeFinanceService', [ '$http', '$q','Service', function($http, $q, Service ) {

	function createTradeFinance(sponsorId,supplierId,data){
		var url = '/api/v1/organize-customers/'+sponsorId+'/trading-partners/'+supplierId+'/trade-finance';
		return Service.doPost(url,data);
	}

	function updateTradeFinance(sponsorId,supplierId,accountId,data){
		var url = '/api/v1/organize-customers/'+sponsorId+'/trading-partners/'+supplierId+'/trade-finance/'+accountId;
		return Service.doPut(url,data);
	}

	function getTradeFinanceInfo(sponsorId,supplierId,accountId){
		var url = '/api/v1/organize-customers/'+sponsorId+'/trading-partners/'+supplierId+'/trade-finance/'+accountId;
		return Service.doGet(url);
	}

	return {
		getTradeFinanceInfo:getTradeFinanceInfo,
		updateTradeFinance:updateTradeFinance,
		createTradeFinance:createTradeFinance
	}
} ]);