'use strict';

var app = angular.module('gecscf.ui');
app.directive('scfInputText', [ function() {

    function link(scope, element, attrs) {
	console.log(scope.maxLength)
	if (angular.isDefined(scope.maxLength)) {
	    scope.show = true;
	}
    }
    return {
	restrict : 'AE',
	replace : true,
	scope: {
	    maxLength: '=maxlength'
	},
	template : '<input ng-if="show" type="text" class="form-control"/>',
	link : link
    };
} ])