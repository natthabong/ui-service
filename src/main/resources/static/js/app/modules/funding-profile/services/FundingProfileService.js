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
	    		contact: fundingInfo.contact,
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
	
	var updateFundingProfile = function(fundingProfile,fundingFinanceSolutions) {
	    var deferred = $q.defer();
	    var serviceUrl = '/api/v1/fundings/' + fundingProfile.fundingId;
	    var fundingProfilePaylod = {
	    		fundingProfile: fundingProfile,
	    		financialServiceProfiles: fundingFinanceSolutions
	    }
	    $http({
	      method : 'POST',
	      headers: {
	        'If-Match': fundingProfile.version,
	        'X-HTTP-Method-Override': 'PUT'
	      },
	      url : serviceUrl,
	      data: fundingProfilePaylod
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