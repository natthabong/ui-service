angular.module('scfApp').factory('SystemIntegrationMonitorService', ['$http', '$q', SystemIntegrationMonitorService]);
function SystemIntegrationMonitorService($http, $q) {
    return {
        getWebServiceList: getWebServiceList,
		verifySystemStatusWebService:verifySystemStatusWebService,
		getFTPList:getFTPList,
		verifySystemStatusFTP:verifySystemStatusFTP,
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
	    return deffered;
    }
	function getFTPList(bankCode){
        var deffered = $q.defer();
	    $http({
	       method: 'GET',
	       url: '/api/v1/ftp-connection-info/organizes/' + bankCode
	    }).then(function(response) {
	       deffered.resolve(response);
	    }).catch(function(response) {
	       deffered.reject(response);
	    });
	    return deffered;
    }
	function verifySystemStatusWebService(systemModel){
		var bankCode = systemModel.bankCode;
		var requestType = systemModel.requestDataType;
		var requestMode = systemModel.requestMode;
        var deffered = $q.defer();
	    $http({
	       method: 'POST',
	       url: 'api/v1/check-bank-connection/banks/'+bankCode+'/data/'+requestType+'/modes/'+requestMode
	    }).then(function(response) {
	       deffered.resolve(response);
	    }).catch(function(response) {
	       deffered.reject(response);
	    });
	    return deffered;
    }
	
	function verifySystemStatusFTP(systemModel){
		var jobId = systemModel;
        var deffered = $q.defer();
	    $http({
	       method: 'POST',
	       url: 'api/v1/check-ftp-connection/connections/'+jobId
	    }).then(function(response) {
	       deffered.resolve(response);
	    }).catch(function(response) {
	       deffered.reject(response);
	    });
	    return deffered;
    }
}