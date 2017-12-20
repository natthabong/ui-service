'use strict';
var ptModule = angular.module('gecscf.organize.configuration.productType');
ptModule
		.controller(
				'ProductTypeController',
				[
						'$scope',
						'PageNavigation',
						'UIFactory',
						'ProductTypeService',
						function($scope, PageNavigation, UIFactory,
								ProductTypeService) {

							var vm = this;

							var params = PageNavigation.getParameters();
							vm.editMode = params.productType != null;

							vm.model = {
								organizeId : params.organizeId
							};

							var init = function() {
								if (vm.editMode) {
									var deffered = ProductTypeService
											.getProductType(params.organizeId,
													params.productType)
									deffered.promise.then(function(response) {
										vm.model = response.data;
									});

								}
							}();

							vm.errors = {};

							var isBlank = function(text) {
								return !angular.isDefined(text) || text == null
										|| text == ''
							}

							var _validate = function(data) {
								$scope.errors = {};
								var valid = true;

								if (isBlank(data.productType)) {
									valid = false;
									$scope.errors.productType = {
										message : 'Product type is required.'
									}

								}

								if (isBlank(data.displayName)) {
									valid = false;
									$scope.errors.displayName = {
										message : 'Display name is required.'
									}

								}
								return valid;
							}
							vm.cancel = function() {
								PageNavigation.gotoPreviousPage(false);
							}
							vm.save = function() {
								if (_validate(vm.model)) {
									var preCloseCallback = function(confirm) {
										PageNavigation.gotoPreviousPage(false);
									}

									UIFactory
											.showConfirmDialog({
												data : {
													headerMessage : 'Confirm save?'
												},
												confirm : function() {
													return vm.editMode ? ProductTypeService
															.updateProductType(vm.model)
															: ProductTypeService
																	.createProductType(vm.model);
												},
												onFail : function(response) {
													if (response.status != 400) {
														var msg = {};
														UIFactory
																.showFailDialog({
																	data : {
																		headerMessage : vm.editMode ? 'Edit product type fail.'
																				: 'Add new product type fail.',
																		bodyMessage : msg[response.status] ? msg[response.status]
																				: response.data.message
																	},
																	preCloseCallback : preCloseCallback
																});
													} else {
														console.log(response);
														$scope.errors = {};
														for (var i = 0; i < response.data.length; i++) { 
															$scope.errors[response.data[i].reference] = {
																	message : response.data[i].errorMessage
															}
														}
//														$scope.errors[response.data.reference] = {
//															message : response.data.errorMessage
//														}
														console
																.log($scope.errors)
													}
												},
												onSuccess : function(response) {
													UIFactory
															.showSuccessDialog({
																data : {
																	headerMessage : vm.editMode ? 'Edit product type complete.'
																			: 'Add new product type success.',
																	bodyMessage : ''
																},
																preCloseCallback : preCloseCallback
															});
												}
											});
								} else {
									console.log('Invalidate data for save');
								}
							}

						} ]);
