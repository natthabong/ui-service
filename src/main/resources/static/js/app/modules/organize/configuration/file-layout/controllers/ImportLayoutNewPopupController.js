'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule
		.controller(
				'ImportLayoutNewPopupController',
				[
						'$scope',
						'UIFactory',
						'PageNavigation',
						'FileLayoutService',
						function($scope, UIFactory, PageNavigation,
								FileLayoutService) {

							var vm = this;
							$scope.errors = undefined;
							
							
							var data = $scope.ngDialogData.data;
							vm.dataTypeByIds = {};
							vm.model = {
								ownerId : data.ownerId,
								accountingTransactionType : data.accountingTransactionType,
								displayName: '',
								processType: 'AR_DOCUMENT' ,
								items: {}
							}

							vm.hasError = false;
							
							var _isValid = function() {
								$scope.errors = undefined;
								if (!vm.model.displayName.length) {
									$scope.errors = {'displayName':'Layout name is required'};
									return false;
								}
								return true;
							}
							vm.save = function(callback) {
								if (_isValid()) {
									if (FileLayoutService.validate(sponsorLayout, vm.dataTypeByIds, onFail)) {
										UIFactory.showConfirmDialog({
											data: {
												headerMessage: 'Confirm save?'
											},
											confirm: function () {
												blockUI.start();
												return $scope.confirmSave(sponsorLayout)
											},
											onSuccess: function (response) {
												var headerMessage = "Add new file layout complete.";
												UIFactory.showSuccessDialog({
													data: {
														headerMessage: headerMessage,
														bodyMessage: ''
													},
													preCloseCallback: function () {
														vm.backToSponsorConfigPage();
													}
												});
												blockUI.stop();
											},
											onFail: function (response) {
												if (response.status != 400) {
													var msg = {};
													UIFactory
															.showFailDialog({
																data : {
																	headerMessage : 'Add new file layout fail.',
																	bodyMessage : msg[response.status] ? msg[response.status]
																			: response.data.message
																},
																preCloseCallback : preCloseCallback
															});
												} else {
													$scope.errors = {};
													$scope.errors[response.data.reference] = {
														message : response.data.errorMessage
													}
													
													var errors = {
														duplicateLayoutName : true
													}
													
													onFail(errors)
												}
												blockUI.stop();
											}
										});
									}
								}
							}

						} ]);