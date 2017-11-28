'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('GECSystemIntegrationMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService, ngDialog) {

        var vm = this; 
        vm.organize = null;

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

        var getMyOrganize = function(){
            var getMyOrganizeServiceUrl = '/api/v1/users/me/organizes';
            var organizeDeferred = Service.doGet(getMyOrganizeServiceUrl);
            organizeDeferred.promise.then(function(response){
                vm.organize = response.data[0];
            }).catch(function(response){
                console.log("get organization fail.")
            });
        }

        var initial = function(){
            getMyOrganize();
        }
        initial();
} ]);