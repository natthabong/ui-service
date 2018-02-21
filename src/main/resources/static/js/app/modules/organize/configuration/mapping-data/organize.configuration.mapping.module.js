'use strict';
angular.module('gecscf.organize.configuration.mapping',
		[ 'ui.router', 'gecscf.ui' ]).config(
		[ '$stateProvider', function($stateProvider) {

			var resources = ['js/app/modules/organize/configuration/mapping-data/controllers/EditMappingDataController.js', 
			                 'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js', 
			                 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'];
			
			$stateProvider.state('/sponsor-configuration/mapping-data/edit', {
				url: '/organizes/:organizeId/mapping-data/edit/:organizeId',
				controller: 'EditMappingDataController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/mapping-data/edit',
				params: {
					mode: 'editMapping',
					mappingData: null,
					backAction: null
				},
				resolve: WebHelper.loadScript(resources)
			}).state('/sponsor-configuration/mapping-data/view', {
				url: '/sponsor-configuration/mapping-data/view/:organizeId',
				controller: 'EditMappingDataController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/mapping-data/view',
				params: {
					mode: 'viewMapping',
					mappingData: null,
					backAction: null
				},
				resolve: WebHelper.loadScript(resources)
			}).state('/sponsor-configuration/mapping-data/code/new', {
				url: '/sponsor-configuration/mapping-data/code/new/:organizeId',
				controller: 'MappingDataCodeController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/mapping-data/code/new',
				params: {
					mappingData: null,
					mode: "newCode",
					mappingDataItem: null
				},
				resolve: WebHelper.loadScript(resources)
			}).state('/sponsor-configuration/mapping-data/code/edit', {
				url: '/sponsor-configuration/mapping-data/code/edit/:organizeId',
				controller: 'MappingDataCodeController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/mapping-data/code/new',
				params: {
					mappingData: null,
					mode: "editCode",
					mappingDataItem: null
				},
				resolve: WebHelper.loadScript(resources)

			})
		} 
	]
);
