'use strict';

var app = angular.module('gecscf.ui');

app.directive('gecAutoSuggest', [function () {
	return {
		restrict: 'E',
		transclude: true,
		replace: false,
		scope: {
			model: '=',
			ngModel: '=',
			id: '@',
			disable: '=',
			required: '@',
			name: '@'
		},
		link: function (scope, elements, attrs) {
			elements.context.id = "undefined";
			if (angular.isUndefined(scope.model) || angular.isUndefined(scope.model.itemTemplateUrl) || scope.model.itemTemplateUrl == null) {
				scope.model.itemTemplateUrl = 'uib/template/typeahead/typeahead-match.html';
			}

			if (angular.isUndefined(scope.required)) {
				scope.ngRequired = false;
			} else {
				scope.ngRequired = true;
			}

			if (angular.isDefined(scope.name)) {
				elements.name = '';
			}
		},
		templateUrl: function (elem, attr) {
			return attr.itemTemplateUrl ||
				'ui/template/autoSuggest.html';
		}
	}
}]);