'use strict';
var fpModule = angular.module('gecscf.fundingProfile');
fpModule.factory('FundingProfileService', ['$http', '$q', 'Service', function ($http, $q, Service) {
	
	var createFundingProfile = function(fundingInfo) {
	    var deferred = $q.defer();
	    var serviceUrl = '/api/v1/fundings';
	    var fundingProfile = {
	    		bankCode: fundingInfo.fundingCode,
	    		fundingName: fundingInfo.fundingName,
	    		fundingId: fundingInfo.taxId,
                creditPendingMethod: fundingInfo.creditPendingMethod
	    }
	    var fundingProfilePaylod = {
	    		fundingProfile: fundingProfile
	    }
	    $http({
	      method : 'POST',
	      url : serviceUrl,
	      data : fundingProfilePaylod
	      }).then(function(response){
	          return deferred.resolve(response);
	     }).catch(function(response){
	          return deferred.reject(response);
	     });
	     return deferred;
	}
	
	var updateFundingProfile = function(fundingInfo) {
	    var deferred = $q.defer();
	    var serviceUrl = '/api/v1/fundings/' + fundingInfo.fundingId;
	    $http({
	      method : 'POST',
	      headers: {
	        'If-Match': fundingInfo.version,
	        'X-HTTP-Method-Override': 'PUT'
	      },
	      url : serviceUrl,
	      data: fundingInfo
	      }).then(function(response){
	          return deferred.resolve(response);
	     }).catch(function(response){
	          return deferred.reject(response);
	     });
	     return deferred;
	 }
	
	return {
		updateFundingProfile: updateFundingProfile,
		createFundingProfile: createFundingProfile
	}
}]);