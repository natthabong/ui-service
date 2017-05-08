angular.module('scfApp').factory('SystemIntegrationMonitorService', ['$http', '$q', SystemIntegrationMonitorService]);
function SystemIntegrationMonitorService($http, $q) {
    return {
        getSystemMonitorRecodes: getSystemMonitorRecodes
    };
    function getSystemMonitorRecodes(organize){
         var deffered = $q.defer();
	    $http({
	       method: 'GET',
	       url: '/api/request-ftp-connection-info/'+organize
	    }).then(function(response) {
	       deffered.resolve(response);
	    }).catch(function(response) {
	       deffered.reject(response);
	    });
	    return deffered;
    }
}