'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('FtpMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog','scfFactory',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService,ngDialog,scfFactory) {
		var vm = this;
		
		vm.viewInfo = function(channel){
			var deffered = SystemIntegrationMonitorService.updateFTPInfomation(channel.jobName);
			deffered.promise.then(function(response) {
				var data = response.data;
				vm.serviceInfo = {
					serviceName : data.displayName,
					serviceType : 'FTP',
					protocal : 'SFTP',
					url : null,
					userName : data.remoteUsername,
					host : data.remoteHost,
					port : data.remotePort,
					remoteDirectory : data.remotePath,
					isFTP : true
				};
				var systemInfo = ngDialog.open({
					id : 'service-information-dialog',
					template : '/js/app/modules/monitor/dialog-service-information.html',
					className : 'ngdialog-theme-default',
					controller: 'ViewServiceInformationController',
					controllerAs: 'ctrl',
					scope : $scope,
					data : {
						serviceInfo : vm.serviceInfo
					}
				})
			}).catch(function(response) {
				console.log("Load data fail.");
			});
		}
		
		vm.recheck = function(channel) {
			vm.channels[channel.recordNo].status = "loading";
			var deffered = SystemIntegrationMonitorService.verifySystemStatusFTP(channel.jobName);
			deffered.promise.then(function(response) {
				if(response.data.returnCode == "200"){
					vm.channels[channel.recordNo].status = "success";
				}else{
					vm.channels[channel.recordNo].errorMessage = response.data.returnCode + ' - ' + response.data.returnMessage;
					vm.channels[channel.recordNo].status = "fail";
				}
			}).catch(function(response) {
				vm.channels[channel.recordNo].errorMessage = response.status + ' - ' + response.statusText;
				vm.channels[channel.recordNo].status = "fail";
			});
		}

		vm.viewProblem = function(channel , index){
			vm.serviceInfo = {
				jobName : channel.jobName,
				bankCode : null,
				requestDataType: null,
				requestMode: null,
				errorMessage : channel.errorMessage,
				recordNo:index
			};
			var problemDialog = ngDialog.open({
				id : 'problem-detail-dialog',
				template : '/js/app/modules/monitor/dialog-problem-detail.html',
				className : 'ngdialog-theme-default',
				controller: 'ViewProblemDetailController',
				controllerAs: 'ctrl',
				scope : $scope,
				data : {
					serviceInfo : vm.serviceInfo
				},
				preCloseCallback : function(channel) {
					if (channel != null) {
						vm.recheck(channel);
					}
				}
			});
		}
		
	    var defered = scfFactory.getUserInfo();
	    defered.promise.then(function(response) {
	    	
			$scope.$on('onload', function(e) {
				getChannels();
			});
	    	
			var verify= function(channel){
				var deffered = SystemIntegrationMonitorService.verifySystemStatusFTP(channel.jobName);
				deffered.promise.then(function(response) {
					if(response.data.returnCode == "200"){
						channel.status = "success";
					}else{
						channel.errorMessage = response.data.returnCode + ' - ' + response.data.returnMessage;
						channel.status = "fail";
					}
				}).catch(function(response) {
					channel.errorMessage = response.status + ' - ' + response.statusText;
					channel.status = "fail";
				});
			}
			
	    	var getChannels = function(){
	    		if(!angular.isUndefined($scope.monitorOwnerModel)){
		    		var deffered = SystemIntegrationMonitorService.getFTPList($scope.monitorOwnerModel.id);
					deffered.promise.then(function(response) {
						vm.channels = response.data;
						angular.forEach(vm.channels, function(channel){
							channel.status = 'loading';
							channel.isFTP = true;
							verify(channel);
						});					
					}).catch(function(response) {
						console.log("connect api fail.");
					});
	    		}
	    	}
	    	
			var initialization = function() {
				getChannels();
			}();
	    });
}]);
scfApp.controller('ViewServiceInformationController', [ '$scope', '$rootScope', function($scope, $rootScope) {
 var vm = this;
 vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
} ]);
scfApp.controller('ViewProblemDetailController', [ '$scope', '$rootScope', function($scope, $rootScope) {
 var vm = this;
 vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
} ]);