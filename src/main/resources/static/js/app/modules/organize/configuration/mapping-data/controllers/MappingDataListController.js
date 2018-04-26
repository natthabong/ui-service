'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule
    .controller(
        'MappingDataListController', [
            '$scope',
            '$rootScope',
            '$stateParams',
            'UIFactory',
            'PageNavigation',
            'PagingController',
            'MappingDataService',
            'ConfigurationUtils',
            function($scope, $rootScope, $stateParams, UIFactory,
                PageNavigation, PagingController,
                MappingDataService, ConfigurationUtils) {

                var vm = this;

                vm.accountingTransactionType = 'PAYABLE';
                vm.viewAction = false;
                vm.manageAction = false;

                vm.dataTable = {
                    identityField: 'mappingDataName',
                    columns: [

                        {
                            fieldName: 'mappingDataName',
                            headerId: 'mapping-data-name-header-label',
                            labelEN: 'Mapping data name',
                            labelTH: 'Mapping data name',
                            sortable: false,
                            cssTemplate: 'text-left',
                            cellTemplate: '<span id="{{ctrl.accountingTransactionType}}-mapping-data-{{data.mappingDataName}}-label">{{data.mappingDataName}}</span>'
                        },
                        {
                            fieldName: 'action',
                            label: '',
                            cssTemplate: 'text-center',
                            sortData: false,
                            cellTemplate: '<scf-button class="btn btn-sm" ng-disabled="ctrl.unauthenView()" id="{{ctrl.accountingTransactionType}}-mapping-data-{{data.mappingDataName}}-view-button" ng-click="ctrl.view(data)"><i class="fa fa-search" aria-hidden="true"></i></scf-button>' +
                                '<scf-button id="{{ctrl.accountingTransactionType}}-mapping-data-{{data.mappingDataName}}-edit-button" ng-disabled="ctrl.unauthenConfig()" class="btn btn-sm" ng-click="ctrl.edit(data)" title="Edit"><i class="fa fa-cog" aria-hidden="true"></i></scf-button>' +
                                '<scf-button id="{{ctrl.accountingTransactionType}}-mapping-data-{{data.mappingDataName}}-delete-button" class="btn btn-sm" ng-disabled="ctrl.unauthenDelete(data)" ng-click="ctrl.deleteMappingData(data)" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
                        }
                    ]
                }

                var ownerId = $stateParams.organizeId;
                var _criteria = {};

                var loadData = function() {
                    vm.pagingController.search();
                }

                vm.unauthenView = function() {
                    if (vm.viewAction) {
                        return false;
                    } else {
                        return true;
                    }
                }

                vm.unauthenConfig = function() {
                    if (vm.manageAction) {
                        return false;
                    } else {
                        return true;
                    }
                }

                vm.unauthenDelete = function(data) {

                    if (data.mappingType == 'REASON_CODE') {
                        return true;
                    } else if (vm.manageAction) {
                        return false;
                    } else {
                        return true;
                    }
                }

                vm.edit = function(data) {
                    var params = {
                        mappingData: data,
                        organizeId: ownerId,
                        accountingTransactionType: vm.accountingTransactionType,
                        mappingDataId: data.mappingDataId,
                        mappingType: data.mappingType
                    };
                    PageNavigation
                        .gotoPage(
                            '/sponsor-configuration/mapping-data/edit',
                            params, {});
                }
                
                vm.view = function(data) {
                    var params = {
                        mappingData: data,
                        organizeId: ownerId,
                        accountingTransactionType: vm.accountingTransactionType,
                        mappingDataId: data.mappingDataId,
                        mappingType: data.mappingType
                    };
                    PageNavigation
                        .gotoPage(
                            '/sponsor-configuration/mapping-data/view',
                            params, {});
                }

                vm.deleteMappingData = function(data) {
                    UIFactory
                        .showConfirmDialog({
                            data: {
                                headerMessage: 'Confirm delete?'
                            },
                            confirm: function() {
                                return MappingDataService
                                    .remove(data);
                            },
                            onFail: function(response) {
                                var status = response.status;
                                if (status != 400) {
                                    var msg = {
                                        404: "Mapping data has been deleted."
                                    }
                                    UIFactory
                                        .showFailDialog({
                                            data: {
                                                headerMessage: 'Delete mapping data fail.',
                                                bodyMessage: msg[status] ? msg[status] : response.errorMessage
                                            },
                                            preCloseCallback: loadData
                                        });
                                }

                            },
                            onSuccess: function(response) {
                                UIFactory
                                    .showSuccessDialog({
                                        data: {
                                            headerMessage: 'Delete mapping data success.',
                                            bodyMessage: ''
                                        },
                                        preCloseCallback: loadData
                                    });
                            }
                        });
                }

                vm.init = function(accountingTransactionType) {
                    vm.accountingTransactionType = accountingTransactionType;
                    var uri = 'api/v1/organize-customers/' +
                        ownerId + '/accounting-transactions/' +
                        accountingTransactionType +
                        '/mapping-datas'
                    vm.pagingController = PagingController.create(
                        uri, _criteria, 'GET');
                    loadData();

                };

            }
        ]);