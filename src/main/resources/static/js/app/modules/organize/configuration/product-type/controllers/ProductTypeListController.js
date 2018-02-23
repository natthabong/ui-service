'use strict';
angular.module('gecscf.organize.configuration.productType').controller('ProductTypeListController', [
    '$location',
    '$scope',
    '$stateParams',
    'PageNavigation',
    'PagingController',
    'ProductTypeService',
    'UIFactory',
    function ($location, $scope, $stateParams, PageNavigation, PagingController, ProductTypeService, UIFactory) {
        var vm = this;
        var organizeId = $stateParams.organizeId;
        var modes = ['configuration', 'list'];
        var url = '/api/v1/organize-customers/' + organizeId + '/product-types';

        vm.currentMode = undefined;
        vm.criteria = $stateParams.criteria || {};
        vm.pagingController = PagingController.create(url, vm.criteria, 'GET');

        function setMode() {
            var params = $location.url().split('/');
            vm.currentMode = params[params.length - 1];
        }

        var loadData = function () {
            vm.searchProductType();
        }

        vm.isConfigMode = function () {
            return modes[0] === vm.currentMode;
        }

        vm.isViewMode = function () {
            return modes[1] === vm.currentMode;
        }

        vm.searchProductType = function (pageModel) {
            vm.pagingController.search(pageModel, function (criteriaData, response) {
                $scope.currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
                $scope.pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
            });
        }

        vm.newProductType = function () {
            var params = {
                organizeId: organizeId
            };

            PageNavigation.gotoPage('/organizations/product-types/setup/new', params, {
                organizeId: organizeId,
                criteria: vm.criteria
            });
        }

        vm.editProductType = function (data) {
            var params = {
                organizeId: organizeId,
                productType: data.productType,
                model: data
            };

            PageNavigation.gotoPage('/organizations/product-types/setup/edit', params, {
                organizeId: organizeId,
                criteria: vm.criteria
            });
        }

        vm.deleteProductType = function (data) {
            UIFactory.showConfirmDialog({
                data: {
                    headerMessage: 'Confirm delete?'
                },
                confirm: function () {
                    return ProductTypeService.removeProductType(data);
                },
                onFail: function (response) {
                    var status = response.status;
                    if (status != 400) {
                        var msg = {
                            404: "Product type has been deleted.",
                            409: "Product type has been modified.",
                            405: "Product type has already use."
                        }

                        UIFactory.showFailDialog({
                            data: {
                                headerMessage: 'Delete Product type fail.',
                                bodyMessage: msg[status] ? msg[status] : response.errorMessage
                            },
                            preCloseCallback: loadData
                        });
                    }
                },
                onSuccess: function (response) {
                    UIFactory.showSuccessDialog({
                        data: {
                            headerMessage: 'Delete Product type success.',
                            bodyMessage: ''
                        },
                        preCloseCallback: loadData
                    });
                }
            });
        }

        vm.gotoPreviousPage = function () {
            var params = {
                organizeId: organizeId
            };
            PageNavigation.gotoPage("/sponsor-configuration", params);
        }

        function main() {
            setMode();
            vm.searchProductType();
        }
        main();
    }
]);