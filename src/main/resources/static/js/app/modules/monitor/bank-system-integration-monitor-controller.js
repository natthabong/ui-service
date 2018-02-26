'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BankSystemIntegrationMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService, ngDialog) {

        var vm = this;
        vm.readyToShow = false;
        vm.fundingModel;
        vm.useFundingFromDropdown;
        vm.check = function(){
        	if(validateFundingModel){
        		$scope.useFundingFromDropdown = vm.useFundingFromDropdown;
        		$scope.fundingModel = vm.fundingModel;
                $scope.$broadcast('onload');
        	}
        }
        
        var validateFundingModel= function(){
			var validate;
            if(typeof vm.fundingModel != 'object'){
                validate = false;
            } else {
                validate = true;
            }
			return validate
		}
        
        vm.fundingModel = {
			fundingId : null,
			fundingName : null
		};

        vm.fundingDropdown = [];
        vm.searchFundings = function() {
       	 	var serviceDiferred = Service.doGet('api/v1/fundings');
            var failedFunc = function(response) {
            	vm.fundingModel.fundingId = $rootScope.userInfo.fundingId;
               	vm.fundingModel.fundingName = $rootScope.userInfo.fundingName;
               	vm.readyToShow = true;
               	$scope.useFundingFromDropdown = vm.useFundingFromDropdown;
        		$scope.fundingModel = vm.fundingModel;
            };
            var successFunc = function(response) {
	           	var _fundings = response.data;
	           	if (angular.isDefined(_fundings)) {
	           		vm.fundingModel.fundingId = _fundings[0].fundingId;
	           		vm.fundingModel.fundingName = _fundings[0].fundingName;
	           		_fundings.forEach(function (funding) {
	                      var selectObj = {
	                          label: funding.fundingName,
	                          value: funding.fundingId
	                      }
	                      vm.fundingDropdown.push(selectObj);
	                   });
	          	}
	           	vm.readyToShow = true;
	           	$scope.useFundingFromDropdown = vm.useFundingFromDropdown;
        		$scope.fundingModel = vm.fundingModel;
            };
            serviceDiferred.promise.then(successFunc).catch(failedFunc);
        }

        var initial = function(){
        	vm.searchFundings();
        }
        initial();
} ]);