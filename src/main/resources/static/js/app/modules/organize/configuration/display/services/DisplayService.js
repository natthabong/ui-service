'use strict';
var displayModule = angular.module('gecscf.organize.configuration.display');
displayModule.factory('DisplayService', [ '$http', '$q', 'Service', function($http, $q, Service) {

	var getDocumentDisplayConfig = function(ownerId, accountingTransactionType, displayMode) {
			var differed = $q.defer();
			var reqUrl = '/api/v1/organize-customers/'+ownerId+'/accounting-transactions/'+accountingTransactionType+'/display-modes/'+displayMode+'/displays';
            $http({
				url : reqUrl,
				method: 'GET',
					
			}).then(function(response) {
				differed.resolve(response);
			}).catch(function(response) {
				differed.resolve(response);
			});
			return differed;
		};

	return {
        getDocumentDisplayConfig:getDocumentDisplayConfig
	}
} ]);