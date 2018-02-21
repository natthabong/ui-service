'use strict';
angular.module('gecscf.organize.configuration.mappingData', ['ui.router', 'gecscf.ui']).config(
	['$stateProvider', function ($stateProvider) {

		var resources = [
			'js/app/modules/organize/configuration/mapping-data/controllers/EditMappingDataController.js', 
			'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js', 
			'js/app/common/scf-component.js', 
			'js/app/common/scf-component.css'
		];

		$stateProvider.state('/sponsor-configuration/mapping-data/edit', {
			url: '/sponsor-configuration/mapping-data/edit/:organizeId',
			controller: 'EditMappingDataController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/mapping-data/edit',
			params: {
				mappingData: null,
				backAction: null
			},
			resolve: WebHelper.loadScript(resources)
		});

	}]
);