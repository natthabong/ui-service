angular.module('gecscf.transaction').factory('ApprovePaymentService',['$http', '$q', ApprovePaymentService]);
function ApprovePaymentService($http, $q){
	
	return {
		getTransaction : getTransaction,
		getRequestForm : getRequestForm
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