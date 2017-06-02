angular.module('scfApp').controller('RoleListController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', '$state', 'UIFactory', '$http', '$q',
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state, UIFactory, $http, $q ){
		
		var vm = this;
		var log = $log;
		var param = {
			mode : null
		}
		var roleCriteria = {
			
		}
		vm.pagingController = PagingController.create('/api/v1/roles/all-role', roleCriteria, 'GET');

		vm.searchRole = function(pageModel){
			vm.pagingController.search(pageModel);
		}

		vm.newRole = function(){
			param.mode = 'NEW';
			PageNavigation.gotoPage('/role/new', param,[]);
		}

		vm.editRole = function(){
			param.mode = 'EDIT';
			PageNavigation.gotoPage('/role/edit', param,[]);
		}

		vm.viewRole = function(){
			param.mode = 'VIEW';
			PageNavigation.gotoPage('/role/view', param,[]);
		}

		vm.dataTable = {
			identityField: 'roleName',
			columns : [
				{
					fieldName : 'roleName',
					labelEN : 'Role',
					labelTH : 'Role',
					id : 'role-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},
				{
					cssTemplate : 'text-center',
					sortable : false,
					cellTemplate : '<scf-button ng-disabled="false" class="btn-default gec-btn-action" id="role-{{data.roleName}}-view-button" ng-click="ctrl.viewRole(data)" title="View"><i class="fa fa-search" aria-hidden="true"></i></scf-button>'
						+ '<scf-button ng-disabled="false" class="btn-default gec-btn-action" id="role-{{data.roleName}}-edit-button" ng-click="ctrl.editRole(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
						+ '<scf-button ng-disabled="false" class="btn-default gec-btn-action" id="role-{{data.roleName}}-delete-button" ng-click="ctrl.deleteRole(data)" title="Delete"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
				} ]
		}

		var initial = function(){
			vm.searchRole();
		}
		initial();
		
		var deleteRole = function(role){
		    
			var serviceUrl = '/api/v1/roles/' + role.roleId;
			var deferred = $q.defer();
			$http({
			    method: 'POST',
			    url: serviceUrl,
			    headers : {
					'If-Match' : role.version,
					'X-HTTP-Method-Override': 'DELETE'
				},
				data: role
			  }).then(function(response){
			      return deferred.resolve(response);
			 }).catch(function(response){
			      return deferred.reject(response);
			 });
			 return deferred;
		}
		
		vm.deleteRole = function(role){
		    var preCloseCallback = function(confirm) {
		    	vm.searchRole();
		    }
		    
		    UIFactory.showConfirmDialog({
			data: { 
			    headerMessage: 'Confirm delete?'
			},
			confirm: function(){
			    return deleteRole(role);
			},
			onFail: function(response){
			    var msg = {409:'Role has been deleted.', 405:'Role has been used.'};
			    UIFactory.showFailDialog({
				data: {
				    headerMessage: 'Delete role fail.',
				    bodyMessage: msg[response.status]?msg[response.status]:response.statusText
				},
				preCloseCallback: preCloseCallback
			    });
			},
			onSuccess: function(response){
			    UIFactory.showSuccessDialog({
				data: {
				    headerMessage: 'Delete role success.',
				    bodyMessage: ''
				},
				preCloseCallback: preCloseCallback
			    });
			}
		    });
		    
		}
}]);