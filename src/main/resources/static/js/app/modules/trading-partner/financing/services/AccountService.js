'use strict';
var app = angular.module('gecscf.tradingPartner.financing');
app.factory('AccountService', [ '$http', '$q','Service', function($http, $q, Service ) {

	var save = function(account){
		var serviceUrl = '/api/v1/organize-customers/'+account.organizeId+'/accounts';
		var deferred = $q.defer();
		$http({
			method : 'POST',
			url : serviceUrl,
			data: account
		}).then(function(response) {
			return deferred.resolve(response);
		}).catch(function(response) {
			return deferred.reject(response);
		});
		return deferred;
	
	}

	return {
		save: save
	}
} ]);