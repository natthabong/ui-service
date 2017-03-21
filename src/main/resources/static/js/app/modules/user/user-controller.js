'use strict';
var scfApp = angular.module('scfApp');
scfApp
	.controller(
		'UserController',
		[
			'$scope',
			'$stateParams',
			'$log',
			'$q',
			'$rootScope',
			'$http',
			'Service',
			'ngDialog',
			'SCFCommonService',
			'UIFactory',
			'PagingController',
			function($scope, $stateParams, $log, $q, $rootScope,
				$http, Service, ngDialog, SCFCommonService,
				UIFactory, PagingController) {

			    var vm = this;
			    var log = $log;
			    $scope.errors = {};
			    $scope.user = {
				activeDate: new Date()
			    };
			    vm.dataTable = {
				columns : [
					{
					    fieldName : 'organize',
					    labelEN : 'Organize',
					    labelTH : 'Organize',
					    id : '{value}-organize',
					    sortable : false,
					    cssTemplate : 'text-right'
					},
					{
					    fieldName : 'role',
					    labelEN : 'Role',
					    labelTH : 'Role',
					    id : '{value}-role',
					    sortable : false,
					    cssTemplate : 'text-right'
					},
					{
					    cssTemplate : 'text-center',
					    sortable : false,
					    cellTemplate : '<scf-button ng-disabled="true" class="btn-default gec-btn-action" id="{{data.organizeId}}-profile-button" ng-click="" title=""><i class="fa fa-trash" aria-hidden="true"></i></scf-button>'
					} ]
			    };

			    vm.openBirthDate = false;
			    vm.openCalendarBirthDate = function() {
				vm.openBirthDate = true;
			    };
			    vm.openActiveDate = false;
			    vm.openCalendarActiveDate = function() {
				vm.openActiveDate = true;
			    };
			    vm.openExpireDate = false;
			    vm.openCalendarExpireDate = function() {
				vm.openExpireDate = true;
			    };
			    vm.isUseExpireDate = false;

			    $scope.addRole = function() {
				ngDialog.open({
				    template : '/user-organize',
				    scope : $scope,
				    disableAnimation : true
				});
			    }

			    vm.organizeLinks = [];

			    vm.pagingController = PagingController
				    .create(vm.organizeLinks);

			    vm.search = function(pageModel) {
				vm.pagingController.search(pageModel);
			    }
			    var isRequire = function(data) {
				return (data == '' || data == null);
			    }

			    $scope.save = function() {
				var user = $scope.user;
				console.log(user);
				if (validate(user)) {

				}
			    }

			    var validate = function(user) {
				$scope.errors = {};
				var valid = true;
				if (isRequire(user.firstName)) {
				    valid = false;
				    $scope.errors.firstName = {
					message : 'First name is required.'
				    }
				}
				if (isRequire(user.lastName)) {
				    valid = false;
				    $scope.errors.lastName = {
					message : 'Last name is required.'
				    }
				}

				if (isRequire(user.displayName)) {
				    valid = false;
				    $scope.errors.displayName = {
					message : 'Display name is required.'
				    }
				}

				if (isRequire(user.loginName)) {
				    valid = false;
				    $scope.errors.loginName = {
					message : 'Login name is required.'
				    }
				}
				if (isRequire(user.email)) {
				    valid = false;
				    $scope.errors.email = {
					message : 'e-mail is required.'
				    }
				}
				if (isRequire(user.birthDate)) {
				    valid = false;
				    $scope.errors.birthDate = {
					message : 'Birth date is required.'
				    }
				}

				if (isRequire(user.activeDate)) {
				    valid = false;
				    $scope.errors.activeDate = {
					message : 'Active date is required.'
				    }
				} else if (!angular.isDate(user.activeDate)) {
				    valid = false;
				    $scope.errors.activeDate = {
					message : 'Wrong date format data.'
				    }
				}

				if (vm.isUseExpireDate) {

				    if (isRequire(user.expiryDate)) {
					valid = false;
					$scope.errors.expiryDate = {
					    message : 'Expiry date is required.'
					}
				    } else if (!angular.isDate(user.expiryDate)) {
					$scope.errors.expiryDate = {
					    message : 'Wrong date format data.'
					}
				    } else if (angular
					    .isDefined(user.activeDate)
					    && user.expiryDate < user.activeDate) {

					$scope.errors.activeDate = {
					    message : 'Active date must be less than or equal to expire date.'
					}
				    }

				}

				if (vm.organizeLinks = null
					|| vm.organizeLinks.length < 1) {
				    $scope.errors.organizeLinks = true
				}
				return valid;
			    }
			    
			    var init = function(){
				vm.search();
			    }();
			} ]);