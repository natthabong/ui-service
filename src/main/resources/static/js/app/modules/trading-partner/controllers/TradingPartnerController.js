'use strict';
var tpModule = angular.module('gecscf.tradingPartner');
tpModule.controller('TradingPartnerController', [
        '$scope',
		'$stateParams',
		'UIFactory',
		'PageNavigation',
		'PagingController',
		'TradingPartnerService',
        function($scope, $stateParams, UIFactory, PageNavigation,
				PagingController, TradingPartnerService){

            var vm = this;
            $scope.tradingPartner = {};
            var mode = {
                NEW : 'newTradingPartner',
		    	EDIT : 'editTradingPartner'
            }
            var currentMode = $stateParams.mode;

            vm.initialPage = function(){
                if(currentMode == mode.EDIT){

                }else{
                    vm.isNewMode = true;
                    vm.isEditMode = false;
                }
            }

        }
]);