var shiftingDateStrategyModule = angular
	.module('gecscf.organize.configuration.shiftingDateStrategy');

shiftingDateStrategyModule.controller('ShiftingDateStrategySettingController', [
	'$log', '$scope', '$state', '$stateParams', 'Service', 'PageNavigation', 'UIFactory', 'blockUI', '$q', '$http', 'ngDialog',
	
	function ($log, $scope, $state, $stateParams, Service, PageNavigation, UIFactory, blockUI, $q, $http,ngDialog) {

		var vm = this;
		var log = $log;
		
		var NOT_SHIFT = "NOT_SHIFT";
		vm.accountingTransactionType = $stateParams.accountingTransactionType;
		vm.organizeId = $stateParams.organizeId;

		var initShifStrategyItemAP = {
				BUYER_PAYMENT_DATE_FOR_AP_DOCUMENT_IMPORT : false,
				BUYER_PAYMENT_DATE_FOR_EXISTING_AP_DOCUMENT_JOB : false,
				TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_DRAWDOWN : false,
				TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_OVERDRAFT : false,
				TRANSACTION_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB : false,
				TRANSACTION_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB : false,
				MATURITY_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB : false,
				MATURITY_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB : false
		};
		
		// vm.shifStrategyItemAR = {
		// PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DRAWDOWN : false,
		// PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DEBIT_OVERDRAFT : false,
		// PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_SPECIAL_DEBIT : false,
		// PAYMENT_DATE_FOR_PAYMENT_WITH_DRAWDOWN_JOB : false,
		// PAYMENT_DATE_FOR_PAYMENT_WITH_DEBIT_OVERDRAFT_JOB : false,
		// PAYMENT_DATE_FOR_PAYMENT_WITH_SPECIAL_DEBIT_JOB : false
		// };
		
		vm.initShiftingModelAP = {
				ownerId : vm.organizeId,
				accountingTransactionType : vm.accountingTransactionType,
				shiftingMethod : NOT_SHIFT,
				items : [
					{dateType : "BUYER_PAYMENT_DATE_FOR_AP_DOCUMENT_IMPORT", suspend:true},
					{dateType : "BUYER_PAYMENT_DATE_FOR_EXISTING_AP_DOCUMENT_JOB", suspend:true},
					{dateType : "TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_DRAWDOWN", suspend:true},
					{dateType : "TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_OVERDRAFT", suspend:true},
					{dateType : "TRANSACTION_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB", suspend:true},
					{dateType : "TRANSACTION_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB", suspend:true},
					{dateType : "MATURITY_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB", suspend:true},
					{dateType : "MATURITY_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB", suspend:true}
				]
		};
		
		vm.showShiftingContent = function (value) {
			if (vm.accountingTransactionType == undefined || vm.accountingTransactionType == null || vm.accountingTransactionType == '') {
				return false;
			}
			if (value == undefined || value == null || value == '') {
				return false;
			}
			if (vm.accountingTransactionType == value) {
				return true;
			}
		}
		
		vm.shiftStrategyChange = function (value) {
			if (NOT_SHIFT == value) {
				vm.isNotShift = true;
				vm.shifStrategyDisplayItemAP = angular.copy(initShifStrategyItemAP);
			} else {
				vm.isNotShift = false;
			}
		}

		var sendRequestToGet = function (uri, succcesFunc, failedFunc) {
			var serviceDiferred = Service.doGet(uri);

			var failedFunc = failedFunc | function (response) {
				log.error('Load data error');
			};
			serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
		}

		vm.getShiftStrategyItemAP = function () {
			vm.shiftingMethodDisplay = NOT_SHIFT;
			vm.isNotShift = true;
			vm.shifStrategyDisplayItemAP = angular.copy(initShifStrategyItemAP);
			vm.shiftingModel = angular.copy(vm.initShiftingModelAP);
			sendRequestToGet('api/v1/organize-customers/'+ vm.organizeId + '/accounting-transaction-type/PAYABLE/shifting-date-strategies', function (response) {
				if(response.data != undefined || response.data != null) {
					vm.shiftingModel = response.data;
					vm.shiftingMethodDisplay = vm.shiftingModel.shiftingMethod;
					vm.shiftStrategyChange(vm.shiftingMethodDisplay);
					if (vm.shiftingModel.items != null && vm.shiftingModel.items.length > 0) {
						vm.shiftingModel.items.forEach(function (data) {
							if ("BUYER_PAYMENT_DATE_FOR_AP_DOCUMENT_IMPORT" == data.dateType) {
								vm.shifStrategyDisplayItemAP.BUYER_PAYMENT_DATE_FOR_AP_DOCUMENT_IMPORT = !data.suspend;
							} else if ("BUYER_PAYMENT_DATE_FOR_EXISTING_AP_DOCUMENT_JOB" == data.dateType) {
								vm.shifStrategyDisplayItemAP.BUYER_PAYMENT_DATE_FOR_EXISTING_AP_DOCUMENT_JOB = !data.suspend;
							} else if ("TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_DRAWDOWN" == data.dateType) {
								vm.shifStrategyDisplayItemAP.TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_DRAWDOWN = !data.suspend;
							} else if ("TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_OVERDRAFT" == data.dateType) {
								vm.shifStrategyDisplayItemAP.TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_OVERDRAFT = !data.suspend;
							} else if ("TRANSACTION_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB" == data.dateType) {
								vm.shifStrategyDisplayItemAP.TRANSACTION_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB = !data.suspend;			
							} else if ("TRANSACTION_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB" == data.dateType) {
								vm.shifStrategyDisplayItemAP.TRANSACTION_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB = !data.suspend;
							} else if ("MATURITY_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB" == data.dateType) {
								vm.shifStrategyDisplayItemAP.MATURITY_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB = !data.suspend;				
							} else if ("MATURITY_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB" == data.dateType) {
								vm.shifStrategyDisplayItemAP.MATURITY_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB = !data.suspend;			
							}
						});
					}
				}
			});
		};

		$scope.confirmSave = function () {
			blockUI.start();
			var deffered = $q.defer();
			if (vm.shiftingModel.shiftingDateStrategyId == undefined || vm.shiftingModel.shiftingDateStrategyId == null || vm.shiftingModel.shiftingDateStrategyId == '') {
				// new
				var serviceUrl = 'api/v1/organize-customers/' + vm.shiftingModel.ownerId + '/shifting-date-strategies';
				var serviceDiferred = $http({
					method: 'POST',
					url: serviceUrl,
					data: vm.shiftingModel
				}).then(function (response) {
					deffered.resolve(response.data)
				}).catch(function (response) {
					deffered.reject(response);
				});
			} else {
				// update
				var serviceUrl = 'api/v1/organize-customers/' + vm.shiftingModel.ownerId + '/accounting-transaction-type/PAYABLE/shifting-date-strategies/' + vm.shiftingModel.shiftingDateStrategyId;
				var serviceDiferred = $http({
					method: 'POST',
					url: serviceUrl,
					headers: {
						'If-Match': vm.shiftingModel.version,
						'X-HTTP-Method-Override': 'PUT'
					},
					data: vm.shiftingModel
				}).then(function (response) {
					deffered.resolve(response.data)
				}).catch(function (response) {
					deffered.reject(response);
				});
			}
			return deffered;
		}
		
		vm.backToSponsorConfigPage = function () {
			PageNavigation.gotoPage('/sponsor-configuration', {
				organizeId: vm.organizeId
			});
		}
		
		vm.prepareShiftingAPToSave = function () {
			
			vm.shiftingModel.shiftingMethod = vm.shiftingMethodDisplay;
			vm.shiftingModel.items.forEach(function (data) {
				if ("BUYER_PAYMENT_DATE_FOR_AP_DOCUMENT_IMPORT" == data.dateType) {
					data.suspend = !vm.shifStrategyDisplayItemAP.BUYER_PAYMENT_DATE_FOR_AP_DOCUMENT_IMPORT;
				} else if ("BUYER_PAYMENT_DATE_FOR_EXISTING_AP_DOCUMENT_JOB" == data.dateType) {
					data.suspend = !vm.shifStrategyDisplayItemAP.BUYER_PAYMENT_DATE_FOR_EXISTING_AP_DOCUMENT_JOB;
				} else if ("TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_DRAWDOWN" == data.dateType) {
					data.suspend = !vm.shifStrategyDisplayItemAP.TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_DRAWDOWN;
				} else if ("TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_OVERDRAFT" == data.dateType) {
					data.suspend = !vm.shifStrategyDisplayItemAP.TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_OVERDRAFT;
				} else if ("TRANSACTION_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB" == data.dateType) {
					data.suspend = !vm.shifStrategyDisplayItemAP.TRANSACTION_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB;			
				} else if ("TRANSACTION_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB" == data.dateType) {
					data.suspend = !vm.shifStrategyDisplayItemAP.TRANSACTION_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB;
				} else if ("MATURITY_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB" == data.dateType) {
					data.suspend = !vm.shifStrategyDisplayItemAP.MATURITY_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB;				
				} else if ("MATURITY_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB" == data.dateType) {
					data.suspend = !vm.shifStrategyDisplayItemAP.MATURITY_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB;			
				}
			});
		}
		
		vm.save = function () {
			vm.prepareShiftingAPToSave();
			var preCloseCallback = function (confirm) {
				vm.backToSponsorConfigPage();
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
							headerMessage: 'Edit shifting date strategy complete.',
							bodyMessage: ''
						},
						preCloseCallback: preCloseCallback
					});
				},
				
				onFail: function (response) {
					var msg = {
						405: 'Shifting date strategy has been modified.'
					};
					blockUI.stop();
					UIFactory.showFailDialog({
						data: {
							headerMessage: 'Edit shifting date strategy fail.',
							bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
						},
						preCloseCallback: null
					});
				}
			});
		}

		vm.initLoad = function () {
			vm.getShiftStrategyItemAP();
		}();

	}
]);