'use strict';
var userModule = angular.module('gecscf.user');
userModule.factory('UserService', [ '$http', '$q', function($http, $q) {

    return {
	getAllRoles : function() {
	    var deffered = $q.defer();
	    $http({
	       method: 'GET',
	       url: '/api/v1/roles'
	    }).then(function(response) {
	       deffered.resolve(response);
	    }).catch(function(response) {
	       deffered.reject(response);
	    });
	    return deffered;
	}
    }

} ]);