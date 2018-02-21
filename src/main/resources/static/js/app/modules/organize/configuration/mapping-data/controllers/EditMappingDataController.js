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
        var mode = {
	    		VIEW : 'viewMapping',
	    		EDIT : 'editMapping'
		    }
        
        var model = $stateParams.mappingData || {
            mappingDataId: undefined,
            mappingType: 'TEXT_MAPPING'
        };
        vm.hideSignFlagColumn = false;
        if (model.mappingType == 'TEXT_MAPPING' || model.mappingType == 'TEXT_MAPPING_WITH_DEFAULT'|| model.mappingType == 'REASON_CODE') {
        	vm.hideSignFlagColumn = true;
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

        
        vm.loadData = function (pagingModel) {
            vm.pagingController.search(pagingModel, function (criteria, response) {
				var data = response.data;
				var pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
				var currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
				var i = 0;
				var baseRowNo = pageSize * currentPage;
				angular.forEach(data, function (value, idx) {
					++i;
					value.rowNo = baseRowNo + i;
				});
			});
        }

        var currentMode = $stateParams.mode;
        var initialPaging = function (criteria) {
        	if(currentMode == mode.EDIT){
    		    vm.isEditMode = true;
    		}
        	
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
                organizeId: $stateParams.organizeId,
                accountingTransactionType: vm.criteria.accountingTransactionType
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
                organizeId: $stateParams.organizeId,
                accountingTransactionType: vm.criteria.accountingTransactionType
            };

            PageNavigation.gotoPage('/sponsor-configuration/mapping-data/code/edit', params);
        }

    }
]);