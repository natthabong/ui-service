'use strict';
angular.module('gecscf.organize.configuration').factory('OrganizationAccountService', [
	'$http',
	'$q',
	function ($http, $q) {
		var getGeneralInfo = function (organizeId) {
			var deferred = $q.defer();
			$http.get('/api/v1/organize-customers', {
				params: {
					organizeId: organizeId,
					offset: 0,
					limit: 100
				}
			}).then(function (response) {
				deferred.resolve(response);
			}).catch(function (response) {
				deferred.reject(response);
			});
			return deferred;
		}

		return {
			getGeneralInfo: getGeneralInfo
		}
	}

]);