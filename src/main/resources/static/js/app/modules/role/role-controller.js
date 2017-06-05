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

        vm.button = 'Cancel';

        var mode = $stateParams.mode;
        vm.viewMode = false;
        vm.headerMessage;

        $scope.cancel = function() {
            PageNavigation.gotoPreviousPage();
        }

        vm.privilegeGroupList = [];
        vm.setUpPrivilegeGroupList = [];

        $scope.error = [];

        vm.checkDependValue = function(privilege,group){
            var groupIndex = group.sequence-1;
            var privilegeIndex = privilege.sequence-1;
            if(privilege.dependencies.length > 0){
                for(var i=0;i<privilege.dependencies.length;i++){
                    for(var j=0;j<vm.privilegeGroupList[groupIndex].privileges.length;j++){
                        if(vm.privilegeGroupList[groupIndex].privileges[j].privilegeId === privilege.dependencies[i].privilegeId){
                            if(vm.privilegeGroupList[groupIndex].privileges[j].isDisable == false){
                                vm.privilegeGroupList[groupIndex].privileges[j].isDisable = true;
                                vm.privilegeGroupList[groupIndex].privileges[j].value = true;
                            }else{
                                vm.privilegeGroupList[groupIndex].privileges[j].isDisable = false;
                            }
                        }
                    }
                }
            }
        }

        var initailValuePrivilegeGroup = function(data){
            return data;
        }

        var defualtValuePrivilegeGroupList = function(data){
            for(var i=0;i<data.length;i++){
                for(var j=0; j<data[i].privileges.length;j++){
                    data[i].privileges[j].value = false;
                    data[i].privileges[j].isDisable = false;
                }
            }
            if(mode !== 'NEW'){
                return initailValuePrivilegeGroup(data);
            }else{
                return data;
            }
        }

        var initialPrivilegeGroup = function(){
            uri = '/api/v1/privilegeGroups';
            var defered = Service.doGet(uri,null);
            defered.promise.then(function(response){
                vm.privilegeGroupList = defualtValuePrivilegeGroupList(response.data);
                console.log(vm.privilegeGroupList)
            }).catch(function(response) {
                log.error('Get role group fail');
            });
        }

		var initial = function(){
            if(mode!=""){
                if(mode === 'NEW'){
                    vm.headerMessage = page.NEW;
                }else if(mode === 'EDIT'){
                    vm.headerMessage = page.EDIT;
                }else if(mode === 'VIEW'){
                    vm.button = 'Back';
                    vm.viewMode = true;
                    vm.headerMessage = page.VIEW;
                }
                initialPrivilegeGroup()
            }else{
                PageNavigation.gotoPage("/dashboard",undefined,undefined);
            }
            
		}
		initial();
}]);