'use strict';
var sciModule = angular.module('gecscf.supplierCreditInformation');
sciModule.factory('SupplierCreditInformationService', ['$http', '$q', 'Service', function ($http, $q, Service) {

	var _prepareItem = function (item) {
		item.identity = ['supplier-', item.memberId, '-option'].join('');
		item.label = [item.memberCode, ': ', item.memberName].join('');
		return item;
	}
	
	var _prepareItemBuyers = function (item) {
		item.identity = ['buyer-', item.sponsorId, '-option'].join('');
		item.label = [item.sponsorId, ': ', item.sponsorName].join('');
		return item;
	}
	
	var _prepareItemBuyersForBank = function (item) {
		item.identity = ['buyer-', item.memberId, '-option'].join('');
		item.label = [item.memberCode, ': ', item.memberName].join('');
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
	
	var getBuyerForBankByNameOrCodeLike = function (query) {
		var http = $http.get('/api/v1/organizes', {
			params: {
				q: query,
				supporter: false,
				founder: false,
				offset: 0,
				limit: 5
			}
		}).then(function (response) {
			return response.data.map(_prepareItemBuyersForBank);
		});

		return http;
	}
	
	var getBuyerNameOrCodeLike = function (organizeId,query) {
		var http = $http.get('/api/v1/organize-customers/'+organizeId+'/trading-partners', {
			params: {
				q: query,
				offset: 0,
				limit: 5 ,
				accountingTransactionType : 'RECEIVABLE'
			}
		}).then(function (response) {
			return response.data.map(_prepareItemBuyers);
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
		getBuyerNameOrCodeLike: getBuyerNameOrCodeLike,
		getBuyerForBankByNameOrCodeLike: getBuyerForBankByNameOrCodeLike,
		_prepareItem: _prepareItem,
		_prepareItemBuyers: _prepareItemBuyers,
		_prepareItemBuyersForBank: _prepareItemBuyersForBank
	}

}]);