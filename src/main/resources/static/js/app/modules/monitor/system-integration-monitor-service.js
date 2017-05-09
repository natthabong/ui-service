angular.module('scfApp').factory('SystemIntegrationMonitorService', ['$http', '$q', SystemIntegrationMonitorService]);
function SystemIntegrationMonitorService($http, $q) {
    return {
        getWebServiceList: getWebServiceList
    };
    function getWebServiceList(bankCode){
         var deffered = $q.defer();
	    $http({
	       method: 'GET',
	       url: '/api/v1/bank-connection-info/' + bankCode
	    }).then(function(response) {
	       deffered.resolve(response);
	    }).catch(function(response) {
	       deffered.reject(response);
	    });
		console.log(deffered)
	    return deffered;
    }
}