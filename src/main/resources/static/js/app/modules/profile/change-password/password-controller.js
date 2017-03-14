angular.module('scfApp').controller(
	'PasswordController',
	[
		'$scope',
		'Service',
		'$stateParams',
		'$log',
		'SCFCommonService',
		'PagingController',
		'PageNavigation',
		'$state',
		'UIFactory',
		'$http',
		'ngDialog',
		'$rootScope', 
		'blockUI',
		function($scope, Service, $stateParams, $log, SCFCommonService, PagingController, PageNavigation, $state, UIFactory, $http, ngDialog, $rootScope, blockUI) {
			$scope.userId = $rootScope.userInfo.userId;
			
			$scope.wrongCurrentPassword = false;
			$scope.wrongNewPassword = false;
			$scope.wrongConfirmPassword = false;
			
			$scope.model = {
				currentPassword: null,
				newPassword: null,
				confirmPassword: null
			}
			
			$scope.policyCriterial = {
		    	isPasswordDisplay : true
			}
		    
		    var mode = {
				PROFILECHANGE : 'profileChange',
				FORCECHANGE : 'forceChange'
			}
		    
		    var currentMode = $stateParams.mode;
		    
		    function displayPolicy(record) {
				var displayMessage = record.displayPattern;
				displayMessage = displayMessage.replace('{1}', record.numericValue1);
				displayMessage = displayMessage.replace('{2}', record.numericValue2);
				displayMessage = displayMessage.replace('{3}', record.numericValue3);
				return displayMessage;
			}
		    
		    $scope.passwordPolicies = [];
		    var addPolicies = function(policyData) {
				if (policyData.policyItems.length > 0) {
					policyData.policyItems.forEach(function(data) {
						var policyConfig = {
			    			policyTopic: data.policyTopic,
				    		displayPolicy: displayPolicy(data)
						};
						$scope.passwordPolicies.push(policyConfig);
					})
				}
				
			}
		    
		    $scope.getPolicies = function(criteria) {
				var deffered = Service.doGet('/api/v1/policies/common',
					criteria);
				
				$scope.passwordPolicies = [];
				deffered.promise.then(function(response) {
					var policyData = response.data;
					addPolicies(policyData);
				});
		    }
		    
		    var init = function() {
		    	if (currentMode == mode.PROFILECHANGE) {
		    		$scope.isForceChangeMode = false;
				}else{
					$scope.isForceChangeMode = true;
				}
		    	
		    	var criteria = $scope.policyCriterial;
		    	
		    	$scope.getPolicies(criteria);
		    }
		    
		    init();
		    
		    $scope.cancelChangePassword = function() {
		    	goToHome();
		    };
		    
		    var preCloseCallback = function() {
		    	goToHome();
    		}
		    
		    function openSuccessDialog(){
		    	UIFactory.showSuccessDialog({
					data : {
						headerMessage : 'Changed password success.',
						bodyMessage : ''
					},
					preCloseCallback : preCloseCallback
				});
		    	
		    	blockUI.stop();
		    }
		    
		    var isValidateCriteriaPass = function() {
				var isValidatePass = true;
				$scope.wrongCurrentPassword = false;
				$scope.wrongNewPassword = false;
				$scope.wrongConfirmPassword = false;
				
				if($scope.model.currentPassword==null||$scope.model.currentPassword===''){
					$scope.wrongCurrentPassword = true;
					$scope.currentPasswordErrorMsg = 'Current password is required.';
					isValidatePass = false;
				}
				if($scope.model.newPassword==null||$scope.model.newPassword===''){
					$scope.wrongNewPassword = true;
					$scope.newPasswordErrorMsg = 'New password is required.';
					isValidatePass = false;
				}
				if($scope.model.confirmPassword==null||$scope.model.confirmPassword===''){
					$scope.wrongConfirmPassword = true;
					$scope.confirmPasswordErrorMsg = 'Comfirm password is required.';
					isValidatePass = false;
				}
				if($scope.model.newPassword!==$scope.model.confirmPassword){
					$scope.wrongNewPassword = true;
					$scope.newPasswordErrorMsg = 'New password must same as confirm password.';
					isValidatePass = false;
				}
				return isValidatePass;
		    }
		    
		    $scope.saveNewPassword = function() {
		    	if(isValidateCriteriaPass()){
					ngDialog.open({
						template : '/js/app/common/dialogs/confirm-save-dialog.html',
						scope : $scope,
						data : $scope.model,
						disableAnimation : true,
						preCloseCallback : function(value) {
							if (value !== 0) {
								$scope.confirmSaveNewPassword();
							}else{
								$scope.model = {
									currentPassword: null,
									newPassword: null,
									confirmPassword: null
								};
							}
							return true;
						}
					});
		    	}
			};
			
			$scope.confirmSaveNewPassword = function() {
				var serviceUrl = '/api/v1/users/' + $scope.userId + '/password';
				var serviceDiferred = Service.requestURL(serviceUrl, $scope.model, 'POST');
				blockUI.start();
				serviceDiferred.promise.then(function(response) {
					if(!angular.isUndefined(response.message)){
						$scope.wrongCurrentPassword = true;
						$scope.currentPasswordErrorMsg = response.message;
					}else{
						openSuccessDialog();
					}
					blockUI.stop();
				});
			};
			
			function goToHome(){
				PageNavigation.gotoPage('/dashboard' );
			}
		} ]);