'use strict';
var displayListCtrl = function(PageNavigation, PagingController, UIFactory, ConfigurationUtils, DisplayService) {

    var vm = this;

    var parameters = PageNavigation.getParameters();

    var ownerId = parameters.organizeId;

    vm.hiddenFundingColumn = true;
    vm.manageAction = false;
    vm.viewAction = true;

    var _criteria = {};

    vm.pagingController = null;
    vm.loadData = function() {
        vm.pagingController.search();
    }

    vm.init = function(type, mode) {
        vm.mode = mode;
        var reqUrl = ['/api/v1/organize-customers', ownerId,
                'accounting-transactions', type, 'display-modes', mode, 'displays'
            ]
            .join('/');
        vm.pagingController = PagingController.create(reqUrl, _criteria, 'GET');

        vm.loadData();

    };

    vm.unauthenMangeAction = function() {
        if (vm.manageAction) {
            return false;
        } else {
            return true;
        }
    }

    vm.unauthenView = function() {
        if (vm.viewAction) {
            return false;
        } else {
            return true;
        }
    }

    vm.addNewDocumentDisplay = function(type, mode) {
        ConfigurationUtils.showCreateNewCreateDisplayDialog({
            data: {
                ownerId: ownerId,
                accountingTransactionType: type,
                displayMode: mode
            },
            preCloseCallback: function() {
                vm.init(type, mode);
            }
        });
    }

    vm.viewDocumentDisplay = function(record) {
        var params = {
            accountingTransactionType: record.accountingTransactionType,
            displayMode: record.displayMode,
            organizeId: ownerId,
            documentDisplayId: record.documentDisplayId
        }

        PageNavigation.gotoPage('/sponsor-configuration/document-display/view', params);

    }

    vm.editDocumentDisplay = function(record) {
        setting({
            accountingTransactionType: record.accountingTransactionType,
            displayMode: record.displayMode,
            organizeId: ownerId,
            documentDisplayId: record.documentDisplayId
        })
    }

    vm.deleteDocumentDisplay = function(record) {
        UIFactory
            .showConfirmDialog({
                data: {
                    headerMessage: 'Confirm delete?'
                },
                confirm: function() {
                    return DisplayService
                        .removeDisplay(ownerId, vm.accountingTransactionType, record.displayMode, record);
                },
                onFail: function(response) {
                    var status = response.status;
                    if (status != 400) {
                        var msg = {
                            404: "Display has been deleted.",
                            409: "Display has been modified."
                        }
                        UIFactory
                            .showFailDialog({
                                data: {
                                    headerMessage: 'Delete Display fail.',
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
                                headerMessage: 'Delete Display success.',
                                bodyMessage: ''
                            },
                            preCloseCallback: loadData
                        });
                }
            });
    }

    var loadData = function() {
        vm.pagingController.search();
    }

    var setting = function(params) {
        if (vm.mode == 'TRANSACTION_DOCUMENT') {
            PageNavigation.gotoPage(
                '/sponsor-configuration/create-transaction-displays/settings',
                params);
        } else if (vm.mode == 'DOCUMENT') {
            PageNavigation.gotoPage(
                '/sponsor-configuration/document-display/settings', params);
        }
    }
}
angular.module('gecscf.organize.configuration.display').controller(
    'DisplayListController', ['PageNavigation', 'PagingController', 'UIFactory', 'ConfigurationUtils', 'DisplayService', displayListCtrl]);