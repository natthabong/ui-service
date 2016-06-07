'use strict';

angular.module('scfApp').factory('ListTransactionService', ['$http', '$q', ListTransactionServices]);

function ListTransactionServices($http, $q){
	return {
		getSponsors: getSponsors,
		getTransactionDocument: getTransactionDocument
	}
	
	function getSponsors(){
		var deffered = $q.defer();
		$http.post('api/list-transaction/sponsors/get').then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	};
	
	function getTransactionDocument(transactionModel){
		var deffered = $q.defer();
		$http({
			url:'api/list-transaction/search',
			method: 'POST',
			headers : {
            		'Content-Type': 'application/x-www-form-urlencoded'
            },
			data:{
				dateType: transactionModel.transactionDateType
			}
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	}
}