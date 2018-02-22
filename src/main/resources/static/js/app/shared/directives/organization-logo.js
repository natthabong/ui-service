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
      id: '@',
      name: '@'
    },
    link: function(scope, elements, attrs) {

      scope.decodeBase64 = function(data) {
        return (data ? atob(data) : UIFactory.constants.NOLOGO);
      };

      if (!angular.isArray(scope.ngModel)) {
        scope.ngModel = [scope.ngModel];
      }
      scope.fundings = scope.ngModel;
    },
    templateUrl: 'ui/template/organizationLogo.html'
  }
}]);