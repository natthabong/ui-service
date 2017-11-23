'use strict';
var raccModule = angular.module('gecscf.remittanceAdviceCustomer');
raccModule.factory('RemittanceAdviceCustomerService', ['$http', '$q', 'Service', function ($http, $q, Service) {

	var _prepareItemSupplier = function (item) {
		item.identity = ['supplier-', item.organizeId, '-option'].join('');
		item.label = [item.organizeId, ': ', item.organizeName].join('');
		return item;
	}
	
	var _prepareItemBuyer = function (item) {
		item.identity = ['buyer-', item.organizeId, '-option'].join('');
		item.label = [item.organizeId, ': ', item.organizeName].join('');
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