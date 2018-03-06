(function(exports) {
    "use strict";

    var app = angular.module('scfError', ['pascalprecht.translate']);
    app.controller('ErrorController', [ '$scope', '$element', '$attrs', '$http',
	    function($scope, $element, $attrs, $http) {
    		var vm = this;
	    	vm.title = '';
			vm.banner = 'Loading...';
	
			$http.get('../assets/theme.json').then(function (res) {
				vm.title = res.data.title;
				console.log(vm.title);
				vm.banner = res.data.banner;
			});
	    } ]);
})(window);
