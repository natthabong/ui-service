angular.module('scfApp').factory('CreateTransactionService', ['$http', '$q', createTransactionService]);

function createTransactionService($http, $q) {
    return {
        getSponsorPaymentDate: getSponsorPaymentDate,
        getTransactionDate: getTransactionDate
    };

    function getSponsorPaymentDate(sponsorId, supplierCode) {
        var deffered = $q.defer();

        $http.post('api/create-transaction/sponsor-payment-dates/get', {
                params: {
                    sponsorId: sponsorId,
                    supplierCode: supplierCode
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

    function getTransactionDate(sponsorId, sponsorPaymentDate) {
        var deffered = $q.defer();

        $http.post('api/transaction-dates/get', {
                params: {
                    sponsorId: sponsorId,
                    sponsorPaymentDate: sponsorPaymentDate
                }
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