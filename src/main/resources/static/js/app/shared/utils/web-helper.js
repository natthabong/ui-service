"use strict";
var WebHelper = WebHelper || {};

WebHelper = {
	loadScript : function load(srcs, callback) {
		return {
			deps : [
					'$ocLazyLoad',
					'$q',
					'blockUI',
					function($ocLazyLoad, $q, blockUI) {

						var deferred = $q.defer();
						var promise = false;
						var name;
						srcs = Array.isArray(srcs) ? srcs : srcs.split(/\s+/);

						if (!promise) {
							promise = deferred.promise;
						}
						var version = (new Date()).getTime();
						srcs.forEach(function(src) {
							src = src + '?v=' + version;
							promise = promise.then(function() {
								return $ocLazyLoad.load(src);
							});
						});
						
						deferred.resolve();

						return callback ? promise.then(function() {
							return callback();
						}) : promise;
					} ]
		}
	}
};