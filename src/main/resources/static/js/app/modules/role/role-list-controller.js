angular.module('scfApp').controller('RoleListController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', '$state', 'UIFactory', '$http', 
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state, UIFactory, $http ){
		
		var vm = this;
		var log = $log;
		var roleCriteria = {
			
		}
		vm.pagingController = PagingController.create('/api/v1/roles/all-role', roleCriteria, 'GET');

		vm.searchRole = function(pageModel){
			vm.pagingController.search(pageModel);
		}

		console.log(vm.pagingController)
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
}]);