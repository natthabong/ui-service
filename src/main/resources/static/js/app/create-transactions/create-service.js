angular.module('scfApp').factory('CreateTransactionService', ['$http', '$q', createTransactionService]);

function createTransactionService($http, $q) {
    return {
        getSponsorPaymentDate: getSponsorPaymentDate,
        getTransactionDate: getTransactionDate,
		getDocument: getDocument,
		getSponsor: getSponsor,
		verifyTransaction: verifyTransaction
    };

    function getSponsorPaymentDate(sponsorId, supplierCode) {
        var deffered = $q.defer();

        $http({
        	    url :'api/create-transaction/sponsor-payment-dates/get',
            	method: 'POST',
            	headers : {
            		'Content-Type': 'application/x-www-form-urlencoded'
            	},
            	data:{
            		 sponsorId: sponsorId,
                     supplierCode: supplierCode
            	},
		        transformRequest :function (data) {
		            if (data === undefined) {
		                return data;
		            }
		            return $.param(data);
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

        $http({
        	    url :'api/create-transaction/transaction-dates/get',
            	method: 'POST',
            	headers : {
            		'Content-Type': 'application/x-www-form-urlencoded'
            	},
            	data: {
            		 sponsorId: sponsorId,
            		 sponsorPaymentDate: sponsorPaymentDate
            	},
		        transformRequest :function (data) {
		            if (data === undefined) {
		                return data;
		            }
		            return $.param(data);
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

    function getDocument(sponsorId, supplierCode, sponsorPaymentDate, page, pageSize) {
        var deffered = $q.defer();

        $http({
    	    url : 'api/create-transaction/documents/get',
        	method: 'POST',
        	headers : {
        		'Content-Type': 'application/x-www-form-urlencoded'
        	},
        	data: {
        		 sponsorId: sponsorId,
                 supplierCode: supplierCode,
                 sponsorPaymentDate: sponsorPaymentDate,
                 page: page,
                 pageSize: pageSize
        	},
	        transformRequest :function (data) {
	            if (data === undefined) {
	                return data;
	            }
	            return $.param(data);
	        }
        }).then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
    }
	
	 function getSponsor(sponsorId, supplierId){
        var deffered = $q.defer();

        $http({
            method: 'POST',
            url: 'api/create-transaction/sponsor/get',
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                sponsorId: sponsorId,
                supplierId: supplierId
            }
        }).then(function(response){
            deffered.resolve(response);
        }).catch(function(response){
            deffered.reject(response);
        });
	 }
    
    function verifyTransaction(transaction){
    	var deffered = $q.defer();

        $http.post('api/create-transaction/transaction/verify', transaction)
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
    }
}