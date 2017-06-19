'use strict';
var tpModule = angular.module('gecscf.tradingPartner');
tpModule.factory('TradingPartnerService', [ '$http', '$q', 'Service', function($http, $q, Service) {
	var _prepareItem = function(item) {
		item.identity = [ 'organize-', item.organizeId, '-option' ].join('');
		item.label = [ item.organizeId, ': ', item.organizeName ].join('');
		return item;
	}

	var getOrganizeByNameOrCodeLike = function(query) {
		var http = $http.get('/api/v1/organizes', {
			params : {
				q : query,
				supporter : false,
				founder : false,
				offset : 0,
				limit : 5
			}
		}).then(function(response) {
			return response.data.map(_prepareItem);
		});

		return http;
	}

	var createTradingPartner = function(tp) {
		var serviceUrl = 'api/v1/trading-partners';
		var req = {
			method : 'POST',
			url : serviceUrl,
			data: tp
		}
		var deferred = $q.defer();
		$http(req).then(function(response) {
			return deferred.resolve(response);
		}).catch(function(response) {
		    return deferred.reject(response);
		});
		return deferred;
	}

	var findTradingPartnerBySponsorIdAndSupplierId = function(sponsorId, supplierId){

		return Service.doGet('api/v1/organize-customers/' + sponsorId + '/trading-partners/' + supplierId);
	}

	return {
		getOrganizeByNameOrCodeLike : getOrganizeByNameOrCodeLike,
		createTradingPartner : createTradingPartner,
		findTradingPartnerBySponsorIdAndSupplierId : findTradingPartnerBySponsorIdAndSupplierId
	}
} ]);