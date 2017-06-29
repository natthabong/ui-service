angular.module('gecscf.transaction').factory('ViewPaymentService', ['$http', '$q', ViewPaymentService]);
function ViewPaymentService($http, $q) {

    var getTransaction = function(transaction) {
        var deffered = $q.defer();
		var serviceUrl = 'api/v1/transactions/' + transaction.transactionId
		$http({
			url: serviceUrl,
			method: 'GET',
			headers : {
					'If-Match' : transaction.version
				},
			params:{
            		mode: 'view'
            	}
            
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
    }

    return {
        getTransaction: getTransaction
    };
}