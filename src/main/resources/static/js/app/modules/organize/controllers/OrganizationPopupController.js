'use strict';
var tpModule = angular.module('gecscf.organize');
tpModule
        .controller(
                'OrganizationPopupController',
                [
                    '$scope',
                    'UIFactory',
                    'PageNavigation',
                    'OrganizationService',
                    function($scope, UIFactory, PageNavigation,
                            OrganizationService) {

                      var vm = this;
                      $scope.errors = undefined;

                      var data = $scope.ngDialogData.data;
                      vm.model = {
                        organizationCode: null,
                        organizationName: null,
                        taxId: null
                      }

                      vm.hasError = false;

                      var _isValid = function() {
                        $scope.errors = undefined;
                        if (!vm.model.organizationCode.length) {
                          $scope.errors = {
                            'organizationCode': 'Organization code is required'
                          };
                          return false;
                        }
                        if (!vm.model.organizationName.length) {
                          $scope.errors = {
                            'organizationName': 'Organization name is required'
                          };
                          return false;
                        }
                        if (!vm.model.taxId.length) {
                          $scope.errors = {
                            'taxId': 'TAX ID is required'
                          };
                          return false;
                        }
                        return true;
                      }
                      vm.save = function(callback) {
                        if (_isValid()) {
                          var preCloseCallback = function(confirm) {
                            callback();
                            $scope.ngDialogData.preCloseCallback(confirm);
                          }
                          UIFactory
                                  .showConfirmDialog({
                                    data: {
                                      headerMessage: 'Confirm save?'
                                    },
                                    confirm: function() {
                                      return OrganizationService
                                              .create(vm.model);
                                    },
                                    onFail: function(response) {
                                      var status = response.status;
                                      if (status != 400) {
                                        var msg = {
                                          404: "Organization has been deleted."
                                        }
                                        UIFactory
                                                .showFailDialog({
                                                  data: {
                                                    headerMessage: 'Add new organization fail.',
                                                    bodyMessage: msg[status]
                                                            ? msg[status]
                                                            : response.errorMessage
                                                  },
                                                  preCloseCallback: preCloseCallback
                                                });
                                      } else {
                                        $scope.errors = {};
                                        $scope.errors[response.data.reference] = response.data.errorMessage;
                                      }

                                    },
                                    onSuccess: function(response) {
                                      UIFactory
                                              .showSuccessDialog({
                                                data: {
                                                  headerMessage: 'Add new organization success.',
                                                  bodyMessage: ''
                                                },
                                                preCloseCallback: preCloseCallback(response)
                                              });
                                    }
                                  });
                        }
                      }

                    }]);