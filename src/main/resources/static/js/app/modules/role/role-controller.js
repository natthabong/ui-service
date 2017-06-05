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
        vm.roleName;

        $scope.cancel = function() {
            PageNavigation.gotoPreviousPage();
        }

        vm.privilegeGroupList = [];
        vm.setUpPrivilegeGroupList = [];
        var rolePrivilegeModel = {
            roleId : null,
            roleName :null,
            privileges : []
        }

        var getValueRolePrivilegeIsSelected = function(){
            var privilegeList = [];
            for(var i=0;i<vm.privilegeGroupList.length;i++){
                for(var j=0;j<vm.privilegeGroupList[i].privileges.length;j++){
                    if(vm.privilegeGroupList[i].privileges[j].value){
                        privilegeList.push({
                            privilegeId : vm.privilegeGroupList[i].privileges[j].privilegeId
                        });
                    }
                }
            }
            return privilegeList;
        }

        var _save = function(data){
            var url;
            var method;
            if(mode === 'NEW'){
                uri = '/api/v1/roles';
                method = 'POST';
            }else{
                uri = '/api/v1/roles' + data.roleId;
                method = 'PUT';
            }
            
            var defered = Service.requestURL(uri,data,method,null);
            defered.promise.then(function(response){
                console.log(response)
                // vm.privilegeGroupList = defualtValuePrivilegeGroupList(response.data);
            }).catch(function(response) {
                log.error('Save role fail');
            });
            return defered;
        }

        $scope.error = {};
        $scope.save = function() {	
            if (validateDataForSave()) {
                var preCloseCallback = function(confirm) {
                    PageNavigation.gotoPreviousPage(true);
                }

                UIFactory.showConfirmDialog({
                    data : {
                        headerMessage : 'Confirm save?'
                    },
                    confirm : function() {
                        return _save(rolePrivilegeModel);
                    },
                    onFail : function(response) {
                        if(response.status != 400){
                        var msg = {
                                409 : 'Role has been modified.'
                        };
                            UIFactory.showFailDialog({
                            data : {
                                headerMessage : vm.isNewMode? 'Add new role fail.':'Edit role fail.',
                                bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
                            },
                            preCloseCallback : preCloseCallback
                        });
                        }
                    },
                    onSuccess : function(response) {
                        UIFactory.showSuccessDialog({
                            data : {
                                headerMessage : vm.isNewMode? 'Add new role success.':'Edit role complete.',
                                bodyMessage : ''
                            },
                            preCloseCallback : preCloseCallback
                        });
                    }
                });
            }else{
                console.log('Invalidate data for save');
            }
		}

        
        var validateDataForSave = function(){
            var validate = true;

            if(vm.roleName==null || vm.roleName==""){
                validate = false;
                $scope.error.roleNameIsRequired = true;
            }else{
                $scope.error.roleNameIsRequired = false;
            }

            rolePrivilegeModel.privileges = getValueRolePrivilegeIsSelected();

            if(rolePrivilegeModel.privileges.length == 0){
                validate = false;
                $scope.error.permissionsIsRequired = true;
            }else{
                $scope.error.permissionsIsRequired = false;
            }
            return validate;
        }

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
            var url = '/api/v1/privilegeGroups';
            var defered = Service.doGet(url,null);
            defered.promise.then(function(response){
                vm.privilegeGroupList = defualtValuePrivilegeGroupList(response.data);
            }).catch(function(response) {
                log.error('Get role group fail');
            });
        }

		var initial = function(){
            if(mode!=""){
                if(mode === 'NEW'){
                    vm.isNewMode = true;
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