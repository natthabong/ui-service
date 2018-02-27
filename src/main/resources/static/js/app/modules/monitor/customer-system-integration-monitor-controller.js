'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('CustomerSystemIntegrationMonitorController', [
		'$scope',
		'Service',
		'$stateParams',
		'$log',
		'UIFactory',
		'$q',
		'$rootScope',
		'$http',
		'PageNavigation',
		'SystemIntegrationMonitorService',
		'ngDialog',
		'scfFactory',
		function($scope, Service, $stateParams, $log, UIFactory, $q,
				$rootScope, $http, PageNavigation,
				SystemIntegrationMonitorService, ngDialog, scfFactory) {

			var vm = this;
			vm.isDisplay = false;
			vm.readyToShow = false;
			vm.monitorOwnerModel = {
				id : "",
				name : ""
			}

	        var validateOrganizeValue= function(){
				var validate = false;
	            if(typeof vm.customerModel != 'object'){
	                vm.requireCustomer = true;
	                vm.showDetails = false;
	                validate = false;
	            }else{
	                vm.requireCustomer = false;
	                vm.showDetails = true;
	                validate = true;
	            }
				return validate
			}

			vm.check = function() {
				if(validateOrganizeValue()){
					vm.monitorOwnerModel.id = vm.customerModel.memberId;
					vm.monitorOwnerModel.name = vm.customerModel.memberName;	
					vm.readyToShow = true;
					$scope.isMultiProfile = false;
					$scope.monitorOwnerModel = vm.monitorOwnerModel;
					$scope.$broadcast('onload');
				}
			}

			var defered = scfFactory.getUserInfo();
			defered.promise.then(function(response) {
				
		        // Prepare Auto Suggest
				var queryOrganizationCode = function(value) {
					value = value = UIFactory.createCriteria(value);
					return $http.get('api/v1/organizes', {
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
				
				var prepareAutoSuggestLabel = function(item) {
					item.identity = [ 'customer-', item.memberId, '-option' ].join('');
					item.label = [ item.memberCode, ': ', item.memberName ].join('');
					return item;
				}

				vm.customerAutoSuggestModel = UIFactory.createAutoSuggestModel({
					placeholder : 'Please enter organization name or code',
					itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
					query : queryOrganizationCode
				});
				
				vm.isDisplay = true;
			});
}]);