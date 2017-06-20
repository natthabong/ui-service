'use strict';
var tradeFinanceModule = angular.module('scfApp');
tradeFinanceModule.factory('ConfigTradeFinanceService', [ '$http', '$q', 'Service', function($http, $q, Service) {
	
	function getTradeFinanceInfo(sponsorId,supplierId){
		var url = '/api/v1/organize-customers/'+sponsorId+'/trading-partners/'+supplierId+'/trade-finance';
		return Service.doGet(url);
	}
	
	function deleteTradeFinance(tf){		
		var serviceUrl = '/api/v1/organize-customers/'+tf.sponsorId+'/trading-partners/'+tf.supplierId+'/trade-finance/'+tf.accountId;
		var deferred = $q.defer();
		$http({
			method : 'POST',
			url : serviceUrl,
			headers : {
				'If-Match' : tf.version,
				'X-HTTP-Method-Override': 'DELETE'
			},
			data: tf
		}).then(function(response) {
			return deferred.resolve(response);
		}).catch(function(response) {
			return deferred.reject(response);
		});
		return deferred;
	}

	return {
		getTradeFinanceInfo : getTradeFinanceInfo,
		deleteTradeFinance : deleteTradeFinance
	}
} ]);