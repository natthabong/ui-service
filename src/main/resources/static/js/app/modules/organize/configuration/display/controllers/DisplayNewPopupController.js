'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule
		.controller(
				'DisplayNewPopupController',
				[
						'$scope',
						'UIFactory',
						'PageNavigation',
						'DisplayService',
						function($scope, UIFactory, PageNavigation,
								DisplayService) {

							var vm = this;
							$scope.errors = undefined;
							
							
							var data = $scope.ngDialogData.data;
							
							var newDisplayConfig = function () {
					            return {
					                documentFieldId: null,
					                sortType: null
					            }
					        }
							
							vm.model = {
								displayName: null,
					            items: [newDisplayConfig()],
					            loanRequestMode: null,
					            documentSelection: null,
					            supplierCodeSelectionMode: null,
					            documentGroupingFields: [],
					            displayNegativeDocument: null,
					            reasonCodeMappingId: null,
					            supportPartial: false,
					            supportSpecialDebit: null
							}
							
							vm.hasError = false;
							
							var _isValid = function() {
								$scope.errors = undefined;
								if (!vm.model.displayName.length) {
									$scope.errors = {'displayName':'Display name is required'};
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
												data : {
													headerMessage : 'Confirm save?'
												},
												confirm : function() {
													//return DisplayService.create(vm.model);
												},
												onFail : function(response) {
													var status = response.status;
													if (status != 400) {
														var msg = {
															404 : "Display document configuration has been deleted."
														}
														UIFactory
																.showFailDialog({
																	data : {
																		headerMessage : 'Add new display document configuration fail.',
																		bodyMessage : msg[status] ? msg[status]
																				: response.errorMessage
																	},
																	preCloseCallback : preCloseCallback
																});
													}
													else{
														$scope.errors = {};
														$scope.errors[response.data.errorCode] = response.data.errorMessage;
													}

												},
												onSuccess : function(response) {
													UIFactory
															.showSuccessDialog({
																data : {
																	headerMessage : 'Add new display document configuration success.',
																	bodyMessage : ''
																},
																preCloseCallback : preCloseCallback(response)
															});
												}
											});
								}
							}

						} ]);