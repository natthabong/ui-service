'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BankSystemIntegrationMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService, ngDialog) {

        var vm = this;
        vm.check = function(){
            $scope.$broadcast('onload');
        }
        vm.funding = {
			fundingId : null,
			fundingName : null
		};

        vm.fundingDropdown = [];
        vm.searchFundings = function() {
       	 	var serviceDiferred = Service.doGet('api/v1/fundings');
            var failedFunc = function(response) {
            	vm.funding.fundingId = $rootScope.userInfo.fundingId;
               	vm.funding.fundingName = $rootScope.userInfo.fundingName;
            };
            var successFunc = function(response) {
	           	var _fundings = response.data;
	           	if (angular.isDefined(_fundings)) {
	           		vm.funding.fundingId = _fundings[0].fundingId;
	           		vm.funding.fundingName = _fundings[0].fundingName;
	           		_fundings.forEach(function (funding) {
	                      var selectObj = {
	                          label: funding.fundingName,
	                          value: funding.fundingId
	                      }
	                      vm.fundingDropdown.push(selectObj);
	                   });
	          	  }
            };
            serviceDiferred.promise.then(successFunc).catch(failedFunc);
        }

        var initial = function(){
        	vm.searchFundings();
        }
        initial();
} ]);