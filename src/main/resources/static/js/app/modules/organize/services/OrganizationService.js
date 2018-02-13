'use strict';
var orgModule = angular.module('gecscf.organize');
orgModule.service('OrganizationService', ['$http', '$q', function($http, $q) {

  var _prepareItem = function(item) {
    item.identity = ['organize-', item.memberId, '-option'].join('');
    item.label = [item.memberCode, ': ', item.memberName].join('');
    return item;
  }

  this.getOrganizeByNameOrCodeLike = function(query) {
    var http = $http.get('/api/v1/organizes', {
      params: {
        q: query,
        supporter: false,
        founder: false,
        offset: 0,
        limit: 5
      }
    }).then(function(response) {
      return response.data.map(_prepareItem);
    });

    return http;
  }

  this.createOrganization = function(organization) {
    var deferred = $q.defer();
    var serviceUrl = '/api/v1/organize-customers';
    $http({
      method : 'POST',
      url : serviceUrl,
      data : organization
      }).then(function(response){
          return deferred.resolve(response);
     }).catch(function(response){
          return deferred.reject(response);
     });
     return deferred;
  }

    this.removeOrganization = function(organization) {
      var uri = '/api/v1/organize-customers/' + organization.memberId;
      var deferred = $q.defer();
  
      $http({
          url: uri,
          method: 'POST',
          headers: {
              'If-Match': organization.version,
              'X-HTTP-Method-Override': 'DELETE'
          },
          data: organization
      }).then(function(response) {
        deferred.resolve(response);
      }).catch(function(response) {
        deferred.reject(response);
      });
  
      return deferred;
    }
  
}]);