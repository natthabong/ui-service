'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('GECSystemIntegrationMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService,ngDialog) {

        var vm = this; 
        vm.organize;

        var getMyOrganize = function(){
            var getMyOrganizeServiceUrl = '/api/v1/users/me/organizes';
            var organizeDeferred = Service.doGet(getMyOrganizeServiceUrl);
            organizeDeferred.promise.then(function(response){
                vm.organize = response.data[0];
            }).catch(function(response){
                console.log("get organize fail.")
            });
        }

        var initial = function(){
            getMyOrganize();
        }
        initial();
} ]);