'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('WebServiceMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog','scfFactory',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService,ngDialog,scfFactory) {

		var vm = this;
		
	    var defered = scfFactory.getUserInfo();
	    defered.promise.then(function(response) {	    	
		    	
			var firstTimeWebServiceChecking = true;
			vm.webServiceModel;
			vm.organize = {
				organizeId : null,
				organizeName : null
			};
	
			$scope.$on('onload', function(e) {
				systemWebServiceChecking();
			});
	
			var getBankCode = function(){
				return $rootScope.userInfo.fundingId;
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
	
			var validateDoubleClickWebServiceChecking = function(){
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
	
			var systemWebServiceChecking = function(){
				if(validateDoubleClickWebServiceChecking()){
					for(var i=0; i<vm.webServiceModel.length;i++){
						vm.webServiceModel[i].status = "loading";
						verifySystemStatusWebService(i);
					}
				}else{
					console.log("please wait system processing");
				}
			}
	
	
			var validateOrganizeForCheck = function(){
				var validate;
				if(getBankCode == null){
					vm.showDetails = false;
					validate = false;
				}else{
					vm.showDetails = true;
					validate = true;
				}
				return validate
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
					console.log("validate organization fail.");
				}
				return deffered;
			}
			
	        var initLoad = function() {
				var organize = getBankCode();
				getBankProfile(organize);			
				getWebServiceList();
			}
	
			vm.viewSystemInfo = function(serviceType, updateModel){
				var deffered = SystemIntegrationMonitorService.updateWebServiceInfomation(updateModel);
				deffered.promise.then(function(response) {
					console.log(response);
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
	
			vm.recheck = function(value) {
				vm.webServiceModel[value.recordNo].status = "loading";
				verifySystemStatusWebServiceRecheck(value);
			}
	
			vm.viewProblemDetail = function(serviceType, data , index){
				
				vm.serviceInfo = {
					jobId : null,
					bankCode : data.bankCode,
					requestDataType: data.requestDataType,
					requestMode: data.requestMode,
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
	
			initLoad();

	    });
} ]);
scfApp.controller('ViewServiceInformationController', [ '$scope', '$rootScope', function($scope, $rootScope) {
 var vm = this;
 vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
} ]);
scfApp.controller('ViewProblemDetailController', [ '$scope', '$rootScope', function($scope, $rootScope) {
 var vm = this;
 vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
} ]);