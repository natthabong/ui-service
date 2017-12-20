'use strict';
angular.module('gecscf.organize.configuration.productType',
		[ 'ui.router', 'gecscf.ui' ]).config(
		[ '$stateProvider', function($stateProvider) {
			
			var resources = ['js/app/modules/organize/configuration/import-channels/controllers/ImportChannelsSettingController.js',
				'js/app/modules/organize/configuration/import-channels/services/ImportChannelService.js',
				'js/app/common/scf-component.js',
				'js/app/common/scf-component.css'];
			
			$stateProvider.state('/customer-organize/import-channels/setup',{
				url: '/customer-organize/import-channels/setup',
				controller: 'ChannelSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/import-channels/settings',
				params: { selectedItem: null},
				resolve: WebHelper.loadScript(resources)
			});
		} 
	]
);
