'use strict';

angular.module('scfApp').factory('ListTransactionService', ['$http', '$q', ListTransactionServices]);

function ListTransactionServices($http, $q){
	return {
		getSponsors: getSponsors,
		getTransactionStatusGroups: getTransactionStatusGroups
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
	
	function getTransactionStatusGroups(){
		var deffered = $q.defer();
		$http.post('api/list-transaction/transaction-status-group/get').then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;		
	};
}