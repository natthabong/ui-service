var profileApp = angular.module('gecscf.profile');
profileApp
	.controller(
		'PasswordController',
		[
			'$scope',
			'blockUI',
			'ngDialog',
			'PageNavigation',
			'UIFactory',
			'PasswordService',
			function($scope, blockUI, ngDialog, PageNavigation,
				UIFactory, PasswordService) {
			    
			    $scope.reset = function() {
				$scope.user = {
				    currentPassword : null,
				    newPassword : null,
				    confirmPassword : null
				}
			    }

			    $scope.save = function() {
				// Set the 'submitted' flag to true
				$scope.submitted = true;
				var user = $scope.user;
				ngDialog
					.open({
					    template : '/js/app/common/dialogs/confirm-save-dialog.html',
					    scope : $scope,
					    data : user,
					    disableAnimation : true,
					    preCloseCallback : function(value) {
						if (value !== 0) {
						    $scope.confirmSave(user);
						} else {
						    $scope.reset();
						}
						return true;
					    }
					});

			    }

			    $scope.confirmSave = function(data, callback) {

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

				blockUI.start();
				console.log(data);
				var differed = PasswordService.save(data);
				differed.promise.then(function(response) {
				    blockUI.stop();
				    if (callback) {
					callback();
				    } else {
					_success();
				    }
				}, function(response) {
				    blockUI.stop();
				    if (callback) {
					callback();
				    }
				});
			    };

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