'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('SystemIntegrationMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, PagingController, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService,ngDialog) {
		var vm = this;
		vm.headerName = '';
		vm.showDetails = false;
		vm.success = false;
		vm.isBank = false;
		var firstTimeWebServiceChecking = true;
		var firstTimeFTPChecking = true;
		vm.requireSponsor = false;
		var mode = {
			SPONSOR : 'sponsor',
			BANK : 'bank'
		}
		var organizeId = null;
		vm.webServiceModel;
		vm.ftpModel;
		vm.sponsorModel;
		vm.organize = {
			organizeId : null,
			organizeName : null
		};

		var currentMode = $stateParams.mode;
		
		var getBankCode = function(){
			if($stateParams.bankCode != null && $stateParams.bankCode != ''){
				return $stateParams.bankCode;
			}else{
				return null;
			}
		}

		// Prepare Auto Suggest
		var querySponsorCode = function(value) {
			value = value = UIFactory.createCriteria(value);
			return $http.get('api/v1/buyers', {
			params : {
				q : value,
				offset : 0,
				limit : 5
			}
			}).then(function(response) {
				return response.data.map(function(item) {
					item = prepareAutoSuggestLabel(item);
					return item;
				});
			});
		};

		vm.sponsorAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Please enter organization name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : querySponsorCode
			});
		
		var prepareAutoSuggestLabel = function(item) {
			item.identity = [ 'sponsor-', item.organizeId, '-option' ].join('');
			item.label = [ item.organizeId, ': ', item.organizeName ].join('');
			return item;
		}
		// Prepare Auto Suggest

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

		var verifyService = function(service){
			var deffered = SystemIntegrationMonitorService.verifySystemStatusWebService(service);
			deffered.promise.then(function(response) {
				if(response.data.status == "UP"){
					service.status = "success";
				}else{
					service.errorMessage = response.data.code + ' - ' + response.data.message;
					service.status = "fail";
				}
			}).catch(function(response) {
				service.errorMessage = response.status + ' - ' + response.statusText;
				service.status = "fail";
			});
		}

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
		
		var verifyFTP = function(ftp){
			var deffered = SystemIntegrationMonitorService.verifySystemStatusFTP(ftp.jobId);
			deffered.promise.then(function(response) {
				if(response.data.returnCode == "200"){
					ftp.status = "success";
				}else{
					ftp.errorMessage = response.data.returnCode + ' - ' + response.data.returnMessage;
					ftp.status = "fail";
				}
			}).catch(function(response) {
				ftp.errorMessage = response.status + ' - ' + response.statusText;
				ftp.status = "fail";
			});
	    } 

		//Check User Double Click
		var validateDoubleClickFTPChecking = function(){
			var validate = true;
			if(firstTimeFTPChecking){
				firstTimeFTPChecking = false;
			}else{
				vm.ftpModel.forEach(function(ftp) {
					if(ftp.status=='loading'){
						validate = false;
					}
				});
			}
			return validate;
		}

		var validateDoubleClickWebServiceChecking = function(){
			var validate = true;
			if(firstTimeWebServiceChecking){
				firstTimeWebServiceChecking = false;
			}else{
				vm.webServiceModel.forEach(function(service) {
					if(service.status=='loading'){
						validate = false;
					}
				});
			}
			return validate;
		}
		//Check User Double Click

		var systemFTPChecking = function(){
			if(validateDoubleClickFTPChecking()){
				vm.ftpModel.forEach(function(ftp) {
					verifyFTP(ftp);
				});
			}
		}
		var systemWebServiceChecking = function(){
			if(validateDoubleClickWebServiceChecking()){
				vm.webServiceModel.forEach(function(service) {
					verifyService(service);
				});
			}
			
		}

		// initial Display Name
		var getWebServiceList = function(){
			if(validateOrganizeForCheck){
				var deffered = SystemIntegrationMonitorService.getWebServiceList(getBankCode());
				deffered.promise.then(function(response) {
						vm.webServiceModel = response.data;
						for(var i=0; i<vm.webServiceModel.length;i++){
							vm.webServiceModel[i].status = 'loading';
							vm.webServiceModel[i].isFTP = false;
						}
						systemWebServiceChecking();
					}).catch(function(response) {
						console.log("connect api fail.");
					});
			}else{
				console.log("validate organize fail.");
			}
			return deffered;
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
				console.log("validate organization fail.")
			}
		}
		// initial Display Name
		
		var getBankProfile = function(bankCode){
			var serviceUrl = '/api/v1/organize-customers/'+bankCode+'/profile';
			var serviceDiferred = Service.doGet(serviceUrl, {});		
			serviceDiferred.promise.then(function(response){
				vm.organize.organizeId= response.data.organizeId;
				vm.organize.organizeName = response.data.organizeName;
			}).catch(function(response){
				log.error('Load customer code group data error');
			});
		}

		vm.initLoad = function() {
			if (currentMode == mode.SPONSOR) {
				vm.headerName = 'Sponsor system integration monitor';
				vm.isBank = false;
			}else if(currentMode == mode.BANK){
				vm.headerName = 'Bank system integration monitor';
				vm.isBank = true;
				var organize = getBankCode();
				getBankProfile(organize);			
				getWebServiceList();				
				getFTPList(organize);
			}
		}

		vm.initLoad();

		vm.systemChecking = function(){
			if (currentMode == mode.SPONSOR) {
				getFTPList();
			}else if(currentMode == mode.BANK){
				systemFTPChecking();
				systemWebServiceChecking();
			}
		}

		var verifySystemStatusWebServiceRecheck = function(value){
			var deffered = SystemIntegrationMonitorService.verifySystemStatusWebService(value);
				deffered.promise.then(function(response) {
					if(response.data.status == "UP"){
						vm.webServiceModel[value.recordNo].status = "success";
					}else{
						vm.webServiceModel[value.recordNo].errorMessage = response.data.code + ' - ' + response.data.message;
						vm.webServiceModel[value.recordNo].status = "fail";
					}
				}).catch(function(response) {
					vm.webServiceModel[value.recordNo].errorMessage = response.status + ' - ' + response.statusText;
					vm.webServiceModel[value.recordNo].status = "fail";
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
			if(value.jobId == null){
				vm.webServiceModel[value.recordNo].status = "loading";
				verifySystemStatusWebServiceRecheck(value);
			}else{
				vm.ftpModel[value.recordNo].status = "loading";
				verifySystemStatusFTPRecheck(value);
			}
		}

		
		vm.viewSystemInfo = function(serviceType, updateModel){
			if(serviceType === 'gateway'){
				var deffered = SystemIntegrationMonitorService.updateWebServiceInfomation(updateModel);
				deffered.promise.then(function(response) {
					var data = response.data[0];
					vm.serviceInfo = {
						serviceName : data.displayName,
						serviceType : 'Web service',
						protocal : 'https',
						url : data.bankUrl,
						userName : '-',
						host : null,
						port : null,
						remoteDirectory : null,
						isFTP : false
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
					});
				}).catch(function(response) {
					console.log("Load data fail.");
				});
			}else{
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
		}
	
			
		vm.viewProblemDetail = function(serviceType, data , index){
			if(serviceType==='ftp'){
				vm.serviceInfo = {
					jobId : data.jobId,
					bankCode : null,
					requestDataType: null,
					requestMode: null,
					errorMessage : data.errorMessage,
					recordNo:index
				};
			}else{
				vm.serviceInfo = {
					jobId : null,
					bankCode : data.bankCode,
					requestDataType: data.requestDataType,
					requestMode: data.requestMode,
					errorMessage : data.errorMessage,
					recordNo:index
				};
			}
			
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