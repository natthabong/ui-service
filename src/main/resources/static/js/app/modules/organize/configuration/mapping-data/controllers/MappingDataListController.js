'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule.controller('MappingDataListController', [
        '$scope',
        '$rootScope',
		'$stateParams',
		'UIFactory',
		'PageNavigation',
		'PagingController',
		'MappingDataService',
        function($scope, $rootScope, $stateParams, UIFactory, PageNavigation,
				PagingController, MappingDataService){

            var vm = this;
            
            vm.accountingTransactionType = 'PAYABLE';
            
            vm.dataTable = {
        			columns : [
        				
        				{
        					fieldName : 'mappingDataName',
        					headerId : 'mapping-data-name-header-label',
        					labelEN : 'Mapping data name',
        					labelTH : 'Mapping data name',
        					id : 'mapping-data-name-{value}',
        					sortable : false,
        					cssTemplate : 'text-left',
        				},
        				{
        					fieldName : 'action',
        					label : '',
        					cssTemplate : 'text-center',
        					sortData : false,
        					cellTemplate : '<scf-button id="mapping-data-{{$parent.$index + 1}}-edit-button" class="btn-default gec-btn-action" ng-click="ctrl.edit(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
        							+ '<scf-button id="mapping{{$parent.$index + 1}}-delete-button" class="btn-default gec-btn-action" ng-click="ctrl.deleteTP(data)" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
        				} ]
        		}
            
            var ownerId = $scope.sponsorId;
            var _criteria = {};
           
            
            vm.init = function(accountingTransactionType) {
            	 var uri = 'api/v1/organize-customers/'+ownerId+'/accounting-transactions/'+accountingTransactionType+'/mapping-datas'
                 vm.pagingController = PagingController.create(uri, _criteria, 'GET');
            	 
            	 vm.pagingController.search();
			};

        }
]);