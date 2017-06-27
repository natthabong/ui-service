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
	
	function getDocument(criteria) {
        var deffered = $q.defer();
        $http({
    	    url : 'api/v1/documents/',
        	method: 'GET',
        	data: criteria
        }).then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
    }
	return {
		getDocument : getDocument,
		getBuyerCodes: getBuyerCodes,
		getSuppliers: getSuppliers
	}
}