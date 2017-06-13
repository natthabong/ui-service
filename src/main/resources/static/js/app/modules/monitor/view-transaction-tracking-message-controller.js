'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('ViewTransactionTrackingMessageController', 
[ '$scope', 'Service', '$stateParams', 'UIFactory', '$q','$rootScope', '$http','PageNavigation','ngDialog',
	function($scope, Service, $stateParams, UIFactory, $q, $rootScope, $http, PageNavigation,ngDialog) {
        var vm = this;

        vm.trackingMessage = $stateParams.param;
        vm.back = function(){
            PageNavigation.gotoPreviousPage(false);
        }
} ]);
