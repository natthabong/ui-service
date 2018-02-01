'use strict';
angular
        .module(
                'gecscf.organize.configuration',
                ['ui.router', 'scfApp', 'gecscf.ui',
                    'gecscf.organize.configuration.fileLayout',
                    'gecscf.organize.configuration.exportPayment',
                    'gecscf.organize.configuration.productType',
                    'gecscf.organize.configuration.channel'])
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
                          
                          'js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupController.js',
                          'js/app/sponsor-configuration/channel-config-controller.js',
                          'js/app/common/scf-component.js',
                          'js/app/common/scf-component.css',
                          'js/app/sponsor-configuration/DisplayConfigController.js',
                          'js/app/sponsor-configuration/payment-date-formula-controller.js',
                          'js/app/sponsor-configuration/payment-date-formula-service.js',
                          'js/app/modules/organize/configuration/mapping-data/controllers/MappingDataListController.js',
                          'js/app/modules/organize/configuration/mapping-data/controllers/MappingDataNewPopupController.js',
                          'js/app/modules/organize/configuration/display/controllers/DisplayNewPopupController.js',
                          'js/app/modules/organize/configuration/display/services/DisplayService.js',
                          'js/app/modules/organize/configuration/file-layout/controllers/FileLayoutListController.js',
                          'js/app/modules/organize/configuration/file-layout/controllers/ImportLayoutNewPopupController.js',
                          'js/app/modules/organize/configuration/export-payment/controllers/ExportLayoutNewPopupController.js',
                          'js/app/modules/organize/configuration/file-layout/services/FileLayoutService.js',
                          'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js',
                          'js/app/modules/organize/configuration/file-layout/services/FileLayoutService.js',
                          'js/app/sponsor-configuration/ExportPaymentConfigController.js',
                          'js/app/modules/organize/configuration/product-type/controllers/ProductTypeListController.js',
                          'js/app/modules/organize/configuration/product-type/services/ProductTypeService.js',
                          'js/app/modules/organize/configuration/channel/import/controllers/ImportChannelController.js',
                          'js/app/modules/organize/configuration/channel/export/services/ExportChannelService.js',
                          'js/app/modules/organize/configuration/channel/import/services/ImportChannelService.js',
                          'js/app/modules/organize/configuration/channel/export/controllers/ExportChannelListController.js',
                          'js/app/modules/organize/configuration/channel/export/controllers/ExportChannelNewPopupController.js',
                          'js/app/modules/organize/configuration/channel/export/controllers/ExportChannelController.js',
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
                      }).state('/sponsor-configuration/file-layouts/new-file-layout',{
                        url: '/sponsor-configuration/file-layouts/new-file-layout/:organizeId',
                        controller: 'FileLayoutController',
                        controllerAs: 'ctrl',
                        templateUrl: '/sponsor-configuration/file-layouts/new-file-layout',
                        params: { fileLayoutModel: null,processType:null,integrateType:null},
                        resolve: WebHelper.loadScript(['js/app/modules/organize/configuration/file-layout/controllers/FileLayoutController.js',
                          'js/app/modules/organize/configuration/file-layout/controllers/TextLayoutConfigController.js',
                          'js/app/modules/organize/configuration/file-layout/controllers/DateTimeLayoutConfigController.js',
                          'js/app/modules/organize/configuration/file-layout/controllers/NumericLayoutConfigController.js',
                          'js/app/modules/organize/configuration/file-layout/controllers/RecordTypeLayoutConfigController.js',
                          'js/app/modules/organize/configuration/file-layout/controllers/FillerLayoutConfigController.js',
                          'js/app/modules/organize/configuration/file-layout/controllers/SignFlagLayoutConfigController.js',
                          'js/app/modules/organize/configuration/file-layout/controllers/DataLayoutConfigController.js',
                          'js/app/modules/organize/configuration/file-layout/controllers/ImportLayoutNewPopupController.js',
                          'js/app/modules/organize/configuration/mapping-data/controllers/MappingDataNewPopupController.js',
                          'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js',
                          'js/app/modules/organize/configuration/file-layout/services/FileLayoutService.js',
                          'js/app/modules/organize/configuration/file-layout/services/FileLayerExampleDisplayService.js',
                          'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
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
                                  templateUrl: '/js/app/modules/organize/configuration/channel/import/templates/dialog-new-import-channel.html',
                                  controller: 'ImportChannelNewPopupController',
                                  data: data
                                });
                      }
                      
                      var showCreateExportChannelDialog = function(data,
                              callback) {
                        UIFactory
                                .showDialog({
                                  preCloseCallback: callback,
                                  templateUrl: '/js/app/modules/organize/configuration/channel/export/templates/dialog-new-export-channel.html',
                                  controller: 'ExportChannelNewPopupController',
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
                      
                      var showCreateExportLayoutDialog = function(data,
                              callback) {
                        UIFactory
                                .showDialog({
                                  preCloseCallback: callback,
                                  templateUrl: '/js/app/modules/organize/configuration/export-payment/templates/dialog-new-export-layout-data.html',
                                  controller: 'ExportLayoutNewPopupController',
                                  data: data
                                });
                      }
                      
                      var showCreateNewCreateDisplayDialog = function(data,
                              callback) {
                        UIFactory
                                .showDialog({
                                  preCloseCallback: callback,
                                  templateUrl: '/js/app/modules/organize/configuration/display/templates/dialog-new-create-transaction-display.html',
                                  controller: 'DisplayNewPopupController',
                                  data: data
                                });
                      }

                      return {
                        showCreateMappingDataDialog: showCreateMappingDataDialog,
                        showCreateImportChannelDialog: showCreateImportChannelDialog,
                        showCreateImportLayoutDialog: showCreateImportLayoutDialog,
                        showCreateExportLayoutDialog: showCreateExportLayoutDialog,
                        showCreateNewCreateDisplayDialog: showCreateNewCreateDisplayDialog,
                        showCreateExportChannelDialog: showCreateExportChannelDialog
                      };
                    }]);