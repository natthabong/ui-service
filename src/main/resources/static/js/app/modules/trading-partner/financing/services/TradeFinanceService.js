'use strict';
var tradeFinanceModule = angular.module('gecscf.tradingPartner.financing');
tradeFinanceModule.factory('TradeFinanceService', [ '$http', '$q','Service', function($http, $q, Service ) {

	function createTradeFinance(sponsorId,supplierId,data){
		var url = '/api/v1/organize-customers/'+sponsorId+'/trading-partners/'+supplierId+'/trade-finance';
		var deferred = $q.defer();
		$http({
			method : 'POST',
			url : url,
			data: data
		}).then(function(response) {
			return deferred.resolve(response);
		}).catch(function(response) {
			return deferred.reject(response);
		});
		return deferred;
	}

	function updateTradeFinance(sponsorId,supplierId,accountId,data){
		var url = '/api/v1/organize-customers/'+sponsorId+'/trading-partners/'+supplierId+'/trade-finance/'+accountId;
		var deferred = $q.defer();
		$http({
			method : 'PUT',
			url : url,
			data: data
		}).then(function(response) {
			return deferred.resolve(response);
		}).catch(function(response) {
			return deferred.reject(response);
		});
		return deferred;
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