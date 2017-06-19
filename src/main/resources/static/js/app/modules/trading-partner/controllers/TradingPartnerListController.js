'use strict';
var tpModule = angular.module('gecscf.tradingPartner');
tpModule.controller('TradingPartnerListController', [
		'$scope',
		'$stateParams',
		'UIFactory',
		'PageNavigation',
		'PagingController',
		'TradingPartnerService',
		function($scope, $stateParams, UIFactory, PageNavigation,
				PagingController, TradingPartnerService) {

			var vm = this;
			vm.criteria = {};
			vm.pagingController = PagingController.create('/api/v1/users',
					vm.criteria, 'GET');

		} ]);