'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BatchJobMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService,ngDialog) {
    
	var vm = this; 
	
	vm.batchJobModel = [];

	var mode = {
		BANK : 'bank',
		GEC : 'gec',
		SPONSOR : 'sponsor'
	}

	var currentMode = $stateParams.mode;

	$scope.$on('onload', function(e) {
		if(currentMode == mode.BANK){
			var bankCode = $stateParams.bankCode;
			getBankProfile(bankCode);
		}else if(currentMode == mode.GEC){
			getMyOrganize();
		}else{
			organize = $scope.organize;
			getBatchJobInfo();
		}
    });

	var organize;

	var getMyOrganize = function(){
		var getMyOrganizeServiceUrl = '/api/v1/users/me/organizes';
		var organizeDeferred = Service.doGet(getMyOrganizeServiceUrl);
		organizeDeferred.promise.then(function(response){
			organize = response.data[0];
			getBatchJobInfo()
		}).catch(function(response){
			console.log("get organize fail.")
		});
	}

	var getBankProfile = function(bankCode){
		var serviceUrl = '/api/v1/organize-customers/'+bankCode+'/profile';
		var serviceDiferred = Service.doGet(serviceUrl, {});		
		serviceDiferred.promise.then(function(response){
			organize = response.data;
			getBatchJobInfo();
		}).catch(function(response){
			console.log('Load customer code group data error');
		});
	}
	

	var getBatchJobInfo = function(){
		var getBatchJobInfoServiceUrl = '/api/v1/organizes/'+organize.organizeId+'/batch-jobs';
		var batchJobInfoDeferred = Service.doGet(getBatchJobInfoServiceUrl);
		batchJobInfoDeferred.promise.then(function(response){
			vm.batchJobModel = response.data;
		}).catch(function(response){
			console.log("can not get batch job information.")
		});
	}

	var initial = function(){
		if(currentMode == mode.BANK){
			var bankCode = $stateParams.bankCode;
			getBankProfile(bankCode);
		}else if(currentMode == mode.GEC){
			getMyOrganize();
		}
	}
	initial();

	
} ]);