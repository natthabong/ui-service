angular.module('scfApp').controller('ExportPaymentConfigController', ['Service',
    '$log',
    '$scope',
    'PageNavigation',
    'SCFCommonService',
    '$stateParams',
    function(Service, $log, $scope, PageNavigation, SCFCommonService,$stateParams) {
        var vm = this;
        var log = $log;
        vm.viewAll = false;
        vm.manageAll = false;
        var organizeId = $stateParams.organizeId;
        vm.unauthenConfig = function(){
            var disable = true;
            if(vm.viewAll || vm.manageAll){
                disable = false;
            }
            return disable;
        }

        vm.setupExportPayment = function(processType) {
            var params = {
                processType : processType,
                organizeId: organizeId
            };
            PageNavigation.gotoPage('/sponsor-configuration/export-payments/settings', params)
        };
    }
]);