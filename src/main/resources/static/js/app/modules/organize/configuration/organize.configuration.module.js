'use strict';
angular
        .module(
                'gecscf.organize.configuration',
                ['ui.router', 'scfApp', 'gecscf.ui',
                    'gecscf.organize.configuration.fileLayout',
                    'gecscf.organize.configuration.productType',
                    'gecscf.organize.configuration.importChannel'])
        .config(
                [
                    '$stateProvider',
                    function($stateProvider) {

                      var requiredModules = [
                          'js/app/sponsor-configuration/sponsor-config-controller.js',
                          'js/app/sponsor-configuration/profile-controller.js',
                          'js/app/sponsor-configuration/workflow/controllers/workflow-controller.js',
                          'js/app/sponsor-configuration/workflow/controllers/setup-workflow-controller.js',
                          'js/app/sponsor-configuration/workflow/services/workflow-service.js',
                          'js/app/sponsor-configuration/file-layouts-controller.js',
                          'js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupController.js',
                          'js/app/sponsor-configuration/channel-config-controller.js',
                          'js/app/common/scf-component.js',
                          'js/app/common/scf-component.css',
                          'js/app/sponsor-configuration/DisplayConfigController.js',
                          'js/app/sponsor-configuration/payment-date-formula-controller.js',
                          'js/app/sponsor-configuration/payment-date-formula-service.js',
                          'js/app/modules/organize/configuration/mapping-data/controllers/MappingDataListController.js',
                          'js/app/modules/organize/configuration/mapping-data/controllers/MappingDataNewPopupController.js',
                          'js/app/modules/organize/configuration/file-layout/controllers/ImportLayoutNewPopupController.js',
                          'js/app/modules/organize/configuration/file-layout/services/FileLayoutService.js',
                          'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js',
                          'js/app/modules/organize/configuration/file-layout/services/FileLayoutService.js',
                          'js/app/sponsor-configuration/ExportPaymentConfigController.js',
                          'js/app/modules/organize/configuration/product-type/controllers/ProductTypeListController.js',
                          'js/app/modules/organize/configuration/product-type/services/ProductTypeService.js',
                          'js/app/modules/organize/configuration/import-channels/controllers/ImportChannelController.js',
                          'js/app/modules/organize/configuration/import-channels/services/ImportChannelService.js',
                          'js/app/modules/organize/configuration/display/controllers/DisplayListController.js'];

                      $stateProvider.state('/sponsor-configuration', {
                        url: '/sponsor-configuration/:organizeId',
                        controller: 'SponsorConfigController',
                        controllerAs: 'sponsorConfigCtrl',
                        templateUrl: '/sponsor-configuration',
                        params: {
                          organizeModel: null,
                          fileLayoutModel: null,
                          organizeId: null
                        },
                        resolve: WebHelper.loadScript(requiredModules)
                      })

                    }])
        .factory(
                'ConfigurationUtils',
                [
                    "UIFactory",
                    function(UIFactory) {
                      var showCreateMappingDataDialog = function(data, callback) {
                        UIFactory
                                .showDialog({
                                  preCloseCallback: callback,
                                  templateUrl: '/js/app/modules/organize/configuration/mapping-data/templates/dialog-new-mapping-data.html',
                                  controller: 'MappingDataNewPopupController',
                                  data: data
                                });
                      }

                      var showCreateImportChannelDialog = function(data,
                              callback) {
                        UIFactory
                                .showDialog({
                                  preCloseCallback: callback,
                                  templateUrl: '/js/app/modules/organize/configuration/import-channels/templates/dialog-new-import-channel.html',
                                  controller: 'ImportChannelNewPopupController',
                                  data: data
                                });
                      }

                      var showCreateImportLayoutDialog = function(data,
                              callback) {
                        UIFactory
                                .showDialog({
                                  preCloseCallback: callback,
                                  templateUrl: '/js/app/modules/organize/configuration/file-layout/templates/dialog-new-import-layout-data.html',
                                  controller: 'ImportLayoutNewPopupController',
                                  data: data
                                });
                      }

                      return {
                        showCreateMappingDataDialog: showCreateMappingDataDialog,
                        showCreateImportChannelDialog: showCreateImportChannelDialog,
                        showCreateImportLayoutDialog: showCreateImportLayoutDialog
                      };
                    }]);