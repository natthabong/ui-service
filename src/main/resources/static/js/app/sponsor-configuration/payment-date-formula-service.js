angular.module('scfApp').factory('PaymentDateFormulaService',['$http', '$q', 'blockUI', PaymentDateFormulaService]);
function PaymentDateFormulaService($http, $q, blockUI){
	return {
		saveNewFormula: saveNewFormula
	}
	function saveNewFormula(sponsor,formula){
	    var deffered = $q.defer();
	    $http({
	       method: 'POST',
	       url: '/api/v1/organize-customers/' + sponsor + '/sponsor-configs/SFP/payment-date-formulas',
           data: formula
	    }).then(function(response) {
	       deffered.resolve(response);
	    }).catch(function(response) {
	       deffered.reject(response);
	    });
	    return deffered;
	}
}