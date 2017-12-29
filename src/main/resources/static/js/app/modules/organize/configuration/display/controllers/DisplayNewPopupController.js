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
						function($scope, UIFactory, PageNavigation,	DisplayService) {

							var vm = this;
							$scope.errors = undefined;
							
							
							var data = $scope.ngDialogData.data;
							var ownerId = data.ownerId;
					        vm.accountingTransactionType = data.accountingTransactionType;
					        var displayMode = data.displayMode;
					        console.log(displayMode);
					        vm.modeCreateDisplay = true;
					        if(displayMode == 'DOCUMENT'){
					        	vm.modeCreateDisplay = false;
					        }
					        console.log(vm.modeCreateDisplay);
					        
							vm.model = {
								displayName: null,
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
							
													
							var onFail = function (errors) {
					            $scope.errors = errors;
					        }
							
							vm.save = function(callback) {
								var preCloseCallback = function(confirm) {
										callback();
										$scope.ngDialogData.preCloseCallback(confirm);
								}
								if (vm.model.displayName == null) {
									var errors = {
										requireLayoutName : true
									}
									onFail(errors)
								} else {
									UIFactory
											.showConfirmDialog({
												data : {
													headerMessage : 'Confirm save?'
												},
												confirm : function() {
													 return	 DisplayService.create(ownerId, vm.accountingTransactionType, displayMode, vm.model);
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
													} else {
														$scope.errors = {};
														$scope.errors[response.data.errorCode] = response.data.errorMessage;
														
														var errors = {
							                                    duplicateLayoutName: true
							                                }

							                            onFail(errors)
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