angular.module('gecscf.transaction').factory('CreatePaymentService',['$http', '$q', CreatePaymentService]);
function CreatePaymentService($http, $q){
	function getDocument(criteria) {
        var deffered = $q.defer();
        $http({
    	    url : 'api/v1/documents/',
        	method: 'GET',
        	data: criteria
        }).then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
    }
	return {
		getDocument : getDocument,
	}
}