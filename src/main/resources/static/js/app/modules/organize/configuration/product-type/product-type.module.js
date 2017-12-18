'use strict';
angular.module('gecscf.organize.configuration.productType',
		[ 'ui.router', 'gecscf.ui' ]).config(
		[ '$stateProvider', function($stateProvider) {
			
			var resources = ['js/app/modules/organize/configuration/product-type/controllers/ProductTypeListController.js',
				'js/app/modules/organize/configuration/product-type/controllers/ProductTypeController.js',
				'js/app/modules/organize/configuration/product-type/services/ProductTypeService.js',
				'js/app/common/scf-component.js',
				'js/app/common/scf-component.css'];
			
			$stateProvider.state('/customer-organize/product-types',{
				url: '/customer-organize/product-types',
				controller: 'ProductTypeListController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/product-types',
				params: {},
				resolve: WebHelper.loadScript(resources)
			}).state('/customer-organize/product-types/setup',{
				url: '/customer-organize/product-types/setup',
				controller: 'ProductTypeController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/product-types-setup',
				params: {organizeId:null, productType: null},
				resolve: WebHelper.loadScript(resources)
			});

		} ]);
