'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BatchJobMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService,ngDialog) {
    
	var vm = this; 
	
	vm.batchJobModel = []
	for(var i=0;i<10;i++){
		vm.batchJobModel.push({
			displayName : 'Job ' + i
		});
	}
} ]);