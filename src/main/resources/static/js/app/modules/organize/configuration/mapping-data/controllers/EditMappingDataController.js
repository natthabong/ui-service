'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule.controller('EditMappingDataController', [
    '$stateParams',
    '$log',
    'UIFactory',
    'PageNavigation',
    'PagingController',
    'MappingDataService',
    function ($stateParams, $log, UIFactory, PageNavigation,
        PagingController, MappingDataService) {

        var vm = this;
        var log = $log;
        var model = $stateParams.mappingData || {
            mappingDataId: undefined,
            mappingType: 'TEXT_MAPPING'
        };
        var hideSignFlagColumn = false;
        if (model.mappingType == 'TEXT_MAPPING' || model.mappingType == 'TEXT_MAPPING_WITH_DEFAULT'|| model.mappingType == 'REASON_CODE') {
            hideSignFlagColumn = true;
        }

        vm.hideDefaultCodeColumn = false;
        if (model.mappingType == 'TEXT_MAPPING' || model.mappingType == 'SIGN_FLAG_MAPPING') {
            vm.hideDefaultCodeColumn = true;
        }

        vm.unauthenConfig = function(isDefaultCode) {
            if (vm.manageAction && !isDefaultCode) {
                return false;
            } else {
                return true;
            }
        }
        
        vm.criteria = {};

        vm.dataTable = {
            identityField: 'code',
            columns: [{
                fieldName: '$rowNo',
                labelEN: 'No.',
                labelTH: 'No.',
                id: 'No-{value}',
                sortable: false,
                cssTemplate: 'text-right',
            }, {
                fieldName: 'code',
                labelEN: 'Code',
                labelTH: 'Code',
                id: 'code-{value}',
                sortable: false,
                cssTemplate: 'text-left',
            }, {
                fieldName: 'display',
                labelEN: 'Display',
                labelTH: 'Display',
                id: 'display-{value}',
                sortable: false,
                cssTemplate: 'text-left',
            }, {
                fieldName: 'signFlag',
                labelEN: 'Sign flag',
                labelTH: 'Sign flag',
                idValueField: 'code',
                id: 'sign-flag-{value}',
                sortable: false,
                cssTemplate: 'text-left',
                hiddenColumn: hideSignFlagColumn,
                dataRenderer: function (record) {
                    if (record.signFlag) {
                        record = "Negative";
                    } else {
                        record = "Positive";
                    }
                    return record;
                }
            }, {
                fieldName: 'defaultCode',
                labelEN: 'Default code',
                labelTH: 'Default code',
                idValueField: 'code',
                id: 'default-code-{value}',
                sortable: false,
                cellTemplate: '<img	style="height: 16px; width: 16px;" ng-show="data.defaultCode" data-ng-src="img/checkmark.png"/>',
                hiddenColumn: vm.hideDefaultCodeColumn
            }, {
                fieldName: 'action',
                cssTemplate: 'text-center',
                sortData: false,
                cellTemplate: '<scf-button id="{{data.code}}-edit-button" class="btn-default gec-btn-action" ng-disabled="ctrl.unauthenConfig()" ng-click="ctrl.editMappingDataCode(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>' +
                '<scf-button id="{{data.code}}-delete-button" class="btn-default gec-btn-action" ng-disabled="ctrl.unauthenConfig(data.defaultCode)" ng-click="ctrl.deleteMappingData(data)" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>' +
                '<scf-button id="{{data.code}}-set-default-button" class="btn-default gec-btn-action" ng-hide="ctrl.hideDefaultCodeColumn" ng-disabled="ctrl.unauthenConfig()" ng-click="ctrl.setDefaultCode(data)" title="Set default"><i class="fa fa-check-square-o" aria-hidden="true"></i></scf-button>'
            }]
        }


        vm.loadData = function (pagingModel) {
            vm.pagingController.search(pagingModel);
        }

        var initialPaging = function (criteria) {
            var uri = 'api/v1/organize-customers/' + criteria.ownerId + '/accounting-transactions/' + criteria.accountingTransactionType + '/mapping-datas/' + criteria.mappingDataId + '/items';
            vm.pagingController = PagingController.create(uri, vm.criteria, 'GET');
            vm.loadData();
        }

        var init = function () {
            if (model.mappingDataId != undefined) {
                var deffered = MappingDataService.getMappingData(model);
                deffered.promise.then(function (response) {
                    vm.criteria = response.data;
                    if (response.data.mappingType == 'TEXT_MAPPING_WITH_DEFAULT' || response.data.mappingType == 'REASON_CODE') {
                        vm.criteria.sort = ['defaultCode', 'code'];
                    } else {
                        vm.criteria.sort = ['code'];
                    }
                    initialPaging(vm.criteria);
                }).catch(function (response) {
                    log.error("Can not load mapping data !")
                });
            }
        } ();

        vm.errors = { deleteMappingItem: {} };
        vm.deleteMappingData = function (mappingItem) {
            if (mappingItem.defaultCode) {
                vm.errors.deleteMappingItem = {
                    message: 'Cannot delete default code.'
                }
            } else {
                var preCloseCallback = function (confirm) {
                    vm.loadData();
                }

                UIFactory.showConfirmDialog({
                    data: {
                        headerMessage: 'Confirm delete?'
                    },
                    confirm: function () {
                        return MappingDataService.deleteMappingData(vm.criteria, mappingItem);
                    },
                    onFail: function (response) {
                        var msg = { 409: 'Code has been modified.', 405: 'Code has been used.' };
                        UIFactory.showFailDialog({
                            data: {
                                headerMessage: 'Delete code fail.',
                                bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
                            },
                            preCloseCallback: preCloseCallback
                        });
                    },
                    onSuccess: function (response) {
                        UIFactory.showSuccessDialog({
                            data: {
                                headerMessage: 'Delete code success.',
                                bodyMessage: ''
                            },
                            preCloseCallback: preCloseCallback
                        });
                    }
                });
            }
        }

        vm.back = function () {
        	var params = {organizeId: $stateParams.organizeId};
			PageNavigation.gotoPage("/sponsor-configuration",params);
        }

        vm.setDefaultCode = function (dataItem) {
        	dataItem.mappingData = model;
            var deffered = MappingDataService.setDefaultCode(model, dataItem);
            deffered.promise.then(function (response) {
                vm.loadData();
            }).catch(function (response) {
                log.error("Can not set default code !");
            });
        }

        vm.newMappingDataCode = function () {
            var params = {
                mappingData: model,
                organizeId: $stateParams.organizeId
            };

            PageNavigation.gotoPage('/sponsor-configuration/mapping-data/code/new', params);
        }

        vm.editMappingDataCode = function (data) {
            if (data.signFlag) {
                data.signFlag = 1;
            } else {
                data.signFlag = 0;
            }

            var params = {
                mappingData: model,
                mappingDataItem: data,
                organizeId: $stateParams.organizeId
            };

            PageNavigation.gotoPage('/sponsor-configuration/mapping-data/code/edit', params);
        }

    }
]);