'use strict';
angular.module('gecscf.organize.configuration.channel.import', ['ui.router', 'gecscf.ui', 'gecscf.organize.configuration.fileLayout']).config(
	['$stateProvider', function ($stateProvider) {

		var resources = ['js/app/modules/organize/configuration/channel/import/controllers/ImportChannelController.js',
			'js/app/modules/organize/configuration/channel/import/services/ImportChannelService.js',
			'js/app/modules/organize/configuration/channel/export/services/ExportChannelService.js',
			'js/app/modules/organize/configuration/file-layout/services/FileLayoutService.js',
			'js/app/common/scf-component.js',
			'js/app/common/scf-component.css'
		];

		$stateProvider.state('/customer-organize/import-channels/config', {
			url: '/organizes/:organizeId/process-types/:processType/import-channels/:channelId',
			controller: 'ImportChannelController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/import-channels/settings',
			params: {
				organizeId: null,
				processType: null,
				channelId: null
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/customer-organize/import-channels/view', {
			url: '/organizes/:organizeId/process-types/:processType/import-channels/:channelId/view',
			controller: 'ImportChannelController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/import-channels/view',
			params: {
				organizeId: null,
				processType: null,
				channelId: null
			},
			resolve: WebHelper.loadScript(resources)
		});
	}]
);