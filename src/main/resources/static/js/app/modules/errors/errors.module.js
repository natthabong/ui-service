(function(exports) {
    "use strict";

    var app = angular.module('scfError', ['pascalprecht.translate']);
    app.controller('ErrorController', [ '$scope', '$element', '$attrs',
	    function($scope, $element, $attrs) {
		 var okLink = document.getElementById("ok-link");
		 okLink.focus();
	    } ]);
})(window);
