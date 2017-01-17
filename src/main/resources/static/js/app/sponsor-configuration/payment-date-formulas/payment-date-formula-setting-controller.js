angular
		.module('scfApp')
		.controller(
				'PaymentDateFormulaSettingController',
				[
						'SCFCommonService',
						'$log',
						'$scope',
						'$stateParams',
						'$timeout',
						'PageNavigation',
						'Service',
						function(SCFCommonService, $log, $scope, $stateParams, $timeout,
								PageNavigation, Service) {
							var vm = this;
							var log = $log;
						
							vm.initLoad = function() {

							}

							vm.initLoad();
						} ]);