'use strict';
angular.module('gecscf.organize.configuration.mappingData', ['ui.router', 'gecscf.ui']).config(
	['$stateProvider', function ($stateProvider) {

		var resources = [
			'js/app/modules/organize/configuration/mapping-data/controllers/EditMappingDataController.js', 
			'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js', 
			'js/app/modules/organize/configuration/mapping-data/controllers/MappingDataCodeController.js', 
			'js/app/common/scf-component.js', 
			'js/app/common/scf-component.css'
		];

		$stateProvider.state('/sponsor-configuration/mapping-data/edit', {
			url: '/organizations/:organizeId/accounting-transactions/:accountingTransactionType/mapping-data/edit',
			controller: 'EditMappingDataController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/mapping-data/edit',
			params: {
				mode: 'editMapping',
				organizeId: null,
				accountingTransactionType: null,
				mappingData: null,
				backAction: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/sponsor-configuration/mapping-data/view', {
			url: '/organizations/:organizeId/accounting-transactions/:accountingTransactionType/mapping-data/view',
			controller: 'EditMappingDataController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/mapping-data/view',
			params: {
				mode: 'viewMapping',
				organizeId: null,
				accountingTransactionType: null,
				mappingData: null,
				backAction: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/sponsor-configuration/mapping-data/code/new', {
			url: '/organizations/:organizeId/accounting-transactions/:accountingTransactionType/mapping-data/code/new',
			controller: 'MappingDataCodeController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/mapping-data/code/new',
			params: {
				mappingData: null,
				mode: "newCode",
				accountingTransactionType: null,
				mappingDataItem: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/sponsor-configuration/mapping-data/code/edit', {
			url: '/organizations/:organizeId/accounting-transactions/:accountingTransactionType/mapping-data/code/edit',
			controller: 'MappingDataCodeController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/mapping-data/code/new',
			params: {
				mappingData: null,
				mode: "editCode",
				accountingTransactionType: null,
				mappingDataItem: null
			},
			resolve: WebHelper.loadScript(resources)

		})
		;

	}]
);