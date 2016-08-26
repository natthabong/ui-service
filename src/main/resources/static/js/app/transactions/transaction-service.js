angular.module('scfApp').factory('TransactionService', ['$q', '$http', '$sce', 'blockUI', transactionService]);

function transactionService($q, $http, $sce, blockUI) {
    return {
        retry: retry,
        getTransactionDialogErrorUrl: getTransactionDialogErrorUrl
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

    function getTransactionDialogErrorUrl(errorCode) {
		var errorMessageCode = {
			timeout: 'TIMEOUT'
		}
        var templateUrl = '/js/app/approve-transactions/fail-dialog.html';
        if (angular.isDefined(errorCode)) {
            if (errorCode == errorMessageCode.timeout) {
                templateUrl = '/js/app/approve-transactions/incomplete-dialog.html';
            }
        }
        return templateUrl;
    }

}