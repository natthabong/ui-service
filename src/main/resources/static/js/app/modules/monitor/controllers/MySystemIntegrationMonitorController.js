'use strict';
var scfApp = angular.module('gecscf.monitoring');
scfApp.controller('MySystemIntegrationMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog', 'scfFactory',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService, ngDialog, scfFactory) {

        var vm = this; 
		vm.isDisplay = false;
		vm.readyToShow = false;
		vm.monitorOwnerModel = {
			id : "",
			name : ""
		}
		
        vm.check = function(){
			$scope.isMultiProfile = false;
			$scope.monitorOwnerModel = vm.monitorOwnerModel;
			vm.readyToShow = true;
            $scope.$broadcast('onload');
        }
		
		var defered = scfFactory.getUserInfo();
		defered.promise.then(function(response) {
	        var initialization = function(){
	        	vm.monitorOwnerModel.id = $rootScope.userInfo.organizeId;
	           	vm.monitorOwnerModel.name = $rootScope.userInfo.organizeName;
	           	vm.isDisplay = true;
	           	vm.check();
	        }();
		});
} ]);