angular.module('scfApp').factory('ApproveTransactionService', ['$q', '$http','$sce', approveTransactionService]);

function approveTransactionService($q, $http, $sce) {
    return {
		getTransaction: getTransaction,
        approve: approve,
        generateRequestForm: generateRequestForm,
        generateEvidenceForm: generateEvidenceForm
    }

    function approve(transactionApproveModel) {
        var deffered = $q.defer();

        $http({
            method: 'POST',
            url: '/api/approve-transaction/approve',
            data: transactionApproveModel
        }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
            deffered.reject(response);
        });
        		
        return deffered;
    }
	
	function getTransaction(transactionModel){
		var deffered = $q.defer();
        $http({
            method: 'POST',
            url: '/api/approve-transaction/transaction/get',
            data: transactionModel
        }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
            deffered.reject(response);
        });		
		
        return deffered;
	}
	
	function generateRequestForm(transactionModel){
        $http({
            method: 'POST',
            url: '/api/approve-transaction/report-form',
            data: transactionModel,
            responseType: 'arraybuffer'
        }).success(function(response) {
        	var file = new Blob([response], {type: 'application/pdf'});
        	var fileURL = URL.createObjectURL(file);   	
        	document.getElementById('visualizador').setAttribute('data', fileURL);

        }).error(function(response) {
            
        });
	}
	
	function generateEvidenceForm(transactionModel){
		 $http({
	            method: 'POST',
	            url: '/api/approve-transaction/evidence-form',
	            data: transactionModel,
	            responseType: 'arraybuffer'
	        }).success(function(response) {
	        	var file = new Blob([response], {type: 'application/pdf'});
	        	var fileURL = URL.createObjectURL(file);
	        	var a         = document.createElement('a');
	            a.href        = fileURL; 
	            a.target      = '_blank';
	            a.download    = transactionModel.transactionNo+'.pdf';
	            document.body.appendChild(a);
	            a.click();
	        }).error(function(response) {
	            
	        });
	}

}