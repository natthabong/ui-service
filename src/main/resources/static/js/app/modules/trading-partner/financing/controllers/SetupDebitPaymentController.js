'use strict';
var tradeFinanceModule = angular.module('gecscf.tradingPartner.financing');
tradeFinanceModule.controller('SetupDebitPaymentController', ['$scope', '$stateParams', 'UIFactory', 'TradingPartnerService',
    function ($scope, $stateParams, UIFactory, TradingPartnerService) {

        var vm = this;

        vm.tradingPartnerModel = angular.copy($scope.ngDialogData.tradingPartnerModel);
        console.log(vm.tradingPartnerModel);
        vm.payeeOrganizeName = angular.copy($scope.ngDialogData.payeeOrganizeName);

        vm.accountDropdown = [
            {
                label: "Please select",
                value: null
            },
            {
                label: "Undefined",
                value: 0
            }
        ];

        vm.save = function (callback) {
            var preCloseCallback = function (tp) {
                callback(tp);
            }
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
                    onFail : function(response) {
					     if(response.status != 400){
                             var msg = {
                            		 404 : 'Trading partner has been deleted.',
                            		 405 : 'Trading partner is existed.',
                            		 409 : 'Trading partner has been modified.'
                             };
			    		 	UIFactory.showFailDialog({
                                 data : {
                                     headerMessage :'Edit debit payment information fail.',
                                     bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
                                 },
                                 preCloseCallback : preCloseCallback
                             });
					     }
					},
					onSuccess : function(response) {
						UIFactory.showSuccessDialog({
							data : {
								headerMessage :'Edit debit payment information complete.',
								bodyMessage : ''
							},
							preCloseCallback : preCloseCallback(response.data)
						});
					}
                });
        }
    
	}]);