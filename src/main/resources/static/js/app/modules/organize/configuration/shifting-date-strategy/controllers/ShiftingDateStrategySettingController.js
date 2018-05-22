var shiftingDateStrategyModule = angular
	.module('gecscf.organize.configuration.shiftingDateStrategy');

shiftingDateStrategyModule.controller('ShiftingDateStrategySettingController', [
	'$log', '$scope', '$state', '$stateParams', 'Service', 'PageNavigation', 'UIFactory', 'blockUI' , 'ShiftingDateStrategyService', '$q', '$http', 'ngDialog',
	
	function ($log, $scope, $state, $stateParams, Service, PageNavigation, UIFactory, blockUI , ShiftingDateStrategyService, $q, $http,ngDialog) {

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
		
		var initShifStrategyItemAR = {
			 PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DRAWDOWN : false,
			 PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DEBIT_OVERDRAFT : false,
			 PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_SPECIAL_DEBIT : false,
			 PAYMENT_DATE_FOR_PAYMENT_WITH_DRAWDOWN_JOB : false,
			 PAYMENT_DATE_FOR_PAYMENT_WITH_DEBIT_OVERDRAFT_JOB : false,
			 PAYMENT_DATE_FOR_PAYMENT_WITH_SPECIAL_DEBIT_JOB : false
		 };
		
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
		
		vm.initShiftingModelAR = {
				ownerId : vm.organizeId,
				accountingTransactionType : vm.accountingTransactionType,
				shiftingMethod : NOT_SHIFT,
				items : [
					{dateType : "PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DRAWDOWN", suspend:true},
					{dateType : "PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DEBIT_OVERDRAFT", suspend:true},
					{dateType : "PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_SPECIAL_DEBIT", suspend:true},
					{dateType : "PAYMENT_DATE_FOR_PAYMENT_WITH_DRAWDOWN_JOB", suspend:true},
					{dateType : "PAYMENT_DATE_FOR_PAYMENT_WITH_DEBIT_OVERDRAFT_JOB", suspend:true},
					{dateType : "PAYMENT_DATE_FOR_PAYMENT_WITH_SPECIAL_DEBIT_JOB", suspend:true}
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
				if (vm.showShiftingContent('PAYABLE')){
					vm.shifStrategyDisplayItemAP = angular.copy(initShifStrategyItemAP);
				}else{
					vm.shifStrategyDisplayItemAR = angular.copy(initShifStrategyItemAR);
				}
			} else {
				vm.isNotShift = false;
			}
		}

		vm.getShiftStrategyItem = function (accountingTransactionType) {
			vm.shiftingMethodDisplay = NOT_SHIFT;
			vm.isNotShift = true;
			if (vm.showShiftingContent('PAYABLE')){
				vm.shifStrategyDisplayItemAP = angular.copy(initShifStrategyItemAP);
				vm.shiftingModel = angular.copy(vm.initShiftingModelAP);
			} else if (vm.showShiftingContent('RECEIVABLE')){
				vm.shifStrategyDisplayItemAR = angular.copy(initShifStrategyItemAR);
				vm.shiftingModel = angular.copy(vm.initShiftingModelAR);
			}
			var deffered = ShiftingDateStrategyService.getShiftStrategy(vm.organizeId , accountingTransactionType);
			deffered.promise.then(function (response) {

				vm.shiftingModel = response.data;
				vm.shiftingMethodDisplay = vm.shiftingModel.shiftingMethod;
				vm.shiftStrategyChange(vm.shiftingMethodDisplay);
				if (vm.shiftingModel.items != null && vm.shiftingModel.items.length > 0) {
					vm.shiftingModel.items.forEach(function (data) {
						if (vm.showShiftingContent('PAYABLE')){
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
						}else{
							if ("PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DRAWDOWN" == data.dateType) {
								vm.shifStrategyDisplayItemAR.PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DRAWDOWN = !data.suspend;
							} else if ("PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DEBIT_OVERDRAFT" == data.dateType) {
								vm.shifStrategyDisplayItemAR.PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DEBIT_OVERDRAFT = !data.suspend;
							} else if ("PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_SPECIAL_DEBIT" == data.dateType) {
								vm.shifStrategyDisplayItemAR.PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_SPECIAL_DEBIT = !data.suspend;
							} else if ("PAYMENT_DATE_FOR_PAYMENT_WITH_DRAWDOWN_JOB" == data.dateType) {
								vm.shifStrategyDisplayItemAR.PAYMENT_DATE_FOR_PAYMENT_WITH_DRAWDOWN_JOB = !data.suspend;
							} else if ("PAYMENT_DATE_FOR_PAYMENT_WITH_DEBIT_OVERDRAFT_JOB	" == data.dateType) {
								vm.shifStrategyDisplayItemAR.PAYMENT_DATE_FOR_PAYMENT_WITH_DEBIT_OVERDRAFT_JOB = !data.suspend;			
							} else if ("PAYMENT_DATE_FOR_PAYMENT_WITH_SPECIAL_DEBIT_JOB" == data.dateType) {
								vm.shifStrategyDisplayItemAR.PAYMENT_DATE_FOR_PAYMENT_WITH_SPECIAL_DEBIT_JOB = !data.suspend;
							}
						}
					});
				}
			
			});
		};

		$scope.confirmSave = function () {
			blockUI.start();
			var deffered = $q.defer();
			if (vm.shiftingModel.shiftingDateStrategyId == undefined || vm.shiftingModel.shiftingDateStrategyId == null || vm.shiftingModel.shiftingDateStrategyId == '') {
				// new
				deffered = ShiftingDateStrategyService.createShiftStrategy(vm.shiftingModel);
			} else {
				// update
				deffered = ShiftingDateStrategyService.updateShiftStrategy(vm.shiftingModel , vm.accountingTransactionType);
			}
			return deffered;
		}
		
		vm.backToSponsorConfigPage = function () {
			PageNavigation.gotoPage('/sponsor-configuration', {
				organizeId: vm.organizeId
			});
		}
		
		vm.prepareShiftingToSave = function () {
			vm.shiftingModel.shiftingMethod = vm.shiftingMethodDisplay;
			vm.shiftingModel.items.forEach(function (data) {
				if (vm.showShiftingContent('PAYABLE')){
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
				}else{
					if ("PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DRAWDOWN" == data.dateType) {
						data.suspend = !vm.shifStrategyDisplayItemAR.PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DRAWDOWN;
					} else if ("PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DEBIT_OVERDRAFT" == data.dateType) {
						data.suspend = !vm.shifStrategyDisplayItemAR.PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_DEBIT_OVERDRAFT;
					} else if ("PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_SPECIAL_DEBIT" == data.dateType) {
						data.suspend = !vm.shifStrategyDisplayItemAR.PAYMENT_DATE_FOR_CREATE_PAYMENT_WITH_SPECIAL_DEBIT;
					} else if ("PAYMENT_DATE_FOR_PAYMENT_WITH_DRAWDOWN_JOB" == data.dateType) {
						data.suspend = !vm.shifStrategyDisplayItemAR.PAYMENT_DATE_FOR_PAYMENT_WITH_DRAWDOWN_JOB;
					} else if ("PAYMENT_DATE_FOR_PAYMENT_WITH_DEBIT_OVERDRAFT_JOB	" == data.dateType) {
						data.suspend = !vm.shifStrategyDisplayItemAR.PAYMENT_DATE_FOR_PAYMENT_WITH_DEBIT_OVERDRAFT_JOB;	
					} else if ("PAYMENT_DATE_FOR_PAYMENT_WITH_SPECIAL_DEBIT_JOB" == data.dateType) {
						data.suspend = !vm.shifStrategyDisplayItemAR.PAYMENT_DATE_FOR_PAYMENT_WITH_SPECIAL_DEBIT_JOB;
					}
				}
			});
		}
		
		vm.save = function () {
			vm.prepareShiftingToSave();
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
			vm.getShiftStrategyItem(vm.accountingTransactionType);
		}();

	}
]);