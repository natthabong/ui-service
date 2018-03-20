var fundingProfileModule = angular.module('gecscf.fundingProfile');
fundingProfileModule.constant('PendingOnDropdown', [{
		label: 'SCF Hub',
		value: 'AT_GEC'
	},
	{
		label: 'Funding',
		value: 'AT_FUNDING'
	}
]);
fundingProfileModule.controller(
	'FundingProfileConfigurationController',
	['$log', '$stateParams', 'PageNavigation', '$scope', '$rootScope','PendingOnDropdown',
		function ($log, $stateParams, PageNavigation, $scope, $rootScope, PendingOnDropdown) {
			var vm = this;
			var log = $log;
			vm.pendingOnDropdown = PendingOnDropdown;
			vm.newMode = false;
			vm.editMode = false;
			var parameters = PageNavigation.getParameters();
			var taxId = parameters.taxId;
			var mode = parameters.mode;
			if('NEW' == mode){
				vm.newMode = true;
				vm.editMode = false;
			} else {
				vm.newMode = false;
				vm.editMode = true;
			}
			
			$scope.backAction = function () {
				PageNavigation.backStep(false);
			}

					
			vm.config = function(data){
				var params = {
					fundingProfileInfo: data
				};
				PageNavigation.gotoPage('/funding-profile-configuration/funding-logo/settings',params);
			}
			
			vm.decodeBase64 = function(data) {
				if (data == null || angular.isUndefined(data)) {
					return '';
				}
				return atob(data);
			}
			
			var setupPrepareData = function () {

			}
			
			var validSave = function () {
				$scope.errors = {};
				var isValid = true;
				var channel = vm.channelModel;

//				if (vm.channelModel.displayName == null || vm.channelModel.displayName == "") {
//					isValid = false;
//					$scope.errors.displayName = {
//						message: 'Display name is required.'
//					}
//				}

				return isValid;
			}
			
			$scope.confirmSave = function () {
				blockUI.start();
				var serviceUrl = BASE_URI + '/channels/' + vm.channelModel.channelId;
				var deffered = $q.defer();
				var serviceDiferred = $http({
					method: 'POST',
					url: serviceUrl,
					headers: {
						'If-Match': vm.channelModel.version,
						'X-HTTP-Method-Override': 'PUT'
					},
					data: vm.fundingProdile
				}).then(function (response) {
					deffered.resolve(response.data)
				}).catch(function (response) {
					deffered.reject(response);
				});
				return deffered;
			}
			
			vm.save = function () {
				setupPrepareData();
				if (validSave()) {
					var preCloseCallback = function (confirm) {
						$scope.backAction();
					}
					UIFactory.showConfirmDialog({
						data: {
							headerMessage: 'Confirm save?'
						},
						confirm: $scope.confirmSave,
						onSuccess: function (response) {
							blockUI.stop();
							UIFactory.showSuccessDialog({
								data: {
									headerMessage: 'Edit funding profile complete.',
									bodyMessage: ''
								},
								preCloseCallback: preCloseCallback
							});
						},
						onFail: function (response) {
							var msg = {
								405: 'Funding profile has been modified.'
							};
							blockUI.stop();
							UIFactory.showFailDialog({
								data: {
									headerMessage: 'Edit funding profile fail.',
									bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
								},
								preCloseCallback: null
							});
						}
					});
				}
			}
			function init() {
				
			}
			init();
		}
	]);