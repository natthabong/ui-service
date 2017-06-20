'use strict';
var tradeFinanceModule = angular.module('scfApp');
tradeFinanceModule.controller('TradeFinanceController',['$scope','$stateParams','UIFactory','PageNavigation','PagingController',
    function($scope, $stateParams, UIFactory,PageNavigation, PagingController) {

        var vm = this;
        vm.dateFormat = "dd/MM/yyyy";
		vm.openAgreementDate = false;
		vm.openExpireDate = false;
        vm.headerName = null;
        var currentMode = $stateParams.mode;
        console.log(currentMode)

        if(currentMode=='NEW'){
            vm.headerName = 'New trade finance';
        }else if(currentMode=='EDIT'){
            vm.headerName = 'Edit trade finance';
        }
        console.log(vm.headerName)

        vm.openCalendarAgreementDate = function() {
			vm.openAgreementDate = true;
		}

		vm.openCalendarExpireDate = function() {
			vm.openExpireDate = true;
		}

        var initLoad = function() {
            
        }
        initLoad();

    } ]);