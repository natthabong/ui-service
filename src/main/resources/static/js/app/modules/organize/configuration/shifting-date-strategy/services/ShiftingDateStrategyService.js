'use strict';
var shiftingDateStrategyModule = angular
.module('gecscf.organize.configuration.shiftingDateStrategy');
shiftingDateStrategyModule.factory('ShiftingDateStrategyService', ['$http', '$q', 'Service', function ($http, $q, Service) {
	
	var getShiftStrategy = function (organizeId , accountingTransactionType){
		var differed = $q.defer();
		var reqUrl = '/api/v1/organize-customers/'+ organizeId + '/accounting-transaction-type/'+accountingTransactionType+'/shifting-date-strategies';
		$http({
			url: reqUrl,
			method: 'GET',

		}).then(function (response) {
			differed.resolve(response);
		}).catch(function (response) {
			differed.resolve(response);
		});
		return differed;
	}
	
	var createShiftStrategy = function (shiftingModel){
		var deferred = $q.defer();
	    var serviceUrl = '/api/v1/organize-customers/' + shiftingModel.ownerId + '/shifting-date-strategies';
	    $http({
	      method : 'POST',
	      url : serviceUrl,
	      data : shiftingModel
	      }).then(function(response){
	          return deferred.resolve(response);
	     }).catch(function(response){
	          return deferred.reject(response);
	     });
	     return deferred;
	}
	
	var updateShiftStrategy = function (shiftingModel , accountingTransactionType){
		var deferred = $q.defer();
	    var serviceUrl = '/api/v1/organize-customers/' + shiftingModel.ownerId + '/accounting-transaction-type/'+ accountingTransactionType +'/shifting-date-strategies/' + shiftingModel.shiftingDateStrategyId;
	    $http({
	      method : 'POST',
	      headers: {
		        'If-Match': shiftingModel.version,
		        'X-HTTP-Method-Override': 'PUT'
		   },
	      url : serviceUrl,
	      data : shiftingModel
	      }).then(function(response){
	          return deferred.resolve(response);
	     }).catch(function(response){
	          return deferred.reject(response);
	     });
	     return deferred;
	}
	
	return {
		getShiftStrategy: getShiftStrategy,
		createShiftStrategy: createShiftStrategy,
		updateShiftStrategy: updateShiftStrategy,
    }
	
}
]);