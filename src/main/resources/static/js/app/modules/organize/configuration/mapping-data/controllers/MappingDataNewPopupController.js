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
								mappingType : data.showAll? 'TEXT_MAPPING' : 'TEXT_MAPPING_WITH_DEFAULT',
								ownerId : data.ownerId,
								accountingTransactionType : data.accountingTransactionType,
								mappingDataName: ''
							}

							if(data.showAll){
								vm.mappingTypes = [ {
									label : 'Text mapping',
									value : 'TEXT_MAPPING'
								}, {
									label : 'Text mapping with default',
									value : 'TEXT_MAPPING_WITH_DEFAULT'
								}, {
									label : 'Sign flag mapping',
									value : 'SIGN_FLAG_MAPPING'
								} ]
							}else{
								vm.mappingTypes = [ {
									label : 'Text mapping with default',
									value : 'TEXT_MAPPING_WITH_DEFAULT'
								} ]
							}
							
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
										$scope.ngDialogData.preCloseCallback(confirm);
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
																preCloseCallback : preCloseCallback(response)
															});
												}
											});
								}
							}

						} ]);