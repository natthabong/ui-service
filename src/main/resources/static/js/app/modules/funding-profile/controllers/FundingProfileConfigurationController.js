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
			['$log','$stateParams','PageNavigation','$scope','$rootScope','PendingOnDropdown','$q','$http','Service',
	function ($log,  $stateParams,  PageNavigation,  $scope,  $rootScope,  PendingOnDropdown,  $q,  $http,  Service) {
			var vm = this;
			var log = $log;
			vm.pendingOnDropdown = PendingOnDropdown;
			vm.newMode = false;
			vm.editMode = false;
			var parameters = PageNavigation.getParameters();
			vm.fundingProfile = {};
			var fundingId = parameters.fundingId;
			var mode = parameters.mode;
			if('NEW' == mode){
				vm.newMode = true;
				vm.editMode = false;
				vm.fundingProfile.creditPendingMethod = 'AT_GEC';
			} else {
				vm.newMode = false;
				vm.editMode = true;
			}
			
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
			
			vm.search = function () {
				sendRequest('api/v1/fundings/' + fundingId, function (response) {
					vm.fundingProfile = response.data;
				});
			}
			
			vm.initLoad = function () {
				if(vm.editMode){
					vm.search();
				}
			}();
		}
	]);