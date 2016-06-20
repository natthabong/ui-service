angular.module('scfApp').factory('ApproveTransactionService', ['$q', '$http', approveTransactionService]);

function approveTransactionService($q, $http) {
    return {
		getTransaction: getTransaction,
        approve: approve
    }

    function approve(transactionApproveModel) {
        var deffered = $q.defer();

        $http({
            method: 'POST',
            url: '/api/approve-transaction/approve',
            data: transactionApproveModel
        }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
            deffered.reject(response);
        });		
		
        return deffered;
    }
	
	function getTransaction(transactionModel){
		var deffered = $q.defer();
        $http({
            method: 'POST',
            url: '/api/approve-transaction/transaction/get',
            data: transactionModel
        }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
            deffered.reject(response);
        });		
		
        return deffered;
	}
}