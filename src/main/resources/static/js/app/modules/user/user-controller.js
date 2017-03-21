'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('UserController', [
	'$scope',
	'$stateParams',
	'$log',
	'$q',
	'$rootScope',
	'$http',
	'Service',
	'ngDialog',
	'SCFCommonService',
	'UIFactory',
	'PagingController',
	function($scope, $stateParams, $log, $q, $rootScope, $http, Service,ngDialog,
		SCFCommonService, UIFactory, PagingController) {

	    var vm = this;
	    var log = $log;

	    vm.dataTable = {
		columns : [ {
		    fieldName : '$org',
		    labelEN : 'Organize',
		    labelTH : 'องค์กร',
		    sortable : false,
		    cssTemplate : 'text-right'
		}, {
		    fieldName : '$role',
		    labelEN : 'Role',
		    labelTH : 'บทบาท',
		    sortable : false,
		    cssTemplate : 'text-right'
		}, {
		    fieldName : '$des',
		    labelEN : '',
		    labelTH : '',
		    sortable : false,
		    cssTemplate : 'text-right'
		} ]
	    };
	    
	    
	    vm.addRole = function(){
		ngDialog.open({
                    template: '/user-organize',
                    scope: $scope,
                    disableAnimation: true
                });
	    }

	} ]);