'use strict';
var tpModule = angular.module('gecscf.tradingPartner');
tpModule.factory('TradingPartnerService', [ '$http', '$q', function($http, $q) {
	var getOrganizeByNameOrCodeLike = function(query) {
		var deferred = $q.defer();
		$http.get('/api/v1/organizes', {
			params : {
				q : query,
				supporter : false,
				founder : false,
				offset : 0,
				limit : 5
			}
		}).then(function(response) {
			deferred.resolve(response);
		});
		return deferred;
	}

	return {
		getOrganizeByNameOrCodeLike : getOrganizeByNameOrCodeLike
	}
} ]);