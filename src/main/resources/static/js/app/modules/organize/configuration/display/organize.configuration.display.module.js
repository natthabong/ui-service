'use strict';
angular
        .module('gecscf.organize.configuration.display',
                ['ui.router', 'gecscf.ui'])
        .config(
                [
                    '$stateProvider',
                    function($stateProvider) {
                      var requiredModules = [
                          'js/app/modules/organize/configuration/display/controllers/DisplayController.js',
                          'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js',
                          'js/app/modules/organize/configuration/display/services/DisplayService.js'];

                      $stateProvider
                              .state(
                                      '/sponsor-configuration/document-display/settings',
                                      {
                                        url: '/sponsor-configuration/document-display/settings/:organizeId/:accountingTransactionType/:displayMode/displays/:documentDisplayId',
                                        controller: 'DisplayController',
                                        controllerAs: 'ctrl',
                                        templateUrl: '/sponsor-configuration/document-display/settings',
                                        params: {
                                          accountingTransactionType: null,
                                          displayMode: null,
                                          selectedItem: null
                                        },
                                        resolve: WebHelper
                                                .loadScript(requiredModules)
                                      })
                              .state(
                                      '/sponsor-configuration/create-transaction-displays/settings',
                                      {
                                        url: '/sponsor-configuration/create-transaction-displays/settings/:organizeId/:accountingTransactionType/:displayMode/displays/:documentDisplayId',
                                        controller: 'DisplayController',
                                        controllerAs: 'ctrl',
                                        templateUrl: '/sponsor-configuration/create-transaction-displays/settings',
                                        params: {
                                          accountingTransactionType: null,
                                          displayMode: null,
                                          selectedItem: null
                                        },
                                        resolve: WebHelper
                                                .loadScript(requiredModules)
                                      })
                              .state(
                                      '/sponsor-configuration/components/setup-display-fields',
                                      {
                                        url: '/sponsor-configuration/components/setup-display-fields',
                                        templateUrl: '/sponsor-configuration/components/setup-display-fields'
                                      });
                    }]);