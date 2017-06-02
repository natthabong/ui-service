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

        $scope.error = [];

        var initialPrivilegeGroup = function(){
            uri = '/api/v1/privilegeGroups';
            var defered = Service.doGet(uri,null);
            defered.promise.then(function(response){
                console.log(response.data)
                vm.privilegeGroupList = response.data;
            }).catch(function(response) {
                log.error('Search data error');
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