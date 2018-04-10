'use strict';
angular.module('gecscf.transaction').controller(
                'AdjustStatusPopupController',
                [   '$scope','UIFactory','PageNavigation','ViewTransactionService',
            function($scope , UIFactory , PageNavigation , ViewTransactionService) {
                      var vm = this;
                      $scope.errors = undefined;

                      var data = $scope.ngDialogData.data;
                      vm.modeAdjust = $scope.ngDialogData.modeAdjust;
                      vm.model = {
                                organizationCode: null,
                                organizationName: null,
                                taxId: null
                      }

                      vm.hasError = false;

                      var isEmpty = function(data) {
                        return !data || !data.length;
                      }
                      var _isValid = function() {
                        $scope.errors = {};
                        var valid = true;
                        if (isEmpty(vm.model.organizationCode)) {
                          $scope.errors.organizationCode = 'Organization code is required';
                          valid = false;
                        }
                        if (isEmpty(vm.model.organizationName)) {
                          $scope.errors.organizationName = 'Organization name is required';
                          valid = false;
                        }
                        if (isEmpty(vm.model.taxId)) {
                          $scope.errors.taxId = 'TAX ID is required';
                          valid = false;
                        }
                        return valid;
                      }
                      vm.save = function(callback) {
                        if (_isValid()) {
                          var preCloseCallback = function(confirm) {
                            callback();
                            console.log($scope.ngDialogData)
                            $scope.ngDialogData.preCloseCallback(confirm);
                          }
                          UIFactory
                                  .showConfirmDialog({
                                    data: {
                                      headerMessage: 'Confirm save?'
                                    },
                                    confirm: function() {
                                      return $scope.editionMode
                                              ? OrganizationService
                                                      .updateOrganization(vm.model)
                                              : OrganizationService
                                                      .createOrganization(vm.model);
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
                                                    headerMessage: ($scope.editionMode
                                                            ? 'Edit new organization fail.'
                                                            : 'Add new organization fail.'),
                                                    bodyMessage: msg[status]
                                                            ? msg[status]
                                                            : response.errorMessage
                                                  },
                                                  preCloseCallback: preCloseCallback
                                                });
                                      } else {
                                        $scope.errors = {};

                                        $scope.errors[response.data.reference] = response.data.errorMessage;
                                        console.log($scope.errors)
                                      }

                                    },
                                    onSuccess: function(response) {
                                      UIFactory
                                              .showSuccessDialog({
                                                data: {
                                                  headerMessage: ($scope.editionMode
                                                          ? 'Edit organization success.'
                                                          : 'Add new organization success.'),
                                                  bodyMessage: ''
                                                },
                                                preCloseCallback: preCloseCallback(response)
                                              });
                                    }
                                  });
                        }
                      }

                    }]);