var profileApp = angular.module('gecscf.profile');
profileApp
	.controller(
		'PasswordController',
		[
			'$scope',
			'blockUI',
			'ngDialog',
			'UIFactory',
			'PageNavigation',			
			'PasswordService',
			'$window',
			function($scope, blockUI, ngDialog,
				UIFactory, PageNavigation, PasswordService, $window) {
			    $scope.errors = {};
			    $scope.reset = function() {
				$scope.user = {
				    currentPassword : null,
				    newPassword : null,
				    confirmPassword : null
				}
			    }
			    function _success() {
				UIFactory
					.showSuccessDialog({
					    data : {
						headerMessage : 'Changed password success.',
						bodyMessage : ''
					    },
					    preCloseCallback : function() {
						PageNavigation
							.gotoPage('/dashboard');
					    }
					});
			    }

			    var validate = function(user) {
				$scope.errors = {};
				var valid = true;
				if (user.currentPassword === ''
					|| user.currentPassword === null) {
				    valid = false;
				    $scope.errors.currentPassword = {
					message : 'Current password is required.'
				    }
				}    if (user.confirmPassword === ''
					|| user.confirmPassword === null) {
				    valid = false;
				    $scope.errors.confirmPassword = {
					message : 'Confirm password is required.'
				    }
				} if (user.newPassword === ''
					|| user.newPassword === null) {
				    valid = false;
				    $scope.errors.newPassword = {
					message : 'New password is required.'
				    }
				}else if (user.confirmPassword !== user.newPassword) {
				    valid = false;
				    $scope.errors.newPassword = {
					message : 'New password must same as confirm password.'
				    }
				}
				return valid;
			    }

			    $scope.save = function() {
				// Set the 'submitted' flag to true
				$scope.submitted = true;
				var user = $scope.user;
				if (validate(user)) {
				    UIFactory.showConfirmDialog({
					data : {
					    headerMessage : 'Confirm save?'
					},
					confirm : function() {
					    return $scope.confirmSave(user, null, function(){
						$window.location.href = "/error/403";
					    });
					},
					onSuccess : function(response) {
					    _success();
					},
					onCancel : function(response) {
					    $scope.reset();
					},
					onFail : function(response) {
					}
				    });
				}

			    }
			    $scope.cancel = function() {
				PageNavigation.gotoPage('/dashboard');
			    }

			    $scope.directSave = function(data, callback) {
				if (validate(data)) {
				    $scope.confirmSave(data, function(){ 
					callback();
					goToHome();
				    }, function(){
					$window.location.href = '/login';
				    })
				}
			    }

			    $scope.confirmSave = function(data, callback, failCallbak) {

				blockUI.start();
				var differed = PasswordService.save(data);
				differed.promise.then(function(response) {
				    blockUI.stop();
				    if (callback) {
					callback();
				    }
				}).catch(function(response) {
				    blockUI.stop();
				    if (response) {
					$scope.errors[response.code] = {
					    message : response.message
					};
				    }else{
					failCallbak();
				    }
				});
				return differed;
			    };
			    
			    goToHome = function(){
    		        	AuthenticationService.SetCredentials(self.username, self.password);
    		                $window.location.href = '/';
    		            }

			    var init = function() {
				$scope.reset();
				$scope.passwordPolicies = [];
				var deffered = PasswordService.getPolicies();
				deffered.promise
					.then(function(response) {
					    if (response.data.policyItems != null) {
						$scope.passwordPolicies = response.data.policyItems;
					    }
					});
			    }();

			} ]);

profileApp.factory('PasswordService', [
	'ngDialog',
	'Service',
	function(ngDialog, Service) {

	    // factory function body that constructs shinyNewServiceInstance
	    var saveNewPassword = function(user) {
		var serviceUrl = '/api/v1/users/me/password';
		return Service.doPost(serviceUrl, user);
	    }

	    var getPolicies = function() {

		function _displayPolicy(record) {
		    var displayMessage = record.displayPattern;
		    displayMessage = displayMessage.replace('{1}',
			    record.numericValue1);
		    displayMessage = displayMessage.replace('{2}',
			    record.numericValue2);
		    displayMessage = displayMessage.replace('{3}',
			    record.numericValue3);
		    return displayMessage;
		}

		var deffered = Service.doGet('/api/v1/policies/common', {
		    isPasswordDisplay : true
		});
		deffered.promise.then(function(response) {
		    var policyData = response.data;
		    policyData.policyItems.forEach(function(data) {
			data.displayPolicy = _displayPolicy(data)
		    });
		    deffered.resolve(policyData.policyItems);
		});
		return deffered;
	    }

	    return {
		save : saveNewPassword,
		getPolicies : getPolicies
	    };
	} ]);