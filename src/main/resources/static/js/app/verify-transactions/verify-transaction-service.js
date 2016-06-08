'use strict';

angular.module('scfApp').factory('VerifyTransactionService', ['$http', '$q', VerifyTransactionService]);

function VerifyTransactionService($http, $q){
	return {
		getSponsors: getSponsors
	}
	

	function getTransactionDocument(listTransactionModel){
		var deffered = $q.defer();
		$http({
			url: 'api/list-transaction/search',
			method: 'POST',
			data: listTransactionModel
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	}
}