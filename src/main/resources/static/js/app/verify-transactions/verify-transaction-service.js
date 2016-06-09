'use strict';

angular.module('scfApp').factory('VerifyTransactionService', ['$http', '$q', VerifyTransactionService]);

function VerifyTransactionService($http, $q){
	return {
		prepare: prepare,
		approve: approve,
		reject: reject
	}
	

	function prepare(transaction){
		var deffered = $q.defer();
		$http({
			url: 'api/verify-transaction/prepare',
			method: 'POST',
			data: transaction
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	}
	
	function approve(transaction){
		var deffered = $q.defer();
		$http({
			url: 'api/verify-transaction/approve',
			method: 'POST',
			data: transaction
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	}
	
	function reject(transaction){
		var deffered = $q.defer();
		$http({
			url: 'api/verify-transaction/reject',
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