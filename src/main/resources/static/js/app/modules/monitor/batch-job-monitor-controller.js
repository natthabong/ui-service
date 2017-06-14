'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BatchJobMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService,ngDialog) {
    
	var vm = this; 
	
	vm.batchJobModel = [];
	
	var organize;
	var getMyOrganize = function(){
		var getMyOrganizeServiceUrl = '/api/v1/users/me/organizes';
		var organizeDeferred = Service.doGet(getMyOrganizeServiceUrl);
		organizeDeferred.promise.then(function(response){
			organize = response.data[0];
			getBatchJobInfo(organize.organizeId)
		}).catch(function(response){
			console.log("get organize fail.")
		});
	}
	

	var getBatchJobInfo = function(ownerId){
		console.log(ownerId)
		var getBatchJobInfoServiceUrl = '/api/v1/organizes/'+ownerId+'/batch-jobs';
		var batchJobInfoDeferred = Service.doGet(getBatchJobInfoServiceUrl);
		batchJobInfoDeferred.promise.then(function(response){
			vm.batchJobModel = response.data;
		}).catch(function(response){
			console.log("can not get information.")
		});
	}

	var initial = function(){
		getMyOrganize();
	}
	initial();

	
} ]);