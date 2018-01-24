'use strict';
var channelModule = angular.module('gecscf.organize.configuration');
channelModule.service('ChannelService', ['$http', '$q', function($http, $q) {
	
    this.create = function(model) {
        var uri = 'api/v1/organize-customers/' + model.organizeId + '/process-types/' + model.processType + '/channels';
        var deferred = $q.defer();

        $http({
            url: uri,
            method: 'POST',
            data: model
        }).then(function(response) {
        	deferred.resolve(response);
        }).catch(function(response) {
        	deferred.reject(response);
        });

        return deferred;
    }
}]);