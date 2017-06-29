angular.module('gecscf.transaction').factory('CreatePaymentService',['$http', '$q', CreatePaymentService]);
function CreatePaymentService($http, $q){

	var getSuppliers = function(accountingTransactionType) {
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

	var getBuyerCodes = function(ownerId) {
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

	var getAccounts = function(organizeId) {
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
				offset: searchCriteriaModel.offset,
				sponsorId: searchCriteriaModel.sponsorId,
				supplierId: searchCriteriaModel.supplierId,
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
        $http({
    	    url :'api/v1/create-transaction/payment/submit',
        	method: 'POST',
        	data:{
        		Transaction : transactionModel
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

	return {
		getPaymentDate : getPaymentDate,
		getDocument : getDocument,
		getAccounts : getAccounts,
		getBuyerCodes: getBuyerCodes,
		getSuppliers: getSuppliers,
		submitTransaction:submitTransaction
	}
}