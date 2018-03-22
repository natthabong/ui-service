'use strict';
var module = angular.module('gecscf.fundingProfile');
module
        .controller(
                'FundingProfilePopupController',
                [
                    '$scope',
                    'UIFactory',
                    'PageNavigation',
                    'FundingProfileService',
                    function($scope, UIFactory, PageNavigation,
                    		FundingProfileService) {

                      var vm = this;
                      $scope.errors = undefined;

                      var data = $scope.ngDialogData.data;
                      $scope.editionMode = $scope.ngDialogData.editionMode;
                      vm.model = $scope.editionMode ? $scope.ngDialogData.model
                              : {
                            	fundingCode: null,
                                fundingName: null,
                                taxId: null,
                                contact: {
                                	name: null,
                                	email: null
                                },
                                creditPendingMethod: 'AT_GEC'
                              }

                      vm.hasError = false;

                      var isEmpty = function(data) {
                        return !data || !data.length;
                      }
                      var _isValid = function() {
                        $scope.errors = {};
                        var valid = true;
                        if (isEmpty(vm.model.fundingCode)) {
                          $scope.errors.fundingCode = 'Funding code is required';
                          valid = false;
                        }
                        if (isEmpty(vm.model.fundingName)) {
                          $scope.errors.fundingName = 'Funding name is required';
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
                                              ? FundingProfileService
                                                      .updateFundingProfile(vm.model)
                                              : FundingProfileService
                                                      .createFundingProfile(vm.model);
                                    },
                                    onFail: function(response) {
                                      var status = response.status;
                                      if (status != 400) {
                                        var msg = {
                                          404: "Funding profile has been deleted."
                                        }
                                        UIFactory
                                                .showFailDialog({
                                                  data: {
                                                    headerMessage: ($scope.editionMode
                                                            ? 'Edit new funding profile fail.'
                                                            : 'Add new funding profile fail.'),
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
                                                          ? 'Edit funding profile success.'
                                                          : 'Add new funding profile success.'),
                                                  bodyMessage: ''
                                                },
                                                preCloseCallback: preCloseCallback(response)
                                              });
                                    }
                                  });
                        }
                      }

                    }]);