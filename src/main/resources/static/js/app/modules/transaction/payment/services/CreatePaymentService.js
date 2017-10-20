angular.module('gecscf.transaction').factory('CreatePaymentService',['$http', '$q', CreatePaymentService]);
function CreatePaymentService($http, $q){

	function calculateTransactionAmount(documentSelects){
		var sumAmount = 0;
        documentSelects.forEach(function (document) {
            sumAmount += document.netAmount;
        });
		return sumAmount;		
	};
	
	
	return {
		calculateTransactionAmount:calculateTransactionAmount
	}
}