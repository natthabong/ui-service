var app = angular.module('scfApp');
app.controller(
    'PaymentDateFormulaController', [
        'SCFCommonService',
        '$log',
        '$scope',
        '$stateParams',
        '$timeout',
        'ngDialog',
        'PageNavigation',
        'Service', 'UIFactory', '$q', '$http',
        function(SCFCommonService, $log, $scope, $stateParams, $timeout, ngDialog,
            PageNavigation, Service, UIFactory, $q, $http) {
            var vm = this;
            var log = $log;

            vm.manageAction = false;
            vm.viewAction = false;



            vm.sponsorId = $stateParams.organizeId;

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

            vm.dataTable = {
                options: {},
                columns: [{
                    field: 'formulaName',
                    label: 'Formula name',
                    idValueField: 'template',
                    id: 'payment-date-formula-{value}',
                    sortData: true,
                    cssTemplate: 'text-left',
                }, {
                    field: '',
                    label: '',
                    cssTemplate: 'text-center',
                    sortData: false,
                    cellTemplate: '<scf-button class="btn-default gec-btn-action" ng-disabled="ctrl.unauthenView() && ctrl.unauthenMangeAction()" id="payment-date-formula-{{data.formulaName}}-view-button" title="View a payment date formula configs"><i class="fa fa-search" aria-hidden="true"></i></scf-button>' +
                        '<scf-button id="payment-date-formula-{{data.formulaName}}-setup-button" ng-disabled="ctrl.unauthenMangeAction()"  class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="Config a payment date formula configs"><i class="fa fa-cog" aria-hidden="true"></i></scf-button>' +
                        '<scf-button id="payment-date-formula-{{data.formulaName}}-delete-button" ng-disabled="ctrl.unauthenMangeAction()" class="btn-default gec-btn-action" ng-click="ctrl.deleteFormula(data)" title="Delete a payment date formula configs"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'

                }]
            };

            vm.data = []

            vm.config = function(data) {
                var params = {
                    paymentDateFormulaModel: data,
                    organizeId: vm.sponsorId
                };
                PageNavigation.gotoPage('/sponsor-configuration/payment-date-formulas/settings', params);
            }

            vm.search = function() {
                var serviceUrl = '/api/v1/organize-customers/' + $stateParams.organizeId + '/processTypes/AP_DOCUMENT/payment-date-formulas';
                var serviceDiferred = Service.doGet(serviceUrl, {
                    limit: vm.pageModel.pageSizeSelectModel,
                    offset: vm.pageModel.currentPage
                });

                serviceDiferred.promise.then(function(response) {
                    vm.data = response.data;
                    vm.pageModel.totalRecord = response.headers('X-Total-Count');
                    vm.pageModel.totalPage = response.headers('X-Total-Page');
                    vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
                }).catch(function(response) {
                    log.error('Load payment date formula data error');
                });
            }

            vm.initLoad = function() {
                vm.pageModel.currentPage = 0;
                vm.pageModel.pageSizeSelectModel = '20';

                vm.search();
            }

            vm.initLoad();

            vm.unauthenMangeAction = function() {
            	console.log(vm.manageAction)
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

            vm.formula = {
                paymentDateFormulaId: null,
                formulaName: '',
                formulaType: 'CREDIT_TERM',
                sponsorId: vm.sponsorId,
                isCompleted: '0'
            };

            vm.openNewFormula = function() {
                vm.formula.paymentDateFormulaId = null,
                    vm.formula.formulaName = '';
                vm.formula.formulaType = 'CREDIT_TERM';
                vm.formula.sponsorId = vm.sponsorId;
                vm.formula.isCompleted = '0'

                ngDialog.open({
                    id: 'new-formula-dialog',
                    template: '/js/app/sponsor-configuration/file-layouts/dialog-new-formula.html',
                    className: 'ngdialog-theme-default',
                    controller: 'NewPaymentDateFormulaController',
                    controllerAs: 'ctrl',
                    scope: $scope,
                    data: {
                        formula: vm.formula
                    },
                    cache: false,
                    preCloseCallback: function() {
                        vm.refershFormulaTable();
                    }
                });

            };

            vm.refershFormulaTable = function() {
                vm.search();
            }

            var deleteFormula = function(formula) {

                var serviceUrl = 'api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/payment-date-formulas/' + formula.paymentDateFormulaId;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: serviceUrl,
                    headers: {
                        'If-Match': formula.version,
                        'X-HTTP-Method-Override': 'DELETE'
                    },
                    data: formula
                }).then(function(response) {
                    return deferred.resolve(response);
                }).catch(function(response) {
                    return deferred.reject(response);
                });
                return deferred;
            }


            vm.deleteFormula = function(formula) {

                var preCloseCallback = function(confirm) {
                    vm.refershFormulaTable();
                }

                UIFactory.showConfirmDialog({
                    data: {
                        headerMessage: 'Confirm delete?'
                    },
                    confirm: function() {
                        return deleteFormula(formula);
                    },
                    onFail: function(response) {
                        var msg = {
                            409: 'Formula has been deleted.',
                            405: 'Formula has been used.'
                        };
                        UIFactory.showFailDialog({
                            data: {
                                headerMessage: 'Delete formula fail.',
                                bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
                            },
                            preCloseCallback: preCloseCallback
                        });
                    },
                    onSuccess: function(response) {
                        UIFactory.showSuccessDialog({
                            data: {
                                headerMessage: 'Delete formula success.',
                                bodyMessage: ''
                            },
                            preCloseCallback: preCloseCallback
                        });
                    }
                });
            }



        }
    ]);

app.controller('NewPaymentDateFormulaController', ['$scope', '$rootScope', 'Service', 'PaymentDateFormulaService', 'ngDialog', 'UIFactory', function($scope, $rootScope, Service, PaymentDateFormulaService, ngDialog, UIFactory) {
    var vm = this;
    vm.formula = angular.copy($scope.ngDialogData.formula);
    vm.formula.formulaName = null;
    var sponsorId = angular.copy($scope.ngDialogData.formula.sponsorId);
    vm.showMessageError = false;
    vm.messageError = null;
    vm.paymentDateFormulaId = angular.copy($scope.ngDialogData.paymentDateFormulaId);

    vm.create = function(callback) {
        if (vm.formula.formulaName == null || vm.formula.formulaName == "") {
            vm.showMessageError = true;
            vm.messageError = "Formula name is required";
        } else {
            UIFactory.showConfirmDialog({
                data: {
                    headerMessage: 'Confirm save?'
                },
                confirm: function() {
                    return PaymentDateFormulaService.saveNewFormula(sponsorId, vm.formula);
                },
                onFail: function(response) {
                    var msg = { 500: 'Formula name is existed.' };
                    dialogFail = UIFactory.showFailDialog({
                        data: {
                            headerMessage: 'Add new credit term fail.',
                            bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
                        },
                        preCloseCallback: null
                    });
                },
                onSuccess: function(response) {
                    dialogSuccess = UIFactory.showSuccessDialog({
                        data: {
                            headerMessage: 'Add new formula success.',
                            bodyMessage: ''
                        },
                        preCloseCallback: function() {
                            vm.paymentDateFormulaId = response.data.paymentDateFormulaId;
                            callback(vm.paymentDateFormulaId);
                        }
                    });
                }
            });
        }
    }
}]);