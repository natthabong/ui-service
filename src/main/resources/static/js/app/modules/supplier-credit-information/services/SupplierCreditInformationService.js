'use strict';
var sciModule = angular.module('gecscf.supplierCreditInformation');
sciModule.factory('SupplierCreditInformationService', ['$http', '$q', 'Service', function ($http, $q, Service) {

	var _prepareItem = function (item) {
		item.identity = ['supplier-', item.organizeId, '-option'].join('');
		item.label = [item.organizeId, ': ', item.organizeName].join('');
		return item;
	}

	var getOrganizeByNameOrCodeLike = function (query) {
		var http = $http.get('/api/v1/organizes', {
			params: {
				q: query,
				supporter: false,
				founder: false,
				offset: 0,
				limit: 5
			}
		}).then(function (response) {
			return response.data.map(_prepareItem);
		});

		return http;
	}

	var getCreditInformation = function (buyerId, supplierId) {
		var dataSource = $http({ url: '/api/v1/supplier-credit-information', method: 'GET', params: { buyerId: buyerId, supplierId: supplierId } });
		dataSource.success(function (response) {
			return response.content;
		});
	}

	return {
		getOrganizeByNameOrCodeLike: getOrganizeByNameOrCodeLike,
		getCreditInformation: getCreditInformation,
		_prepareItem: _prepareItem
	}

}]);