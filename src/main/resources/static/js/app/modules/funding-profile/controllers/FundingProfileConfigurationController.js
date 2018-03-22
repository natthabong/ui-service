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
			['$log','$stateParams','PageNavigation','$scope','$rootScope','PendingOnDropdown','$q','$http','Service','UIFactory','blockUI',
			'FundingProfileService',
	function ($log,  $stateParams,  PageNavigation,  $scope,  $rootScope,  PendingOnDropdown,  $q,  $http,  Service , UIFactory , blockUI,
			 FundingProfileService) {
			var vm = this;
			var log = $log;
			vm.pendingOnDropdown = PendingOnDropdown;
			vm.fundingLogo = null;
			var parameters = PageNavigation.getParameters();
			vm.fundingProfile = {};
			var fundingId = parameters.fundingId;
			
			vm.backAction = function () {
				PageNavigation.gotoPage('/customer-registration/funding-profile');
			}

			var sendRequest = function (uri, succcesFunc, failedFunc) {
				var serviceDiferred = Service.doGet(uri);

				var failedFunc = failedFunc | function (response) {
					log.error('Load data error');
				};
				serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
			}
					
			vm.config = function(data){
				var params = {
						fundingInfo: data,
						fundingId: data.fundingId
				};
				PageNavigation.gotoPage('/customer-registration/funding-configuration/logo/settings',params);
			}
			
			vm.hasLogo = false;
			
			vm.decodeBase64 = function(data){
				if(data==null||angular.isUndefined(data)){
					vm.hasLogo = false;
					return '';
				}
				vm.hasLogo = true;
				console.log(vm.hasLogo);
				return atob(data);
			}
			
			var setupPrepareData = function () {

			}
			
			var validSave = function () {
				$scope.errors = {};
				var isValid = true;

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
				return FundingProfileService.updateFundingProfile(vm.fundingProfile);
			}
			
			vm.save = function () {
				if (validSave()) {
					var preCloseCallback = function (confirm) {
						vm.backAction();
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
									headerMessage: 'Edit funding profile success.',
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
			
			vm.search = function () {
				sendRequest('api/v1/fundings/' + fundingId, function (response) {
					vm.fundingProfile = response.data;
					if (vm.fundingProfile.fundingLogo != null) {
						vm.fundingLogo = vm.decodeBase64(vm.fundingProfile.fundingLogo);
					}
				});
			}
			
			vm.initLoad = function () {
				vm.search();
			}();
		}
	]);