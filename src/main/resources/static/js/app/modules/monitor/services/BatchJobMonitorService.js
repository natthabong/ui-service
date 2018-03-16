angular.module('gecscf.monitoring').service('BatchJobMonitorService', ['$http', '$q', BatchJobMonitorService]);
function BatchJobMonitorService($http, $q) {
    
    this.getBatchJobs = function(organizeId){
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
    
  this.getBatchJobExportChannel = function( organizeId , jobId){
    	var url = '/api/v1/organizes/'+ organizeId +'/channel/'+ jobId;
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
    
    this.runJob = function(organizeId, jobId){
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