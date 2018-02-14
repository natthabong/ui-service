'use strict';
var productTypeModule = angular.module('gecscf.organize.configuration.productType');
productTypeModule.controller('ProductTypeListController', [
    'PageNavigation',
    'PagingController',
    'UIFactory',
    '$log',
    '$scope',
    '$stateParams',
    'ProductTypeService',
    function(PageNavigation, PagingController, UIFactory, $log, $scope, $stateParams, ProductTypeService) {
        var vm = this;
        var log = $log;
        var organizeId = $stateParams.organizeId;

        vm.manageAllConfig = false;
        vm.manageMyOrgConfig = false;
        vm.viewAction = false;

        var url = '/api/v1/organize-customers/' + organizeId + '/product-types';

        vm.criteria = $stateParams.criteria || {};
        vm.pagingController = PagingController.create(url, vm.criteria, 'GET');

        vm.gotoListPage = function() {
            var params = {
                organizeId: organizeId
            };

            PageNavigation.gotoPage('/customer-organize/product-types', params);
        }

        vm.newProductType = function() {
            var params = {
                organizeId: organizeId
            };

            PageNavigation.gotoPage('/customer-organize/product-types/setup', params, {
                organizeId: organizeId,
                criteria: vm.criteria
            });
        }

        vm.editProductType = function(data) {
            var params = {
                organizeId: organizeId,
                productType: data.productType,
                model: data
            };

            PageNavigation.gotoPage('/customer-organize/product-types/setup', params, {
                organizeId: organizeId,
                criteria: vm.criteria
            });
        }

        vm.deleteProductType = function(data) {
            UIFactory
                .showConfirmDialog({
                    data: {
                        headerMessage: 'Confirm delete?'
                    },
                    confirm: function() {
                        return ProductTypeService
                            .removeProductType(data);
                    },
                    onFail: function(response) {
                        var status = response.status;
                        if (status != 400) {
                            var msg = {
                                404: "Product type has been deleted.",
                                409: "Product type has been modified.",
                                405: "Product type has already use."
                            }
                            UIFactory
                                .showFailDialog({
                                    data: {
                                        headerMessage: 'Delete Product type fail.',
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
                                    headerMessage: 'Delete Product type success.',
                                    bodyMessage: ''
                                },
                                preCloseCallback: loadData
                            });
                    }
                });
        }

        vm.gotoPreviousPage = function() {
            var params = { organizeId: organizeId };
            PageNavigation.gotoPage("/sponsor-configuration", params);
        }

        vm.unauthenConfig = function() {
            if (vm.manageAllConfig) {
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

        vm.searchProductType = function(pageModel) {
            vm.pagingController.search(pageModel, function(criteriaData, response) {
                $scope.currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
                $scope.pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
            });
        }

        var loadData = function() {
            vm.searchProductType();
        }

        var init = function() {
            vm.searchProductType();
        }();



    }
]);