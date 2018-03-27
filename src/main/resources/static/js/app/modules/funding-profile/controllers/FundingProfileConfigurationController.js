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
			vm.endTime = null;
			var parameters = PageNavigation.getParameters();
			vm.fundingProfile = {};
			vm.financeSolutions = {
				buyerFinancing: {
					PnServiceTime : null,
					PnPeriod : {
						beginTime : null,
						endTime : null
					},
					PnSuspend : null,
					OdServiceTime : null,
					OdPeriod : {
						beginTime : null,
						endTime : null
					},
					OdSuspend : null,
					SavingServiceTime: null,
					SavingPeriod : {
						beginTime : null,
						endTime : null
					},
					SavingSuspend : null
				},	
				supplierFinancing : {
					PnServiceTime : null,
					PnPeriod : {
						beginTime : null,
						endTime : null
					},
					PnSuspend : null,
					OdServiceTime : null,
					OdPeriod : {
						beginTime : null,
						endTime : null
					},
					OdSuspend : null
				},
				enquiry : {
					PnServiceTime : null,
					PnPeriod : {
						beginTime : null,
						endTime : null
					},
					PnSuspend : null,
					OdServiceTime : null,
					OdPeriod : {
						beginTime : null,
						endTime : null
					},
					OdSuspend : null
				}
			};
			vm.fundingFinanceSolutions = [];
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
				return atob(data);
			}
			
			var setupPrepareData = function () {
				vm.fundingFinanceSolutions = [];
				var financeSolutionPaymentPN = {
						fundingId : fundingId,
						serviceType : 'PAYMENT',
						serviceMethod : 'TERM_LOAN',
						openAllHours : vm.financeSolutions.buyerFinancing.PnServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.buyerFinancing.PnSuspend,
						startServiceHour : vm.financeSolutions.buyerFinancing.PnPeriod.beginTime,
						endServiceHour : vm.financeSolutions.buyerFinancing.PnPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionPaymentPN);
				
				var financeSolutionPaymentOD = {
						fundingId : fundingId,
						serviceType : 'PAYMENT',
						serviceMethod : 'OD',
						openAllHours : vm.financeSolutions.buyerFinancing.OdServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.buyerFinancing.OdSuspend,
						startServiceHour : vm.financeSolutions.buyerFinancing.OdPeriod.beginTime,
						endServiceHour : vm.financeSolutions.buyerFinancing.OdPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionPaymentOD);
				
				var financeSolutionPaymentSaving = {
						fundingId : fundingId,
						serviceType : 'PAYMENT',
						serviceMethod : 'DEBIT',
						openAllHours : vm.financeSolutions.buyerFinancing.SavingServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.buyerFinancing.SavingSuspend,
						startServiceHour : vm.financeSolutions.buyerFinancing.SavingPeriod.beginTime,
						endServiceHour : vm.financeSolutions.buyerFinancing.SavingPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionPaymentSaving);
				
				var financeSolutionLoanPN = {
						fundingId : fundingId,
						serviceType : 'LOAN',
						serviceMethod : 'TERM_LOAN',
						openAllHours : vm.financeSolutions.supplierFinancing.PnServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.supplierFinancing.PnSuspend,
						startServiceHour : vm.financeSolutions.supplierFinancing.PnPeriod.beginTime,
						endServiceHour : vm.financeSolutions.supplierFinancing.PnPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionLoanPN);
				
				var financeSolutionLoanOD = {
						fundingId : fundingId,
						serviceType : 'LOAN',
						serviceMethod : 'OD',
						openAllHours : vm.financeSolutions.supplierFinancing.OdServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.supplierFinancing.OdSuspend,
						startServiceHour : vm.financeSolutions.supplierFinancing.OdPeriod.beginTime,
						endServiceHour : vm.financeSolutions.supplierFinancing.OdPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionLoanOD);
				
				var financeSolutionEnquiryPN = {
						fundingId : fundingId,
						serviceType : 'ENQUIRY',
						serviceMethod : 'TERM_LOAN',
						openAllHours : vm.financeSolutions.enquiry.PnServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.enquiry.PnSuspend,
						startServiceHour : vm.financeSolutions.enquiry.PnPeriod.beginTime,
						endServiceHour : vm.financeSolutions.enquiry.PnPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionEnquiryPN);
				
				var financeSolutionEnquiryOD = {
						fundingId : fundingId,
						serviceType : 'ENQUIRY',
						serviceMethod : 'OD',
						openAllHours : vm.financeSolutions.enquiry.OdServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.enquiry.OdSuspend,
						startServiceHour : vm.financeSolutions.enquiry.OdPeriod.beginTime,
						endServiceHour : vm.financeSolutions.enquiry.OdPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionEnquiryOD);
			}
			
			var validSave = function () {
				$scope.errors = {};
				var isValid = true;
				if (vm.financeSolutions.buyerFinancing.PnServiceTime == 'PERIOD') {
					if(vm.financeSolutions.buyerFinancing.PnPeriod.beginTime == null ||
							vm.financeSolutions.buyerFinancing.PnPeriod.endTime == null){
						isValid = false;
						$scope.errors.buyerFinancingPnServiceTime = {
							message: 'P/N service time is required.'
						}
					}
				}
				if (vm.financeSolutions.buyerFinancing.OdServiceTime == 'PERIOD') {
					if(vm.financeSolutions.buyerFinancing.OdPeriod.beginTime == null ||
							vm.financeSolutions.buyerFinancing.OdPeriod.endTime == null){
						isValid = false;
						$scope.errors.buyerFinancingOdServiceTime = {
							message: 'Overdraft service time is required.'
						}
					}
				}
				if (vm.financeSolutions.buyerFinancing.SavingServiceTime == 'PERIOD') {
					if(vm.financeSolutions.buyerFinancing.SavingPeriod.beginTime == null ||
							vm.financeSolutions.buyerFinancing.SavingPeriod.endTime == null){
						isValid = false;
						$scope.errors.buyerFinancingSavingServiceTime = {
							message: 'Saving service time is required.'
						}
					}
				}
				
				if (vm.financeSolutions.supplierFinancing.PnServiceTime == 'PERIOD') {
					if(vm.financeSolutions.supplierFinancing.PnPeriod.beginTime == null ||
							vm.financeSolutions.supplierFinancing.PnPeriod.endTime == null){
						isValid = false;
						$scope.errors.supplierFinancingPnServiceTime = {
							message: 'P/N service time is required.'
						}
					}
				}
				if (vm.financeSolutions.supplierFinancing.OdServiceTime == 'PERIOD') {
					if(vm.financeSolutions.supplierFinancing.OdPeriod.beginTime == null ||
							vm.financeSolutions.supplierFinancing.OdPeriod.endTime == null){
						isValid = false;
						$scope.errors.supplierFinancingOdServiceTime = {
							message: 'Overdraft service time is required.'
						}
					}
				}
				
				if (vm.financeSolutions.enquiry.PnServiceTime == 'PERIOD') {
					if(vm.financeSolutions.enquiry.PnPeriod.beginTime == null ||
							vm.financeSolutions.enquiry.PnPeriod.endTime == null){
						isValid = false;
						$scope.errors.enquiryPnServiceTime = {
							message: 'P/N service time is required.'
						}
					}
				}
				if (vm.financeSolutions.enquiry.OdServiceTime == 'PERIOD') {
					if(vm.financeSolutions.enquiry.OdPeriod.beginTime == null ||
							vm.financeSolutions.enquiry.OdPeriod.endTime == null){
						isValid = false;
						$scope.errors.enquiryOdServiceTime = {
							message: 'Overdraft service time is required.'
						}
					}
				}

				return isValid;
			}
			
			$scope.confirmSave = function () {
				blockUI.start();
				return FundingProfileService.updateFundingProfile(vm.fundingProfile, vm.fundingFinanceSolutions);
			}
			
			vm.save = function () {
				if (validSave()) {
					setupPrepareData();
					
					console.log(vm.fundingProfile);
					console.log(vm.financeSolutions);
					console.log(vm.fundingFinanceSolutions);
					
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
				
				sendRequest('api/v1/fundings/'+ fundingId + '/financial-services', function (response) {
					
					var _financialServices = response.data;
					console.log(_financialServices);
					if (angular.isDefined(_financialServices)) {
						_financialServices.forEach(function (financialService) {
														
							if(financialService.serviceType == 'PAYMENT'){
								if(financialService.serviceMethod == 'TERM_LOAN'){
									if(financialService.openAllHours){
										vm.financeSolutions.buyerFinancing.PnServiceTime = '24HR';
									} else {
										vm.financeSolutions.buyerFinancing.PnServiceTime = 'PERIOD';
										vm.financeSolutions.buyerFinancing.PnPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.buyerFinancing.PnPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.buyerFinancing.PnSuspend = financialService.suspend;
								}
								if(financialService.serviceMethod == 'OD'){
									if(financialService.openAllHours){
										vm.financeSolutions.buyerFinancing.OdServiceTime = '24HR';
									} else {
										vm.financeSolutions.buyerFinancing.OdServiceTime = 'PERIOD';
										vm.financeSolutions.buyerFinancing.OdPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.buyerFinancing.OdPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.buyerFinancing.OdSuspend = financialService.suspend;
								}
								if(financialService.serviceMethod == 'DEBIT'){
									if(financialService.openAllHours){
										vm.financeSolutions.buyerFinancing.SavingServiceTime = '24HR';
									} else {
										vm.financeSolutions.buyerFinancing.SavingServiceTime = 'PERIOD';
										vm.financeSolutions.buyerFinancing.SavingPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.buyerFinancing.SavingPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.buyerFinancing.SavingSuspend = financialService.suspend;
								}
							}
							if(financialService.serviceType == 'LOAN'){
								if(financialService.serviceMethod == 'TERM_LOAN'){
									if(financialService.openAllHours){
										vm.financeSolutions.supplierFinancing.PnServiceTime = '24HR';
									} else {
										vm.financeSolutions.supplierFinancing.PnServiceTime = 'PERIOD';
										vm.financeSolutions.supplierFinancing.PnPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.supplierFinancing.PnPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.supplierFinancing.PnSuspend = financialService.suspend;
								}
								if(financialService.serviceMethod == 'OD'){
									if(financialService.openAllHours){
										vm.financeSolutions.supplierFinancing.OdServiceTime = '24HR';
									} else {
										vm.financeSolutions.supplierFinancing.OdServiceTime = 'PERIOD';
										vm.financeSolutions.supplierFinancing.OdPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.supplierFinancing.OdPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.supplierFinancing.OdSuspend = financialService.suspend;
								}
							}
							if(financialService.serviceType == 'ENQUIRY'){
								if(financialService.serviceMethod == 'TERM_LOAN'){
									if(financialService.openAllHours){
										vm.financeSolutions.enquiry.PnServiceTime = '24HR';
									} else {
										vm.financeSolutions.enquiry.PnServiceTime = 'PERIOD';
										vm.financeSolutions.enquiry.PnPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.enquiry.PnPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.enquiry.PnSuspend = financialService.suspend;
								}
								if(financialService.serviceMethod == 'OD'){
									if(financialService.openAllHours){
										vm.financeSolutions.enquiry.OdServiceTime = '24HR';
									} else {
										vm.financeSolutions.enquiry.OdServiceTime = 'PERIOD';
										vm.financeSolutions.enquiry.OdPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.enquiry.OdPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.enquiry.OdSuspend = financialService.suspend;
								}
							}
						});
					}
				});
			}
			
			vm.initLoad = function () {
				vm.search();
			}();
		}
	]);