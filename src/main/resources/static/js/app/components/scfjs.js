(function() {
	'use strict';

	var app = angular.module('scf-ui', []);

	app.controller('Controller', [ '$scope', function($scope) {
		this.model = {};

	} ]);

	app.factory('Service', [ '$http', '$q', function($http, $q) {
		return {
			requestURL : requestURL
		}

		function requestURL(url, params) {
			var deffered = $q.defer();

			$http({
				method : 'GET',
				url : url,
				data : params
			}).success(function(response) {
				deffered.resolve(response)
			}).error(function(response) {
				deffered.reject(response);
			});
			return deffered;
		}
	} ]);

	app.directive('scfFormLabel', [ '$filter', function($filter) {
		return {
			restrict : 'E',
			replace : true,
			scope : {
				label : '@',
				displayColon : '@'
			},
			link : function(scope, element, attrs, ctrl) {
				if (scope.displayColon === undefined) {
					scope.hasColon = true;
				} else {
					scope.hasColon = scope.displayColon === 'true';
				}
			},
			templateUrl : 'js/app/components/templates/form-label.html'
		};
	} ]);

	app.directive('scfFormTextbox', [ function() {
		return {
			restrict : 'E',
			replace : true,
			scope : {
				required : '@',
				name : '@',
				value : '@'
			},
			controller : [ '$scope', function($scope) {
				$scope.model = $scope.$parent.ctrl.model;
				$scope.model[$scope.name] = $scope.value;
			} ],
			templateUrl : '/js/app/components/templates/form-textbox.html'
		}
	} ]);

})();