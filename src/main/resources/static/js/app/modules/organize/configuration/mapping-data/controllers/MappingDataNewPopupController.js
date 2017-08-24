'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule
		.controller(
				'MappingDataNewPopupController',
				[
						'$scope',
						'UIFactory',
						'PageNavigation',
						'MappingDataService',
						function($scope, UIFactory, PageNavigation,
								MappingDataService) {

							var vm = this;
							$scope.errors = undefined;
							
							
							var data = $scope.ngDialogData.data;
							vm.model = {
								mappingType : 'TEXT_MAPPING',
								ownerId : data.ownerId,
								accountingTransactionType : data.accountingTransactionType,
								mappingDataName: ''
							}

							vm.mappingTypes = [ {
								label : 'Text mapping',
								value : 'TEXT_MAPPING'
							}, {
								label : 'Sign flag mapping',
								value : 'SIGN_FLAG_MAPPING'
							} ]
							
							vm.hasError = false;
							
							var _isValid = function() {
								$scope.errors = undefined;
								if (!vm.model.mappingDataName.length) {
									$scope.errors = {'mappingDataName':'Mapping name is required'};
									return false;
								}
								return true;
							}
							vm.save = function(callback) {
								if (_isValid()) {
									var preCloseCallback = function(confirm) {
										callback();
										$scope.ngDialogData.preCloseCallback();
									}
									UIFactory
											.showConfirmDialog({
												data : {
													headerMessage : 'Confirm save?'
												},
												confirm : function() {
													return MappingDataService
															.create(vm.model);
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
																		headerMessage : 'Add new mapping data fail.',
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
																	headerMessage : 'Add new mapping data success.',
																	bodyMessage : ''
																},
																preCloseCallback : preCloseCallback
															});
												}
											});
								}
							}

						} ]);