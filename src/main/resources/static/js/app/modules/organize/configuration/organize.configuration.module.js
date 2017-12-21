'use strict';
angular.module('gecscf.organize.configuration', [
	'ui.router',
	'scfApp',
	'gecscf.ui',
	'gecscf.organize.configuration.fileLayout',
	'gecscf.organize.configuration.productType',
	'gecscf.organize.configuration.importChannel'
	]).config([ '$stateProvider', function($stateProvider) {	
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
				controller: 'ImportChannelNewPopupController',
				data: data
			});
		}

		return {
			showCreateMappingDataDialog: showCreateMappingDataDialog,
			showCreateImportChannelDialog: showCreateImportChannelDialog
		};
	}]
);