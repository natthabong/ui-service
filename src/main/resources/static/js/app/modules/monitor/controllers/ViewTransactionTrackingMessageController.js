'use strict';
var scfApp = angular.module('gecscf.monitoring');
scfApp.controller('ViewTransactionTrackingMessageController', 
[ '$scope', 'Service', '$stateParams', 'UIFactory', '$q','$rootScope', '$http','PageNavigation','$timeout',
	function($scope, Service, $stateParams, UIFactory, $q, $rootScope, $http, PageNavigation, $timeout) {
        var vm = this;

        vm.trackingMessage = $stateParams.params;
        vm.back = function(){
            $timeout(function(){
                PageNavigation.backStep();
            }, 10);
        }

        var initial = function(){
            if($stateParams.params.length == 0){
                PageNavigation.gotoPage("/monitoring/transaction-tracking",undefined,undefined);
            }
        }
        initial();

} ]);
