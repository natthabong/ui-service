'use strict';
angular.module('gecscf.sponsorConfiguration.workflow').factory('WorkflowService', ['$http', '$q', 'blockUI', WorkflowService]);

function WorkflowService($http, $q, blockUI){
    function getWorkflow(workflowModel){
        var deffered = $q.defer();
        var url = '/api/v1/organizes/'+workflowModel.organizeId+'/workflows/'+workflowModel.module+'/'+workflowModel.type;
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
                deffered.reject('Cannot load dropdown');
            });
        return deffered;
    }

    function saveWorkflow(workflowModel) {
        var url = 'api/v1/organizes/'+workflowModel.organizeId+'/workflows/'+workflowModel.module+'/'+workflowModel.workflowType;
        var deffered = $q.defer();
        $http({
        	    url : url,
            	method: 'PUT',
            	data:{
					workflowId : workflowModel.workflow.value,
					workflowName : workflowModel.workflow.label
            	},
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject('Cannot save workflow');
            });
        return deffered;
    }

	return {
        getWorkflow : getWorkflow,
        saveWorkflow : saveWorkflow,
        getWorkflowDropDown : getWorkflowDropDown
	}
}