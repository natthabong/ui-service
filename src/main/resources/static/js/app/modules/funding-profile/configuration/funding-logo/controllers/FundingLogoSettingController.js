angular
	.module('gecscf.fundingProfile.configuration')
	.controller(
		'FundingLogoSettingController', [
			'FundingLogoService',
			'SCFCommonService',
			'$log',
			'$scope',
			'$stateParams',
			'$timeout',
			'$rootScope',
			'PageNavigation',
			'Service',
			'$http',
			'blockUI',
			'ngDialog',
			'$q', 
			'UIFactory', 
			function(FundingLogoService, SCFCommonService, $log, $scope, $stateParams, $timeout, $rootScope,
				PageNavigation, Service, $http, blockUI, ngDialog, $q, UIFactory) {
		
				var vm = this;
				var log = $log;
		
				vm.acceptFileExtention = 'png,jpg,jpeg';
				vm.acceptFileExtentionLabel = 'jpeg, jpg, png';
				vm.showErrorMsg = false;
				vm.showErrorMsgLogo = false;
				vm.manageAll=false;
				vm.fundingLogo = null;
				
				var parameters = PageNavigation.getParameters();
				var fundingId = parameters.fundingId;
				
				vm.fundingInfo = $stateParams.fundingInfo;
				if(vm.fundingInfo == null || angular.isUndefined(vm.fundingInfo)){
					var params = {
						fundingId: fundingId,
						mode: 'EDIT'
					};
					PageNavigation.gotoPage('/customer-registration/funding-profile/config',params);
				}
				var fundingId = vm.fundingInfo.fundingId;
		
				vm.uploadModel = {
			        file: ''
			    };
				
				vm.hasLogo = false;
				
				vm.decodeBase64 = function(data){
					if(data==null||angular.isUndefined(data)){
						vm.hasLogo = false;
						return '';
					}
					vm.hasLogo = true;
					return atob(data);
				}
		
				if (vm.fundingInfo.fundingLogo != null) {
					vm.fundingLogo = vm.decodeBase64(vm.fundingInfo.fundingLogo);
				}
				
				vm.backToSponsorConfigPage = function() {
					var params = {
							fundingId: fundingId,
							mode: 'EDIT'
						};
						PageNavigation.gotoPage('/customer-registration/funding-profile/config',params);
				}
				
				var reader = new FileReader();
				reader.onload = function(){
					blockUI.start();
				}
				
				reader.onloadend = function () {
					var logoBase64 = reader.result;
					var newBase64 = logoBase64.split(",")[1];
					vm.fundingLogo = newBase64;
					vm.hasLogo = true;
					blockUI.stop();
				};
				
				vm.uploadAction = function() {
					vm.showErrorMsg = false;
					vm.showErrorMsgLogo = false;
			        // Validate Form before send upload file
			        if (validateFileUpload(vm.uploadModel, vm.acceptFileExtention)) {
						reader.readAsDataURL(vm.uploadModel.file);
			        }else{
			        	vm.showErrorMsg = true;
			        }
				}

				function _success() {
					UIFactory
					.showSuccessDialog({
					    data : {
						headerMessage : 'Edit logo success.',
						bodyMessage : ''
					    },
					    preCloseCallback : function() {
					    	vm.backToSponsorConfigPage();
					    }
					});
			    }
				
				var closeDialogFail = function(){
					dialogPopup.close();
				}
				
				$scope.save = function(){
					vm.showErrorMsgLogo = false;
					vm.fundingInfo.fundingLogo = vm.fundingLogo;
					
					if(vm.fundingInfo.fundingLogo != null){
						UIFactory.showConfirmDialog({
							data : {
							    headerMessage : 'Confirm save?'
							},
							confirm : FundingLogoService.save(vm.fundingInfo),
							onSuccess : function(response) {
							    blockUI.stop();
							    _success();
							},
							onFail : function(response) {
							    blockUI.stop();
							    dialogPopup = UIFactory.showFailDialog({
									data: {
									    headerMessage: 'Edit logo fail.',
									    bodyMessage: 'Logo has been modified.'
									},
									buttons : [{
										id: 'close-button',
										label: 'Close',
										action:function(){
											closeDialogFail();
										}
									}],
									preCloseCallback: null
								});					
							}
						    });
					} else {
						vm.showErrorMsgLogo = true;
						vm.errorMsgKeyLogo = 'Funding logo is required';
					}
			    }
			    
			    function validateFileUpload(data, acceptFileExtention, errorMsgKey) {
			        var validateResult = true;
			        if (angular.equals(data.file, '')) {
			            validateResult = false;
			            vm.errorMsgKey = 'Upload Msg err';
			        }else if(data.file.size > 1024*1024){
			            log.error('Upload file fail');
			            vm.errorMsgKey = 'Upload filesize err';
			            validateResult = false;
			        } 
			        else {
			            var fileName = data.file.name;
			            var fileSelectExtention = fileName.slice(fileName.lastIndexOf('.') + 1, fileName.length);
			            // Check file extention name exists in acceptFileExtention ?.
			            if (acceptFileExtention.search(fileSelectExtention) < 0) {
			                validateResult = false;
			                vm.errorMsgKey = 'File extension error';
			            }
			        }
			        return validateResult;
			    }
			}
		]
	);