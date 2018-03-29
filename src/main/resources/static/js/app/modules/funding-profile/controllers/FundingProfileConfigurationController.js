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
			vm.holidays = [];
			vm.financeSolutions = {
				buyerFinancing: {
					pnServiceTime : null,
					pnPeriod : {
						beginTime : null,
						endTime : null
					},
					pnSuspend : null,
					odServiceTime : null,
					odPeriod : {
						beginTime : null,
						endTime : null
					},
					odSuspend : null,
					savingServiceTime: null,
					savingPeriod : {
						beginTime : null,
						endTime : null
					},
					savingSuspend : null
				},	
				supplierFinancing : {
					pnServiceTime : null,
					pnPeriod : {
						beginTime : null,
						endTime : null
					},
					pnSuspend : null,
					odServiceTime : null,
					odPeriod : {
						beginTime : null,
						endTime : null
					},
					odSuspend : null
				},
				enquiry : {
					pnServiceTime : null,
					pnPeriod : {
						beginTime : null,
						endTime : null
					},
					pnSuspend : null,
					odServiceTime : null,
					odPeriod : {
						beginTime : null,
						endTime : null
					},
					odSuspend : null,
					savingServiceTime: null,
					savingPeriod : {
						beginTime : null,
						endTime : null
					},
					savingSuspend : null
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
						openAllHours : vm.financeSolutions.buyerFinancing.pnServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.buyerFinancing.pnSuspend,
						startServiceHour : vm.financeSolutions.buyerFinancing.pnPeriod.beginTime,
						endServiceHour : vm.financeSolutions.buyerFinancing.pnPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionPaymentPN);
				
				var financeSolutionPaymentOD = {
						fundingId : fundingId,
						serviceType : 'PAYMENT',
						serviceMethod : 'OD',
						openAllHours : vm.financeSolutions.buyerFinancing.odServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.buyerFinancing.odSuspend,
						startServiceHour : vm.financeSolutions.buyerFinancing.odPeriod.beginTime,
						endServiceHour : vm.financeSolutions.buyerFinancing.odPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionPaymentOD);
				
				var financeSolutionPaymentSaving = {
						fundingId : fundingId,
						serviceType : 'PAYMENT',
						serviceMethod : 'DEBIT',
						openAllHours : vm.financeSolutions.buyerFinancing.savingServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.buyerFinancing.savingSuspend,
						startServiceHour : vm.financeSolutions.buyerFinancing.savingPeriod.beginTime,
						endServiceHour : vm.financeSolutions.buyerFinancing.savingPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionPaymentSaving);
				
				var financeSolutionLoanPN = {
						fundingId : fundingId,
						serviceType : 'LOAN',
						serviceMethod : 'TERM_LOAN',
						openAllHours : vm.financeSolutions.supplierFinancing.pnServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.supplierFinancing.pnSuspend,
						startServiceHour : vm.financeSolutions.supplierFinancing.pnPeriod.beginTime,
						endServiceHour : vm.financeSolutions.supplierFinancing.pnPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionLoanPN);
				
				var financeSolutionLoanOD = {
						fundingId : fundingId,
						serviceType : 'LOAN',
						serviceMethod : 'OD',
						openAllHours : vm.financeSolutions.supplierFinancing.odServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.supplierFinancing.odSuspend,
						startServiceHour : vm.financeSolutions.supplierFinancing.odPeriod.beginTime,
						endServiceHour : vm.financeSolutions.supplierFinancing.odPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionLoanOD);
				
				var financeSolutionEnquiryPN = {
						fundingId : fundingId,
						serviceType : 'ENQUIRY',
						serviceMethod : 'TERM_LOAN',
						openAllHours : vm.financeSolutions.enquiry.pnServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.enquiry.pnSuspend,
						startServiceHour : vm.financeSolutions.enquiry.pnPeriod.beginTime,
						endServiceHour : vm.financeSolutions.enquiry.pnPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionEnquiryPN);
				
				var financeSolutionEnquiryOD = {
						fundingId : fundingId,
						serviceType : 'ENQUIRY',
						serviceMethod : 'OD',
						openAllHours : vm.financeSolutions.enquiry.odServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.enquiry.odSuspend,
						startServiceHour : vm.financeSolutions.enquiry.odPeriod.beginTime,
						endServiceHour : vm.financeSolutions.enquiry.odPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionEnquiryOD);
				
				var financeSolutionEnquiryDebit = {
						fundingId : fundingId,
						serviceType : 'ENQUIRY',
						serviceMethod : 'DEBIT',
						openAllHours : vm.financeSolutions.enquiry.savingServiceTime == '24HR' ? true : false ,
						suspend : vm.financeSolutions.enquiry.savingSuspend,
						startServiceHour : vm.financeSolutions.enquiry.savingPeriod.beginTime,
						endServiceHour : vm.financeSolutions.enquiry.savingPeriod.endTime
				}
				vm.fundingFinanceSolutions.push(financeSolutionEnquiryDebit);
			}
			
			var validSave = function () {
				$scope.errors = {};
				var isValid = true;
				if (vm.financeSolutions.buyerFinancing.pnServiceTime == 'PERIOD') {
					if(vm.financeSolutions.buyerFinancing.pnPeriod.beginTime == null ||
							vm.financeSolutions.buyerFinancing.pnPeriod.endTime == null){
						isValid = false;
						$scope.errors.buyerFinancingPnServiceTime = {
							message: 'P/N Service time (Period) is required.'
						}
					}
					else if(vm.financeSolutions.buyerFinancing.pnPeriod.beginTime == vm.financeSolutions.buyerFinancing.pnPeriod.endTime){
						isValid = false;
						$scope.errors.buyerFinancingPnServiceTime = {
							message: 'P/N Service time (Period) from - to is same time.'
						}
					}
				}
				if (vm.financeSolutions.buyerFinancing.odServiceTime == 'PERIOD') {
					if(vm.financeSolutions.buyerFinancing.odPeriod.beginTime == null ||
							vm.financeSolutions.buyerFinancing.odPeriod.endTime == null){
						isValid = false;
						$scope.errors.buyerFinancingOdServiceTime = {
							message: 'Overdraft Service time (Period) is required.'
						}
					}
					else if(vm.financeSolutions.buyerFinancing.odPeriod.beginTime == vm.financeSolutions.buyerFinancing.odPeriod.endTime){
						isValid = false;
						$scope.errors.buyerFinancingOdServiceTime = {
							message: 'Overdraft Service time (Period) from - to is same time.'
						}
					}
				}
				if (vm.financeSolutions.buyerFinancing.savingServiceTime == 'PERIOD') {
					if(vm.financeSolutions.buyerFinancing.savingPeriod.beginTime == null ||
							vm.financeSolutions.buyerFinancing.savingPeriod.endTime == null){
						isValid = false;
						$scope.errors.buyerFinancingSavingServiceTime = {
							message: 'Saving Service time (Period) is required.'
						}
					}
					else if(vm.financeSolutions.buyerFinancing.savingPeriod.beginTime == vm.financeSolutions.buyerFinancing.savingPeriod.endTime){
						isValid = false;
						$scope.errors.buyerFinancingSavingServiceTime = {
							message: 'Saving Service time (Period) from - to is same time.'
						}
					}
				}
				
				if (vm.financeSolutions.supplierFinancing.pnServiceTime == 'PERIOD') {
					if(vm.financeSolutions.supplierFinancing.pnPeriod.beginTime == null ||
							vm.financeSolutions.supplierFinancing.pnPeriod.endTime == null){
						isValid = false;
						$scope.errors.supplierFinancingPnServiceTime = {
							message: 'P/N Service time (Period) is required.'
						}
					}
					else if(vm.financeSolutions.supplierFinancing.pnPeriod.beginTime == vm.financeSolutions.supplierFinancing.pnPeriod.endTime){
						isValid = false;
						$scope.errors.supplierFinancingPnServiceTime = {
							message: 'P/N Service time (Period) from - to is same time.'
						}
					}
				}
				if (vm.financeSolutions.supplierFinancing.odServiceTime == 'PERIOD') {
					if(vm.financeSolutions.supplierFinancing.odPeriod.beginTime == null ||
							vm.financeSolutions.supplierFinancing.odPeriod.endTime == null){
						isValid = false;
						$scope.errors.supplierFinancingOdServiceTime = {
							message: 'Overdraft Service time (Period) is required.'
						}
					}
					else if(vm.financeSolutions.supplierFinancing.odPeriod.beginTime == vm.financeSolutions.supplierFinancing.odPeriod.endTime){
						isValid = false;
						$scope.errors.supplierFinancingOdServiceTime = {
							message: 'Overdraft Service time (Period) from - to is same time.'
						}
					}
				}
				
				if (vm.financeSolutions.enquiry.pnServiceTime == 'PERIOD') {
					if(vm.financeSolutions.enquiry.pnPeriod.beginTime == null ||
							vm.financeSolutions.enquiry.pnPeriod.endTime == null){
						isValid = false;
						$scope.errors.enquiryPnServiceTime = {
							message: 'P/N Service time (Period) is required.'
						}
					}
					else if(vm.financeSolutions.enquiry.pnPeriod.beginTime == vm.financeSolutions.enquiry.pnPeriod.endTime){
						isValid = false;
						$scope.errors.enquiryPnServiceTime = {
							message: 'P/N Service time (Period) from - to is same time.'
						}
					}
				}
				if (vm.financeSolutions.enquiry.odServiceTime == 'PERIOD') {
					if(vm.financeSolutions.enquiry.odPeriod.beginTime == null ||
							vm.financeSolutions.enquiry.odPeriod.endTime == null){
						isValid = false;
						$scope.errors.enquiryOdServiceTime = {
							message: 'Overdraft Service time (Period) is required.'
						}
					}
					else if(vm.financeSolutions.enquiry.odPeriod.beginTime == vm.financeSolutions.enquiry.odPeriod.endTime){
						isValid = false;
						$scope.errors.enquiryOdServiceTime = {
							message: 'Overdraft Service time (Period) from - to is same time.'
						}
					}
				}
				if (vm.financeSolutions.enquiry.savingServiceTime == 'PERIOD') {
					if(vm.financeSolutions.enquiry.savingPeriod.beginTime == null ||
							vm.financeSolutions.enquiry.savingPeriod.endTime == null){
						isValid = false;
						$scope.errors.enquirySavingServiceTime = {
							message: 'Saving Service time (Period) is required.'
						}
					}
					else if(vm.financeSolutions.enquiry.savingPeriod.beginTime == vm.financeSolutions.enquiry.savingPeriod.endTime){
						isValid = false;
						$scope.errors.enquirySavingServiceTime = {
							message: 'Saving Service time (Period) from - to is same time.'
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
				
				sendRequest('/api/v1/fundings/' + fundingId + '/holidays/all-years', function (response) {
					var _holidays = response.data;
					console.log(_holidays);
					if (angular.isDefined(_holidays)) {
						_holidays.forEach(function (holiday) {
							vm.holidays.push(holiday);
						});
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
										vm.financeSolutions.buyerFinancing.pnServiceTime = '24HR';
									} else {
										vm.financeSolutions.buyerFinancing.pnServiceTime = 'PERIOD';
										vm.financeSolutions.buyerFinancing.pnPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.buyerFinancing.pnPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.buyerFinancing.pnSuspend = financialService.suspend;
								}
								if(financialService.serviceMethod == 'OD'){
									if(financialService.openAllHours){
										vm.financeSolutions.buyerFinancing.odServiceTime = '24HR';
									} else {
										vm.financeSolutions.buyerFinancing.odServiceTime = 'PERIOD';
										vm.financeSolutions.buyerFinancing.odPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.buyerFinancing.odPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.buyerFinancing.odSuspend = financialService.suspend;
								}
								if(financialService.serviceMethod == 'DEBIT'){
									if(financialService.openAllHours){
										vm.financeSolutions.buyerFinancing.savingServiceTime = '24HR';
									} else {
										vm.financeSolutions.buyerFinancing.savingServiceTime = 'PERIOD';
										vm.financeSolutions.buyerFinancing.savingPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.buyerFinancing.savingPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.buyerFinancing.savingSuspend = financialService.suspend;
								}
							}
							if(financialService.serviceType == 'LOAN'){
								if(financialService.serviceMethod == 'TERM_LOAN'){
									if(financialService.openAllHours){
										vm.financeSolutions.supplierFinancing.pnServiceTime = '24HR';
									} else {
										vm.financeSolutions.supplierFinancing.pnServiceTime = 'PERIOD';
										vm.financeSolutions.supplierFinancing.pnPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.supplierFinancing.pnPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.supplierFinancing.pnSuspend = financialService.suspend;
								}
								if(financialService.serviceMethod == 'OD'){
									if(financialService.openAllHours){
										vm.financeSolutions.supplierFinancing.odServiceTime = '24HR';
									} else {
										vm.financeSolutions.supplierFinancing.odServiceTime = 'PERIOD';
										vm.financeSolutions.supplierFinancing.odPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.supplierFinancing.odPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.supplierFinancing.odSuspend = financialService.suspend;
								}
							}
							if(financialService.serviceType == 'ENQUIRY'){
								if(financialService.serviceMethod == 'TERM_LOAN'){
									if(financialService.openAllHours){
										vm.financeSolutions.enquiry.pnServiceTime = '24HR';
									} else {
										vm.financeSolutions.enquiry.pnServiceTime = 'PERIOD';
										vm.financeSolutions.enquiry.pnPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.enquiry.pnPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.enquiry.pnSuspend = financialService.suspend;
								}
								if(financialService.serviceMethod == 'OD'){
									if(financialService.openAllHours){
										vm.financeSolutions.enquiry.odServiceTime = '24HR';
									} else {
										vm.financeSolutions.enquiry.odServiceTime = 'PERIOD';
										vm.financeSolutions.enquiry.odPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.enquiry.odPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.enquiry.odSuspend = financialService.suspend;
								}
								if(financialService.serviceMethod == 'DEBIT'){
									if(financialService.openAllHours){
										vm.financeSolutions.enquiry.savingServiceTime = '24HR';
									} else {
										vm.financeSolutions.enquiry.savingServiceTime = 'PERIOD';
										vm.financeSolutions.enquiry.savingPeriod.beginTime = financialService.startServiceHour;
										vm.financeSolutions.enquiry.savingPeriod.endTime = financialService.endServiceHour;
									}
									vm.financeSolutions.enquiry.savingSuspend = financialService.suspend;
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