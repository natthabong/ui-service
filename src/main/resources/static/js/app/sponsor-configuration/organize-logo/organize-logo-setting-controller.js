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
			function(SCFCommonService, $log, $scope, $stateParams, $timeout, $rootScope,
				PageNavigation, Service, $http, blockUI, ngDialog, $q) {
		
				var vm = this;
				var log = $log;
		
				vm.acceptFileExtention = 'png,jpg,jpeg,gif';
				vm.showErrorMsg = false;
				vm.manageAll=false;
				
				var sponsorId = $rootScope.sponsorId;
		
				vm.organizeInfo = $stateParams.organizeInfo;
				var organizeId = vm.organizeInfo.organizeId;
		
				vm.uploadModel = {
			        file: ''
			    };
				
				vm.hasLogo = false;
				
				vm.decodeBase64 = function(data){
					if(angular.isUndefined(data)){
						vm.hasLogo = false;
						return '';
					}
					vm.hasLogo = true;
					return atob(data);
				}
		
				vm.backToSponsorConfigPage = function() {
					PageNavigation.gotoPreviousPage();
				}
		
				vm.uploadAction = function() {
					vm.showErrorMsg = false;
			        // Validate Form before send upload file
			        if (!validateFileUpload(vm.uploadModel, vm.acceptFileExtention)) {
			        	vm.showErrorMsg = true;
			        }
				}
				
				vm.save = function() {
					var serviceUrl = 'api/v1/organize-customers/' + organizeId;
					var serviceDiferred = Service.requestURL(serviceUrl, vm.model, 'PUT');
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
			            var fileSelectExtention = fileName.slice(fileName.lastIndexOf('.'), fileName.length);
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