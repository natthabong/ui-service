'use strict';
var displayModule = angular.module('gecscf.organize.configuration.display');
displayModule.factory('DisplayService', ['$http', '$q', 'Service', function ($http, $q, Service) {

	

	var getDocumentDisplayConfig = function (ownerId, accountingTransactionType, displayMode) {
		var differed = $q.defer();
		var reqUrl = '/api/v1/organize-customers/' + ownerId + '/accounting-transactions/' + accountingTransactionType + '/display-modes/' + displayMode + '/displays';
		$http({
			url: reqUrl,
			method: 'GET',

		}).then(function (response) {
			differed.resolve(response);
		}).catch(function (response) {
			differed.resolve(response);
		});
		return differed;
	};
	

	var updateDisplay = function (ownerId, accountingTransactionType, displayMode, dataModel) {
		var reqUrl = '/api/v1/organize-customers/' + ownerId + '/accounting-transactions/' + accountingTransactionType + '/display-modes/' + displayMode + '/displays';
		var deferred = $q.defer();
		$http({
			method : 'POST',
			url : reqUrl + '/'+ dataModel.documentDisplayId,
			data : dataModel,
			headers : {
				'If-Match' : dataModel.version,
				'X-HTTP-Method-Override': 'PUT'
			}
		  }).then(function(response){
		      return deferred.resolve(response);
		 }).catch(function(response){
		      return deferred.reject(response);
		 });
		 return deferred;
	}

	return {
		getDocumentDisplayConfig: getDocumentDisplayConfig,
		updateDisplay: updateDisplay
	}
}]);