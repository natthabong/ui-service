'use strict';
var module = angular.module('gecscf.fundingProfile.configuration');
module.service('FundingLogoService', [ '$http', '$q', function($http, $q) {

	this.save = function(fundingInfo) {
		var serviceUrl = 'api/v1/fundings/' + fundingInfo.fundingId + '/logo';
		var deffered = $q.defer();
		var serviceDiferred = $http({
			method : 'POST',
			url : serviceUrl,
			data : fundingInfo.fundingLogo,
			headers : {
				'If-Match' : fundingInfo.version,
				'X-HTTP-Method-Override' : 'PUT'
			}
		}).success(function(data, status, headers, config) {
			deffered.resolve({
				data : data,
				headers : headers
			})
		}).error(function(response) {
			deffered.reject(response);
		});
		return deffered;
	}

} ]);