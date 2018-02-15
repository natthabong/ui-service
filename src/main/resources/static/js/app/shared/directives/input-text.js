'use strict';
angular.module('gecscf.ui').directive('scfInputText', [function () {

	function link(scope, element, attrs) {
		if (angular.isDefined(scope.maxLength)) {
			scope.show = true;
		}
	}

	return {
		restrict: 'AE',
		replace: true,
		scope: {
			maxLength: '=maxlength'
		},
		template: '<input ng-if="show" type="text" class="form-control"/>',
		link: link
	};

}])