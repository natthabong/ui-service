'use strict';
var userModule = angular.module('gecscf.user');
userModule
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
			'PageNavigation',
			'PagingController',
			function($scope, $stateParams, $log, $q, $rootScope,
				$http, Service, ngDialog, SCFCommonService,
				UIFactory, PageNavigation, PagingController) {

			    var vm = this;
			    var log = $log;
			    $scope.errors = {};
			    $scope.user = {
				activeDate : new Date()
			    };
			    vm.organizeLinks = [];
			    vm.dataTable = {
				columns : [
					{
					    fieldName : 'organize',
					    labelEN : 'Organize',
					    labelTH : 'Organize',
					    idTemplate : 'organize-{value}',
					    idValueField : '$rowNo',
					    sortable : false,
					    cssTemplate : 'text-left',
					    renderer : function(rowNo, record) {
						var val = undefined;
						if (record != null) {
						    val = angular
							    .isDefined(record.organize) ? [
							    record.organize.organizeId,
							    record.organize.organizeName ]
							    .join(': ')
							    : '';
						} else {
						    val = rowNo;
						}
						return val;
					    }
					},
					{
					    fieldName : 'role',
					    labelEN : 'Role',
					    labelTH : 'Role',
					    idTemplate : 'role-{value}',
					    idValueField : '$rowNo',
					    sortable : false,
					    cssTemplate : 'text-left',
					    renderer : function(rowNo, record) {
						var val = undefined;
						if (record != null) {
						    val = angular
							    .isDefined(record.role) ? record.role.roleName
							    : '';
						} else {
						    val = rowNo;
						}
						return val;
					    }
					},
					{
					    cssTemplate : 'text-center',
					    sortable : false,
					    cellTemplate : '<scf-button class="btn-default gec-btn-action" id="{{data.organizeId}}-profile-button" ng-click="deleteRole(data)" title="Delete a role"><i class="fa fa-trash" aria-hidden="true"></i></scf-button>'
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

			    $scope.deleteRole = function(record) {
				var index = vm.organizeLinks.indexOf(record);
				if (index > -1) {
				    vm.organizeLinks.splice(index, 1);
				    vm.pagingController.updateSource(
					    vm.organizeLinks).search();
				}
			    }

			    $scope.addRole = function() {
				ngDialog
					.open({
					    template : '/user-organize',
					    controller : 'UserOrganizeController',
					    controllerAs : 'ctrl',
					    scope : $scope,
					    disableAnimation : true,
					    preCloseCallback : function(value) {
						if (value) {
						    vm.organizeLinks = value;
						}
						vm.pagingController
							.updateSource(
								vm.organizeLinks)
							.search();
						console
							.log(vm.pagingController.dataSource)
					    }
					});
			    }

			    vm.pagingController = PagingController
				    .create(vm.organizeLinks);

			    vm.search = function(pageModel) {
				vm.pagingController.search(pageModel);
			    }
			    var isRequire = function(data) {
				return (data == '' || data == null);
			    }
			    
			    var _save = function(user){
				var serviceUrl = 'api/v1/users'
				var deferred = $q.defer();
				$http({
					method : 'POST',
					url : serviceUrl,
					data: user
				}).then(function(response) {
					return deferred.resolve(response);
				}).catch(function(response) {
					return deferred.reject(response);
				});
				return deferred;
			    }
			    
			    $scope.save = function() {
				var user = $scope.user;
				user.organizeRoles = [];
				vm.organizeLinks.forEach(function(organizeLink) {
				    user.organizeRoles.push({
					roleId: organizeLink.roleId,
					organizeId: organizeLink.organizeId
				    });
				});
				
				
				if (validate(user)) {
				    var preCloseCallback = function(confirm) {
					PageNavigation.gotoPreviousPage(true);
				    }

				    UIFactory.showConfirmDialog({
					data : {
						headerMessage : 'Confirm save?'
					},
					confirm : function() {
						return _save(user);
					},
					onFail : function(response) {
					},
					onSuccess : function(response) {
						UIFactory.showSuccessDialog({
							data : {
								headerMessage : 'Save user completed.',
								bodyMessage : ''
							},
							preCloseCallback : preCloseCallback
						});
					}
				    });
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
					valid = false;
					$scope.errors.expiryDate = {
					    message : 'Wrong date format data.'
					}
				    } else if (angular
					    .isDefined(user.activeDate)
					    && user.expiryDate < user.activeDate) {
					valid = false;
					$scope.errors.activeDate = {
					    message : 'Active date must be less than or equal to expire date.'
					}
				    }

				}

				if (user.organizeRoles == null
					|| user.organizeRoles.length < 1) {
				    valid = false;
				    $scope.errors.organizeLinks = true
				}
				return valid;
			    }

			    var init = function() {
				vm.search();
			    }();
			} ]);