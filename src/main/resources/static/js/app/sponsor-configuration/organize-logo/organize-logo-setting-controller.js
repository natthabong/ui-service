angular
	.module('scfApp')
	.controller(
		'OrganizeLogoSettingController', [
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
			function(SCFCommonService, $log, $scope, $stateParams, $timeout, $rootScope,
				PageNavigation, Service, $http, blockUI, ngDialog, $q, UIFactory) {
		
				var vm = this;
				var log = $log;
		
				vm.acceptFileExtention = 'png,jpg,jpeg,gif';
				vm.showErrorMsg = false;
				vm.showErrorMsgLogo = false;
				vm.manageAll=false;
				vm.sponsorLogo = null;
				
				var sponsorId = $rootScope.sponsorId;
		
				vm.organizeInfo = $stateParams.organizeInfo;
				var organizeId = vm.organizeInfo.organizeId;
		
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
					console.log("==========================");
					return atob(data);
				}
		
				if(vm.organizeInfo.organizeLogo!=null){
					vm.sponsorLogo = vm.decodeBase64(vm.organizeInfo.organizeLogo);
				}
				
				vm.backToSponsorConfigPage = function() {
					PageNavigation.gotoPreviousPage();
				}
		
				vm.uploadAction = function() {
					vm.showErrorMsg = false;
					vm.showErrorMsgLogo = false;
			        // Validate Form before send upload file
			        if (validateFileUpload(vm.uploadModel, vm.acceptFileExtention)) {
//			        	console.log(vm.uploadModel.file);
			        	var reader = new FileReader();
						reader.readAsDataURL(vm.uploadModel.file);
						reader.onloadend = function () {
							var logoBase64 = reader.result;
//							document.getElementById(vm.organizeInfo.organizeId+"-organize-logo").src = reader.result;
							var newBase64 = logoBase64.split(",")[1];
							vm.sponsorLogo = newBase64;
							console.log(vm.sponsorLogo);
							vm.hasLogo = true;
						};
			        }else{
			        	vm.showErrorMsg = true;
			        }
				}
				
				vm.save = function() {
					vm.organizeInfo.organizeLogo = vm.sponsorLogo;
					
					var serviceUrl = 'api/v1/organize-customers/' + organizeId;
					var serviceDiferred = Service.requestURL(serviceUrl, vm.organizeInfo, 'PUT');
					blockUI.start();
					serviceDiferred.promise.then(function(response) {
						vm.backToSponsorConfigPage();
						blockUI.stop();
					});
				};
				
				function _success() {
					UIFactory
					.showSuccessDialog({
					    data : {
						headerMessage : 'Update logo success.',
						bodyMessage : ''
					    },
					    preCloseCallback : function() {
					    	vm.backToSponsorConfigPage();
					    }
					});
			    }
				
				$scope.save = function(){
					vm.showErrorMsgLogo = false;
					vm.organizeInfo.organizeLogo = vm.sponsorLogo;
					
					if(vm.organizeInfo.organizeLogo!=null){
						UIFactory.showConfirmDialog({
							data : {
							    headerMessage : 'Confirm save?'
							},
							confirm : $scope.confirmSave,
							onSuccess : function(response) {
							    blockUI.stop();
							    _success();
							},
							onFail : function(response) {
							    blockUI.stop();
							}
						    });
					}else{
						vm.showErrorMsgLogo = true;
						vm.errorMsgKey = 'Organize logo is required';
					}
			    }
			    
			    $scope.confirmSave = function() { 
					var serviceUrl = 'api/v1/organize-customers/' + organizeId;
					var serviceDiferred = Service.requestURL(serviceUrl, vm.model, 'PUT');
					return serviceDiferred;
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
			            var fileSelectExtention = fileName.slice(fileName.lastIndexOf('.')+1, fileName.length);
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