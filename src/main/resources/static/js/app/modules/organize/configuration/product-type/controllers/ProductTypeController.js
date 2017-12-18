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
							vm.model = {
								organizeId : params.organizeId
							};

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

							vm.save = function() {
								if (_validate(vm.model)) {
									var preCloseCallback = function(confirm) {
										PageNavigation.gotoPreviousPage(true);
									}

									UIFactory
											.showConfirmDialog({
												data : {
													headerMessage : 'Confirm save?'
												},
												confirm : function() {
													return ProductTypeService
															.createProductType(vm.model);
												},
												onFail : function(response) {
													if (response.status != 400) {
														var msg = {
														};
														UIFactory
															.showFailDialog({
																data: {
																	headerMessage: 'Add new account fail.',
																	bodyMessage: msg[response.status] ? msg[response.status]
																		: response.data.message
																},
																preCloseCallback: preCloseCallback
															});
													}
												},
												onSuccess : function(response) {
													UIFactory
															.showSuccessDialog({
																data : {
																	headerMessage : vm.isNewMode ? 'Add new role success.'
																			: 'Edit role complete.',
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
