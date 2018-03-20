'use strict';
angular.module('gecscf.organize.configuration.customerCode', ['ui.router', 'gecscf.ui']).config(
	['$stateProvider', function ($stateProvider) {

		var resources = [
			'js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupSettingController.js', 
			'js/app/modules/organize/configuration/customer-code/services/CustomerCodeGroupService.js', 
			'js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupDialogController.js', 
			'js/app/common/scf-component.js', 
			'js/app/common/scf-component.css'
		];

		$stateProvider.state('/sponsor-configuration/customer-code-groups/settings', {
			url: '/sponsor-configuration/customer-code-groups/settings',
			controller: 'CustomerCodeGroupSettingController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/customer-code-groups/settings',
			params: {
				selectedItem: null,
				mode: 'all'
			}
		}).state('/my-organize/supplier-code-list', {
			url: '/my-organize/supplier-code-list',
			controller: 'CustomerCodeGroupSettingController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/customer-code-groups/supplier-code-list/edit',
			params: {
				mode: 'editCustCode',
				viewMode: 'MY_ORGANIZE',
				organizeId: null,
				accountingTransactionType: 'PAYABLE'
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/my-organize/buyer-code-list', {
			url: '/my-organize/buyer-code-list',
			controller: 'CustomerCodeGroupSettingController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/customer-code-groups/buyer-code-list/edit',
			params: {
				mode: 'editCustCode',
				viewMode: 'MY_ORGANIZE',
				organizeId: null,
				accountingTransactionType: 'RECEIVABLE'
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/customer-organize/supplier-code-list/edit', {
			url: '/organizations/:organizeId/accounting-transactions/:accountingTransactionType/customer-organize/supplier-code-list/edit',
			controller: 'CustomerCodeGroupSettingController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/customer-code-groups/supplier-code-list/edit',
			params: {
				mode: 'editCustCode',
				viewMode: 'CUSTOMER',
				organizeId: null,
				accountingTransactionType: 'PAYABLE'
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/customer-organize/buyer-code-list/edit', {
			url: '/organizations/:organizeId/accounting-transactions/:accountingTransactionType/customer-organize/buyer-code-list/edit',
			controller: 'CustomerCodeGroupSettingController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/customer-code-groups/buyer-code-list/edit',
			params: {
				mode: 'editCustCode',
				viewMode: 'CUSTOMER',
				organizeId: null,
				accountingTransactionType: 'RECEIVABLE'
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/customer-organize/supplier-code-list/view', {
			url: '/organizations/:organizeId/accounting-transactions/:accountingTransactionType/customer-organize/supplier-code-list/view',
			controller: 'CustomerCodeGroupSettingController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/customer-code-groups/supplier-code-list/view',
			params: {
				mode: 'viewCustCode',
				viewMode: 'CUSTOMER',
				organizeId: null,
				accountingTransactionType: 'PAYABLE'
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/customer-organize/buyer-code-list/view', {
			url: '/organizations/:organizeId/accounting-transactions/:accountingTransactionType/customer-organize/buyer-code-list/view',
			controller: 'CustomerCodeGroupSettingController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/customer-code-groups/buyer-code-list/view',
			params: {
				mode: 'viewCustCode',
				viewMode: 'CUSTOMER',
				organizeId: null,
				accountingTransactionType: 'RECEIVABLE'
			},
			resolve: WebHelper.loadScript(resources)
		});
	}]
);