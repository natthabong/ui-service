angular.module('scfApp').controller('DashboardController', ['Service', '$log', dashboardController]);

var dashboardController = function(Service, $log) {
    var vm = this;
    var log = $log;
    vm.load = function() {
        var deferred = Service.requestURL('api/dashboard/items/get');
        vm.dashboardItems = [];
        deferred.promise.then(function(response) {
            vm.dashboardItems = response;
        }).catch(function(response) {
            log.error('Cannot load dashboard');
        });
    };
}