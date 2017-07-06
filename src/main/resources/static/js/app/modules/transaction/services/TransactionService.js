angular.module('gecscf.transaction').factory('TransactionService', ['$http', '$q', 'blockUI', transactionService]);

function transactionService($http, $q, blockUI) {

    //payment
    function getSuppliers(accountingTransactionType) {
        var deffered = $q.defer();

        $http({
        	    url :'api/v1/create-transaction/suppliers',
            	method: 'GET',
            	params:{
            		accountingTransactionType: accountingTransactionType
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

    //loan
    function getSupplier(sponsorId){
		var deffered = $q.defer();

        $http({
            method: 'GET',
            url: 'api/v1/create-transaction/supplier-code',
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

	function getBuyerCodes(ownerId) {
	    var deffered = $q.defer();
	
	    $http({
	    	    url :'api/v1/organize-customers/'+ownerId+'/customer-code-groups/me/customer-codes',
	        	method: 'GET'
	        })
	        .then(function(response) {
	            deffered.resolve(response);
	        })
	        .catch(function(response) {
	            deffered.reject('Cannot load customer code');
	        });
	    return deffered;
	}

	function getAccounts(organizeId) {
        var deffered = $q.defer();
        $http({
        	    url :'api/v1/organize-customers/'+organizeId+'/accounts',
            	method: 'GET',
            	params:{
					q : '',
					offset: 0,
					limit: 999
            	}
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject('Cannot load account');
            });
        return deffered;
    }

	function getDocument(searchCriteriaModel) {
        var deffered = $q.defer();
        $http({
    	    url : 'api/v1/documents',
        	method: 'GET',
        	params: {
				accountingTransactionType: searchCriteriaModel.accountingTransactionType,
				customerCode: searchCriteriaModel.customerCode,
				limit: searchCriteriaModel.limit,
                sponsorPaymentDate:searchCriteriaModel.sponsorPaymentDate,
				offset: searchCriteriaModel.offset,
				documentStatus : searchCriteriaModel.documentStatus,
				dueDateFrom: searchCriteriaModel.dueDateFrom,
                dueDateTo: searchCriteriaModel.dueDateTo,
				sponsorId: searchCriteriaModel.sponsorId,
				supplierId: searchCriteriaModel.supplierId,
				showOverdue: searchCriteriaModel.showOverdue
			}
        }).then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
    }

	function getPaymentDate(transactionModel) {
        var deffered = $q.defer();
        $http({
        	    url :'api/v1/create-transaction/payment-dates/calculate',
            	method: 'POST',
            	data:{
					sponsorId : transactionModel.sponsorId,
					supplierId : transactionModel.supplierId,
					documents : transactionModel.documents
            	},
				params: {
					loanRequestMode : "CURRENT_AND_FUTURE"
				}
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject('Cannot load payment date');
            });
        return deffered;
    }
	
	function submitTransaction(transactionModel){
		var deffered = $q.defer();
        $http({
    	    url :'api/v1/create-transaction/payment/submit',
        	method: 'POST',
        	data: transactionModel
        })
        .then(function(response) {
            deffered.resolve(response);
        })
        .catch(function(response) {
            deffered.reject('Cannot load payment date');
        });
        return deffered;		
	}

    function getSponsorPaymentDate(sponsorId, supplierCode, loanRequestMode) {
        var deffered = $q.defer();

        $http({
        	    url :'api/v1/create-transaction/sponsor-payment-dates/get',
            	method: 'GET',
            	params:{
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
        	    url :'api/v1/create-transaction/transaction-dates/get',
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

    function getDocumentPOST(searchCriteriaModel) {
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
        blockUI.start();
        $http({
            method: 'POST',
            url: 'api/v1/create-transaction/trading-info/get',
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
            blockUI.stop();
            deffered.resolve(response);
        }).catch(function(response){
            blockUI.stop();
            deffered.reject(response);
        });
		 return deffered;
	 }
    
    function verifyTransaction(transaction){
    	var deffered = $q.defer();

        $http.post('api/v1/create-transaction/transaction/verify', transaction)
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

        $http.get('api/v1/create-transaction/sponsor')
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
	}

	function verifyTradingPartner() {
        var deffered = $q.defer();
        $http({
                url :'api/v1/create-transaction/trading-partner/verify',
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

    function calculateTransactionAmount(totalAmount, preDradowPercentag) {
        var sumAmount = (totalAmount * (preDradowPercentag / 100)).toFixed(2);
        return sumAmount;
    }

    return {
        getSponsorPaymentDate: getSponsorPaymentDate,
        getTransactionDate: getTransactionDate,
        getTradingInfo: getTradingInfo,
        verifyTransaction: verifyTransaction,
        verifyTradingPartner: verifyTradingPartner,
        getSponsor: getSponsor,
        getSupplier: getSupplier,
        getPaymentDate : getPaymentDate,
        getDocument : getDocument,
        getAccounts : getAccounts,
        getBuyerCodes: getBuyerCodes,
        getSuppliers: getSuppliers,
        getDocumentPOST:getDocumentPOST,
        calculateTransactionAmount:calculateTransactionAmount,
        submitTransaction:submitTransaction
	}
}