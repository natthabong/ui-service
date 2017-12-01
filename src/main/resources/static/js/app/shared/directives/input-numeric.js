'use strict';

var app = angular.module('gecscf.ui');
app.directive('scfInputNumeric', [ function() {

    function link(scope, element, attrs) {
		if (angular.isDefined(scope.maxLength)) {
	    	scope.show = true;
		}
    }
    return {
		restrict : 'AE',
		replace : true,
		scope : {
	    	maxLength : '=maxlength'
		},
		template : '<input ng-if="show" type="text" class="form-control" format="currency" placeholder="0.00" style="text-align: right;" />',
		link : link
    };
} ]);

app.directive("formatDefaultValue", function () {
    return {
        restrict: 'E',
        scope: {},
    };
});

app.directive("formatOnlyPositive", function () {
    return {
        restrict: 'E',
        scope: {},
    };
});

app.directive("formatNotBeZero", function () {
    return {
        restrict: 'E',
        scope: {},
    };
});