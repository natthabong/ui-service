angular.module('scfApp').factory('ValidateAndSubmitService', ['$http', '$q', validateAndSubmitService]);
function validateAndSubmitService($http, $q) {
    return {
    	prepareTransactionOnValidatePage: prepareTransactionOnValidatePage,
    	getDocumentOnValidatePage: getDocumentOnValidatePage,
    	submitTransaction: submitTransaction
    };	
    
    function prepareTransactionOnValidatePage(paymentDate, maturityDate) {
        var deffered = $q.defer();

        $http.post('api/create-transaction/validate-submit/transaction/prepare', {
                params: {
                	paymentDate: paymentDate,
                	maturityDate: maturityDate
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
                deffered.reject('Cannot load supplierCode');
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
                deffered.reject('Cannot load supplierCode');
            });
        return deffered;
    }    
}