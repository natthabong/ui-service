'use strict';
angular
        .module('gecscf.organize',
                ['ui.router', 'gecscf.ui', 'gecscf.organize.configuration'])
        .config(
                [
                    '$stateProvider',
                    function($stateProvider) {

                      $stateProvider
                              .state(
                                      '/settings/organizes',
                                      {
                                        url: '/settings/organizes',
                                        controller: 'OrganizationListController',
                                        controllerAs: 'ctrl',
                                        params: {
                                          backAction: false,
                                          party: 'bank',
                                          criteria: null,
                                          organize: null
                                        },
                                        templateUrl: '/organize-list/bank',
                                        resolve: WebHelper
                                                .loadScript([
                                                    'js/app/modules/organize/controllers/OrganizationListController.js',
                                                    'js/app/modules/organize/services/OrganizationService.js',
                                                    'js/app/common/scf-component.js',
                                                    'js/app/common/scf-component.css'])
                                      });

                    }]);