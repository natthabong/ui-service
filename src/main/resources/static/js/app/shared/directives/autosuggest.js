'use strict';

var app = angular.module('gecscf.ui');

app.directive('gecAutosuggest', [ function() {
	return {
		restrict : 'E',
		transclude : true,
		replace : true,
		scope : {
			model: '='
		},
		link: function(scope, elements, attrs){
			scope.searchTypeHead = function(value){
				return scope.model.searchAutosuggest(value);
			}
		},
		templateUrl : function(elem, attr) {
			return attr.templateUrl
				|| 'ui/template/autosuggest.html';
		}
	}
} ]);