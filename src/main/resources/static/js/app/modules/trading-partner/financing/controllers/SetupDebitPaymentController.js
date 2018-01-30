'use strict';
var tradeFinanceModule = angular.module('gecscf.tradingPartner.financing');
tradeFinanceModule.controller('SetupDebitPaymentController', ['$scope', '$stateParams',
    'UIFactory', 'TradingPartnerService', '$log', '$filter',
    function ($scope, $stateParams, UIFactory, TradingPartnerService, $log, $filter) {

        var vm = this;
        var log = $log;
        vm.payeeAccountIsRequired = false;

        vm.tradingPartnerModel = angular.copy($scope.ngDialogData.tradingPartnerModel);
        vm.payeeOrganizeName = angular.copy($scope.ngDialogData.payeeOrganizeName);

        vm.accountDropdown = [
            {
                label: "Please select",
                value: ""
            },
            {
                label: "Undefined",
                value: 0
            }
        ];

        var loadPayeeAccounts = function () {
            var deffered = TradingPartnerService.getPayeeAccounts(vm.tradingPartnerModel.supplierId);
            deffered.promise.then(function (response) {
                var account = response.data;
                account.forEach(function (data) {
                    vm.accountDropdown.push({
                        label: data.format ? ($filter('accountNoDisplay')(data.accountNo)) : data.accountNo,
                        value: data.accountId
                    })
                });
                console.log(vm.accountDropdown);
                // vm.tradingPartner = response.data;
            }).catch(function (response) {
                log.error('Get Payee account fail');
            });
        }

        var initload = function () {
            loadPayeeAccounts();
        } ();

        var validateBeforeSave = function () {
            var valid = true;
            console.log(vm.tradingPartnerModel.debitPayeeAccount);
            if (vm.tradingPartnerModel.debitPayeeAccount == null) {
                valid = false;
                vm.payeeAccountIsRequired = true;
            } else {
                valid = true;
                vm.payeeAccountIsRequired = false;
            }
            return valid
        }

        vm.save = function (callback) {
            var preCloseCallback = function (tp) {
                callback(tp);
            }
            if (validateBeforeSave()) {
                UIFactory
                    .showConfirmDialog({
                        data: {
                            headerMessage: 'Confirm save?'
                        },
                        confirm: function () {
                            console.log(vm.tradingPartnerModel);
                            return TradingPartnerService
                                .createTradingPartner(vm.tradingPartnerModel, true);
                        },
                        onFail: function (response) {
                            if (response.status != 400) {
                                var msg = {
                                    404: 'Trading partner has been deleted.',
                                    405: 'Trading partner is existed.',
                                    409: 'Trading partner has been modified.'
                                };
                                UIFactory.showFailDialog({
                                    data: {
                                        headerMessage: 'Edit debit payment information fail.',
                                        bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
                                    },
                                    preCloseCallback: preCloseCallback
                                });
                            }
                        },
                        onSuccess: function (response) {
                            UIFactory.showSuccessDialog({
                                data: {
                                    headerMessage: 'Edit debit payment information complete.',
                                    bodyMessage: ''
                                },
                                preCloseCallback: preCloseCallback(response.data)
                            });
                        }
                    });
            }
        }

        vm.changeSupportPaymentByDebit = function () {
            if (!vm.tradingPartnerModel.supportDebit) {
                vm.tradingPartnerModel.debitPayeeAccount = null;
            }
            vm.payeeAccountIsRequired = false;
        }

        vm.changePayeeAccount = function () {
            vm.payeeAccountIsRequired = false;
            console.log(vm.tradingPartnerModel.debitPayeeAccount);
        }

    }]);