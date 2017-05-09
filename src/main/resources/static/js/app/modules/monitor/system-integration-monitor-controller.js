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

		var getMyOrganize = function() {
			vm.organize = angular.copy($rootScope.userInfo);
		}

		var currentMode = $stateParams.mode;
		
		var getBankCode = function(){
			return $stateParams.bankCode;
		}

		// Prepare Auto Suggest
		var querySponsorCode = function(value) {
			value = value = UIFactory.createCriteria(value);
			return $http.get('api/v1/sponsors', {
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
			placeholder : 'Enter organize name or code',
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
				}else{
					organizeId = vm.sponsorModel.organizeId;
					validate = true;
				}
			}else{
				if(vm.organize == null || vm.organize == undefined || vm.organize == ''){
					validate = false;
				}else{
					validate = true;
				}
			}
			return validate
		}


		var verifySystemStatusWebService = function(index){
			var deffered = SystemIntegrationMonitorService.verifySystemStatusWebService(vm.webServiceModel[index]);
				deffered.promise.then(function(response) {
					if(response.data.status == "UP"){
						vm.webServiceModel[index].status = "success";
					}else{
						vm.webServiceModel[index].errorMessage = response.data.code + ' - ' + response.data.message;
						vm.webServiceModel[index].status = "fail";
					}
				}).catch(function(response) {
					vm.webServiceModel[index].errorMessage = response.status + ' - ' + response.statusText;
					vm.webServiceModel[index].status = "fail";
				});
		}

		var verifySystemStatusFTP = function(index){
			var deffered = SystemIntegrationMonitorService.verifySystemStatusFTP(vm.ftpModel[index].ftpConnectionConfigId);
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


		var validateWaitFTPChecking = function(){
			var validate = true;
			if(firstTimeFTPChecking){
				firstTimeFTPChecking = false;
			}else{
				for(var i=0; i<vm.ftpModel.length;i++){
					if(vm.ftpModel[i].status=='loading'){
						validate = false;
					}
				}
			}
			return validate;
		}

		var validateWaitWebServiceChecking = function(){
			var validate = true;
			if(firstTimeWebServiceChecking){
				firstTimeWebServiceChecking = false;
			}else{
				for(var i=0; i<vm.webServiceModel.length;i++){
					if(vm.webServiceModel[i].status=='loading'){
						validate = false;
					}
				}
			}
			return validate;
		}

		var systemFTPChecking = function(){
			if(validateOrganizeForCheck()){
				vm.showDetails = true;
				if(validateWaitFTPChecking()){
					for(var i=0; i<vm.ftpModel.length;i++){
						vm.ftpModel[i].status = "loading";
						verifySystemStatusFTP(i);
					}
				}else{
					console.log("please wait system processing");
				}
			}else{
				vm.showDetails = false;
			}
		}

		var systemWebServiceChecking = function(){
			if(validateOrganizeForCheck()){
				vm.showDetails = true;
				if(validateWaitWebServiceChecking()){
					for(var i=0; i<vm.webServiceModel.length;i++){
						vm.webServiceModel[i].status = "loading";
						verifySystemStatusWebService(i);
					}
				}else{
					console.log("please wait system processing");
				}
			}else{
				vm.showDetails = false;
			}
		}

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
					var deffered = SystemIntegrationMonitorService.getFTPList(organizeId)
				}else{
					var deffered = SystemIntegrationMonitorService.getFTPList(organize);
				}
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
				console.log("validate organize fail.")
			}
		}
		
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
				getMyOrganize();				
				getWebServiceList();				
				getFTPList(organize);
			}
		}

		vm.initLoad();

		vm.systemChecking = function(){
			if (currentMode == mode.SPONSOR) {
				getFTPList()
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
			var deffered = SystemIntegrationMonitorService.verifySystemStatusFTP(value.ftpConnectionConfigId);
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
			if(value.ftpConnectionConfigId == null){
				verifySystemStatusWebServiceRecheck(value);
			}else{
				verifySystemStatusFTPRecheck(value);
			}
		}

		
		vm.viewSystemInfo = function(serviceType, data){
				if(serviceType==='ftp'){
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
				}else{
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
				}
				
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
				}

		vm.viewProblemDetail = function(serviceType, data , index){
			if(serviceType==='ftp'){
				vm.serviceInfo = {
				ftpConnectionConfigId : data.ftpConnectionConfigId,
				bankCode : null,
				requestDataType: null,
				requestMode: null,
				errorMessage : data.errorMessage,
				recordNo:index
			};
			}else{
				vm.serviceInfo = {
					ftpConnectionConfigId : null,
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