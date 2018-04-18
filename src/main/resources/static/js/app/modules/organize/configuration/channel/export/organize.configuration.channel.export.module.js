'use strict';
angular.module('gecscf.organize.configuration.channel.export',
		[ 'ui.router', 'gecscf.ui','gecscf.organize.configuration.fileLayout' ]).config(
		[ '$stateProvider', function($stateProvider) {

			var resources = [
			  'js/app/modules/organize/configuration/channel/common/controllers/SetupFileEncryptionController.js',
			  'js/app/modules/organize/configuration/channel/export/controllers/ExportChannelController.js',
				'js/app/modules/organize/configuration/channel/export/services/ExportChannelService.js',
				'js/app/modules/organize/configuration/file-layout/services/FileLayoutService.js',
				'js/app/common/scf-component.js',
				'js/app/common/scf-component.css'];
			$stateProvider.state('/customer-organize/export-channels/config',{
		        url: '/organizes/:organizeId/export-channels/:channelId',
		        controller: 'ExportChannelController',
		        controllerAs: 'ctrl',
		        templateUrl: '/sponsor-configuration/export-channel-configs/settings',
		        params: { organizeId: null, processType: null, channelId: null},
		        resolve: WebHelper.loadScript(resources)
			}).state('/customer-organize/export-channels/view',{
		        url: '/organizes/:organizeId/process-types/:processType/export-channels/:channelId/view',
		        controller: 'ExportChannelController',
		        controllerAs: 'ctrl',
		        templateUrl: '/sponsor-configuration/export-channels/view',
		        params: { organizeId: null, processType: null, channelId: null},
		        resolve: WebHelper.loadScript(resources)
			});
		} 
	]
);
