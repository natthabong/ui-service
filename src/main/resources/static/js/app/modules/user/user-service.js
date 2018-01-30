'use strict';
var userModule = angular.module('gecscf.user');
userModule.factory('UserService', ['$http', '$q', function ($http, $q) {

	return {
		getAllRoles: function () {
			var deffered = $q.defer();
			$http({
				method: 'GET',
				url: '/api/v1/roles'
			}).then(function (response) {
				deffered.resolve(response);
			}).catch(function (response) {
				deffered.reject(response);
			});
			return deffered;
		},
		saveUser: function (user, editMode) {
			var serviceUrl = 'api/v1/users' + (editMode ? ('/' + user.userId) : '');
			var req = {
				method: 'POST',
				url: serviceUrl,
				data: user
			}
			if (editMode) {
				req.headers = {
					'If-Match': user.version,
					'X-HTTP-Method-Override': 'PUT'
				}
			}
			var deferred = $q.defer();
			$http(req).then(function (response) {
				return deferred.resolve(response);
			}).catch(function (response) {
				return deferred.reject(response);
			});
			return deferred;
		}
	}

}]);