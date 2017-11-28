'use strict';
var raccModule = angular.module('gecscf.remittanceAdviceCustomer');
raccModule.factory('RemittanceAdviceCustomerService', ['$http', '$q', 'Service', function($http, $q, Service) {

	var _prepareItemSupplier = function(item) {
		item.identity = ['supplier-', item.organizeId, '-option'].join('');
		item.label = [item.organizeId, ': ', item.organizeName].join('');
		return item;
	}

	var _prepareItemBuyer = function(item) {
		item.identity = ['buyer-', item.organizeId, '-option'].join('');
		item.label = [item.organizeId, ': ', item.organizeName].join('');
		return item;
	}

	var getItemSuggestBuyers = function(query) {
		var http = $http.get('/v1/buyers', {
			params: {
				q: query,
				offset: 0,
				limit: 5
			}
		}).then(function(response) {
			console.log(response.data)
			return response.data.map(_prepareItemBuyer);
		});
		return http;
	}

	var getItemSuggestSuppliers = function(query) {
		var http = $http.get('/v1/suppliers', {
			params: {
				q: query,
				offset: 0,
				limit: 5
			}
		}).then(function(response) {
			return response.data.map(_prepareItemSupplier);
		});
		return http;
	}

	var getBorrowerTypes = function(organizeId) {
		var deferred = $q.defer();
		var http = $http.get('/api/v1/organizes/' + organizeId + '/borrower-types', {
		}).then(function (response) {
			deferred.resolve(response);
		}).catch(function (response) {
			deferred.reject(response);
		});
		return deferred;
	}

	return {
		getItemSuggestBuyers: getItemSuggestBuyers,
		getItemSuggestSuppliers: getItemSuggestSuppliers,
		getBorrowerTypes: getBorrowerTypes
	}

}]);