angular.module('scfApp').factory('CreateTransactionService', ['$http', '$q', createTransactionService]);

function createTransactionService($http, $q) {
    return {
        getSponsorPaymentDate: getSponsorPaymentDate,
        getTransactionDate: getTransactionDate,
		getDocument: getDocument
    };

    function getSponsorPaymentDate(sponsorId, supplierCode) {
        var deffered = $q.defer();

        $http.post('api/create-transaction/sponsor-payment-dates/get', {
                sponsorId: sponsorId,
                supplierCode: supplierCode
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject('Cannot load supplierCode');
            });
        return deffered;
    }

    function getTransactionDate(sponsorId, sponsorPaymentDate) {
        var deffered = $q.defer();

        $http.post('api/create-transaction/transaction-dates/get', {
                sponsorId: sponsorId,
                sponsorPaymentDate: sponsorPaymentDate
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
    }

    function getDocument(sponsorId, supplierCode, sponsorPaymentDate, page, pageSize) {
        var deffered = $q.defer();

        $http.post('api/create-transaction/documents/get', {
                sponsorId: sponsorId,
                supplierCode: supplierCode,
                sponsorPaymentDate: sponsorPaymentDate,
                page: page,
                pageSize: pageSize
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
    }
}