'use strict';
angular.module('gecscf.organize.configuration', [
	'ui.router',
	'scfApp',
	'gecscf.ui',
	'gecscf.organize.configuration.fileLayout',
	'gecscf.organize.configuration.productType',
	'gecscf.organize.configuration.importChannel'
	]).config([ '$stateProvider', function($stateProvider) {	
//		var resources = ['js/app/modules/organize/configuration/import-channels/controllers/ImportChannelController.js',
//			'js/app/modules/organize/configuration/import-channels/services/ImportChannelService.js',
//			'js/app/common/scf-component.js',
//			'js/app/common/scf-component.css'];
//		
//		$stateProvider.state('/customer-organize/import-channels/setup',{
//			url: '/customer-organize/import-channels/setup',
//			controller: 'ImportChannelController',
//			controllerAs: 'ctrl',
//			templateUrl: '/sponsor-configuration/ar-channel-setup',
//			params: { selectedItem: null},
//			resolve: WebHelper.loadScript(resources)
//		});
	}]).factory('ConfigurationUtils', [ "UIFactory", function(UIFactory) {
		var showCreateMappingDataDialog = function(data, callback) {
			UIFactory.showDialog({
				preCloseCallback: callback,
				templateUrl: '/js/app/modules/organize/configuration/mapping-data/templates/dialog-new-mapping-data.html',
				controller: 'MappingDataNewPopupController',
				data: data
			});
		}

		var showCreateImportChannelDialog = function(data, callback) {
			UIFactory.showDialog({
				preCloseCallback: callback,
				templateUrl: '/js/app/modules/organize/configuration/import-channels/templates/dialog-new-import-channel.html',
//				templateUrl: '/customer-organize/import-channels/setup',
				controller: 'ChannelConfigsController',
				data: data
			});
		}

		return {
			showCreateMappingDataDialog: showCreateMappingDataDialog,
			showCreateImportChannelDialog: showCreateImportChannelDialog
		};
	}]
);