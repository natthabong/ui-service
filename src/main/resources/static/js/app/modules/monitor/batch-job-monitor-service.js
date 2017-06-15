angular.module('scfApp').factory('BatchJobMonitorService', ['$http', '$q', BatchJobMonitorService]);
function BatchJobMonitorService($http, $q) {
    return {
    	getBatchJobs: getBatchJobs,
    	runJob: runJob
    };
    
    function getBatchJobs(organizeId){
    	var url = '/api/v1/organizes/'+ organizeId +'/batch-jobs';
    	var deffered = $q.defer();
 	    $http({
 	       method: 'GET',
 	       url: url
 	    }).then(function(response) {
 	       deffered.resolve(response);
 	    }).catch(function(response) {
 	       deffered.reject(response);
 	    });
 	    return deffered;
	}
    
    function runJob(organizeId, jobId){
    	var url = '/api/v1/organizes/'+organizeId+'/batch-jobs/'+jobId+'/run';
    	var deffered = $q.defer();
 	    $http({
 	       method: 'POST',
 	       url: url
 	    }).then(function(response) {
 	       deffered.resolve(response);
 	    }).catch(function(response) {
 	       deffered.reject(response);
 	    });
 	    return deffered;
	}
}