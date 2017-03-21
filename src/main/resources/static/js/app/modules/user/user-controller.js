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
		    fieldName : 'organize',
		    labelEN : 'Organize',
		    labelTH : 'Organize',
			id: '{value}-organize',
		    sortable : false,
		    cssTemplate : 'text-right'
		}, {
		    fieldName : 'role',
		    labelEN : 'Role',
		    labelTH : 'Role',
			id: '{value}-role',
		    sortable : false,
		    cssTemplate : 'text-right'
		}, {
		    cssTemplate: 'text-center',
		    sortable : false,
		    cellTemplate: '<scf-button ng-disabled="true" class="btn-default gec-btn-action" id="{{data.organizeId}}-profile-button" ng-click="" title=""><i class="fa fa-trash" aria-hidden="true"></i></scf-button>'
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