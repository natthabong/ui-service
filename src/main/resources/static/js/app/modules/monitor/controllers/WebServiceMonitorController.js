'use strict';
var scfApp = angular.module('gecscf.monitoring');
scfApp.controller('WebServiceMonitorController', ['$scope', 'Service',
	'$stateParams', '$log', 'UIFactory', '$q', '$rootScope', '$http',
	'PageNavigation', 'SystemIntegrationMonitorService', 'ngDialog',
	'scfFactory',
	function ($scope, Service, $stateParams, $log, UIFactory,
		$q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService,
		ngDialog, scfFactory) {

		var vm = this;

		vm.viewInfo = function (serviceType, webServiceModel) {
			var deffered = SystemIntegrationMonitorService.updateWebServiceInfomation(webServiceModel);
			deffered.promise.then(function (response) {
				var data = response.data;
				vm.serviceInfo = {
					serviceName: data.displayName,
					serviceType: data.serviceType,
					protocal: 'https',
					url: data.connection.url,
					userName: '-',
					host: null,
					port: null,
					remoteDirectory: null,
					isFTP: false
				};
				var systemInfo = ngDialog.open({
					id: 'service-information-dialog',
					template: '/js/app/modules/monitor/templates/dialog-service-information.html',
					className: 'ngdialog-theme-default',
					controller: 'ViewServiceInformationController',
					controllerAs: 'ctrl',
					scope: $scope,
					data: {
						serviceInfo: vm.serviceInfo
					}
				});
			}).catch(function (response) {
				console.log("Load data fail.");
			});
		}

		vm.viewProblem = function (serviceType, data, index) {
			vm.serviceInfo = {
				jobId: null,
				bankCode: data.bankCode,
				requestDataType: data.requestDataType,
				requestMode: data.requestMode,
				errorMessage: data.errorMessage,
				recordNo: index
			};

			var problemDialog = ngDialog.open({
				id: 'problem-detail-dialog',
				template: '/js/app/modules/monitor/templates/dialog-problem-detail.html',
				className: 'ngdialog-theme-default',
				controller: 'ViewProblemDetailController',
				controllerAs: 'ctrl',
				scope: $scope,
				data: {
					serviceInfo: vm.serviceInfo
				},
				preCloseCallback: function (value) {
					if (value != null) {
						vm.recheck(value);
					}
				}
			});
		}
		
		vm.recheck = function(value) {
			vm.webServices[value.recordNo].status = "loading";
			var deffered = SystemIntegrationMonitorService.verifySystemStatusWebService(value);
			deffered.promise.then(function (response) {
				if (response.data.status == "UP") {
					vm.webServices[value.recordNo].status = "success";
				} else {
					vm.webServices[value.recordNo].errorMessage = response.data.code + ' - ' + response.data.message;
					vm.webServices[value.recordNo].status = "fail";
				}
			}).catch(function (response) {
				vm.webServices[value.recordNo].errorMessage = response.status + ' - ' + response.statusText;
				vm.webServices[value.recordNo].status = "fail";
			});
		}
		
		var verify = function (webServiceModel) {
			var deffered = SystemIntegrationMonitorService.verifySystemStatusWebService(webServiceModel);
			deffered.promise.then(function (response) {
				if (response.data.status == "UP") {
					webServiceModel.status = "success";
				} else {
					webServiceModel.errorMessage = response.data.code + ' - ' + response.data.message;
					webServiceModel.status = "fail";
				}
			}).catch(function (response) {
				webServiceModel.errorMessage = response.status + ' - ' + response.statusText;
				webServiceModel.status = "fail";
			});
		}

		var defered = scfFactory.getUserInfo();
		defered.promise.then(function (response) {

			$scope.$on('onload', function (e) {
				getWebServices();
			});

			var getWebServices = function () {
				var deffered = SystemIntegrationMonitorService.getWebServiceList($scope.monitorOwnerModel.id);
				deffered.promise.then(function (response) {
					vm.webServices = response.data;
					angular.forEach(vm.webServices, function (service) {
						service.status = 'loading';
						service.isFTP = false;
						verify(service);
					});
				}).catch(function (response) {
					console.log("connect api fail.");
				});
			}

			var initialization = function () {
				getWebServices();
			}();
		});
	}
]);

scfApp.controller('ViewServiceInformationController', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		var vm = this;
		vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
	}
]);

scfApp.controller('ViewProblemDetailController', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		var vm = this;
		vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
	}
]);