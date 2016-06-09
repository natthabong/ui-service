'use strict';

angular.module('scfApp').factory('ViewTransactionService', ['$http', '$q', ViewTransactionService]);

function ViewTransactionService($http, $q){
	return {
		prepare: prepare
	}
	

	function prepare(transaction){
		var deffered = $q.defer();
		$http({
			url: 'api/view-transaction/prepare',
			method: 'POST',
			data: transaction
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	}
	
	
}