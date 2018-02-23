'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('MySystemIntegrationMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService, ngDialog) {

        var vm = this; 
        vm.organize = {
        		organizeId : null,
        		organizeName : null
        }

        vm.check = function(){
            $scope.$broadcast('onload');
        }

        var validateHasOrganize = function(){
            var validate = true;
            if(vm.organize == null){
                validate = false;
            }
            return validate;
        }

        var initial = function(){
        	vm.organize.organizeId = $rootScope.userInfo.organizeId;
           	vm.organize.organizeName = $rootScope.userInfo.organizeName;
        }
        initial();
} ]);