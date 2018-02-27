'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BatchJobMonitorController', [
		'$scope',
		'$stateParams',
		'Service',
		'BatchJobMonitorService',
		'UIFactory',
		'PageNavigation',
		'ngDialog',
		'scfFactory',
		function($scope, $stateParams, Service, BatchJobMonitorService,
				UIFactory, PageNavigation, ngDialog, scfFactory) {

			var vm = this;
			vm.canRunNow = true;
			
			vm.getRunDate = function(days) {
				var daysOfWeek = days.replace("[","").replace("]","").replace( "1" ,"Sun").replace( "2" ,"Mon").replace( "3" ,"Tue").replace( "4" ,"Wed").replace( "5" ,"Thu").replace( "6" ,"Fri").replace( "7" ,"Sat");
				return daysOfWeek;
			}

			vm.getRunTime = function(batchJob) {

				var generateTime = function(startHour,startMinute,endHour,endMinute){
					var pad = "00";
					var startHourText = pad.substring(0, pad.length - startHour.length) + startHour;
					var startMinuteText =  pad.substring(0, pad.length - startMinute.length)+ startMinute;
					var endHourText = pad.substring(0, pad.length - endHour.length)+ endHour;
					var endMinuteText =  pad.substring(0, pad.length - endMinute.length)+ endMinute;
					return startHourText+":"+startMinuteText+" - "+endHourText+":"+endMinuteText;
				}
				
				var runtime;
									
				if(batchJob.triggerInformations.length == 1){
					var triggerInformation = batchJob.triggerInformations[0];
					runtime = generateTime(triggerInformation.startHour,triggerInformation.startMinute,triggerInformation.endHour,triggerInformation.endMinute);
				}else{

					var max = batchJob.triggerInformations.length;
					var today = new Date();
					var times = [];

					angular.forEach(batchJob.triggerInformations, function(triggerInformation){
						var time = new Date(today.getFullYear(), today.getMonth(), today.getDate(), triggerInformation.startHour, triggerInformation.startMinute, 0);
						times.push(time);
					});
					
					times.sort(function (a, b) {
						  return new Date(a) - new Date(b);
					});
					
					runtime = generateTime(times[0].getHours().toString(),times[0].getMinutes().toString(),times[max-1].getHours().toString(),times[max-1].getMinutes().toString());
				}			
				
				return runtime;
			}
			
			vm.historyJob = function(batchJob){
				var params = {params: batchJob};
				PageNavigation.gotoPage('/batch-job-tracking', params,params.params);
			}
			
			vm.viewInfo = function(batchJob){

				var sunday = false;
				var monday = false;
				var tuesday = false;
				var wednesday = false;
				var thursday = false;
				var friday = false;
				var saturday = false;
				
				var dayOfWeekFrequency = {
	    			SUNDAY : 1,
	    			MONDAY : 2,
	    			TUESDAY : 3,
	    			WEDNESDAY : 4,
	    			THURSDAY : 5,
	    			FRIDAY : 6,
	    			SATURDAY : 7
				}
				
				var daysOfWeek = batchJob.triggerInformations[0].daysOfWeek.replace("[","").replace("]","").split(",");
				daysOfWeek.forEach(function(day){
					if(day == dayOfWeekFrequency.SUNDAY){
						sunday = true
					}
					if(day == dayOfWeekFrequency.MONDAY){
						monday = true;
					}
					if(day == dayOfWeekFrequency.TUESDAY){
						tuesday = true
					}
					if(day == dayOfWeekFrequency.WEDNESDAY){
						wednesday = true
					}
					if(day == dayOfWeekFrequency.THURSDAY){
						thursday = true
					}
					if(day == dayOfWeekFrequency.FRIDAY){
						friday = true
					}
					if(day == dayOfWeekFrequency.SATURDAY){
						saturday = true
					}
				});
				
				var beginTime = '';
				var endTime = '';
				var runTimes  = '';
				
				if(batchJob.interval){
					var triggerInformation = batchJob.triggerInformations[0];
					var hour = triggerInformation.startHour.length == 1 ? "0"+ triggerInformation.startHour : triggerInformation.startHour;
	 				var minute = triggerInformation.startMinute.length == 1 ? "0"+triggerInformation.startMinute : triggerInformation.startMinute;
	 				beginTime = hour + ':' + minute;
					
					hour = triggerInformation.endHour.length == 1 ? "0"+ triggerInformation.endHour : triggerInformation.endHour;
	 				minute = triggerInformation.endMinute.length == 1 ? "0"+triggerInformation.endMinute : triggerInformation.endMinute;
	 				endTime = hour + ':' + minute;
				} else {
					if(batchJob.triggerInformations.length > 0){
						batchJob.triggerInformations.forEach(function(info){
							if(info.startHour != null && info.startMinute != null){
				 				var hour = info.startHour.length == 1 ? "0"+info.startHour : info.startHour;
				 				var minute = info.startMinute.length == 1 ? "0"+info.startMinute : info.startMinute;
								var time = hour + ":" +minute;
				 				runTimes = runTimes + ', ' + time;
							}
			 			});
						if (runTimes.length > 2){
							runTimes = runTimes.substring(2 , runTimes.length);
						}
					}
				}
				vm.batchJobInfo = {
					jobName : batchJob.jobName,
					runTimes : runTimes,
					sunday : sunday,
					monday : monday,
					tuesday : tuesday,
					wednesday : wednesday,
					thursday : thursday,
					friday : friday,
					saturday : saturday,
					runtimeType : batchJob.interval ? "INTERVAL" : "FIXED",
					intervalInMinutes : batchJob.triggerInformations[0].intervalInMinutes,
					beginTime : beginTime ,
					endTime : endTime,
					frequencyType : 'Daily'
				};
				var systemInfo = ngDialog.open({
					id : 'batch-job-detail-dialog',
					template : '/js/app/modules/monitor/dialog-batch-job-detail.html',
					className : 'ngdialog-theme-default',
					controller: 'ViewBatchJobController',
					controllerAs: 'ctrl',
					scope : $scope,
					data : {
						jobInfo : vm.batchJobInfo
					}
				})
			
			}
			
			var getBatchJobInfo = function(){
				if(!angular.isUndefined($scope.monitorOwnerModel)){
					var deferred = BatchJobMonitorService.getBatchJobs($scope.monitorOwnerModel.id);
					deferred.promise.then(function(response){
						vm.batchJobs = response.data;
					}).catch(function(response){
						console.log("can not get batch job information.")
					});	
				}
			}

			vm.runJob = function(batchJob){

				var preCloseCallback = function(confirm) {
					getBatchJobInfo();
				}
				
				UIFactory.showConfirmDialog({
					data : {
						headerMessage : 'Confirm run now?'
					},
					confirm : function() {
						return BatchJobMonitorService.runJob($scope.monitorOwnerModel.id, batchJob.jobId);
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
			
			var defered = scfFactory.getUserInfo();
			defered.promise.then(function(response) {

				$scope.$on('onload', function(e) {
					getBatchJobInfo();
			    });
							
				var initialization = function() {
					getBatchJobInfo();
				}();
			});

}]);

scfApp.controller('ViewBatchJobController', [ '$scope', '$rootScope',
		function($scope, $rootScope) {
			var vm = this;
			vm.jobInfo = angular.copy($scope.ngDialogData.jobInfo);
		} ]);