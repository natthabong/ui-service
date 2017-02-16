angular.module('scfApp').factory('CreateTransactionService', ['$http', '$q', createTransactionService]);

function createTransactionService($http, $q) {
    return {
        getSponsorPaymentDate: getSponsorPaymentDate,
        getTransactionDate: getTransactionDate,
		getDocument: getDocument,
		getTradingInfo: getTradingInfo,
		verifyTransaction: verifyTransaction,
		getSponsor: getSponsor,
		getSupplier: getSupplier,
		verifyTradingPartner: verifyTradingPartner
    };

    function getSponsorPaymentDate(sponsorId, supplierCode, loanRequestMode) {
        var deffered = $q.defer();

        $http({
        	    url :'api/create-transaction/sponsor-payment-dates/get',
            	method: 'POST',
            	headers : {
            		'Content-Type': 'application/x-www-form-urlencoded'
            	},
            	data:{
            		 sponsorId: sponsorId,
                     supplierCode: supplierCode,
                     loanRequestMode: loanRequestMode
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

    function getTransactionDate(sponsorId, sponsorPaymentDate, loanRequestMode, tenor) {
        var deffered = $q.defer();

        $http({
        	    url :'api/create-transaction/transaction-dates/get',
            	method: 'POST',
            	headers : {
            		'Content-Type': 'application/x-www-form-urlencoded'
            	},
            	data: {
            		 sponsorId: sponsorId,
            		 sponsorPaymentDate: sponsorPaymentDate,
                     loanRequestMode: loanRequestMode,
                     tenor: tenor
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

    function getDocument(searchCriteriaModel) {
        var deffered = $q.defer();
        $http({
    	    url : 'api/documents/get',
        	method: 'POST',
        	data: searchCriteriaModel
        }).then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
    }
	
	 function getTradingInfo(sponsorId, supplierId){
        var deffered = $q.defer();

        $http({
            method: 'POST',
            url: 'api/create-transaction/trading-info/get',
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                sponsorId: sponsorId,
                supplierId: supplierId
            },
	        transformRequest :function (data) {
	            if (data === undefined) {
	                return data;
	            }
	            return $.param(data);
	        }
        }).then(function(response){
            deffered.resolve(response);
        }).catch(function(response){
            deffered.reject(response);
        });
		 return deffered;
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
	
	function getSponsor(){
		var deffered = $q.defer();

        $http.post('api/create-transaction/sponsor/get')
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
	}
	
	function getSupplier(sponsorId){
		var deffered = $q.defer();

        $http({
            method: 'POST',
            url: 'api/create-transaction/supplier/get',
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                sponsorId: sponsorId
            }
        }).then(function(response){
            deffered.resolve(response);
        }).catch(function(response){
            deffered.reject(response);
        });
        return deffered;
	}
	 function verifyTradingPartner() {
	        var deffered = $q.defer();

	        $http({
	        	    url :'api/create-transaction/trading-partner/verify',
	            	method: 'POST',
	            	headers : {
	            		'Content-Type': 'application/x-www-form-urlencoded'
	            	},
	            	data:{
	            		 
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
}