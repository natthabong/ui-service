'use strict';

angular.module('gecscf.organize.configuration', [ 'ui.router', 'gecscf.ui', 'gecscf.organize.configuration.fileLayout' ])
		.config([ '$stateProvider', function($stateProvider) {

		} ]).factory('MappingDataUtils', [ "UIFactory", function(UIFactory) {

			var showCreateMappingDataDialog = function(data, callback){
				UIFactory.showDialog({
					preCloseCallback: callback,
					templateUrl: '/js/app/modules/organize/configuration/mapping-data/templates/dialog-new-mapping-data.html',
					controller: 'MappingDataNewPopupController',
					data: data
				});
			}
			
			
			return {
				showCreateMappingDataDialog: showCreateMappingDataDialog
			};

		} ]);