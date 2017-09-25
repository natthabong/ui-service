angular.module('gecscf.transaction').factory('ApprovePaymentService',['$http', '$q','blockUI','$window', ApprovePaymentService]);
function ApprovePaymentService($http, $q, blockUI,$window){
	
	return {
        approve : approve,
        reject: reject,
		getTransaction : getTransaction,
		getRequestForm : getRequestForm,
		generateEvidenceForm: generateEvidenceForm
	}

    function approve(transactionApproveModel) {
        var deffered = $q.defer();
        blockUI.start();
        $http({
            method: 'POST',
            url: '/api/approve-transaction/approve',
            data: transactionApproveModel
        }).then(function(response) {
            blockUI.stop();
            deffered.resolve(response);
        }).catch(function(response) {
            blockUI.stop();
            if(response.status == 403){
        	$window.location.href = "/error/403";
            }else{
        	deffered.reject(response);
            }
        });
        return deffered;
    }
	
    function reject(transactionApproveModel) {
        var deffered = $q.defer();
        blockUI.start();
        $http({
            method: 'POST',
            url: '/api/approve-transaction/reject',
            data: transactionApproveModel
        }).then(function(response) {
            blockUI.stop();
            deffered.resolve(response);
        }).catch(function(response) {
            blockUI.stop();
            if(response.status == 403){
        	$window.location.href = "/error/403";
            }else{
        	deffered.reject(response);
            }
        });
        return deffered;
    }
    
    function getTransaction(transactionModel) {
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
    
    function getRequestForm(transactionModel) {
        var requestFormBlock = blockUI.instances.get('requestForm');
        requestFormBlock.start();
        $http({
            method: 'POST',
            url: '/api/approve-transaction/report-form',
            data: transactionModel,
            responseType: 'arraybuffer'
        }).success(function(response) {
            var file = new Blob([response], {
                type: 'image/jpeg'
            });
            var fileURL = URL.createObjectURL(file);
            document.getElementById('visualizador').setAttribute('data', fileURL);
            requestFormBlock.stop();
        }).error(function(response) {

        });
    }
}