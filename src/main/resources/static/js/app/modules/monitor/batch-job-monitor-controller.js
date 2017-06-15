'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BatchJobMonitorController', [ '$scope', '$stateParams', 'Service', 'BatchJobMonitorService', 'UIFactory', 'PageNavigation',
	function($scope, $stateParams, Service, BatchJobMonitorService, UIFactory, PageNavigation) {
    
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
			getBatchJobInfo(organize.organizeId);
		}
    });

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

	var getBankProfile = function(bankCode){
		var serviceUrl = '/api/v1/organize-customers/'+bankCode+'/profile';
		var serviceDiferred = Service.doGet(serviceUrl, {});		
		serviceDiferred.promise.then(function(response){
			organize = response.data;
			getBatchJobInfo(organize.organizeId);
		}).catch(function(response){
			console.log('Load customer code group data error');
		});
	}
	
	var getBatchJobInfo = function(organizeId){
		var loadBatchDeferred = BatchJobMonitorService.getBatchJobs(organizeId);
		loadBatchDeferred.promise.then(function(response){
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
	
	
	vm.view = function(data){
		var params = {params: data};
		PageNavigation.gotoPage('/batch-job-tracking', params,params.params);
	}
	
	vm.runJob = function(job){
		var preCloseCallback = function(confirm) {
			getBatchJobInfo(organize.organizeId);
		}
		UIFactory.showConfirmDialog({
			data : {
				headerMessage : 'Confirm run now?'
			},
			confirm : function() {
				return BatchJobMonitorService.runJob(organize.organizeId, job.jobId);
			},
			onFail : function(response) {
				var msg = {
					409 : 'Batch job processing.'
				};
				UIFactory.showFailDialog({
					data : {
						headerMessage : 'Run now batch job fail.',
						bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
					},
					preCloseCallback : preCloseCallback
				});
			},
			onSuccess : function(response) {
				UIFactory.showSuccessDialog({
					data : {
						headerMessage : 'Run now batch job success.',
						bodyMessage : ''
					},
					preCloseCallback : preCloseCallback
				});
			}
		});
	}
	
} ]);