'use strict';
var tpModule = angular.module('gecscf.tradingPartner');
tpModule.factory('TradingPartnerService', ['$http', '$q', 'Service', function ($http, $q, Service) {
	var _prepareItem = function (item) {
		item.identity = ['organize-', item.memberId, '-option'].join('');
		item.label = [item.memberCode, ': ', item.memberName].join('');
		return item;
	}

	var getOrganizeByNameOrCodeLike = function (query) {
		var http = $http.get('/api/v1/organizes', {
			params: {
				q: query,
				supporter: false,
				founder: false,
				offset: 0,
				limit: 5
			}
		}).then(function (response) {
			return response.data.map(_prepareItem);
		});

		return http;
	}

	var createTradingPartner = function (tp, editMode) {
		var serviceUrl = '';
		if (editMode) {
			serviceUrl = 'api/v1/organize-customers/' + tp.buyerId + '/trading-partners/' + tp.supplierId;
		} else {
			serviceUrl = 'api/v1/trading-partners';
		}

		var req = {
			method: 'POST',
			url: serviceUrl,
			data: tp
		}
		if (editMode) {
			req.headers = {
				'If-Match': tp.version,
				'X-HTTP-Method-Override': 'PUT'
			}
		}
		var deferred = $q.defer();
		$http(req).then(function (response) {
			return deferred.resolve(response);
		}).catch(function (response) {
			return deferred.reject(response);
		});
		return deferred;
	}

	var deleteTradingPartner = function (trading) {
		var serviceUrl = '/api/v1/organize-customers/' + trading.buyerId + '/trading-partners/' + trading.supplierId
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: serviceUrl,
			headers: {
				'If-Match': trading.version,
				'X-HTTP-Method-Override': 'DELETE'
			},
			data: trading
		}).then(function (response) {
			return deferred.resolve(response);
		}).catch(function (response) {
			return deferred.reject(response);
		});
		return deferred;
	}

	var getPayeeAccounts = function (organizeId) {
		var serviceUrl = '/api/v1/organize-customers/' + organizeId + '/accounts';
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: serviceUrl,
			params: {
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

	function getTradingPartner(buyerId, supplierId){
		var serviceUrl = 'api/v1/organize-customers/' + buyerId + '/trading-partners/' + supplierId;
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: serviceUrl
		}).then(function (response) {
			return deferred.resolve(response);
		}).catch(function (response) {
			return deferred.reject(response);
		});
		return deferred;
	}
	
	var updateDebitPaymentInformation = function (tp) {
		var serviceUrl = 'api/v1/organize-customers/' + tp.buyerId + '/debit-payment-information/' + tp.supplierId;
		var req = {
			method: 'POST',
			url: serviceUrl,
			data: tp,
			headers: {
				'If-Match': tp.version,
				'X-HTTP-Method-Override': 'PUT'
			}
		}

		var deferred = $q.defer();
		$http(req).then(function (response) {
			return deferred.resolve(response);
		}).catch(function (response) {
			return deferred.reject(response);
		});
		return deferred;
	}

	return {
		getTradingPartner: getTradingPartner,
		updateDebitPaymentInformation : updateDebitPaymentInformation,
		getPayeeAccounts: getPayeeAccounts,
		getOrganizeByNameOrCodeLike: getOrganizeByNameOrCodeLike,
		createTradingPartner: createTradingPartner,
		deleteTradingPartner: deleteTradingPartner,
		_prepareItem: _prepareItem
	}
}]);