angular.module('gecscf.transaction').factory('PaymentTransactionService',['$http', '$q', PaymentTransactionService]);
function PaymentTransactionService($http, $q){

	function getTransactionStatusGroups(transactionType){
		var deffered = $q.defer();
		$http({
			url: 'api/v1/list-transaction/transaction-status-groups',
			method: 'GET',
			params: {
				transactionType: transactionType
			}
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;		
	};
	function getSummaryOfTransaction(criteria){
		var deffered = $q.defer();
		$http({
			url: 'api/v1/list-transaction/summary-internal-step',
			method: 'GET',
			params: criteria
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	};
	function generateCreditAdviceForm(transactionModel){
		$http({
            method: 'POST',
            url: '/api/approve-transaction/credit-advice-form',
            data: transactionModel,
            responseType: 'arraybuffer'
        }).success(function(response) {
            var file = new Blob([response], {
                type: 'application/pdf'
            });
            var fileURL = URL.createObjectURL(file);
            var a = document.createElement('a');
            a.href = fileURL;
            a.target = '_blank';
            a.download = transactionModel.transactionNo + '.pdf';
            document.body.appendChild(a);
            a.click();
        }).error(function(response) {

        });
	};
	return {
		getTransactionStatusGroups:getTransactionStatusGroups,
		getSummaryOfTransaction: getSummaryOfTransaction,
		generateCreditAdviceForm: generateCreditAdviceForm,
	}
}