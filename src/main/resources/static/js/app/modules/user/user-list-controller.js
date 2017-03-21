var scfApp = angular.module('scfApp').controller('UserListController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', '$state', 'UIFactory', '$http', 'UserStatus', 'PasswordStatus', 
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state, UIFactory, $http, UserStatus, PasswordStatus){

		var vm = this;
		var log = $log;
		    
		vm.userStatusDropdowns = UserStatus;
		vm.passwordStatusDropdowns = PasswordStatus;
		
		vm.pageSizeList = [ {
			label : '10',
			value : '10'
		}, {
			label : '20',
			value : '20'
		}, {
			label : '50',
			value : '50'
		} ];
		
		vm.userListModel = {
    		user : undefined,
			organize : undefined,
			userStatus : vm.userStatusDropdowns[0].value,
			passwordStatus : vm.passwordStatusDropdowns[0].value
		}
		
		vm.newUser = function(data){
			var params = {userModel: data};
			PageNavigation.gotoPage('/user/new');
		}
		
		vm.viewUser = function(data){
			var params = {userModel: data};
			$timeout(function(){	
				PageNavigation.gotoPage('/user/view', params);
			}, 10);
		}
		
		vm.editUser = function(data){
			var params = {userModel: data};
			$timeout(function(){	
				PageNavigation.gotoPage('/user/edit', params);
			}, 10);
		}
		
		vm.resetPasswordUser = function(data){
			ngDialog.open({
                            template: '/js/app/user/confirm-reset-password-dialog.html',
                            scope: $scope,
                            disableAnimation: true
                        });
		}
	    
		var userAutoSuggestServiceUrl = 'api/v1/users';
		var searchUserTypeHead = function(value){
	    		value = UIFactory.createCriteria(value);
	    		return $http.get(userAutoSuggestServiceUrl, {
				params : {
					q : value,
					offset : 0,
					limit : 5
					}
				}).then(function(response) {
					return response.data.map(function(item) {
						item.identity = [ 'user-', item.displayName, '-option' ].join('');
						item.label = [ item.displayName ].join('');
						return item;
					});
				});
		}
		vm.userAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder: 'Enter display name',
			itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
			query: searchUserTypeHead
		});

	    var organizeAutoSuggestServiceUrl = 'api/v1/organizes';
	    var searchOrganizeTypeHead = function(value){
	    	value = UIFactory.createCriteria(value);
	    	return $http.get(organizeAutoSuggestServiceUrl, {
				params : {
					q : value,
					isFounder: false,
					offset : 0,
					limit : 5
					}
				}).then(function(response) {
					return response.data.map(function(item) {
						item.identity = [ 'organize-', item.organizeId, '-option' ].join('');
						item.label = [ item.organizeId, ': ', item.organizeName ].join('');
						return item;
					});
				});
		}
		
		vm.organizeAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder: 'Enter organize name or code',
			itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
			query: searchOrganizeTypeHead
		});
		
		vm.userCriteria = {
			userId : '',
			organizeId : '',
			userStatus : undefined,
			passwordStatus : undefined
		}
		
		vm.pagingController = PagingController.create('/api/v1/users', vm.userCriteria, 'GET');
		
		vm.searchUser = function(pageModel){
			if (angular.isDefined(vm.userListModel.user)) {
				vm.userCriteria.userId = vm.userListModel.user.userId;
			}
			
			if (angular.isDefined(vm.userListModel.organize)) {
				vm.userCriteria.organizeId = vm.userListModel.organize.organizeId;
			}
	        
	        UserStatus.forEach(function(status) {
				if (vm.userListModel.userStatus == status.value) {
					vm.userCriteria.userStatus = status.valueObject;
				}
			});
	        
	        PasswordStatus.forEach(function(status) {
				if (vm.userListModel.passwordStatus == status.value) {
					vm.userCriteria.passwordStatus = status.valueObject;
				}
			});
			
	        vm.pagingController.search(pageModel);
	        
		}
	    
	    vm.dataTable = {
    		identityField: 'displayName',
            columns: [{
            	fieldName: 'displayName',
                labelEN: 'Display name',
                labelTH: 'Display name',
                id: 'display-name-{value}',
                sortable: false,
                cssTemplate: 'text-left',
            },{
            	fieldName: 'firstName',
            	labelEN: 'First Name',
            	labelTH: 'First Name',
                id: 'first-name-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },{
            	fieldName: 'lastName',
            	labelEN: 'Last Name',
            	labelTH: 'Last Name',
                id: 'last-name-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },{
            	fieldName: 'status',
            	labelEN: 'Status',
            	labelTH: 'Status',
                id: 'status-{value}',
                sortable: false,
                filterType : 'translate',
                cssTemplate: 'text-center'
            },{
            	fieldName: 'passwordStatus',
            	labelEN: 'Password status',
            	labelTH: 'Password status',
                id: 'password-status-{value}',
                sortable: false,
                filterType : 'translate',
                cssTemplate: 'text-center'
            },{
            	fieldName: 'activeDate',
            	labelEN: 'Active date',
            	labelTH: 'Active date',
                id: 'active-date-{value}',
                sortable: false,
                filterType : 'date',
                format : 'dd/MM/yyyy',
                cssTemplate: 'text-center'
            },{
            	fieldName: 'expiryDate',
            	labelEN: 'Expire date',
            	labelTH: 'Expire date',
                id: 'expire-date-{value}',
                sortable: false,
                filterType : 'date',
                format : 'dd/MM/yyyy',
                cssTemplate: 'text-center'
            },{
				cssTemplate: 'text-center',
				sortable: false,
				cellTemplate : 	'<scf-button ng-disabled="false" class="btn-default gec-btn-action" id="view-button-{{data.displayName}}" ng-click="ctrl.viewUser(data)" title="View"><i class="fa fa-search" aria-hidden="true"></i></scf-button>'+
								'<scf-button ng-disabled="false" class="btn-default gec-btn-action" id="reset-password-button-{{data.displayName}}" ng-click="ctrl.resetPasswordUser(data)" title="Reset password"><i class="fa fa-unlock-alt" aria-hidden="true"></i></scf-button>'+
								'<scf-button ng-disabled="false" class="btn-default gec-btn-action" id="edit-button-{{data.displayName}}" ng-click="ctrl.editUser(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
			}]
	    }
	    
		vm.initLoad = function() {
	       
	        vm.searchUser();
		}
	
		vm.initLoad();
	
	}]);
	scfApp.constant("UserStatus", [
      	{
      		label : 'All',
      		value : '',
      		valueObject : null
      	},
      	{
      		label : 'Active',
      		value : 'ACTIVE',
      		valueObject : 'ACTIVE'
      	},
      	{
      		label : 'Expired',
      		value : 'EXPIRED',
      		valueObject : 'EXPIRED'
      	},
      	{
      		label : 'Pending',
      		value : 'PENDING',
      		valueObject : 'PENDING'
      	},
      	{
      		label : 'Suspend',
      		value : 'SUSPEND',
      		valueObject : 'SUSPEND'
      	}
      ]);
	scfApp.constant("PasswordStatus", [
     	{
     		label : 'All',
     		value : '',
     		valueObject : null
     	},
     	{
     		label : 'Enable',
     		value : 'ENABLE',
     		valueObject : 'ENABLED'
     	},
     	{
     		label : 'Lock',
     		value : 'LOCK',
     		valueObject : 'LOCK'
     	}
     ]);