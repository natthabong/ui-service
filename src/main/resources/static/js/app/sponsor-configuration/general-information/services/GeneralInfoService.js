'use strict';
angular.module('gecscf.sponsorConfiguration.generalInfo').factory('GeneralInfoService', ['$http', '$q', function ($http, $q) {

	var getItemSuggestSuppliers = function (organizeId, query) {
		var http = $http.get('/api/v1/organize-customers/' + organizeId + '/trading-partners', {
			params: {
				q: query,
				offset: 0,
				limit: 5,
				accountingTransactionType: 'PAYABLE'
			}
		}).then(function (response) {
			return response.data.map(_prepareItemSupplier);
		});
		return http;
	}

	var getBorrowerTypes = function (organizeId) {
		var deferred = $q.defer();
		var http = $http.get('/api/v1/organizes/' + organizeId + '/borrower-types', {}).then(function (response) {
			deferred.resolve(response);
		}).catch(function (response) {
			deferred.reject(response);
		});
		return deferred;
	}

	return {
		getItemSuggestSuppliers: getItemSuggestSuppliers,
	}

}]);