'use strict';

angular.module('scfApp').factory('ViewTransactionService', ['$http', '$q', ViewTransactionService]);

function ViewTransactionService($http, $q){
	return {
		prepare: prepare,
		getDocuments: getDocuments
	}
	
	function prepare(transaction){
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
	
	function getDocuments(txnDocCriteria){
		var deffered = $q.defer();
		$http({
			url: 'api/transaction-documents/get',
			method: 'POST',
			data: txnDocCriteria
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});
		return deffered;
	}
}