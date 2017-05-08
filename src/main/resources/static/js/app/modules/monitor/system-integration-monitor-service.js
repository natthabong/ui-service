angular.module('scfApp').factory('SystemIntegrationMonitorService', ['$http', '$q', SystemIntegrationMonitorService]);

function SystemIntegrationMonitorService($http, $q) {
    return {
        getSystemMonitorRecodes: getSystemMonitorRecodes
    };
    function getSystemMonitorRecodes(organize){
        
    }
}