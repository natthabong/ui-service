'use strict';
angular.module('gecscf.organize.configuration.productType', ['ui.router', 'gecscf.ui']).config(
	['$stateProvider', function ($stateProvider) {

		var resources = ['js/app/modules/organize/configuration/product-type/controllers/ProductTypeController.js',
			'js/app/modules/organize/configuration/product-type/controllers/ProductTypeListController.js',
			'js/app/modules/organize/configuration/product-type/controllers/ProductTypeSetupController.js',
			'js/app/modules/organize/configuration/product-type/services/ProductTypeService.js',
			'js/app/common/scf-component.js',
			'js/app/common/scf-component.css'
		];

		$stateProvider.state('/sponsor-configuration/product-types', {
			url: '/customer-organize/product-types/:organizeId',
			controller: 'ProductTypeController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/product-types',
			params: {
				organizeId: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/sponsor-configuration/product-type-list', {
			url: '/customer-organize/product-types/:organizeId',
			controller: 'ProductTypeListController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/product-type-list',
			params: {
				organizeId: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/sponsor-configuration/product-types-setup', {
			url: '/customer-organize/product-types/setup/:organizeId/:productType',
			controller: 'ProductTypeSetupController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/product-types-setup',
			params: {
				organizeId: null,
				productType: null,
				model: null
			},
			resolve: WebHelper.loadScript(resources)
		});

	}]
);