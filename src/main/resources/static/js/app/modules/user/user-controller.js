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
			'UserService',
			function($scope, $stateParams, $log, $q, $rootScope,
				$http, Service, ngDialog, SCFCommonService,
				UIFactory, PageNavigation, PagingController, UserService) {

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
					    cellTemplate : '<scf-button class="btn-default gec-btn-action" id="delete-{{$index +1}}-button" ng-click="deleteRole(data)" ng-disabled="ctrl.isViewMode" title="Delete a role"><i class="fa fa-trash" aria-hidden="true"></i></scf-button>'
					} ]
			    };
			    
			    vm.pagingController = PagingController
			    .create(vm.organizeLinks);
			    
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
			    
			    var mode = {
		    		VIEW : 'viewUser',
		    		NEW : 'newUser',
		    		EDIT : 'editUser'
			    }
			    
			    var currentMode = $stateParams.mode;
			    vm.loadUser = function() {
			    	if(currentMode == mode.VIEW || currentMode == mode.EDIT){
			    		var userId = $stateParams.userModel.userId;
			    		$scope.user.userId = userId;
			    		if(currentMode == mode.VIEW){
			    		    vm.isViewMode = true;
			    		}
			    		else{
			    		    vm.isEditMode = true;
			    		}
			    		var deffered = Service.doGet('/api/v1/users/'+userId);
			    		deffered.promise.then(function(response) {
			    			console.log(response)
			    			
			    			$scope.user = response.data;
			    			if(response.data.birthDate != null){
			    				$scope.user.birthDate = new Date(response.data.birthDate);
			    			}else{
			    				$scope.user.birthDate = null;
			    			}
			    			
			    			if(response.data.activeDate != null){
			    				$scope.user.activeDate = new Date(response.data.activeDate);
			    			}else {
			    				$scope.user.activeDate = null;
			    			}
			    			
			    			if(response.data.expiryDate != null){
			    				$scope.user.expiryDate = new Date(response.data.expiryDate);
			    				vm.isUseExpireDate = true;
			    			}else{
			    				$scope.user.expiryDate = null;
			    			}
			    			vm.organizeLinks = $scope.user.organizeRoles;
			    			vm.pagingController.updateSource(
			   					    vm.organizeLinks).search();
	        	        	
				        }).catch(function(response) {
				            log.error('Get user fail');
				        });
			    		
			    	}else {
			    		vm.isViewMode = false;
			    		vm.isEditMode = false;
			    		vm.isNewMode = true;
			    	}
			    }

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
						    value.forEach(function(data){
							vm.organizeLinks.push(data);
						    })
						}
						vm.pagingController
							.updateSource(
								vm.organizeLinks)
							.search();
					    }
					});
			    }

			    vm.search = function(pageModel) {
				vm.pagingController.search(pageModel);
			    }
			    var isRequire = function(data) {
				return (data == '' || data == null);
			    }
			    
			    var _save = function(user){
				
				var deferred = UserService.saveUser(user, vm.isEditMode);
				deferred.promise.then(function(response){}).catch(function(response){
				    if (response) {
					if(Array.isArray(response.data)){
					   response.data.forEach(function(error){
					      $scope.errors[error.code] = {
						message : error.message
					      };
					   });
				        }
				    }
				    deferred.resolve(response);
				});
				return deferred;
			    }
			    
			    $scope.cancel = function() {
				PageNavigation.gotoPreviousPage();
			    }
			    $scope.save = function() {
				var user = $scope.user;
				user.organizeRoles = [];
				vm.organizeLinks.forEach(function(organizeLink) {
				    user.organizeRoles.push({
					roleId: organizeLink.roleId,
					organizeId: organizeLink.organizeId,
					userId: (vm.isEditMode? $scope.user.userId: null)
				    });
				});
				
				
				if (_validate(user)) {
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
					    if(response.status != 400){
						var msg = {
			    				409 : 'User has been modified.'
						};
			    			UIFactory.showFailDialog({
						   data : {
						      headerMessage : 'Save user failed.',
						      bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
						   },
						   preCloseCallback : preCloseCallback
						});
					    }
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
				}else{
				    console.log('Invalid');
				}
			    }

			    var _validate = function(user) {
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

				if (isRequire(user.username)) {
				    valid = false;
				    $scope.errors.username = {
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

				if (!angular.isDefined(user.activeDate)) {
				    valid = false;
				    $scope.errors.activeDate = {
					message : 'Wrong date format data.'
				    }
				}else if(user.activeDate == null|| user.activeDate ==''){
					valid = false;
				    $scope.errors.activeDate = {
				    		message : 'Active date is required.'
				    }
				}
if (vm.isUseExpireDate) {

				    if (!angular.isDefined(user.expiryDate)) {
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
				    }else if(user.expiryDate == null|| user.expiryDate ==''){				    	
						valid = false;
					    $scope.errors.expiryDate = {
					    		message : 'Expire date is required.'
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
			    	vm.loadUser();
			    }();
			} ]);