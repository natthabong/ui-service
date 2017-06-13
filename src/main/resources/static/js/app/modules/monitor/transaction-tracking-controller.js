'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('TransactionTrackingController', [ '$scope', 'Service', '$stateParams', '$log', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','TransactionTrackingService','ngDialog',
	function($scope, Service, $stateParams, $log, PagingController, UIFactory, $q, $rootScope, $http, PageNavigation, TransactionTrackingService,ngDialog) {
        var vm = this;

		var trackingCriteria = {
			
		}

		vm.pagingController = PagingController.create('api/v1/transaction-trackings/search', trackingCriteria, 'GET');

		vm.viewMessage = function(data){

		}

		vm.searchTrackingLog = function(pageModel){
			vm.pagingController.search(pageModel);
		}

		vm.dataTable = {
			identityField: '$rowNo',
			columns : [
				{
					fieldName : 'actionTime',
					labelEN : 'Date',
					labelTH : 'Date',
					id : 'action-time-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					fieldName : 'processNo',
					labelEN : 'Process no',
					labelTH : 'Process no',
					id : 'process-no-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					fieldName : 'refNo',
					labelEN : 'Ref no',
					labelTH : 'Ref no',
					id : 'ref-no-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					fieldName : 'node',
					labelEN : 'Node',
					labelTH : 'Node',
					id : 'node-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					fieldName : 'ipAddress',
					labelEN : 'IP',
					labelTH : 'IP',
					id : 'ip-address-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},
				{
					fieldName : 'action',
					labelEN : 'Action',
					labelTH : 'Action',
					id : 'action-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					cssTemplate : 'text-center',
					sortable : false,
					cellTemplate : '<scf-button ng-disabled="data.trackingDetail" class="btn-default gec-btn-action" id="view-{{data.$rowNo}}-view-button" ng-click="ctrl.viewMessage(data)" title="View"><i class="fa fa-search" aria-hidden="true"></i></scf-button>'
				} ]
		}

		var initial = function(){

		}

		initial();
} ]);