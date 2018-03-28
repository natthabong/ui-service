angular.module('gecscf.monitoring').service('SystemIntegrationMonitorService', ['$http', '$q', SystemIntegrationMonitorService]);
function SystemIntegrationMonitorService($http, $q) {

    this.getWebServiceList = function(bankCode){
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
    
    this.getFTPList = function(bankCode){
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
	 this.verifySystemStatusWebService = function(systemModel){
		var bankCode = systemModel.fundingId;
		var requestType = systemModel.serviceType;
		var requestMode = systemModel.serviceMethod;
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
	
	this.verifySystemStatusFTP = function(systemModel){
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
	 this.updateWebServiceInfomation = function(webServiceModel){
		var uri = '/api/v1/fundings/'+webServiceModel.fundingId+'/service-connections/'+webServiceModel.financialServiceId;
		var deffered = $q.defer();
		$http({
			method: 'GET',
			url: uri
		}).then(function(response) {
			deffered.resolve(response);
		}).catch(function(response) {
			deffered.reject(response);
		});
		return deffered;
	}
	 this.updateFTPInfomation = function(jobId){
        var deffered = $q.defer();
	    $http({
	       method: 'POST',
	       url: 'api/v1/ftp-connection-info/job/'+jobId
	    }).then(function(response) {
	       deffered.resolve(response);
	    }).catch(function(response) {
	       deffered.reject(response);
	    });
	    return deffered;
    }
}