angular.module('scfApp').controller(
	'SponsorConfigController',
	['$log', '$stateParams', 'PageNavigation', '$scope', '$rootScope',
		function ($log, $stateParams, PageNavigation, $scope, $rootScope) {
			var vm = this;
			var log = $log;

			$scope.backAction = function () {
				PageNavigation.backStep(false);
			}

			function init() {
				if (vm.organizeModel === null) {
					PageNavigation.backStep(false);
				}
			}
			init();
		}
	]);