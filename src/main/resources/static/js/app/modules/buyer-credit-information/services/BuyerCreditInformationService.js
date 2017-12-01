'use strict';
var bciModule = angular.module('gecscf.buyerCreditInformation');
bciModule.factory('BuyerCreditInformationService', ['$http', '$q', 'Service', function ($http, $q, Service) {

	var _prepareItemSupplier = function (item) {
		item.identity = ['supplier-', item.organizeId, '-option'].join('');
		item.label = [item.organizeId, ': ', item.organizeName].join('');
		return item;
	}
	
	var _prepareItemSupplierForBuyer = function (item) {
		item.identity = ['supplier-', item.supplierId, '-option'].join('');
		item.label = [item.supplierId, ': ', item.supplierName].join('');
		return item;
	}
	
	var _prepareItemBuyers = function (item) {
		item.identity = ['buyer-', item.sponsorId, '-option'].join('');
		item.label = [item.sponsorId, ': ', item.sponsorName].join('');
		return item;
	}
	
	var _prepareItemBuyersForBank = function (item) {
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
			return response.data.map(_prepareItemBuyersForBank);
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
	
	var getItemSuggestBuyersBySupplierId = function (organizeId, query) {
		var http = $http.get('/api/v1/organize-customers/' + organizeId + '/trading-partners', {
			params: {
				q: query,
				offset: 0,
				limit: 5,
				accountingTransactionType: "RECEIVABLE"
			}
		}).then(function (response) {
			return response.data.map(_prepareItemBuyers);
		});
		return http;
	}
	
	var getItemSuggestSuppliersByBuyerId = function (organizeId, query) {
		var http = $http.get('/api/v1/organize-customers/' + organizeId + '/trading-partners', {
			params: {
				q: query,
				offset: 0,
				limit: 5,
				accountingTransactionType: "PAYABLE"
			}
		}).then(function (response) {
			return response.data.map(_prepareItemSupplierForBuyer);
		});
		return http;
	}

	return {
		getItemSuggestBuyers: getItemSuggestBuyers,
		getItemSuggestSuppliers: getItemSuggestSuppliers,
		getItemSuggestBuyersBySupplierId: getItemSuggestBuyersBySupplierId,
		getItemSuggestSuppliersByBuyerId: getItemSuggestSuppliersByBuyerId
	}

}]);