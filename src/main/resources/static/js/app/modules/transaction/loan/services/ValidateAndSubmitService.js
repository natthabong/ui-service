angular.module('scfApp').factory('ValidateAndSubmitService', ['$http', '$q', 'blockUI', validateAndSubmitService]);
function validateAndSubmitService($http, $q, blockUI) {
    return {
    	prepareTransactionOnValidatePage: prepareTransactionOnValidatePage,
    	getDocumentOnValidatePage: getDocumentOnValidatePage,
    	submitTransaction: submitTransaction
    };	
    
    function prepareTransactionOnValidatePage(params) {
        var deffered = $q.defer();

        $http.post('api/v1/create-transaction/validate-submit/transaction/prepare', params)
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

        $http.post('api/v1/create-transaction/validate-submit/document/get', {
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
    
    function submitTransaction(transaction) {
        blockUI.start();
        var deffered = $q.defer();
        $http.post('api/v1/create-transaction/validate-submit/transaction/submit',transaction)
            .then(function(response) {
            	blockUI.stop();
                deffered.resolve(response);
            })
            .catch(function(response) {
            	blockUI.stop();
                deffered.reject(response);
            });
        return deffered;
    }    
}