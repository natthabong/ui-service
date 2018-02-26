'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BatchJobMonitorController', [ '$scope', '$stateParams', 'Service', 'BatchJobMonitorService', 'UIFactory', 'PageNavigation' ,'ngDialog', 'scfFactory',
	function($scope, $stateParams, Service, BatchJobMonitorService, UIFactory, PageNavigation,ngDialog, scfFactory) {
    
	var vm = this; 
	vm.canRunNow = true;
	
    var defered = scfFactory.getUserInfo();
    defered.promise.then(function(response) {	
	
		vm.batchJobModel = [];
	
		var mode = {
			BANK : 'bank',
			GEC : 'gec',
			SPONSOR : 'sponsor'
		}
		
		var dayOfWeekFrequency = {
    			SUNDAY : 1,
    			MONDAY : 2,
    			TUESDAY : 3,
    			WEDNESDAY : 4,
    			THURSDAY : 5,
    			FRIDAY : 6,
    			SATURDAY : 7
		}
      
		vm.getRunDate = function(time) {
			var daysOfWeek = time.replace("[","").replace("]","").replace( "1" ,"Sun").replace( "2" ,"Mon").replace( "3" ,"Tue").replace( "4" ,"Wed").replace( "5" ,"Thu").replace( "6" ,"Fri").replace( "7" ,"Sat");
			return daysOfWeek;
		}
		
		vm.getRunTime = function(time) {
			var startHour = "23";
			var startMin = "59";
			var endHour = "0";
			var endMin = "0";
			time.forEach(function(data){
				if (parseInt(data.startHour, 10) < parseInt(startHour, 10)){
					startHour = data.startHour;
					startMin = data.startMinute;
				}else if (parseInt(data.startHour, 10) == parseInt(startHour, 10)){
					if ( parseInt(data.startMinute, 10) < parseInt(startMin, 10)){
						startHour = data.startHour;
						startMin = data.startMinute;
					}
				}
				if (parseInt(data.endHour, 10) > parseInt(endHour, 10)){
					endHour = data.endHour;
					endMin = data.endMinute;
				}else if (parseInt(data.endHour, 10) == parseInt(endHour, 10)){
					if (parseInt(data.endMinute, 10) > parseInt(endMin, 10)){
						endHour = data.endHour;
						endMin = data.endMinute;
					}
				}
			});
			var pad = "00";
			var runtime = pad.substring(0, pad.length - startHour.length) + startHour + ":" + pad.substring(0, pad.length - startMin.length) + startMin + " - " + pad.substring(0, pad.length - endHour.length) + endHour + ":" + pad.substring(0, pad.length - endMin.length) + endMin;
			return runtime;
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
				getBatchJobInfo( $scope.organize.memberId);
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
		
		
		vm.historyJob = function(data){
			var params = {params: data};
			PageNavigation.gotoPage('/batch-job-tracking', params,params.params);
		}
		
		vm.view = function(data){

			var sunday = false;
			var monday = false;
			var tuesday = false;
			var wednesday = false;
			var thursday = false;
			var friday = false;
			var saturday = false;
			
			var daysOfWeek = data.triggerInformations[0].daysOfWeek.replace("[","").replace("]","").split(",");
			daysOfWeek.forEach(function(data){
				if(data == dayOfWeekFrequency.SUNDAY){
					sunday = true
				}
				if(data == dayOfWeekFrequency.MONDAY){
					monday = true;
				}
				if(data == dayOfWeekFrequency.TUESDAY){
					tuesday = true
				}
				if(data == dayOfWeekFrequency.WEDNESDAY){
					wednesday = true
				}
				if(data == dayOfWeekFrequency.THURSDAY){
					thursday = true
				}
				if(data == dayOfWeekFrequency.FRIDAY){
					friday = true
				}
				if(data == dayOfWeekFrequency.SATURDAY){
					saturday = true
				}
			});
			
			var beginTime = '';
			var endTime = '';
			var runTimes  = '';
			
			if(data.interval){
				var triggerInformation = data.triggerInformations[0];
				var hour = triggerInformation.startHour.length == 1 ? "0"+ triggerInformation.startHour : triggerInformation.startHour;
 				var minute = triggerInformation.startMinute.length == 1 ? "0"+triggerInformation.startMinute : triggerInformation.startMinute;
 				beginTime = hour + ':' + minute;
				
				hour = triggerInformation.endHour.length == 1 ? "0"+ triggerInformation.endHour : triggerInformation.endHour;
 				minute = triggerInformation.endMinute.length == 1 ? "0"+triggerInformation.endMinute : triggerInformation.endMinute;
 				endTime = hour + ':' + minute;
			} else {
				if(data.triggerInformations.length > 0){
					data.triggerInformations.forEach(function(info){
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
				jobName : data.jobName,
				runTimes : runTimes,
				sunday : sunday,
				monday : monday,
				tuesday : tuesday,
				wednesday : wednesday,
				thursday : thursday,
				friday : friday,
				saturday : saturday,
				runtimeType : data.interval ? "INTERVAL" : "FIXED",
				intervalInMinutes : data.triggerInformations[0].intervalInMinutes,
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
scfApp.controller('ViewBatchJobController', [ '$scope', '$rootScope', function($scope, $rootScope) {
	 var vm = this;
	 vm.jobInfo = angular.copy($scope.ngDialogData.jobInfo);
	} ]);