'use strict';
var sciModule = angular.module('gecscf.remittanceAdviceBank');
sciModule.factory('RemittanceAdviceBankService', ['$http', '$q', 'Service', function ($http, $q, Service) {

	var _prepareItemSupplier = function (item) {
		item.identity = ['supplier-', item.memberId, '-option'].join('');
		item.label = [item.memberCode, ': ', item.memberName].join('');
		return item;
	}
	
	var _prepareItemBuyer = function (item) {
		item.identity = ['buyer-', item.memberId, '-option'].join('');
		item.label = [item.memberCode, ': ', item.memberName].join('');
		return item;
	}
	
	
	var getItemSuggestBuyers = function (query) {
		var http = $http.get('/api/v1/organizes', {
			params: {
				q: query,
				offset: 0,
				limit: 5
			}
		}).then(function (response) {
			return response.data.map(_prepareItemBuyer);
		});
		return http;
	}
	
	var getItemSuggestSuppliers = function (query) {
		var http = $http.get('/api/v1/organizes', {
			params: {
				q: query,
				offset: 0,
				limit: 5
			}
		}).then(function (response) {
			return response.data.map(_prepareItemSupplier);
		});
		return http;
	}
	
	return {
		getItemSuggestBuyers: getItemSuggestBuyers,
		getItemSuggestSuppliers: getItemSuggestSuppliers
	}

}]);