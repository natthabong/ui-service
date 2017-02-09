'use strict';

var app = angular.module('gecscf.ui');s
directive('confirmation', [ function() {
    return {
	restrict : 'A',
	require : '^scfButton',
	link : function(scope, element, attrs) {
	    
	}
    }
} ]);