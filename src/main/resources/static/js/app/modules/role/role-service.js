'use strict';
var roleModule = angular.module('scfApp');
roleModule.service('RoleService', ['$http', '$q', 'Service',
	function($http, $q, Service) {
  
		this.getRole = function (roleId) {
			var serviceUrl = '/api/v1/roles/'+roleId;
			var deferred = $q.defer();
			$http({
				method: 'GET',
				url: serviceUrl
			}).then(function (response) {
				return deferred.resolve(response);
			}).catch(function (response) {
				return deferred.reject(response);
			});
			return deferred;
        }
    }
]);