angular.module('scfApp').controller('RoleController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', '$state', 'UIFactory', '$http', 
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state, UIFactory, $http ){
		
		var vm = this;
		var log = $log;

        var page = {
            NEW : 'New Role',
            EDIT : 'Edit Role',
            VIEW : 'View Role'
        }

        var mode = $stateParams.mode;
        vm.viewMode = false;
        vm.headerMessage;

        $scope.cancel = function() {
            PageNavigation.gotoPreviousPage();
        }



////////////////////// mock data for test /////////////////////////

        vm.model = [];
        var privilege = [];
        var privilege2 = [];

        for(var i = 0;i<5;i++){
            var privilegeNode = {
                privilege_id : i+1,
                privilege_name : "test privilege" + i,
                privilege_group_id : 1,
                sequence :i,
                dependent_privilege_id : null,
                value : false
            }
            privilege.push(privilegeNode);
        }

        for(var i = 6;i<10;i++){
            var privilegeNode = {
                privilege_id : i+1,
                privilege_name : "test privilege" + i,
                privilege_group_id : 1,
                sequence :i,
                dependent_privilege_id : null,
                value : true
            }
            privilege2.push(privilegeNode);
        }
        console.log(privilege)
        vm.group1 = {
            gid : "1",
            groupName :  "test1",
            seq : "1",
            privilege : privilege
        }

        
        vm.group2 = {
            gid : "2",
            groupName :  "test2",
            seq : "2",
            privilege : privilege2
        }
        vm.model.push(vm.group1);
        vm.model.push(vm.group2);
        vm.model[0].privilege[3].value = true;

        vm.change = function () { 
            console.log(vm.model)
        };

        vm.check = function(id,value){
            console.log(id)
            console.log(value)
            if(id == 4){
                value = true;
            }else{
                value = false;
            }
            return value;
        }

        vm.changeVal = function(data){
            console.log(data)
        }


////////////////////// mock data for test /////////////////////////


		var initial = function(){
            if(mode === 'NEW'){
                vm.headerMessage = page.NEW;
            }else if(mode === 'EDIT'){
                vm.headerMessage = page.EDIT;
            }else{
                vm.viewMode = true;
                vm.headerMessage = page.VIEW;
            }
		}
		initial();
}]);