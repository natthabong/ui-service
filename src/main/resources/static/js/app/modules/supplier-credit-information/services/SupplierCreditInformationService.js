'use strict';
var sciModule = angular.module('gecscf.supplierCreditInformation');
sciModule.factory('SupplierCreditInformationService', ['$http', '$q', 'Service', function ($http, $q, Service) {

	var _prepareItem = function (item) {
		item.identity = ['supplier-', item.memberId, '-option'].join('');
		item.label = [item.memberCode, ': ', item.memberName].join('');
		return item;
	}
	
	var _prepareItemBuyers = function (item) {
		item.identity = ['buyer-', item.buyerId, '-option'].join('');
		item.label = [item.buyerId, ': ', item.buyerName].join('');
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
	
	return {
		getOrganizeByNameOrCodeLike: getOrganizeByNameOrCodeLike,
		getBuyerNameOrCodeLike: getBuyerNameOrCodeLike,
		getBuyerForBankByNameOrCodeLike: getBuyerForBankByNameOrCodeLike,
		_prepareItem: _prepareItem,
		_prepareItemBuyers: _prepareItemBuyers,
		_prepareItemBuyersForBank: _prepareItemBuyersForBank
	}

}]);