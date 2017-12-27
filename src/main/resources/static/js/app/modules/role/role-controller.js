angular.module('scfApp').controller('RoleController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', '$state', 'UIFactory', '$http', '$q',
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state, UIFactory, $http ,$q){
		
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
        vm.roleMessageError;
        var defaultPrivilegeListIsSelected =[];

        $scope.cancel = function() {
            PageNavigation.gotoPreviousPage();
        }

        vm.privilegeGroupList = [];
        vm.setUpPrivilegeGroupList = [];

        var rolePrivilegeModel = {
            roleId : null,
            roleName :null,
            privileges : [],
            version:null
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
            var url = '/api/v1/roles';
            var deferred = $q.defer();

            if (mode === 'NEW') {
        		$http({
        			method : 'POST',
        			url : url,
        			data: data
        		}).then(function(response) {
        			return deferred.resolve(response);
        		}).catch(function(response) {
        			log.error('Save role fail');
        			return deferred.reject(response);
        		});
        		return deferred;
            } else {
        		$http({
        			method : 'POST',
        			url : url,
        			headers : {
        				'If-Match' : data.version,
        				'X-HTTP-Method-Override': 'PUT'
        			},
        			data: data
        		}).then(function(response) {
        			return deferred.resolve(response);
        		}).catch(function(response) {
        			log.error('Save role fail');
        			return deferred.reject(response);
        		});
        		return deferred;
            }
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
                        if(response.data == 403){
                            vm.roleMessageError = vm.isNewMode? 'New role fail. Role name is exits' : 'Edit role fail. Role name is exits';
                            $scope.error.roleNameIsRequired = true;
                        }else{
                            var msg = {
                                "001" : 'Role has been deleted.',
                                "002" : 'Role has been modified.'
                            };
                            UIFactory.showFailDialog({
                                data : {
                                    headerMessage : vm.isNewMode? 'Add new role fail.':'Edit role fail.',
                                    bodyMessage : msg[response.data.message] ? msg[response.data.message] : response.statusText
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
                console.log('Invalid data for save');
            }
		}

        
        var validateDataForSave = function(){
            var validate = true;

            if(vm.roleName==null || vm.roleName==""){
                validate = false;
                vm.roleMessageError = "Role name is required";
                $scope.error.roleNameIsRequired = true;
            }else{
                rolePrivilegeModel.roleName = vm.roleName;
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

        vm.checkDependValue = function(privilege){
            if(privilege.value){
                if(privilege.dependencies.length > 0){
                    for(var i=0;i<privilege.dependencies.length;i++){
                        for(var groupIndex=0;groupIndex<vm.privilegeGroupList.length;groupIndex++){
                            for(var privilegeIndex=0;privilegeIndex<vm.privilegeGroupList[groupIndex].privileges.length;privilegeIndex++){
                                if(vm.privilegeGroupList[groupIndex].privileges[privilegeIndex].privilegeId === privilege.dependencies[i].privilegeId){
                                    if(vm.privilegeGroupList[groupIndex].privileges[privilegeIndex].isDisable == false){
                                        vm.privilegeGroupList[groupIndex].privileges[privilegeIndex].isDisable = true;
                                        vm.privilegeGroupList[groupIndex].privileges[privilegeIndex].value = true;
                                    }
                                    vm.checkDependValue(vm.privilegeGroupList[groupIndex].privileges[privilegeIndex]);
                                }
                            }
                        }
                    }
                }
            }else{
                if(privilege.dependencies.length > 0){
                    for(var i=0;i<privilege.dependencies.length;i++){
                        for(var groupIndex=0;groupIndex<vm.privilegeGroupList.length;groupIndex++){
                            for(var privilegeIndex=0;privilegeIndex<vm.privilegeGroupList[groupIndex].privileges.length;privilegeIndex++){
                                if(vm.privilegeGroupList[groupIndex].privileges[privilegeIndex].privilegeId === privilege.dependencies[i].privilegeId){
                                    if(vm.privilegeGroupList[groupIndex].privileges[privilegeIndex].isDisable == true){
                                        vm.privilegeGroupList[groupIndex].privileges[privilegeIndex].isDisable = false;
                                        vm.privilegeGroupList[groupIndex].privileges[privilegeIndex].value = true;
                                    }
                                    vm.checkDependValue(vm.privilegeGroupList[groupIndex].privileges[privilegeIndex]);
                                }
                            }
                        }
                    }
                }
            }
        }

        var comparePrivilegeIsSelected = function(privilegeId){
            var invalid = defaultPrivilegeListIsSelected.indexOf(privilegeId);
            if(invalid != -1){
                return true;
            }
            return false;
        }

        var indexOfPrivilegeIsSelected = [];

        var defualtValuePrivilegeGroupList = function(data){
            for(var i=0;i<data.length;i++){
                for(var j=0; j<data[i].privileges.length;j++){
                    data[i].privileges[j].value = false;
                    data[i].privileges[j].isDisable = false;
                    if(defaultPrivilegeListIsSelected != []){
                        data[i].privileges[j].value = comparePrivilegeIsSelected(data[i].privileges[j].privilegeId);
                        if(data[i].privileges[j].value){
                            indexOfPrivilegeIsSelected.push({
                                groupIndex : i,
                                privilegeIndex : j
                            });
                        }
                    }
                }
            }
            return data;
        }

        var initialPrivilegeGroup = function(){
            var url = '/api/v1/privilegeGroups';
            var defered = Service.doGet(url,null);
            defered.promise.then(function(response){
                vm.privilegeGroupList = defualtValuePrivilegeGroupList(response.data);
                if(indexOfPrivilegeIsSelected != []){
                    for(var index=0; index<indexOfPrivilegeIsSelected.length; index++){
                        var groupIndex = indexOfPrivilegeIsSelected[index].groupIndex;
                        var privilegeIndex = indexOfPrivilegeIsSelected[index].privilegeIndex;
                        vm.checkDependValue(vm.privilegeGroupList[groupIndex].privileges[privilegeIndex]);
                    }
                }
            }).catch(function(response) {
                log.error('Get role group fail');
            });
        }

        var initialRoleInformation = function(model){
            var information = $stateParams.data;

            for(var index=0; index<information.privileges.length; index++){
                defaultPrivilegeListIsSelected.push(
                    information.privileges[index].privilegeId
                );
            }

            vm.roleName = information.roleName;
            model.roleId = information.roleId;
            model.version = information.version;
            return model;
        }

		var initial = function(){
            if(mode!=""){
                if(mode === 'NEW'){
                    vm.isNewMode = true;
                    vm.headerMessage = page.NEW;
                }else if(mode === 'EDIT'){
                    vm.headerMessage = page.EDIT;
                    rolePrivilegeModel = initialRoleInformation(rolePrivilegeModel);
                }else if(mode === 'VIEW'){
                    vm.button = 'Back';
                    vm.viewMode = true;
                    vm.headerMessage = page.VIEW;
                    rolePrivilegeModel = initialRoleInformation(rolePrivilegeModel);
                }
                initialPrivilegeGroup();
            }else{
                PageNavigation.gotoPage("/dashboard",undefined,undefined);
            }
            
		}
		initial();
}]);