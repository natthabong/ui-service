angular.module('scfApp').factory('JourneyResultService', ['$http', '$q', 'blockUI','$window', journeyResultService]);

function journeyResultService($http, $q, blockUI, $window) {
	
    function getTransactionResultSummary(transactionType) {
        var deffered = $q.defer();
        $http({
        	    url :'api/v1/transactions/result-summary',
            	method: 'GET',
            	params:{
            		transactionType: transactionType
            	}
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject('Cannot load supplierCode');
            });
        return deffered;
    }
    
	return {
		getTransactionResultSummary: getTransactionResultSummary
	}
}