'use strict';
angular.module('gecscf.organize.configuration.importChannel',
		[ 'ui.router', 'gecscf.ui' ]).config(
		[ '$stateProvider', function($stateProvider) {

			var resources = ['js/app/modules/organize/configuration/import-channels/controllers/ImportChannelController.js',
				'js/app/modules/organize/configuration/import-channels/services/ImportChannelService.js',
				'js/app/common/scf-component.js',
				'js/app/common/scf-component.css'];
			
			$stateProvider.state('/customer-organize/import-channels/config',{
				url: '/customer-organize/import-channels/config',
				controller: 'ImportChannelController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/import-channels/settings',
				params: { selectedItem: null},
				resolve: WebHelper.loadScript(resources)
			});
		} 
	]
);
