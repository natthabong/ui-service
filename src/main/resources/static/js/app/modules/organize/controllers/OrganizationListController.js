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

                      vm.newOrganization = function() {
                        UIFactory
                                .showDialog({
                                  templateUrl: '/js/app/modules/organize/templates/dialog-organization.html',
                                  controller: 'OrganizationPopupController',
                                  data: {
                                    preCloseCallback: function(confirm) {
                                      vm.searchOrganize();
                                    },
                                    editionMode: false
                                  }
                                });
                      }

                      vm.editOrganization = function(data) {
                        UIFactory
                                .showDialog({
                                  templateUrl: '/js/app/modules/organize/templates/dialog-organization.html',
                                  controller: 'OrganizationPopupController',
                                  data: {
                                    preCloseCallback: function(confirm) {
                                      vm.searchOrganize();
                                    },
                                    editionMode: true,
                                    model: {
                                      organizationCode: data.memberCode,
                                      organizationName: data.memberName,
                                      taxId: data.memberId,
                                      version: data.version
                                    }
                                  }
                                });
                      }

                      vm.deleteOrganization = function(data) {
                        UIFactory
                                .showConfirmDialog({
                                  data: {
                                    headerMessage: 'Confirm delete?'
                                  },
                                  confirm: function() {
                                    return OrganizationService
                                            .removeOrganization(data);
                                  },
                                  onFail: function(response) {
                                    var status = response.status;
                                    if (status != 400) {
                                      var msg = {
                                        404: "Organization has been deleted.",
                                        405: "Organization already in use.",
                                        409: "Organization has been modified."
                                      }
                                      UIFactory
                                              .showFailDialog({
                                                data: {
                                                  headerMessage: 'Delete organization fail.',
                                                  bodyMessage: msg[status]
                                                          ? msg[status]
                                                          : response.errorMessage
                                                },
                                                preCloseCallback: vm.loadData
                                              });
                                    }

                                  },
                                  onSuccess: function(response) {
                                    UIFactory
                                            .showSuccessDialog({
                                              data: {
                                                headerMessage: 'Delete organization success.',
                                                bodyMessage: ''
                                              },
                                              preCloseCallback: vm.loadData
                                            });
                                  }
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