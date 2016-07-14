'use strict';

angular.module('scfApp').factory('NewduedateGroupService', ['$http', '$q', 'blockUI', NewduedateGroupServices]);

function NewduedateGroupServices($http, $q, blockUI){
	return {
//		getSponsors: getSponsors,
//		getTransactionStatusGroups: getTransactionStatusGroups,
		getDocumentsGroupbyDuedate: getDocumentsGroupbyDuedate,
//		summaryInternalStep: summaryInternalStep,
//		exportCSVFile: exportCSVFile,
//		generateEvidenceForm: generateEvidenceForm
	}
	
//	function getSponsors(){
//		var deffered = $q.defer();
//		$http.post('api/list-transaction/sponsors/get').then(function(response){
//			deffered.resolve(response);
//		}).catch(function(response){
//			deffered.reject(response);
//		});	
//		return deffered;
//	};
	
//	function getTransactionStatusGroups(){
//		var deffered = $q.defer();
//		$http.post('api/list-transaction/transaction-status-group/get').then(function(response){
//			deffered.resolve(response);
//		}).catch(function(response){
//			deffered.reject(response);
//		});	
//		return deffered;		
//	};

	function getDocumentsGroupbyDuedate(listDocumentModel){
		var deffered = $q.defer();
		var searchBlock = blockUI.instances.get('search-block');
		searchBlock.start();
		$http({
//			url: 'api/create-transaction/document-groupby-duedate',
//			method: 'POST',
//			data: listDocumentModel
			url: 'js/app/dashboard/documentGroupbyDuedate_maker.json',
			method: 'GET'
		}).then(function(response){
			searchBlock.stop();
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	}

//	function summaryInternalStep(listTransactionModel){
//		var deffered = $q.defer();
//		$http({
//			url: 'api/list-transaction/summary-internal-step',
//			method: 'POST',
//			data: listTransactionModel
//		}).then(function(response){
//			deffered.resolve(response);
//		}).catch(function(response){
//			deffered.reject(response);
//		});	
//		return deffered;
//	}

//	function exportCSVFile(listTransactionModel,$translate){
//		blockUI.start();
//        $http({
//            url : 'api/list-transaction/exportCSVFile',
//            method : 'POST',
//            data: listTransactionModel,
//            //params : {listTransactionModel},
//            headers : {
//                //'Content-type' : 'text/csv;charset=tis-620',
//                'Accept-Language': $translate.use()
//            },
//            responseType : 'arraybuffer'
//        }).success(function(data, status, headers, config) {
//            // TODO when WS success
//            var file = new Blob([ data ], {
//                type : 'text/csv'
//            });
//            //trick to download store a file having its URL
//            var fileURL = URL.createObjectURL(file);
//            var a         = document.createElement('a');
//            a.href        = fileURL; 
//            a.target      = '_blank';
//            a.download    = 'Transaction.csv';
//            document.body.appendChild(a);
//            blockUI.stop();
//            a.click();
//        }).error(function(data, status, headers, config) {
//            //TODO when WS error
//        });
//	}
	
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