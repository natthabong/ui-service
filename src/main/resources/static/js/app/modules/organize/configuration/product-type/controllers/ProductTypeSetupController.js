'use strict';
angular.module('gecscf.organize.configuration.productType').controller('ProductTypeSetupController', [
    '$location',
    '$log',
    '$stateParams',
    'PageNavigation',
    'ProductTypeService',
    'UIFactory',
    function ($location, $log, $stateParams, PageNavigation, ProductTypeService, UIFactory) {
        var vm = this;
        var log = $log;
        var organizeId = $stateParams.organizeId;
        var productType = $stateParams.productType;
        var modes = ['new', 'edit'];

        vm.currentMode = undefined;
        vm.headerLabel = undefined;
        vm.model = {
            organizeId: organizeId,
            productType: '',
            displayName: '',
            createdBy: '',
            createdTime: '',
            lastModifiedBy: '',
            lastModifiedTime: '',
            version: undefined
        };
        vm.errors = {
            productType: {
                message: undefined
            },
            displayName: {
                message: undefined
            }
        };

        function setMode() {
            var urlParams = $location.url().split('/');
            vm.currentMode = urlParams[urlParams.length - 1];

            if (vm.isNewMode()) {
                vm.headerLabel = 'Add product type';
            } else if (vm.isEditMode()) {
                vm.headerLabel = 'Edit product type';

                var deferred = ProductTypeService.getProductType(organizeId, productType);
                deferred.promise.then(function (response) {
                    vm.model = response.data;
                }).catch(function (response) {
                    log.error('Fail to load (' + productType + ') product type.');
                    gotoConfigPage();
                });
            } else {
                vm.headerLabel = 'Product type';
            }
        }

        var gotoConfigPage = function () {
            var params = {
                organizeId: vm.model.organizeId
            };
            PageNavigation.gotoPage('/organizations/product-types/configuration', params);
        }

        vm.isNewMode = function () {
            return modes[0] === vm.currentMode;
        }

        vm.isEditMode = function () {
            return modes[1] === vm.currentMode;
        }

        vm.save = function () {
            var pass = true;
            vm.errors.productType.message = undefined;
            vm.errors.displayName.message = undefined;

            if (vm.model.productType == '') {
                vm.errors.productType.message = 'Product type is required.';
                pass = false;
            }
            if (vm.model.displayName == '') {
                vm.errors.displayName.message = 'Display name is required.';
                pass = false;
            }

            if (pass) {
                UIFactory.showConfirmDialog({
                    data: {
                        headerMessage: 'Confirm save?'
                    },
                    confirm: function () {
                        if (vm.isNewMode()) {
                            return ProductTypeService.createProductType(vm.model);
                        } else if (vm.isEditMode()) {
                            return ProductTypeService.updateProductType(vm.model);
                        }
                    },
                    onFail: function (response) {
                        var errorMessage = '';
                        response.data.forEach(function appendErrorMessage(data) {
                            if (data.errorCode === 'productType') {
                                vm.errors.productType.message = data.errorMessage;
                            } else if (data.errorCode === 'displayName') {
                                vm.errors.displayName.message = data.errorMessage;
                            }
                            errorMessage += data.errorMessage + '\n';
                        });
                        UIFactory.showFailDialog({
                            data: {
                                headerMessage: 'Add product type fail.',
                                bodyMessage: errorMessage
                            }
                        });
                    },
                    onSuccess: function (response) {
                        UIFactory.showSuccessDialog({
                            data: {
                                headerMessage: 'Add product type success.',
                                bodyMessage: ''
                            },
                            preCloseCallback: gotoConfigPage
                        });
                    }
                });
            }
        }

        vm.cancel = function () {
            gotoConfigPage();
        }

        function init() {
            setMode();
        }
        init();
    }
]);