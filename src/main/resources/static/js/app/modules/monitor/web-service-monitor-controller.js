'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('WebServiceMonitorController', [ '$scope', 'Service',
		'$stateParams', '$log', 'UIFactory', '$q', '$rootScope', '$http',
		'PageNavigation', 'SystemIntegrationMonitorService', 'ngDialog',
		'scfFactory', function($scope, Service, $stateParams, $log, UIFactory,
				$q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService,
				ngDialog, scfFactory) {

			var vm = this;
			
			vm.viewInfo = function(serviceType, webServiceModel){
				var deffered = SystemIntegrationMonitorService.updateWebServiceInfomation(webServiceModel);
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
			
			vm.viewProblem = function(serviceType, data , index){
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

			var defered = scfFactory.getUserInfo();
			defered.promise.then(function(response) {
				
				$scope.$on('onload', function(e) {
					getWebServices();
				});
				
				var verify = function(webServiceModel){
					var deffered = SystemIntegrationMonitorService.verifySystemStatusWebService(webServiceModel);
					deffered.promise.then(function(response) {
						if(response.data.status == "UP"){
							webServiceModel.status = "success";
						}else{
							webServiceModel.errorMessage = response.data.code + ' - ' + response.data.message;
							webServiceModel.status = "fail";
						}
					}).catch(function(response) {
						webServiceModel.errorMessage = response.status + ' - ' + response.statusText;
						webServiceModel.status = "fail";
					});			
				}
				
				var getWebServices = function(){
					var deffered = SystemIntegrationMonitorService.getWebServiceList($scope.monitorOwnerModel.id);
					deffered.promise.then(function(response) {
						vm.webServices = response.data;
						angular.forEach(vm.webServices, function(service){
							service.status = 'loading';
							service.isFTP = false;
							verify(service);
						});
					}).catch(function(response) {
						console.log("connect api fail.");
					});			
				}
				
				var initialization = function() {
					getWebServices();
				}();
			});
		}]);
scfApp.controller('ViewServiceInformationController', [ '$scope', '$rootScope',
		function($scope, $rootScope) {
			var vm = this;
			vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
		} ]);
scfApp.controller('ViewProblemDetailController', [ '$scope', '$rootScope',
		function($scope, $rootScope) {
			var vm = this;
			vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
		} ]);