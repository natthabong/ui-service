angular.module('scfApp').controller('ExportPaymentConfigController', ['Service',
    '$log',
    '$scope',
    'PageNavigation',
    'SCFCommonService',
    function(Service, $log, $scope, PageNavigation, SCFCommonService) {
        var vm = this;
        var log = $log;
        vm.viewAll = false;
        vm.manageAll = false;

        vm.unauthenConfig = function(){
            var disable = true;
            if(vm.viewAll || vm.manageAll){
                disable = false;
            }
            return disable;
        }

        vm.setupExportPayment = function(processType) {
            var params = {
                processType : processType
            };
            PageNavigation.gotoPage('/sponsor-configuration/export-payments/settings', params)
        };
    }
]);