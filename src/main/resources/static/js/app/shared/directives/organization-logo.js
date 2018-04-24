'use strict';

var app = angular.module('gecscf.ui');

app.directive('organizationLogo', ['UIFactory', function(UIFactory) {
  return {
    restrict: 'E',
    transclude: true,
    replace: false,
    scope: {
      model: '=',
      ngModel: '=',
      id: '=',
      name: '=',
      logoAttr: '@',
      nameAttr: '@',
      objAttr: '@',
      idAttr: '@'
    },
    link: function(scope, elements, attrs) {
      var logoAttr = scope.logoAttr || 'fundingLogo';
      var nameAttr = scope.nameAttr || 'fundingName';
      var idAttr = scope.idAttr || 'fundingId';
      scope.decodeBase64 = function(data) {
        return (data ? atob(data) : UIFactory.constants.NOLOGO);
      };

      if (!angular.isArray(scope.ngModel)) {
        scope.ngModel = [scope.ngModel];
      }
      scope.$watch("ngModel",function(newValue,oldValue) {
        scope.organizations = {};
        angular.forEach(newValue, function(value) {
          var val = scope.objAttr==undefined?value:value[scope.objAttr];
          this[val[idAttr]] = {
              logo: val[logoAttr],
              name: val[nameAttr]
          };
        }, scope.organizations);
      });

    },
    templateUrl: 'ui/template/organizationLogo.html'
  }
}]);