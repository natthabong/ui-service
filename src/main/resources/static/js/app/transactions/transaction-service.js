angular.module('scfApp').factory('TransactionService', ['$q', '$http','$sce', 'blockUI', transactionService]);

function transactionService($q, $http, $sce, blockUI) {
    return {
        retry: retry,
    }

    function retry(transactionApproveModel) {
        var deffered = $q.defer();
        blockUI.start();
        $http({
            method: 'POST',
            url: '/api/transaction/retry',
            data: transactionApproveModel
        }).then(function(response) {
        	blockUI.stop();
            deffered.resolve(response);
        }).catch(function(response) {
        	blockUI.stop();
            deffered.reject(response);
        });
        return deffered;
    }

}