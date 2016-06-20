angular.module('scfApp').factory('ApproveTransactionService', ['$q', '$http', approveTransactionService]);

function approveTransactionService($q, $http) {
    return {
        approve: approve
    }

    function approve(transactionApproveModel) {
        var deffered = $q.defer();

//        $http({
//            method: 'POST',
//            url: '/api/approve-transaction/approve',
//            data: transactionApproveModel
//        }).then(function(response) {
//            deffered.resolve(response);
//        }).catch(function(response) {
//            deffered.reject(response);
//        });
		
		$http({
            method: 'GET',
            url: '/js/test/approve-transactions/transaction.json'
        }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
            deffered.reject(response);
        });
        return deffered;
    }
}