'use strict';
var app = angular.module('gecscf.tradingPartner.financing');
app.factory('AccountService', [ '$http', '$q','Service', function($http, $q, Service ) {

	var save = function(account){
		var url = '/api/v1/organize-customers/'+account.organizeId+'/accounts';
		return Service.doPost(url, account);
	}

	return {
		save: save
	}
} ]);