angular.module('scfApp').controller('DashboardController', ['Service', '$log', '$rootScope', '$element', dashboardController]);

var dashboardController = function(Service, $log, $rootScope, $element) {
    var vm = this;
    var log = $log;
    vm.load = function() {
        var deferred = Service.requestURL('api/dashboard/items/get');
        vm.rowItems = [];
        deferred.promise.then(function(response) {
        	angular.forEach(response, function(value, key) {
        		if(this[value.rowNo] == null){
        			this[value.rowNo] = [];
        		}
        		this[value.rowNo].push(value);
        		
        		},  vm.rowItems);
        }).catch(function(response) {
            log.error('Cannot load dashboard');
        });
    };
}