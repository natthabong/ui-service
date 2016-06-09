'use strict';

angular.module('scfApp').factory('ListTransactionService', ['$http', '$q', ListTransactionServices]);

function ListTransactionServices($http, $q){
	return {
		getSponsors: getSponsors,
		getTransactionStatusGroups: getTransactionStatusGroups,
		getTransactionDocument: getTransactionDocument,
		summaryInternalStep: summaryInternalStep
		exportCSVFile: exportCSVFile,
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

	function summaryInternalStep(listTransactionModel){
		var deffered = $q.defer();
		$http({
			url: 'api/list-transaction/summary-internal-step',
			method: 'POST',
			data: listTransactionModel
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	}

	function exportCSVFile(listTransactionModel,$translate){
        $http({
            url : 'api/list-transaction/exportCSVFile',
            method : 'POST',
            data: listTransactionModel,
            //params : {listTransactionModel},
            headers : {
                //'Content-type' : 'text/csv;charset=tis-620',
                'Accept-Language': $translate.use()
            },
            responseType : 'arraybuffer'
        }).success(function(data, status, headers, config) {
            // TODO when WS success
            var file = new Blob([ data ], {
                type : 'text/csv'
            });
            //trick to download store a file having its URL
            var fileURL = URL.createObjectURL(file);
            var a         = document.createElement('a');
            a.href        = fileURL; 
            a.target      = '_blank';
            a.download    = 'Transaction.csv';
            document.body.appendChild(a);
            a.click();
        }).error(function(data, status, headers, config) {
            //TODO when WS error
        });
	}
}