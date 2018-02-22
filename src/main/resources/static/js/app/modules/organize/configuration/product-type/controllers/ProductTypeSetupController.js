'use strict';
angular.module('gecscf.organize.configuration.productType').controller('ProductTypeSetupController', [
    '$location',
    '$stateParams',
    'PageNavigation',
    'ProductTypeService',
    function ($location, $stateParams, PageNavigation, ProductTypeService) {
        var vm = this;
        var organizeId = $stateParams.organizeId;
        var modes = ['new', 'edit'];

        vm.currentMode = undefined;
        vm.headerLabel = undefined;

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

        function gotoConfigPage() {
            var params = {
                organizeId: organizeId
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
                

            gotoConfigPage();
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