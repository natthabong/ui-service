angular.module('gecscf.transaction').factory('PaymentTransactionService',['$http', '$q', PaymentTransactionService]);
function PaymentTransactionService($http, $q){

	function getTransactionStatusGroups(){
		var deffered = $q.defer();
		$http.get('api/v1/list-transaction/transaction-status-group/get').then(function(response){
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
	}
	return {
		getTransactionStatusGroups:getTransactionStatusGroups,
		getSummaryOfTransaction: getSummaryOfTransaction,
	}
}