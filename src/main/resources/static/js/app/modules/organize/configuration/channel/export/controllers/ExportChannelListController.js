'use strict';
var exportChannelModule = angular
        .module('gecscf.organize.configuration.channel.export');
exportChannelModule
        .controller(
                'ExportChannelListController',
                [
                    '$log',
                    '$scope',
                    '$state',
                    '$stateParams',
                    'UIFactory',
                    'ngDialog',
                    'PagingController',
                    'PageNavigation',
                    'ConfigurationUtils',
                    'ExportChannelService',
                    function($log, $scope, $state, $stateParams, UIFactory, ngDialog,
                            PagingController, PageNavigation,
                            ConfigurationUtils , ExportChannelService) {

                      var vm = this;
                      vm.organizeId = $stateParams.organizeId || null;
                      vm.criteria = $stateParams.criteria || {};
                      vm.pagingController = PagingController.create(
                              '/api/v1/organize-customers/' + vm.organizeId
                                      + '/export-channels', vm.criteria, 'GET');

                      vm.search = function(pageModel) {
                        vm.pagingController.search(pageModel, function(
                                criteriaData, response) {
                        });
                      }

                      vm.newChannel = function(callback) {
                        ConfigurationUtils.showCreateExportChannelDialog({
                          data: {
                            organizeId: ownerId,
                            channelType: 'WEB',
                            showAll: true
                          },
                          preCloseCallback: function() {
                            callback();
                          }
                        });
                      }
                      vm.newExportChannel = function(callback) {
                        ConfigurationUtils.showCreateExportChannelDialog({
                          data: {
                            organizeId: vm.organizeId,
                            channelType: 'WEB',
                            showAll: true
                          },
                          preCloseCallback: function() {
                            callback();
                          }
                        });
                      }

                      $scope.disableTestConnection = function(data) {
                        return data.channelType == 'WEB';
                      }
                      vm.testConnection = function(data) {
                        vm.serviceInfo = {
                          status: 'loading',
                          errorMessage: ''
                        };

                        var testConnectionDialog = ngDialog
                                .open({
                                  id: 'test-connection-result-dialog',
                                  template: 'js/app/sponsor-configuration/dialog-test-connection-result.html',
                                  className: 'ngdialog-theme-default',
                                  controller: 'TestConnectionResultController',
                                  controllerAs: 'ctrl',
                                  scope: $scope,
                                  data: {
                                    serviceInfo: vm.serviceInfo,
                                    data: data
                                  },
                                  preCloseCallback: function(value) {

                                  }
                                });
                      }

                      vm.editExportChannel = function(data) {
                        var params = {
                          channelId: data.channelId,
                          organizeId: vm.organizeId
                        };
                        PageNavigation.gotoPage(
                                '/customer-organize/export-channels/config',
                                params, {
                                  organizeId: vm.organizeId
                                });
                      }
                      
                      vm.deleteExportChannel = function(data) {
							UIFactory
									.showConfirmDialog({
										data : {
											headerMessage : 'Confirm delete?'
										},
										confirm : function() {
											return ExportChannelService
													.remove(data);
										},
										onFail : function(response) {
											var status = response.status;
											if (status != 400) {
												var msg = {
													404 : "Mapping data has been deleted."
												}
												UIFactory
														.showFailDialog({
															data : {
																headerMessage : 'Delete mapping data fail.',
																bodyMessage : msg[status] ? msg[status]
																		: response.errorMessage
															},
															preCloseCallback : loadData
														});
											}

										},
										onSuccess : function(response) {
											UIFactory
													.showSuccessDialog({
														data : {
															headerMessage : 'Delete mapping data success.',
															bodyMessage : ''
														},
														preCloseCallback : loadData
													});
										}
									});
						}
                      
                      var loadData = function() {
                    	  vm.search();
					  }

                      var initLoad = function() {
                        vm.search();
                      }();

                    }]);