var shiftingDateStrategyModule = angular
	.module('gecscf.organize.configuration.shiftingDateStrategy');

shiftingDateStrategyModule.controller('ShiftingDateStrategySettingController', [
	'$log', '$scope', '$state', '$stateParams', 'Service', 'PageNavigation', 'UIFactory', 'blockUI', '$q', '$http', 'ngDialog',
	
	function ($log, $scope, $state, $stateParams, Service, PageNavigation, UIFactory, blockUI, $q, $http,ngDialog) {

		var vm = this;
		var log = $log;
		var NOT_SHIFT = "NOT_SHIFT";
		
		var accountingTransactionType = $stateParams.accountingTransactionType;
		var organizeId = $stateParams.organizeId;
		var fundingId = $stateParams.fundingId;
		
		var BASE_URI = 'api/v1/XXX/' + organizeId;
		
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
		
		var initShiftingModel = {
				shiftingDateStrategyId : 0,
				ownerId : organizeId,
				accountingTransactionType : "PAYABLE",
				fundingId : fundingId,
				shiftingMethod : NOT_SHIFT,
				items : [
					{shiftingDateStrategyItemId : 0, shiftingDateStrategyId : 0, dateType : "BUYER_PAYMENT_DATE_FOR_AP_DOCUMENT_IMPORT", suspend:true},
					{shiftingDateStrategyItemId : 0, shiftingDateStrategyId : 0, dateType : "BUYER_PAYMENT_DATE_FOR_EXISTING_AP_DOCUMENT_JOB", suspend:true},
					{shiftingDateStrategyItemId : 0, shiftingDateStrategyId : 0, dateType : "TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_DRAWDOWN", suspend:true},
					{shiftingDateStrategyItemId : 0, shiftingDateStrategyId : 0, dateType : "TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_OVERDRAFT", suspend:true},
					{shiftingDateStrategyItemId : 0, shiftingDateStrategyId : 0, dateType : "TRANSACTION_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB", suspend:true},
					{shiftingDateStrategyItemId : 0, shiftingDateStrategyId : 0, dateType : "TRANSACTION_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB", suspend:true},
					{shiftingDateStrategyItemId : 0, shiftingDateStrategyId : 0, dateType : "MATURITY_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB", suspend:true},
					{shiftingDateStrategyItemId : 0, shiftingDateStrategyId : 0, dateType : "MATURITY_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB", suspend:true}
				]
		};
		
		vm.shiftingMethod = {
			name : NOT_SHIFT
		};
		vm.isNotShift = true;
		
		vm.shifStrategyItemAP = angular.copy(initShifStrategyItemAP);
		vm.shiftStrategyChange = function (value) {
			if (NOT_SHIFT == value) {
				vm.isNotShift = true;
				vm.shifStrategyItemAP = angular.copy(initShifStrategyItemAP);
			} else {
				vm.isNotShift = false;
			}
		}

		var sendRequest = function (uri, succcesFunc, failedFunc) {
			var serviceDiferred = Service.doGet(BASE_URI + uri);

			var failedFunc = failedFunc | function (response) {
				log.error('Load data error');
			};
			serviceDiferred.promise.then(succcesFunc).catch(failedFunc);
		}

		vm.getShiftStrategyItemAP = function () {
			sendRequest('/export-channels/' + channelId, function (response) {
				vm.shiftingModel = response.data;
				if (vm.shiftingModel.items != null && vm.shiftingModel.items.length > 0) {
					vm.shiftingModel.items.forEach(function (data) {
						if ("BUYER_PAYMENT_DATE_FOR_AP_DOCUMENT_IMPORT" == data.suspend) {
							vm.strategyItemAP.BUYER_PAYMENT_DATE_FOR_AP_DOCUMENT_IMPORT = data.suspend;
						} else if ("BUYER_PAYMENT_DATE_FOR_EXISTING_AP_DOCUMENT_JOB" == data.suspend) {
							vm.strategyItemAP.BUYER_PAYMENT_DATE_FOR_EXISTING_AP_DOCUMENT_JOB = data.suspend;
						} else if ("TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_DRAWDOWN" == data.suspend) {
							vm.strategyItemAP.TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_DRAWDOWN = data.suspend;
						} else if ("TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_OVERDRAFT" == data.suspend) {
							vm.strategyItemAP.TRANSACTION_DATE_FOR_CREATE_LOAN_WITH_OVERDRAFT = data.suspend;
						} else if ("TRANSACTION_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB" == data.suspend) {
							vm.strategyItemAP.TRANSACTION_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB = data.suspend;			
						} else if ("TRANSACTION_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB" == data.suspend) {
							vm.strategyItemAP.TRANSACTION_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB = data.suspend;
						} else if ("MATURITY_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB" == data.suspend) {
							vm.strategyItemAP.MATURITY_DATE_FOR_LOAN_WITH_DRAWDOWN_JOB = data.suspend;				
						} else if ("MATURITY_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB" == data.suspend) {
							vm.strategyItemAP.MATURITY_DATE_FOR_LOAN_WITH_OVERDRAFT_JOB = data.suspend;			
						}
					});
				}
			});
		};

		$scope.confirmSave = function () {
			blockUI.start();
			var serviceUrl = BASE_URI + '/export-channels/' + vm.shiftingModel.ownerId;
			var deffered = $q.defer();
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
			return deffered;
		}
		
		vm.backToSponsorConfigPage = function () {
			PageNavigation.gotoPage('/sponsor-configuration', {
				organizeId: organizeId
			});
		}
		
		vm.prepareDataToSave = function () {
			
		}
		
		vm.save = function () {
			vm.prepareDataToSave();
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
							headerMessage: 'Edit channel complete.',
							bodyMessage: ''
						},
						preCloseCallback: preCloseCallback
					});
				},
				
				onFail: function (response) {
					var msg = {
						405: 'Channel has been modified.'
					};
					blockUI.stop();
					UIFactory.showFailDialog({
						data: {
							headerMessage: 'Edit channel fail.',
							bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
						},
						preCloseCallback: null
					});
				}
			});
		}

		vm.initLoad = function () {
// vm.getShiftStrategyItemAP();
			log.error(initShiftingModel);
		}();

	}
]);