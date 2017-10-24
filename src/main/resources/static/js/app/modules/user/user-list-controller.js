'use strict';
var userModule = angular.module('gecscf.user');
userModule
	.controller(
		'UserListController',
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
			'UserStatus',
			'PasswordStatus',
			'$timeout',
			'$q',
			'blockUI',
			function($scope, Service, $stateParams, $log,
				SCFCommonService, PagingController,
				PageNavigation, $state, UIFactory, $http,
				UserStatus, PasswordStatus, $timeout, $q, blockUI) {

			    var vm = this;
			    var log = $log;
				vm.manageAll = false;
				vm.canResetPwd = false;

			    vm.userStatusDropdowns = UserStatus;
			    vm.passwordStatusDropdowns = PasswordStatus;

			    vm.userListModel = {
					user : undefined,
					organize : undefined,
					userStatus : vm.userStatusDropdowns[0].value,
					passwordStatus : vm.passwordStatusDropdowns[0].value
			    }

			    var _criteria = {};
			    
			    vm.criteria = $stateParams.criteria || {
					userId : '',
					organizeId : '',
					userStatus : undefined,
					passwordStatus : undefined
			    }

			    vm.user = null;
			    vm.resetPasswordUser = function(data) {
			    	 vm.user = data;
			    	
			    	var preCloseCallback = function(confirm) {
						vm.pagingController.reload();
					}
			    	
			    	var userId = data.userId;
			    	UIFactory.showConfirmDialog({
			    		data : {
			    			headerMessage : 'Confirm reset password?'
			    		},
			    		confirm : function() {
			    			return _resetPassword(userId);
			    		},
			    		onFail : function(response) {
			    			blockUI.stop();
			    			var msg = {
			    				409 : 'User has been modified.'
						};
			    			UIFactory.showFailDialog({
						   data : {
						      headerMessage : 'Reset password fail.',
						      bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
						   },
						   preCloseCallback : preCloseCallback
						});
			    		},
			    		onSuccess : function(response) {
			    			blockUI.stop();
			    			UIFactory.showSuccessDialog({
			    				data : {
			    					headerMessage : 'Reset password complete.',
			    					bodyMessage : ''
			    				},
			    				preCloseCallback : preCloseCallback
			    			});
			    		}
			    	});
			    }
			    
			    var _resetPassword = function(userId) {
			    	blockUI.start();
					var serviceUrl = 'api/v1/users/'+userId+'/reset-password'
					var deferred = $q.defer();
					$http({
						method : 'POST',
						url : serviceUrl,
						data: vm.user
					}).then(function(response) {
						return deferred.resolve(response);
					}).catch(function(response) {
	    				    if (response) {
	    					if(Array.isArray(response.data)){
	        				   response.data.forEach(function(error){
	        				       $scope.errors[error.code] = {
	    	    					    message : error.message
	    	    					};
	        				   });
	    					}
	    				    }
					    return deferred.reject(response);
					});
					return deferred;
				}

			    var userAutoSuggestServiceUrl = 'api/v1/users';
			    var searchUserTypeHead = function(value) {
				value = UIFactory.createCriteria(value);
				return $http
					.get(userAutoSuggestServiceUrl, {
					    params : {
						q : value,
						offset : 0,
						limit : 5
					    }
					})
					.then(
						function(response) {
						    return response.data
							    .map(function(item) {
								item.identity = [
									'user-',
									item.displayName,
									'-option' ]
									.join('');
								item.label = [ item.displayName ]
									.join('');
								return item;
							    });
						});
			    }
			    vm.userAutoSuggestModel = UIFactory
				    .createAutoSuggestModel({
					placeholder : 'Enter display name',
					itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
					query : searchUserTypeHead
				    });

			    var organizeAutoSuggestServiceUrl = '/api/v1/organizes';
			    var searchOrganizeTypeHead = function(value) {
				value = UIFactory.createCriteria(value);
				return $http
					.get(organizeAutoSuggestServiceUrl, {
					    params : {
						q : value,
						offset : 0,
						limit : 5
					    }
					})
					.then(
						function(response) {
						    return response.data
							    .map(function(item) {
								item.identity = [
									'organize-',
									item.organizeId,
									'-option' ]
									.join('');
								item.label = [
									item.organizeId,
									': ',
									item.organizeName ]
									.join('');
								return item;
							    });
						});
			    }

			    vm.organizeAutoSuggestModel = UIFactory
				    .createAutoSuggestModel({
					placeholder : 'Enter organize name or code',
					itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
					query : searchOrganizeTypeHead
				    });

			    vm.pagingController = PagingController.create(
				    '/api/v1/users', _criteria, 'GET');

			    vm.searchUser = function(pageModel) {
					if (angular.isDefined(vm.userListModel.user)) {
						vm.criteria.userId = vm.userListModel.user.userId;
					}

					if (angular.isDefined(vm.userListModel.organize)) {
						vm.criteria.organizeId = vm.userListModel.organize.organizeId;
					}

					UserStatus.forEach(function(status) {
							if (vm.userListModel.userStatus == status.value) {
							vm.criteria.userStatus = status.valueObject;
							}
						});

					PasswordStatus.forEach(function(status) {
							if (vm.userListModel.passwordStatus == status.value) {
							vm.criteria.passwordStatus = status.valueObject;
							}
						});
					_storeCriteria();
					vm.pagingController.search(pageModel || ( $stateParams.backAction? {
			    		offset : _criteria.offset,
						limit : _criteria.limit
			    	}: undefined));
					if($stateParams.backAction){
			    		$stateParams.backAction = false;
			    	}
			    }

			    vm.dataTable = {
				identityField : 'displayName',
				columns : [
					{
					    fieldName : 'displayName',
					    labelEN : 'Display name',
					    labelTH : 'Display name',
					    id : 'display-name-{value}',
					    sortable : false,
					    cssTemplate : 'text-left',
					},
					{
					    fieldName : 'firstName',
					    labelEN : 'First name',
					    labelTH : 'First name',
					    id : 'first-name-{value}',
					    sortable : false,
					    cssTemplate : 'text-left'
					},
					{
					    fieldName : 'lastName',
					    labelEN : 'Last name',
					    labelTH : 'Last name',
					    id : 'last-name-{value}',
					    sortable : false,
					    cssTemplate : 'text-left'
					},
					{
					    fieldName : 'realStatus',
					    labelEN : 'Status',
					    labelTH : 'Status',
					    id : 'status-{value}',
					    sortable : false,
					    filterType : 'translate',
					    cssTemplate : 'text-center'
					},
					{
					    fieldName : 'passwordStatus',
					    labelEN : 'Password status',
					    labelTH : 'Password status',
					    id : 'password-status-{value}',
					    sortable : false,
					    filterType : 'translate',
					    cssTemplate : 'text-center'
					},
					{
					    fieldName : 'activeDate',
					    labelEN : 'Active date',
					    labelTH : 'Active date',
					    id : 'active-date-{value}',
					    sortable : false,
					    filterType : 'date',
					    format : 'dd/MM/yyyy',
					    cssTemplate : 'text-center'
					},
					{
					    fieldName : 'expiryDate',
					    labelEN : 'Expire date',
					    labelTH : 'Expire date',
					    id : 'expire-date-{value}',
					    sortable : false,
					    filterType : 'date',
					    format : 'dd/MM/yyyy',
					    cssTemplate : 'text-center',
					    renderer : function(data) {
						return data || '';
					    }
					},
					{
					    cssTemplate : 'text-center',
					    sortable : false,
					    cellTemplate : '<scf-button ng-disabled="false" class="btn-default gec-btn-action" id="view-{{data.displayName}}-button" ng-click="ctrl.viewUser(data)" title="View"><i class="fa fa-search" aria-hidden="true"></i></scf-button>'
						    + '<scf-button ng-disabled="!ctrl.canResetPwd" class="btn-default gec-btn-action" id="reset-password-{{data.displayName}}-button" ng-click="ctrl.resetPasswordUser(data)" title="Reset password"><i class="fa fa-unlock-alt" aria-hidden="true"></i></scf-button>'
						    + '<scf-button ng-disabled="!ctrl.manageAll" class="btn-default gec-btn-action" id="edit-{{data.displayName}}-button" ng-click="ctrl.editUser(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
					} ]
			    }

				function _storeCriteria() {
					angular.copy(vm.criteria, _criteria);
				}

			    vm.initLoad = function() {
					var backAction = $stateParams.backAction;
					if(backAction){
						vm.userListModel = $stateParams.criteria;
					}
					vm.searchUser();
			    }

			    vm.initLoad();

				vm.newUser = function() {
					var params = {
						userModel : null
					};
					
					PageNavigation.gotoPage('/user/new', params, {criteria : _criteria});
			    }

			    vm.viewUser = function(data) {
					var params = {
						userModel : data
					};
					$timeout(function() {
						PageNavigation.gotoPage('/user/view', params, {criteria : _criteria});
					}, 10);
			    }

			    vm.editUser = function(data) {
					var params = {
						userModel : data
					};
					$timeout(function() {
						PageNavigation.gotoPage('/user/edit', params, {criteria : _criteria});
					}, 10);
			    }

			} ]);
userModule.constant("UserStatus", [ {
    label : 'All',
    value : '',
    valueObject : null
}, {
    label : 'Active',
    value : 'ACTIVE',
    valueObject : 'ACTIVE'
}, {
    label : 'Expired',
    value : 'EXPIRED',
    valueObject : 'EXPIRED'
}, {
    label : 'Pending',
    value : 'PENDING',
    valueObject : 'PENDING'
}, {
    label : 'Suspend',
    value : 'SUSPEND',
    valueObject : 'SUSPEND'
} ]);
userModule.constant("PasswordStatus", [ {
    label : 'All',
    value : '',
    valueObject : null
}, {
    label : 'Enable',
    value : 'ENABLED',
    valueObject : 'ENABLED'
}, {
    label : 'Lock',
    value : 'LOCK',
    valueObject : 'LOCK'
} ]);