'use strict';
var app = angular.module('gecscf.organize.configuration.channel.export');
app
        .controller(
                'ExportChannelNewPopupController',
                [
                    '$scope',
                    'UIFactory',
                    'PageNavigation',
                    'ExportChannelService',
                    function($scope, UIFactory, PageNavigation,
                            ExportChannelService) {

                      var vm = this;
                      $scope.errors = undefined;

                      vm.newChannelDropdown = [{
                        label: 'FTP',
                        value: 'FTP'
                      }, {
                        label: 'Web',
                        value: 'WEB'
                      }];

                      var data = $scope.ngDialogData.data;
                      vm.model = {
                        organizeId: data.organizeId,
                        channelType: data.channelType
                      }
                      vm.save = function(callback) {
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
                                    return ExportChannelService
                                            .create(vm.model);
                                  },
                                  onFail: function(response) {
                                    var status = response.status;
                                    if (status != 400) {
                                      var msg = {
                                        404: "Export channel has been deleted."
                                      }
                                      UIFactory
                                              .showFailDialog({
                                                data: {
                                                  headerMessage: 'Add new export channel fail.',
                                                  bodyMessage: msg[status]
                                                          ? msg[status]
                                                          : response.errorMessage
                                                },
                                                preCloseCallback: preCloseCallback
                                              });
                                    } else {
                                      $scope.errors = {};
                                      $scope.errors[response.data.errorCode] = response.data.errorMessage;
                                    }

                                  },
                                  onSuccess: function(response) {
                                    UIFactory
                                            .showSuccessDialog({
                                              data: {
                                                headerMessage: 'Add new mapping data success.',
                                                bodyMessage: ''
                                              },
                                              preCloseCallback: preCloseCallback(response)
                                            });
                                  }
                                });
                      }

                    }]);