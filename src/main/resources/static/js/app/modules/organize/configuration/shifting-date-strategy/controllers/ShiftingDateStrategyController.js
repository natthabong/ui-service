'use strict';
angular.module('gecscf.organize.configuration.shiftingDateStrategy').controller(
    'ShiftingDateStrategyController', [
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

            vm.manageConfig = true;
            vm.viewAction = true;

            vm.config = function(accountingTransactionType) {
                var params = {
                    accountingTransactionType: accountingTransactionType,
                    organizeId: $stateParams.organizeId
                };
                
                PageNavigation.gotoPage('/sponsor-configuration/shifting-date-strategy/settings', params)
            }
            
            vm.view = function(accountingTransactionType) {
                var params = {
                    accountingTransactionType: accountingTransactionType,
                    organizeId: $stateParams.organizeId
                };
                  
                PageNavigation.gotoPage('/sponsor-configuration/shifting-date-strategy/view', params)
            }

            vm.initLoad = function() {
            	
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