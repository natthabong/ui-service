'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller(
    'CustomerCodeGroupController', [
        'SCFCommonService',
        '$log',
        '$scope',
        '$stateParams',
        '$timeout',
        'PageNavigation',
        'Service',
        'ngDialog',
        function(SCFCommonService, $log, $scope, $stateParams, $timeout,
            PageNavigation, Service, ngDialog) {
            var vm = this;
            var log = $log;

            vm.manageConfig = false;
            vm.viewAction = false;

            vm.pageModel = {
                pageSizeSelectModel: '20',
                totalRecord: 0,
                currentPage: 0,
                clearSortOrder: false,
                page: 0,
                pageSize: 20
            };

            vm.pageSizeList = [{
                label: '10',
                value: '10'
            }, {
                label: '20',
                value: '20'
            }, {
                label: '50',
                value: '50'
            }];


            vm.decodeBase64 = function(data) {
                if (angular.isUndefined(data)) {
                    return '';
                }
                return atob(data);
            }

            vm.buyerdata = [];
            vm.supplierdata = [];

            vm.search = function() {
                var serviceUrl = '/api/v1/organize-customers/' + $scope.sponsorId + '/accounting-transactions/PAYABLE/customer-code-groups';
                var serviceDiferred = Service.doGet(serviceUrl, {
                    limit: vm.pageModel.pageSizeSelectModel,
                    offset: vm.pageModel.currentPage
                });

                serviceDiferred.promise.then(function(response) {
                    vm.supplierdata = response.data[0];
                    vm.pageModel.totalRecord = response.headers('X-Total-Count');
                    vm.pageModel.totalPage = response.headers('X-Total-Page');
                    vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
                }).catch(function(response) {
                    log.error('Load customer code group data error');
                });

                serviceUrl = '/api/v1/organize-customers/' + $scope.sponsorId + '/accounting-transactions/RECEIVABLE/customer-code-groups';
                serviceDiferred = Service.doGet(serviceUrl, {
                    limit: vm.pageModel.pageSizeSelectModel,
                    offset: vm.pageModel.currentPage
                });

                serviceDiferred.promise.then(function(response) {
                    vm.buyerdata = response.data[0];
                    vm.pageModel.totalRecord = response.headers('X-Total-Count');
                    vm.pageModel.totalPage = response.headers('X-Total-Page');
                    vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
                }).catch(function(response) {
                    log.error('Load customer code group data error');
                });
            }

            //			vm.addNew = function() {
            //				vm.newCustCodeDialog = ngDialog.open({
            //					id : 'new-customer-code-setting-dialog',
            //					template : '/js/app/modules/sponsor-config/customer-code-groups/dialog-new-customer-code-group.html',
            //					className : 'ngdialog-theme-default',
            //					scope : $scope,
            //					controller : 'CustomerCodeGroupDiaglogController',
            //					controllerAs : 'ctrl',
            //					data : {
            //						sponsorId : $scope.sponsorId
            //					},
            //					preCloseCallback : function(value) {
            //						if (value != null) {
            //							vm.search();
            //						}
            //						return true;
            //					}
            //				});
            //			};

            vm.config = function(customerCodeGroup, accountingTransactionType) {
                var params = {
                    organizeId: $stateParams.organizeId,
                    accountingTransactionType: accountingTransactionType
                };

                if (accountingTransactionType == 'PAYABLE') {
                    PageNavigation.gotoPage('/customer-organize/supplier-code-list/edit', params)
                } else if (accountingTransactionType == 'RECEIVABLE') {
                    PageNavigation.gotoPage('/customer-organize/buyer-code-list/edit', params)
                }

            }
            
            vm.view = function(customerCodeGroup, accountingTransactionType) {
                var params = {
                    organizeId: $stateParams.organizeId,
                    accountingTransactionType: accountingTransactionType
                };

                if (accountingTransactionType == 'PAYABLE') {
                    PageNavigation.gotoPage('/customer-organize/supplier-code-list/view', params)
                } else if (accountingTransactionType == 'RECEIVABLE') {
                    PageNavigation.gotoPage('/customer-organize/buyer-code-list/view', params)
                }

            }

            vm.initLoad = function() {
                vm.pageModel.currentPage = 0;
                vm.pageModel.pageSizeSelectModel = '20';

                vm.search();
            }

            vm.initLoad();

            vm.unauthenConfig = function() {
                if (vm.manageConfig) {
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
        }
    ]);