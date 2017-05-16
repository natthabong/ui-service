'use strict';

var app = angular.module('gecscf.ui');

app.directive('gecCheckboxButton', [ function() {
	return {
		restrict : 'E',
		transclude : true,
		replace : false,
		scope : {
			ngModel: '=',
			id: '@',
			disable: '='
		},
		link: function(scope, elements, attrs){			
			elements.context.id="undefined";
		},
		templateUrl : function(elem, attr) {
			return attr.itemTemplateUrl
				|| 'ui/template/checkboxButton.html';
		}
	}
} ]);