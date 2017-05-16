'use strict';

var app = angular.module('gecscf.ui');

app.directive('gecCheckboxButton', [ function() {
	return {
		restrict : 'E',
		transclude : true,
		replace : true,
		scope : {
			ngModel: '=',
			id: '@',
			disable: '=',
			label: '@',
			name: '@'
		},
		link: function(scope, elements, attrs){			
		},
		templateUrl : function(elem, attr) {
			return attr.itemTemplateUrl
				|| 'ui/template/checkboxButton.html';
		}
	}
} ]);