'use strict';
angular
        .module('gecscf.organize')
        .controller(
                'OrganizationListController',
                [
                    '$scope',
                    '$stateParams',
                    'PagingController',
                    'PageNavigation',
                    'UIFactory',
                    'OrganizationService',
                    function($scope, $stateParams, PagingController,
                            PageNavigation, UIFactory, OrganizationService) {

                      var vm = this;

                      var _criteria = {};
                      vm.criteria = $stateParams.criteria || {
                        organizeId: undefined
                      }
                      vm.organize = $stateParams.organize || undefined;

                      vm.newOrganizationProfile = function() {
                        UIFactory
                                .showDialog({
                                  templateUrl: '/js/app/modules/organize/templates/dialog-new-organization.html',
                                  controller: 'OrganizationPopupController',
                                  data: {
                                    preCloseCallback: function(confirm) {
                                      vm.searchOrganize();
                                    },
                                    creationMode: true
                                  }
                                });
                      }

                      vm.editOrganizationProfile = function(data) {
                        PageNavigation.gotoPage('/' + data.memberId, {

                        });
                      }

                      vm.configOrganizationProfile = function(data) {
                        var params = {
                          organizeId: data.memberId
                        };
                        PageNavigation.nextStep('/sponsor-configuration',
                                params, {
                                  criteria: _criteria,
                                  organize: vm.organize
                                });
                      }

                      var searchOrganizeTypeHead = function(value) {
                        var query = UIFactory.createCriteria(value);
                        return OrganizationService
                                .getOrganizeByNameOrCodeLike(query);
                      }

                      vm.organizeAutoSuggestModel = UIFactory
                              .createAutoSuggestModel({
                                placeholder: 'Enter organization name or code',
                                itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
                                query: searchOrganizeTypeHead
                              });

                      vm.organizeCriteria = {
                        organizeId: undefined
                      }

                      vm.pagingController = PagingController.create(
                              '/api/v1/organize-customers/', _criteria, 'GET');
                      vm.loadData = function(pageModel) {
                        vm.pagingController.search(pageModel
                                || ($stateParams.backAction ? {
                                  offset: _criteria.offset,
                                  limit: _criteria.limit,
                                  organizeId: _criteria.organizeId
                                } : undefined));

                        if ($stateParams.backAction) {
                          $stateParams.backAction = false;
                        }
                      }
                      vm.searchOrganize = function(pageModel) {
                        var organizeId = undefined;
                        if (angular.isObject(vm.organize)) {
                          vm.criteria.organizeId = vm.organize.memberId;
                        } else {
                          vm.criteria.organizeId = undefined;
                        }
                        _storeCriteria();
                        vm.loadData(pageModel);
                      }

                      function _storeCriteria() {
                        angular.copy(vm.criteria, _criteria);
                      }

                      vm.initLoad = function() {
                        var backAction = $stateParams.backAction;

                        if (backAction
                                && Object.keys($stateParams.criteria).length != 0) {
                          vm.organizeCriteria = $stateParams.criteria;
                        }
                        vm.searchOrganize();
                      }

                      vm.initLoad();

                    }]);