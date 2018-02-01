'use strict';
var exportChannelModule = angular.module('gecscf.organize.configuration.channel.export');
exportChannelModule.service('ExportChannelService', ['$http', '$q', function($http, $q) {
  this.create = function(model) {
    var uri = 'api/v1/organize-customers/' + model.organizeId + '/export-channels';
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
  
  this.remove = function(model) {
	 var uri = 'api/v1/organize-customers/' + model.organizeId + '/export-channels/' + model.channelId ;
	 var deferred = $q.defer();

	  $http({
	      url: uri,
	      method: 'POST',
	      headers: {
              'If-Match': model.version,
              'X-HTTP-Method-Override': 'DELETE'
          },
	      data: model
	  }).then(function(response) {
	    deferred.resolve(response);
	  }).catch(function(response) {
	    deferred.reject(response);
	  });

	    return deferred;
  }
  
}]);