angular.module('gecscf.transaction').factory('VerifyPaymentService', ['$http', '$q', 'blockUI', '$window', VerifyPaymentService]);
function VerifyPaymentService($http, $q, blockUI, $window) {

	return {
		getTransaction: getTransaction,
		approve: approve,
		reject: reject,
		getAccountDetails: getAccountDetails
	}

	function getAccountDetails(sponsorId, supplierId, accountId) {
		var deffered = $q.defer();
		var serviceUrl = 'api/v1/organize-customers/'+sponsorId+'/trading-partners/'+supplierId+'/trade-finance/'+accountId
		$http({
			url: serviceUrl,
			method: 'GET',
            
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});	
		return deffered;
	}

	function getTransaction(transaction) {
		var deffered = $q.defer();
		var serviceUrl = 'api/v1/transactions/' + transaction.transactionId
		$http({
			url: serviceUrl,
			method: 'GET',
			headers: {
				'If-Match': transaction.version
			},
			params: {
				mode: 'verify'
			}

		}).then(function (response) {
			deffered.resolve(response);
		}).catch(function (response) {
			deffered.reject(response);
		});
		return deffered;
	}

	function approve(transaction) {
		var deffered = $q.defer();
		$http({
			url: 'api/verify-transaction/approve',
			method: 'POST',
			data: transaction
		}).then(function (response) {
			deffered.resolve(response);
		}).catch(function (response) {
			deffered.reject(response);
		});
		return deffered;
	}

	function reject(transaction) {
		var deffered = $q.defer();
		$http({
			url: 'api/verify-transaction/reject',
			method: 'POST',
			data: transaction
		}).then(function (response) {
			deffered.resolve(response);
		}).catch(function (response) {
			deffered.reject(response);
		});
		return deffered;
	}
}