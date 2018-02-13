'use strict';
angular.module('gecscf.sponsorConfiguration.workflow').factory('WorkflowService', ['$http', '$q', 'blockUI', WorkflowService]);

function WorkflowService($http, $q, blockUI){
    function getWorkflow(workflowModel){
        var deffered = $q.defer();
        var url = '/api/v1/organizes/'+workflowModel.organizeId+'/workflows/'+workflowModel.module+'/'+workflowModel.workflowType;
        $http({
        	    url : url,
            	method: 'GET',
            	params:{}
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject('Cannot load workflow');
            });
        return deffered;
    }

    function getWorkflowDropDown(){
        var deffered = $q.defer();
        $http({
        	    url : '/api/v1/workflows',
            	method: 'GET',
            	params:{}
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
    }

    function saveWorkflow(workflowModel) {
        var url = 'api/v1/organizes/' + workflowModel.organizeId + '/workflows/' + workflowModel.module + '/' + workflowModel.workflowType;
        var deffered = $q.defer();
        $http({
        		method: 'POST',
        	    url : url,
				headers: {
					'If-Match' : workflowModel.version,
					'X-HTTP-Method-Override': 'PUT'
				},
            	data: workflowModel,
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
    }

	return {
        getWorkflow : getWorkflow,
        saveWorkflow : saveWorkflow,
        getWorkflowDropDown : getWorkflowDropDown
	}
}