'use strict';
angular.module('gecscf.organize.configuration.productType', ['ui.router', 'gecscf.ui']).config(
	['$stateProvider', function ($stateProvider) {

		var resources = ['js/app/modules/organize/configuration/product-type/controllers/ProductTypeController.js',
			'js/app/modules/organize/configuration/product-type/controllers/ProductTypeListController.js',
			'js/app/modules/organize/configuration/product-type/controllers/ProductTypeSetupController.js',
			'js/app/modules/organize/configuration/product-type/services/ProductTypeService.js'
		];

		$stateProvider.state('/organizations/product-types', {
			url: '/organizations/:organizeId/product-types',
			controller: 'ProductTypeController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/product-types',
			params: {
				organizeId: null
			},
			resolve: WebHelper.loadScript([resources[0]])
		}).state('/organizations/product-types/list', {
			url: '/organizations/:organizeId/product-types/list',
			controller: 'ProductTypeListController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/product-type-list',
			params: {
				organizeId: null
			},
			resolve: WebHelper.loadScript([resources[1], resources[3]])
		}).state('/organizations/product-types/configuration', {
			url: '/organizations/:organizeId/product-types/configuration',
			controller: 'ProductTypeListController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/product-type-list',
			params: {
				organizeId: null
			},
			resolve: WebHelper.loadScript([resources[1], resources[3]])
		}).state('/organizations/product-types/configuration/new', {
			url: '/organizations/:organizeId/product-types/configuration/new',
			controller: 'ProductTypeSetupController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/product-types-setup',
			params: {
				organizeId: null
			},
			resolve: WebHelper.loadScript([resources[2], resources[3]])
		}).state('/organizations/product-types/configuration/edit', {
			url: '/organizations/:organizeId/product-types/configuration/:productType/edit',
			controller: 'ProductTypeSetupController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/product-types-setup',
			params: {
				organizeId: null,
				productType: null
			},
			resolve: WebHelper.loadScript([resources[2], resources[3]])
		});

	}]
);