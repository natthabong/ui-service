angular.module('scfApp').controller('RoleController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', 'RoleService', '$state', 'UIFactory', '$http', '$q',
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, RoleService, $state, UIFactory, $http ,$q){
		
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
        vm.model = {
            roleId : null,
            roleName :null,
            privileges : [],
            version:null  
        };
        vm.roleMessageError;
        var defaultPrivilegeListIsSelected =[];

        $scope.cancel = function() {
            PageNavigation.gotoPreviousPage();
        }
        
        $scope.selectedPrivileges = [];
        
        vm.privilegeGroups = [];

        var rolePrivilegeModel = {
            roleId : null,
            roleName :null,
            privileges : [],
            version:null
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
                        return _save(vm.model);
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

            if(vm.model.roleName==null || vm.model.roleName==""){
                validate = false;
                vm.roleMessageError = "Role name is required";
                $scope.error.roleNameIsRequired = true;
            }else{
                $scope.error.roleNameIsRequired = false;
            }

            if(vm.model.privileges.length == 0){
                validate = false;
                $scope.error.permissionsIsRequired = true;
            }else{
                $scope.error.permissionsIsRequired = false;
            }
            return validate;
        }
        
        var initialPrivilegeGroup = function(){
            var url = '/api/v1/privilege-groups';
            var defered = Service.doGet(url,null);
            defered.promise.then(function(response){
                vm.privilegeGroups =  response.data ;
            }).catch(function(response) {
                log.error('Get role group fail');
            });
        }

        var initialRoleInformation = function(){
            var roleId = $stateParams.roleId;
            RoleService.getRole(roleId).promise.then(function(response) {
              vm.model = response.data;
              if(vm.model.privileges!=null){
                vm.model.privileges.forEach(function(p){
                  $scope.selection.push(p.privilegeId);
                });
              }
            }).catch(function(response) {
               log.error('Save role fail');
               return deferred.reject(response);
            });
        }
        
    $scope.selection = [];
    $scope.toggleSelection =  function(privilege){
      if(vm.model.privileges==null){
        vm.model.privileges = [];
      }
      if($scope.selection.indexOf(privilege.privilegeId) === -1) {
        $scope.selection.push(privilege.privilegeId);
        vm.model.privileges.push(privilege);
      } else {
        $scope.selection.splice($scope.selection.indexOf(privilege.privilegeId), 1);
        vm.model.privileges.splice(vm.model.privileges.indexOf(privilege), 1);
        
      }
      console.log( vm.model);
      console.log($scope.selection);
    }
    
		var initial = function(){
            if(mode!=""){
                if(mode === 'NEW'){
                    vm.isNewMode = true;
                    vm.headerMessage = page.NEW;
                }else if(mode === 'EDIT'){
                    vm.headerMessage = page.EDIT;
                    initialRoleInformation();
                }else if(mode === 'VIEW'){
                    vm.button = 'Back';
                    vm.viewMode = true;
                    vm.headerMessage = page.VIEW;
                    initialRoleInformation();
                }
                initialPrivilegeGroup();
            }else{
                PageNavigation.gotoPage("/dashboard",undefined,undefined);
            }
            
		}
		initial();
}]);