'use strict';
angular.module('gecscf.buyerCreditInformation', ['ui.router', 'gecscf.ui']).config(
	['$stateProvider', function ($stateProvider) {

		var resources = [
          	'js/app/modules/buyer-credit-information/controllers/BuyerCreditInformationController.js', 
          	'js/app/modules/buyer-credit-information/services/BuyerCreditInformationService.js', 
          	'js/app/modules/buyer-credit-information/controllers/ViewBuyerCreditInformationController.js', 
          	'js/app/modules/account/services/AccountService.js', 
          	'js/app/common/scf-component.js', 
          	'js/app/common/scf-component.css'
  		];
		
		$stateProvider.state('/customer-registration/buyer-credit-information', {
			url: '/customer-registration/buyer-credit-information',
			controller: 'BuyerCreditInformationController',
			controllerAs: 'ctrl',
			templateUrl: '/buyer-credit-information',
			params: {
				viewMode: 'CUSTOMER',
				backAction: false,
				criteria: null,
				organize: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/customer-registration/buyer-credit-information/view', {
			url: '/customer-registration/buyer-credit-information/account-id/:accountId/view',
			controller: 'ViewBuyerCreditInformationController',
			controllerAs: 'ctrl',
			templateUrl: '/buyer-credit-information/view',
			params: {
				backAction: false,
				buyer: null,
            	supplier: null,
				accountId: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/my-organize/buyer-credit-information', {
			url: '/my-organize/buyer-credit-information',
			controller: 'BuyerCreditInformationController',
			controllerAs: 'ctrl',
			templateUrl: '/buyer-credit-information',
			params: {
				viewMode: 'MY_ORGANIZE',
				backAction: false,
				criteria: null,
				organize: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/my-organize/buyer-credit-information/view', {
			url: '/my-organize/buyer-credit-information/account-id/:accountId/view',
			controller: 'ViewBuyerCreditInformationController',
			controllerAs: 'ctrl',
			templateUrl: '/buyer-credit-information/view',
			params: {
				backAction: false,
				buyer: null,
            	supplier: null,
				accountId: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/partner-organize/buyer-credit-information', {
			url: '/partner-organize/buyer-credit-information',
			controller: 'BuyerCreditInformationController',
			controllerAs: 'ctrl',
			templateUrl: '/buyer-credit-information',
			params: {
				viewMode: 'PARTNER',
				backAction: false,
				criteria: null,
				organize: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/partner-organize/buyer-credit-information/view', {
			url: '/partner-organize/buyer-credit-information/account-id/:accountId/view',
			controller: 'ViewBuyerCreditInformationController',
			controllerAs: 'ctrl',
			templateUrl: '/buyer-credit-information/view',
			params: {
				backAction: false,
				buyer: null,
            	supplier: null,
				accountId: null
			},
			resolve: WebHelper.loadScript(resources)
		});
	}]);