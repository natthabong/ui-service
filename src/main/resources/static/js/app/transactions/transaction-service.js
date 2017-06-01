angular.module('scfApp').factory('TransactionService', ['$q', '$http', '$sce', 'blockUI', transactionService]);

function transactionService($q, $http, $sce, blockUI) {
    return {
        retry: retry,
        reject: reject,
        retryReject: retryReject,
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
    
    function retryReject(transactionApproveModel) {
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
    
    function reject(transactionModel) {
        var deffered = $q.defer();
        blockUI.start();
        $http({
            method: 'POST',
            url: '/api/v1/reject-transaction/reject',
            data: transactionModel
        }).then(function(response) {
            blockUI.stop();
            deffered.resolve(response);
        }).catch(function(response) {
            blockUI.stop();
            deffered.reject(response);
        });
        return deffered;
    }

    function getTransactionDialogErrorUrl(errorCode, action) {
		var errorMessageCode = {
			incomplete: 'INCOMPLETE',
			transactionHour: 'E1012',
			concurency: 'E1003'
		}
		var version = (new Date()).getTime();
		var templateUrl = '/js/app/approve-transactions/fail-dialog.html?v='+version;
		if(action==='approve'){
			if (angular.isDefined(errorCode)) {
	            if (errorCode == errorMessageCode.incomplete) {
	                templateUrl = '/js/app/approve-transactions/incomplete-dialog.html?v='+version;
	            }
	            else if(errorCode == errorMessageCode.concurency){
	            	
	                templateUrl = '/js/app/approve-transactions/approve-concurency-dialog.html?v='+version;
	            }
	        }
		}else{
			templateUrl = '/js/app/approve-transactions/retry-fail-dialog.html?v='+version;
	        if (angular.isDefined(errorCode)) {
	            if (errorCode == errorMessageCode.incomplete) {
	                templateUrl = '/js/app/approve-transactions/incomplete-dialog.html?v='+version;
	            }
	            else if(errorCode == errorMessageCode.concurency){
	            	
	                templateUrl = '/js/app/approve-transactions/retry-concurency-dialog.html?v='+version;
	            }
	        }
		}
        return templateUrl;
    }

}