angular.module('scfApp').controller('ExportPaymentConfigController', ['Service',
    '$log',
    '$scope',
    'PageNavigation',
    'SCFCommonService',
    function(Service, $log, $scope, PageNavigation, SCFCommonService) {
        var vm = this;
        var log = $log;

        vm.setupExportPayment = function() {
            var params = {
            };
            PageNavigation.gotoPage('/sponsor-configuration/export-payment/settings', params)
        };
    }
]);