'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('FtpMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService,ngDialog) {
		var vm = this;

		vm.ftpModel;
		var organizeId = null;
		var mode = {
			SPONSOR : 'sponsor',
			BANK : 'bank'
		}

		var firstTimeFTPChecking = true;

		var currentMode = $stateParams.mode;
		

		$scope.$on('onload', function(e) {
			if (currentMode == mode.SPONSOR) {
				vm.sponsorModel = $scope.organize;
				getFTPList();
			}else if(currentMode == mode.BANK){
				systemFTPChecking();
			}
		});

		var verifySystemStatusFTP = function(index){
			var deffered = SystemIntegrationMonitorService.verifySystemStatusFTP(vm.ftpModel[index].jobId);
				deffered.promise.then(function(response) {
					if(response.data.returnCode == "200"){
						vm.ftpModel[index].status = "success";
					}else{
						vm.ftpModel[index].errorMessage = response.data.returnCode + ' - ' + response.data.returnMessage;
						vm.ftpModel[index].status = "fail";
					}
				}).catch(function(response) {
					vm.ftpModel[index].errorMessage = response.status + ' - ' + response.statusText;
					vm.ftpModel[index].status = "fail";
				});
		}
		
		var verifyStatusFTP= function(ftpModel){
			var deffered = SystemIntegrationMonitorService.verifySystemStatusFTP(ftpModel.jobId);
			deffered.promise.then(function(response) {
				if(response.data.returnCode == "200"){
					ftpModel.status = "success";
				}else{
					ftpModel.errorMessage = response.data.returnCode + ' - ' + response.data.returnMessage;
					ftpModel.status = "fail";
				}
			}).catch(function(response) {
				ftpModel.errorMessage = response.status + ' - ' + response.statusText;
				ftpModel.status = "fail";
			});
		}

		var validateDoubleClickFTPChecking = function(){
			var validate = true;
			if(firstTimeFTPChecking){
				firstTimeFTPChecking = false;
			}else{
				if(vm.ftpModel != null){
					vm.ftpModel.forEach(function(ftpModel){
						if(ftpModel.status=='loading'){
							validate = false;
						}
					});
				}
			}
			return validate;
		}

		var systemFTPChecking = function(){
			if(validateDoubleClickFTPChecking()){
				if(vm.ftpModel != null){
					vm.ftpModel.forEach(function(ftpModel){
						verifyStatusFTP(ftpModel);
					});
				}
			}else{
				console.log("please wait system processing");
			}
		}

		var validateOrganizeForCheck = function(){
			var validate;
			if(currentMode == mode.SPONSOR){
				if(typeof vm.sponsorModel != 'object'){
					validate = false;
					vm.requireSponsor = true;
					vm.showDetails = false;
				}else{
					if(organizeId != vm.sponsorModel.organizeId){
						firstTimeFTPChecking = true;
					}
					organizeId = vm.sponsorModel.organizeId;
					validate = true;
					vm.requireSponsor = false;
					vm.showDetails = true;
				}
			}else{
				if(getBankCode == null){
					vm.showDetails = false;
					validate = false;
				}else{
					vm.showDetails = true;
					validate = true;
				}
			}
			return validate
		}

		var getFTPList = function(organize){
			if(validateOrganizeForCheck()){
				if(currentMode == mode.SPONSOR){
					if(firstTimeFTPChecking){
						var deffered = SystemIntegrationMonitorService.getFTPList(organizeId);
						deffered.promise.then(function(response) {
							vm.ftpModel = response.data;
							for(var i=0; i<vm.ftpModel.length;i++){
								vm.ftpModel[i].status = 'loading';
								vm.ftpModel[i].isFTP = true;
							}
							systemFTPChecking();
						}).catch(function(response) {
							console.log("connect api fail.");
						});
					}else{
						systemFTPChecking();
					}
				}else{
					var deffered = SystemIntegrationMonitorService.getFTPList(organize);
					deffered.promise.then(function(response) {
							vm.ftpModel = response.data;
							for(var i=0; i<vm.ftpModel.length;i++){
								vm.ftpModel[i].status = 'loading';
								vm.ftpModel[i].isFTP = true;
							}
							systemFTPChecking();
						}).catch(function(response) {
							console.log("connect api fail.");
						});
				}
			}else{
				console.log("validate organize fail.")
			}
		}

		var getBankCode = function(){
			if($stateParams.bankCode != null && $stateParams.bankCode != ''){
				return $stateParams.bankCode;
			}else{
				return null;
			}
		}

		vm.initLoad = function() {
			if(currentMode == mode.BANK){
				var organize = getBankCode();				
				getFTPList(organize);
			}
		}

		vm.initLoad();


		vm.viewSystemInfo = function(updateModel){
			var deffered = SystemIntegrationMonitorService.updateFTPInfomation(updateModel.jobId);
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

		var verifySystemStatusFTPRecheck = function(value){
			var deffered = SystemIntegrationMonitorService.verifySystemStatusFTP(value.jobId);
				deffered.promise.then(function(response) {
					if(response.data.returnCode == "200"){
						vm.ftpModel[value.recordNo].status = "success";
					}else{
						vm.ftpModel[value.recordNo].errorMessage = response.data.returnCode + ' - ' + response.data.returnMessage;
						vm.ftpModel[value.recordNo].status = "fail";
					}
				}).catch(function(response) {
					vm.ftpModel[value.recordNo].errorMessage = response.status + ' - ' + response.statusText;
					vm.ftpModel[value.recordNo].status = "fail";
				});
		}

		vm.recheck = function(value) {
			vm.ftpModel[value.recordNo].status = "loading";
			verifySystemStatusFTPRecheck(value);
		}

		vm.viewProblemDetail = function(data , index){
			vm.serviceInfo = {
				jobId : data.jobId,
				bankCode : null,
				requestDataType: null,
				requestMode: null,
				errorMessage : data.errorMessage,
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
				preCloseCallback : function(value) {
					if (value != null) {
						vm.recheck(value);
					}
				}
			});
		}
} ]);
scfApp.controller('ViewServiceInformationController', [ '$scope', '$rootScope', function($scope, $rootScope) {
 var vm = this;
 vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
} ]);
scfApp.controller('ViewProblemDetailController', [ '$scope', '$rootScope', function($scope, $rootScope) {
 var vm = this;
 vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
} ]);