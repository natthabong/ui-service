var importChannelModule = angular
        .module('gecscf.organize.configuration.channel.import');
importChannelModule
        .controller(
                'ImportChannelNewPopupController',
                [
                    '$scope',
                    'UIFactory',
                    'PageNavigation',
                    'ImportChannelService',
                    function($scope, UIFactory, PageNavigation,
                            ImportChannelService) {

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
                        processType: data.processType,
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
                                    return ImportChannelService
                                            .create(vm.model);
                                  },
                                  onFail: function(response) {
                                    var status = response.status;
                                    if (status != 400) {
                                      var msg = {
                                        404: "Import channel has been deleted."
                                      }
                                      UIFactory
                                              .showFailDialog({
                                                data: {
                                                  headerMessage: 'Add new import channel fail.',
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
                                                headerMessage: 'Add new import channel success.',
                                                bodyMessage: ''
                                              },
                                              preCloseCallback: preCloseCallback(response)
                                            });
                                  }
                                });
                      }

                    }]);