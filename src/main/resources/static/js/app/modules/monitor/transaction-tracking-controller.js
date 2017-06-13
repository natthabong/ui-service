'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('TransactionTrackingController', [ '$scope', 'Service', '$stateParams', '$log', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','TransactionTrackingService','ngDialog',
	function($scope, Service, $stateParams, $log, PagingController, UIFactory, $q, $rootScope, $http, PageNavigation, TransactionTrackingService,ngDialog) {
        var vm = this;

		var roleCriteria = {
			
		}

		vm.pagingController = PagingController.create('api/v1/transaction-trackings/search', roleCriteria, 'GET');

		vm.viewMessage = function(data){

		}

		vm.searchTrackingLog = function(pageModel){
			vm.pagingController.search(pageModel);
		}

		vm.dataTable = {
			identityField: '',
			columns : [
				{
					fieldName : 'actionTime',
					labelEN : 'Date',
					labelTH : 'Date',
					id : 'role-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					fieldName : 'processNo',
					labelEN : 'Process no',
					labelTH : 'Process no',
					id : 'role-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					fieldName : 'transactionNo',
					labelEN : 'Ref no',
					labelTH : 'Ref no',
					id : 'role-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					fieldName : 'Date',
					labelEN : 'Node',
					labelTH : 'Node',
					id : 'role-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					fieldName : 'url',
					labelEN : 'IP',
					labelTH : 'IP',
					id : 'role-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},
				{
					fieldName : 'action',
					labelEN : 'Action',
					labelTH : 'Action',
					id : 'role-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					cssTemplate : 'text-center',
					sortable : false,
					cellTemplate : '<scf-button ng-disabled="false" class="btn-default gec-btn-action" id="role-{{data.roleName}}-view-button" ng-click="ctrl.viewMessage(data)" title="View"><i class="fa fa-search" aria-hidden="true"></i></scf-button>'
				} ]
		}
} ]);