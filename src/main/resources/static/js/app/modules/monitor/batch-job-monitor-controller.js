'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BatchJobMonitorController', [ '$scope', '$stateParams', 'Service', 'BatchJobMonitorService', 'UIFactory', 'PageNavigation','scfFactory',
	function($scope, $stateParams, Service, BatchJobMonitorService, UIFactory, PageNavigation, scfFactory) {
    
	var vm = this; 
	vm.canRunNow = false;
	
    var defered = scfFactory.getUserInfo();
    defered.promise.then(function(response) {	
	
		vm.batchJobModel = [];
	
		var mode = {
			BANK : 'bank',
			GEC : 'gec',
			SPONSOR : 'sponsor'
		}

		var currentMode = $stateParams.mode;
		$scope.$on('onload', function(e) {
			if(currentMode == mode.BANK){
				getBatchJobInfo($rootScope.userInfo.fundingId);
			}else if(currentMode == mode.GEC){
				getMyOrganize();
				getBatchJobInfo($rootScope.userInfo.organizeId);
			}else{
				//For Customer
				getBatchJobInfo( $scope.organize.organizeId);
			}
	    });
	
		var getMyOrganize = function(){
			var getMyOrganizeServiceUrl = '/api/v1/users/me/organizes';
			var organizeDeferred = Service.doGet(getMyOrganizeServiceUrl);
			organizeDeferred.promise.then(function(response){
				var organize = response.data[0];
			}).catch(function(response){
				console.log("get organize fail.")
			});
		}
	
	//	var getBankProfile = function(bankCode){
	//		var serviceUrl = '/api/v1/organize-customers/'+bankCode+'/profile';
	//		var serviceDiferred = Service.doGet(serviceUrl, {});		
	//		serviceDiferred.promise.then(function(response){
	//			organize = response.data;
	//			getBatchJobInfo(organize.organizeId);
	//		}).catch(function(response){
	//			console.log('Load customer code group data error');
	//		});
	//	}
		
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
				getMyOrganize();
				getBatchJobInfo(response.fundingId);
			}else if(currentMode == mode.GEC){
				getMyOrganize();
				getBatchJobInfo(response.organizeId);
			}
		}
		initial();
		
		
		vm.view = function(data){
			var params = {params: data};
			PageNavigation.gotoPage('/batch-job-tracking', params,params.params);
		}
		
		vm.runJob = function(job){

			vm.organizeId = '';
			if(currentMode == mode.BANK){
				getMyOrganize();
				vm.organizeId = response.fundingId;
			}else if(currentMode == mode.GEC){
				getMyOrganize();
				vm.organizeId = response.organizeId;
			}else{
				vm.organizeId = $scope.organize.organizeId;
			}
			
			var preCloseCallback = function(confirm) {
				getBatchJobInfo(vm.organizeId);
			}
			UIFactory.showConfirmDialog({
				data : {
					headerMessage : 'Confirm run now?'
				},
				confirm : function() {
					return BatchJobMonitorService.runJob(vm.organizeId, job.jobId);
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
    });
} ]);