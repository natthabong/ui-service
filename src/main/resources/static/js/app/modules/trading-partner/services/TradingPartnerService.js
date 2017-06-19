'use strict';
var tpModule = angular.module('gecscf.tradingPartner');
tpModule.factory('TradingPartnerService', [ '$http', '$q', function($http, $q) {
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

	return {
		getOrganizeByNameOrCodeLike : getOrganizeByNameOrCodeLike
	}
} ]);