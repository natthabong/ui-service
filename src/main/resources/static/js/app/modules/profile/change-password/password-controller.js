var profileApp = angular.module('gecscf.profile');
profileApp
	.controller(
		'PasswordController',
		[
			'$scope',
			'Service',
			'$stateParams',
			'$log',
			'PageNavigation',
			'$state',
			'UIFactory',
			'$http',
			'ngDialog',
			'$rootScope',
			'blockUI',
			function($scope, Service, $stateParams, $log,
				PageNavigation, $state, UIFactory, $http,
				ngDialog, $rootScope, blockUI) {
			    $scope.userId = $rootScope.userInfo.organizeId;

			    $scope.wrongCurrentPassword = false;
			    $scope.wrongNewPassword = false;
			    $scope.wrongConfirmPassword = false;

			    $scope.model = {
				currentPassword : null,
				newPassword : null,
				confirmPassword : null
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
				displayMessage = displayMessage.replace('{1}',
					record.numericValue1);
				displayMessage = displayMessage.replace('{2}',
					record.numericValue2);
				displayMessage = displayMessage.replace('{3}',
					record.numericValue3);
				return displayMessage;
			    }

			    $scope.passwordPolicies = [];
			    var addPolicies = function(policyData) {
				if (policyData.policyItems.length > 0) {
				    policyData.policyItems.forEach(function(
					    data) {
					var policyConfig = {
					    policyTopic : data.policyTopic,
					    displayPolicy : displayPolicy(data)
					};
					$scope.passwordPolicies
						.push(policyConfig);
				    })
				}

			    }

			    $scope.getPolicies = function(criteria) {
				var deffered = Service.doGet(
					'/api/v1/policies/common', criteria);

				$scope.passwordPolicies = [];
				deffered.promise.then(function(response) {
				    var policyData = response.data;
				    addPolicies(policyData);
				});
			    }

			    var init = function() {
				if (currentMode == mode.PROFILECHANGE) {
				    $scope.isForceChangeMode = false;
				} else {
				    $scope.isForceChangeMode = true;
				}

				var criteria = $scope.policyCriterial;

				$scope.getPolicies(criteria);
			    }

			    init();

			    $scope.currentPasswordErrorMsg = function(record) {
				var msg = '';
				return msg;
			    }

			    $scope.newPasswordErrorMsg = function(record) {
				var msg = '';
				return msg;
			    }

			    $scope.confirmPasswordErrorMsg = function(record) {
				var msg = '';
				return msg;
			    }

			    $scope.cancelChangePassword = function() {
				goToHome();
			    };

			    var preCloseCallback = function() {
				goToHome();
			    }

			    function openSuccessDialog() {
				UIFactory
					.showSuccessDialog({
					    data : {
						headerMessage : 'Changed password success.',
						bodyMessage : ''
					    },
					    preCloseCallback : preCloseCallback
					});

				blockUI.stop();
			    }

			    $scope.saveNewPassword = function() {
				ngDialog
					.open({
					    template : '/js/app/common/dialogs/confirm-save-dialog.html',
					    scope : $scope,
					    data : $scope.model,
					    disableAnimation : true,
					    preCloseCallback : function(value) {
						if (value !== 0) {
						    $scope
							    .confirmSaveNewPassword();
						} else {
						    $scope.model = {
							currentPassword : null,
							newPassword : null,
							confirmPassword : null
						    };
						}
						return true;
					    }
					});
			    };
			    var failedFunc = function(reason) {
				blockUI.stop();
			    }
			    $scope.confirmSaveNewPassword = function() {
				var serviceUrl = '/api/v1/users/'
					+ $scope.userId + '/password';
				var serviceDiferred = Service.requestURL(
					serviceUrl, $scope.model, 'POST');
				blockUI.start();
				serviceDiferred.promise.then(
					function(response) {
					    openSuccessDialog();
					}, failedFunc);
			    };

			    function goToHome() {
				PageNavigation.gotoPage('/dashboard');
			    }
			} ]);

profileApp.factory('ChangePasswordDialog', [ 'ngDialog', function(ngDialog) {

    var create = function() {
	var dlg = ngDialog.open({
	    id : 'force-change-password-dialog',
	    template : '/change-password/force',
	    className : 'ngdialog-theme-default',
//	    controller : 'PasswordController',
//	    controllerAs : 'ctrl',
	    preCloseCallback : function() {
		goToHome();
	    }
	});
	return dlg;
    };
    // factory function body that constructs shinyNewServiceInstance
    return {
	create : create
    };
} ]);