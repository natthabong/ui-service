'use strict';
var scfApp = angular.module('gecscf.monitoring');
scfApp.controller('BankSystemIntegrationMonitorController', [ '$scope',
		'Service', '$stateParams', '$log', 'UIFactory', '$q', '$rootScope',
		'$http', 'PageNavigation', 'SystemIntegrationMonitorService', 'scfFactory',
		'ngDialog', function($scope, Service, $stateParams, $log, UIFactory, $q,
				$rootScope, $http, PageNavigation, SystemIntegrationMonitorService,
				scfFactory, ngDialog) {

			var vm = this;
			vm.isDisplay = false;
			vm.isMultiProfile = false;
			vm.fundingDropdown = [];
			vm.monitorOwnerModel = {
				id : "",
				name : ""
			}

			var defered = scfFactory.getUserInfo();
			defered.promise.then(function(response) {
				vm.isDisplay = true;

				vm.check = function() {
		    		$scope.isMultiProfile = vm.isMultiProfile;
		    		$scope.monitorOwnerModel = vm.monitorOwnerModel;
		            $scope.$broadcast('onload');
				}

				var getFundings = function() {
					var serviceDiferred = Service.doGet('api/v1/fundings');
					var failedFunc = function(response) {
						vm.monitorOwnerModel.id = $rootScope.userInfo.fundingId;
						vm.monitorOwnerModel.name = $rootScope.userInfo.fundingName;
						
						vm.readyToShow = true;
						$scope.isMultiProfile = vm.isMultiProfile;
						$scope.monitorOwnerModel = vm.monitorOwnerModel;
					};
					var successFunc = function(response) {
						var _fundings = response.data;
						if (angular.isDefined(_fundings)) {				
							vm.monitorOwnerModel.id = _fundings[0].fundingId;
							vm.monitorOwnerModel.name = _fundings[0].fundingName;
							
							_fundings.forEach(function(funding) {
								var selectObj = {
									label : funding.fundingName,
									value : funding.fundingId
								}
								vm.fundingDropdown.push(selectObj);
							});
						}
						vm.readyToShow = true;
						$scope.isMultiProfile = vm.isMultiProfile;
						$scope.monitorOwnerModel = vm.monitorOwnerModel;
					};
					serviceDiferred.promise.then(successFunc).catch(failedFunc);
				}

				var initialization = function() {
					getFundings();
				}();
			});
		} ]);