'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BankSystemIntegrationMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService, ngDialog) {

        var vm = this; 
        vm.organize = {
			organizeId : null,
			organizeName : null
		};

        vm.check = function(){
            $scope.$broadcast('onload');
        }

        var getBankCode = function(){
			if($stateParams.bankCode != null && $stateParams.bankCode != ''){
				return $stateParams.bankCode;
			}else{
				return null;
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

        var initial = function(){
            var bankCode = getBankCode();
            getBankProfile(bankCode);
        }
        initial();
} ]);