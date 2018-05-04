'use strict';

angular.module('scfApp').factory('ListTransactionService', ['$http', '$q', 'blockUI', ListTransactionServices]);

function ListTransactionServices($http, $q, blockUI){
	return {
		getSponsors: getSponsors,
		getTransactionStatusGroups: getTransactionStatusGroups,
		getTransactionDocument: getTransactionDocument,
		summaryInternalStep: summaryInternalStep,
		summaryStatusGroup: summaryStatusGroup,
		exportCSVFile: exportCSVFile
//		generateEvidenceForm: generateEvidenceForm
	}
	
	function getSponsors(){
		var deffered = $q.defer();
		$http.get('api/v1/list-transaction/sponsors/get').then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	};
	
	function getTransactionStatusGroups(transactionType){
		var deffered = $q.defer();
		$http.get('api/v1/list-transaction/transaction-status-groups',{
			transactionType: transactionType
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;		
	};

	function getTransactionDocument(listTransactionModel){
		var deffered = $q.defer();
		var searchBlock = blockUI.instances.get('search-block');
		searchBlock.start();
		$http({
			url: 'api/v1/list-transaction/search',
			method: 'POST',
			data: listTransactionModel
		}).then(function(response){
			searchBlock.stop();
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	}

	function summaryInternalStep(listTransactionModel){
		var deffered = $q.defer();
		$http({
			url: 'api/v1/list-transaction/summary-internal-step',
			method: 'POST',
			data: listTransactionModel
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	}
	
	function summaryStatusGroup(listTransactionModel){
		var deffered = $q.defer();
		$http({
			url: 'api/v1/list-transaction/summary-status-group',
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
		blockUI.start();
        $http({
            url : 'api/v1/list-transaction/exportCSVFile',
            method : 'POST',
            data: listTransactionModel,
            // params : {listTransactionModel},
            headers : {
                // 'Content-type' : 'text/csv;charset=tis-620',
                'Accept-Language': $translate.use()
            },
            responseType : 'arraybuffer'
        }).success(function(data, status, headers, config) {
            // TODO when WS success
            var file = new Blob([ data ], {
                type : 'text/csv'
            });
            // trick to download store a file having its URL
            var fileURL = URL.createObjectURL(file);
            var a         = document.createElement('a');
            a.href        = fileURL; 
            a.target      = '_self';
            a.download    = 'Transaction.csv';
            document.body.appendChild(a);
            blockUI.stop();
            a.click();
        }).error(function(data, status, headers, config) {
            // TODO when WS error
        });
	}
//	
//	function generateEvidenceForm(transactionModel){
//		 $http({
//	            method: 'POST',
//	            url: '/api/approve-transaction/evidence-form',
//	            data: transactionModel,
//	            responseType: 'arraybuffer'
//	        }).success(function(response) {
//	        	var file = new Blob([response], {type: 'application/pdf'});
//	        	var fileURL = URL.createObjectURL(file);
//	        	var a         = document.createElement('a');
//	            a.href        = fileURL; 
//	            a.target      = '_blank';
//	            a.download    = transactionModel.transactionNo+'.pdf';
//	            document.body.appendChild(a);
//	            a.click();
//	        }).error(function(response) {
//	            
//	        });
//	}
}