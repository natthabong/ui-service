'use strict';
var scfApp = angular.module('gecscf.monitoring');
scfApp.controller('ViewBatchJobMonitorDetailController', 
[ '$scope', 'Service', '$stateParams', 'UIFactory', '$q','$rootScope', '$http','PageNavigation','$timeout',
	function($scope, Service, $stateParams, UIFactory, $q, $rootScope, $http, PageNavigation, $timeout) {
        var vm = this;

        vm.batchTrackingDetail = $stateParams.trackingDetailModel;
        
        vm.back = function(){
            $timeout(function(){
                PageNavigation.backStep();
            }, 10);
        }

        var initial = function(){
            if($stateParams.params.length == 0){
                PageNavigation.gotoPage("/monitoring/customer-system-integration",undefined,undefined);
            }
        }
        initial();

} ]);
