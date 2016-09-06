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
			incomplete: 'INCOMPLETE',
			transactionHour: 'E1012',
			concurency: 'E1003'
		}
        var templateUrl = '/js/app/approve-transactions/fail-dialog.html';
        if (angular.isDefined(errorCode)) {
            if (errorCode == errorMessageCode.incomplete) {
                templateUrl = '/js/app/approve-transactions/incomplete-dialog.html';
            }
            else if(errorCode == errorMessageCode.concurency){
                templateUrl = '/js/app/approve-transactions/approve-concurency-dialog.html';
            }
        }
        return templateUrl;
    }

}