'use strict';
var tradeFinanceModule = angular.module('gecscf.tradingPartner.financing');
tradeFinanceModule.factory('TradeFinanceService', ['$http', '$q', 'Service', function ($http, $q, Service) {
	function createTradeFinance(buyerId, supplierId, data, isSupplier) {
		var borrowerType = null;

		if (isSupplier) {
			borrowerType = "SUPPLIER";
		} else {
			borrowerType = "BUYER";
		}

		var url = '/api/v1/organize-customers/' + buyerId + '/trading-partners/' + supplierId + '/trade-finance';
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: url,
			data: data,
			param: borrowerType
		}).then(function (response) {
			return deferred.resolve(response);
		}).catch(function (response) {
			return deferred.reject(response);
		});
		return deferred;
	}

	function updateTradeFinance(buyerId, supplierId, accountId, data) {
		var url = '/api/v1/organize-customers/' + buyerId + '/trading-partners/' + supplierId + '/trade-finance/' + accountId;
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: url,
			headers: {
				'If-Match': data.version,
				'X-HTTP-Method-Override': 'PUT'
			},
			data: data
		}).then(function (response) {
			return deferred.resolve(response);
		}).catch(function (response) {
			return deferred.reject(response);
		});
		return deferred;
	}

	function getTradeFinanceInfo(buyerId, supplierId, accountId) {
		var url = '/api/v1/organize-customers/' + buyerId + '/trading-partners/' + supplierId + '/trade-finance/' + accountId;
		return Service.doGet(url);
	}

	function getPayeeAccounts(organizeId) {
		var serviceUrl = '/api/v1/organize-customers/accounts';
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: serviceUrl,
			params: {
				organizeId: organizeId,
				offset: 0,
				limit: 999
			}
		}).then(function (response) {
			return deferred.resolve(response);
		}).catch(function (response) {
			return deferred.reject(response);
		});
		return deferred;
	}

	return {
		createTradeFinance: createTradeFinance,
		updateTradeFinance: updateTradeFinance,
		getTradeFinanceInfo: getTradeFinanceInfo,
		getPayeeAccounts: getPayeeAccounts
	}

}]);