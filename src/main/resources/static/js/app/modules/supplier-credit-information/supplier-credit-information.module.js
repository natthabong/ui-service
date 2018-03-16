'use strict';
angular.module('gecscf.supplierCreditInformation', ['ui.router', 'gecscf.ui',]).config(
	['$stateProvider', function ($stateProvider) {
		
		var resources = [
         	'js/app/modules/supplier-credit-information/controllers/SupplierCreditInformationController.js', 
         	'js/app/modules/supplier-credit-information/services/SupplierCreditInformationService.js', 
         	'js/app/modules/supplier-credit-information/controllers/ViewSupplierCreditInformationController.js', 
         	'js/app/modules/account/services/AccountService.js', 
         	'js/app/common/scf-component.js', 
         	'js/app/common/scf-component.css'
 		];
		
		$stateProvider.state('/customer-registration/supplier-credit-information', {
			url: '/customer-registration/supplier-credit-information',
			controller: 'SupplierCreditInformationController',
			controllerAs: 'ctrl',
			templateUrl: '/supplier-credit-information',
			params: {
				viewMode: 'CUSTOMER',
				backAction: false,
				criteria: null,
				organize: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/customer-registration/supplier-credit-information/view', {
			url: '/customer-registration/supplier-credit-information/account-id/:accountId/view',
			controller: 'ViewSupplierCreditInformationController',
			controllerAs: 'ctrl',
			templateUrl: '/supplier-credit-information/view',
			params: {
				backAction: false,
				buyer: null,
            	supplier: null,
				accountId: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/my-organize/supplier-credit-information', {
			url: '/my-organize/supplier-credit-information',
			controller: 'SupplierCreditInformationController',
			controllerAs: 'ctrl',
			templateUrl: '/supplier-credit-information',
			params: {
				viewMode: 'MY_ORGANIZE',
				backAction: false,
				criteria: null,
				organize: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/my-organize/supplier-credit-information/view', {
			url: '/my-organize/supplier-credit-information/account-id/:accountId/view',
			controller: 'ViewSupplierCreditInformationController',
			controllerAs: 'ctrl',
			templateUrl: '/supplier-credit-information/view',
			params: {
				backAction: false,
				buyer: null,
            	supplier: null,
				accountId: null
			},
			resolve: WebHelper.loadScript(resources)
		});
	}]);