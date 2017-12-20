'use strict';
var raccModule = angular.module('gecscf.remittanceAdviceCustomer');
raccModule.factory('RemittanceAdviceCustomerService', ['$http', '$q', 'Service', function($http, $q, Service) {

	var _prepareItemSupplier = function(item) {
		item.identity = ['supplier-', item.supplierId, '-option'].join('');
		item.label = [item.supplierId, ': ', item.supplierName].join('');
		return item;
	}

	var _prepareItemBuyer = function(item) {
		item.identity = ['buyer-', item.sponsorId, '-option'].join('');
		item.label = [item.sponsorId, ': ', item.sponsorName].join('');
		return item;
	}
	
	var getItemSuggestSuppliers = function(organizeId, query) {
		var http = $http.get('/api/v1/organize-customers/' + organizeId + '/trading-partners', {
			params: {
				q: query,
				offset: 0,
				limit: 5,
				accountingTransactionType : 'PAYABLE'
			}
		}).then(function(response) {
			return response.data.map(_prepareItemSupplier);
		});
		return http;
	}

	var getItemSuggestBuyers = function(organizeId, query) {
		var http = $http.get('/api/v1/organize-customers/' + organizeId + '/trading-partners', {
			params: {
				q: query,
				offset: 0,
				limit: 5,
				accountingTransactionType : 'RECEIVABLE'
			}
		}).then(function(response) {
			return response.data.map(_prepareItemBuyer);
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
	
    var verifyBorrowerType = function() {
		var deferred = $q.defer();
		var http = $http.get('/api/v1/organizes/my/borrower-types', {
		}).then(function (response) {
			deferred.resolve(response);
		}).catch(function (response) {
			deferred.reject(response);
		});
		return deferred;
    }

	return {
		getItemSuggestSuppliers: getItemSuggestSuppliers,
		getItemSuggestBuyers: getItemSuggestBuyers,
		getBorrowerTypes: getBorrowerTypes,
		verifyBorrowerType: verifyBorrowerType
	}

}]);