'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('ViewTransactionTrackingMessageController', 
[ '$scope', 'Service', '$stateParams', 'UIFactory', '$q','$rootScope', '$http','PageNavigation',
	function($scope, Service, $stateParams, UIFactory, $q, $rootScope, $http, PageNavigation) {
        var vm = this;

        vm.trackingMessage = $stateParams.params;
        console.log($stateParams.params)
        vm.back = function(){
            PageNavigation.gotoPreviousPage(false);
        }

        var initial = function(){
            if($stateParams.params.length == 0){
                PageNavigation.gotoPage("/transaction-tracking",undefined,undefined);
            }
        }
        initial();

} ]);
