angular.module('scfApp').factory('ValidateAndSubmitService', ['$http', '$q', validateAndSubmitService]);
function validateAndSubmitService($http, $q) {
    return {
    	prepareTransactionOnValidatePage: prepareTransactionOnValidatePage,
    	getDocumentOnValidatePage: getDocumentOnValidatePage,
    	submitTransaction: submitTransaction
    };	
    
    function prepareTransactionOnValidatePage() {
        var deffered = $q.defer();

        $http.post('api/create-transaction/validate-submit/transaction/prepare', {
                params: {
                	http: $http
                }
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject('Cannot load sponsorPaymentDate, supplierCode');
            });
        return deffered;
    }
    
    function getDocumentOnValidatePage(page, pageSize) {
        var deffered = $q.defer();

        $http.post('api/create-transaction/validate-submit/document/get', {
                params: {
                	page: page,
                	pageSize: pageSize
                }
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject('Cannot load page, pageSize ');
            });
        return deffered;
    }
    
    function submitTransaction() {
        var deffered = $q.defer();

        $http.post('api/create-transaction/validate-submit/transaction/submit')
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject('Cannot submitTransaction');
            });
        return deffered;
    }    
}