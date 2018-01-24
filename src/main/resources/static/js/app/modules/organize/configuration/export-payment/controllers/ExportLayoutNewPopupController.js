'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule
		.controller(
				'ExportLayoutNewPopupController',
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
							vm.dataTypeByIds = [];
							vm.model = {
								ownerId : data.ownerId,
								accountingTransactionType : data.accountingTransactionType,
								displayName: '',
								fileType: 'FIXED_LENGTH',
								charsetName: 'TIS-620',
								processType: 'EXPORT_DOCUMENT' ,
								integrateType: 'EXPORT',
								items: []
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
							
							$scope.confirmSave = function (sponsorLayout) {
								return FileLayoutService.createFileLayout(sponsorLayout.ownerId, sponsorLayout.processType, sponsorLayout.integrateType, sponsorLayout);
							};
							
							var onFail = function (errors) {
								console.log(errors);
							}
							
							vm.save = function(callback) {
								if (_isValid()) {
										var preCloseCallback = function(confirm) {
											callback();
											$scope.ngDialogData.preCloseCallback(confirm);
										}
										UIFactory.showConfirmDialog({
											data: {
												headerMessage: 'Confirm save?'
											},
											confirm: function () {
												return $scope.confirmSave(vm.model)
											},
											onSuccess: function (response) {
												var headerMessage = "Add new file layout complete.";
												UIFactory.showSuccessDialog({
													data: {
														headerMessage: headerMessage,
														bodyMessage: ''
													},
													preCloseCallback : preCloseCallback(response)
												});
											},
											onFail: function (response) {
												if (response.status != 400) {
													var msg = {};
													UIFactory
															.showFailDialog({
																data : {
																	headerMessage : 'Add new file layout fail.',
																	bodyMessage : msg[response.status] 
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
											}
										});
								}
							}

						} ]);