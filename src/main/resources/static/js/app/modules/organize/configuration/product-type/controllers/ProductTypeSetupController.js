'use strict';
angular.module('gecscf.organize.configuration.productType').controller('ProductTypeSetupController', [
    '$location',
    '$stateParams',
    'PageNavigation',
    'ProductTypeService',
    'UIFactory',
    function ($location, $stateParams, PageNavigation, ProductTypeService, UIFactory) {
        var vm = this;
        var modes = ['new', 'edit'];

        vm.currentMode = undefined;
        vm.headerLabel = undefined;
        vm.model = {
            organizeId: $stateParams.organizeId,
            productType: '',
            displayName: ''
        };

        function setMode() {
            var urlParams = $location.url().split('/');
            vm.currentMode = urlParams[urlParams.length - 1];

            if (vm.isNewMode()) {
                vm.headerLabel = 'Add product type';
            } else if (vm.isEditMode()) {
                vm.headerLabel = 'Edit product type';
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
            UIFactory.showConfirmDialog({
                data: {
                    headerMessage: 'Confirm save?'
                },
                confirm: function () {
                    return ProductTypeService.createProductType(vm.model);
                },
                onFail: function (response) {
                    var errorMessage = '';
                    response.data.forEach(function appendErrorMessage(data) {
                        errorMessage += data.errorMessage + '\n';
                    });
                    UIFactory.showFailDialog({
                        data: {
                            headerMessage: 'Add product type fail.',
                            bodyMessage: errorMessage
                        },
                        preCloseCallback: gotoConfigPage
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

        vm.cancel = function () {
            gotoConfigPage();
        }

        function init() {
            setMode();
        }
        init();
    }
]);