angular.module('gecscf.transaction').factory('VerifyPaymentService',['$http', '$q','blockUI','$window', VerifyPaymentService]);
function VerifyPaymentService($http, $q, blockUI,$window){
	
	return {
		getTransaction : getTransaction
	}

    function getTransaction(transaction) {
        var deffered = $q.defer();
		var serviceUrl = 'api/v1/transactions/' + transaction.transactionId
		$http({
			url: serviceUrl,
			method: 'GET',
			headers : {
					'If-Match' : transaction.version
				},
			params:{
            		mode: 'verify'
            	}
            
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
    }
}