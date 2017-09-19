angular.module('scfApp').controller('ExportPaymentConfigController', ['Service',
    '$log',
    '$scope',
    'PageNavigation',
    'SCFCommonService',
    function(Service, $log, $scope, PageNavigation, SCFCommonService) {
        var vm = this;
        var log = $log;

        vm.setupExportPayment = function(processType) {
            var params = {
                processType : processType
            };
            PageNavigation.gotoPage('/sponsor-configuration/export-payments/settings', params)
        };
    }
]);