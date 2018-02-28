'use strict';
var tradeFinanceModule = angular.module('gecscf.tradingPartner.financing');
tradeFinanceModule.controller('TradeFinanceController', ['$scope', '$stateParams', 'UIFactory',
	'PageNavigation', 'PagingController', '$log', '$http', '$filter', 'TradeFinanceService', '$q',
	function ($scope, $stateParams, UIFactory, PageNavigation, PagingController, $log, $http, $filter, TradeFinanceService, $q) {

		var vm = this;
		var log = $log;
		var currentMode = $stateParams.mode;
		var borrower = $stateParams.params;
		var organizeId = undefined;
		var supplierId = undefined;

		vm.dateFormat = "dd/MM/yyyy";
		vm.openAgreementDate = false;
		vm.openCreditExpirationDate = false;
		vm.openActiveDate = false;
		vm.openExpireDate = false;
		vm.isUseExpireDate = false;
		vm.headerName = null;
		vm.accountType = '';
		vm.isSupplier = undefined;
		vm.isLoanType = false;
		vm.loanAccountList = null;

		if (currentMode == 'NEW') {
			vm.isNewMode = true;
		} else {
			vm.isNewMode = false;
		}

		if (currentMode == 'VIEW') {
			vm.isViewMode = true;
		} else {
			vm.isViewMode = false;
		}

		var currentDate = new Date();

		if ($stateParams.params == '') {
			PageNavigation.gotoPage('/customer-registration/trading-partners');
		}

		vm.borrowerModel = [{
				label: '[Buyer] ' + borrower.buyerId + ': ' + borrower.buyer.memberName,
				value: "BUYER"
			},
			{
				label: '[Supplier] ' + borrower.supplierId + ': ' + borrower.supplier.memberName,
				value: "SUPPLIER"
			}
		];

		vm.payeeAccountDropdown = [];

		function setPayeeAccountDropdown() {
			vm.payeeAccountDropdown = [{
				label: 'Please select',
				value: 'PLEASE_SELECT'
			}, {
				label: 'Undefined',
				value: 'UNDEFINED_ACCOUNT'
			}];

			var deffered = TradeFinanceService.getPayeeAccounts(borrower.supplierId);
			deffered.promise.then(function (response) {
				var account = response.data;
				account.forEach(function (data) {
					vm.payeeAccountDropdown.push({
						label: data.format ? ($filter('accountNoDisplay')(data.accountNo)) : data.accountNo,
						value: data.accountId
					})
				});
			}).catch(function (response) {
				log.error('Get payee account fail');
			});
		}
		
		setPayeeAccountDropdown();

		var queryAccount = function (value) {
			supplierId = borrower.supplierId;
			if (vm.tradeFinanceModel.borrower == "BUYER") {
				organizeId = borrower.buyerId;
			} else {
				organizeId = borrower.supplierId;
			}
			var url = 'api/v1/organize-customers/' + organizeId + '/accounts';

			value = value = UIFactory.createCriteria(value);

			return $http.get(url, {
				params: {
					q: value,
					offset: 0,
					limit: 5,
					accountType: ['LOAN', 'OVERDRAFT']
				}
			}).then(function (response) {
				vm.loanAccountList = response.data;
				return response.data.map(function (item) {
					var accountNo = null;
					if (item.format) {
						var accountNo = ($filter('accountNoDisplay')(item.accountNo));
					} else {
						var accountNo = item.accountNo;
					}

					item.identity = ['account-', item.accountNo, '-option'].join('');
					item.label = [accountNo].join('');
					return item;
				});
			});
		};
		
		function changeAccountType(accountType) {
			if (accountType === 'LOAN') {
				vm.isLoanType = true;
				vm.accountType = 'Term loan';
			} else if (accountType === 'OVERDRAFT') {
				vm.isLoanType = false;
				vm.accountType = 'Overdraft';
				vm.tradeFinanceModel.percentageLoan = '';
				vm.tradeFinanceModel.tenor = '';
				vm.tradeFinanceModel.interestRate = '';
				vm.isUseExpireDate = false;
			}
		}

		vm.financeAccountAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder: 'Please enter borrower account no.',
			itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
			query: queryAccount
		});

		vm.tradeFinanceModel = {
			borrower: vm.borrowerModel[0].value,
			financeAccount: null,
			tenor: null,
			percentageLoan: null,
			interestRate: null,
			agreementDate: currentDate,
			creditExpirationDate: null,
			isSuspend: false
		};

		var prepareAutoSuggestLabel = function (data) {
			var accountNoSetFormat = null;
			if (data.format) {
				accountNoSetFormat = ($filter('accountNoDisplay')(data.accountNo));
			} else {
				accountNoSetFormat = data.accountNo;
			}

			var item = {
				accountId: data.accountId,
				accountNo: data.accountNo,
				identity: ['account-', data.accountNo, '-option'].join(''),
				label: [accountNoSetFormat].join(''),
			}
			return item;
		}

		var initialTradeFinance = function (data) {
			var tradeFinanceData = data;
			if (tradeFinanceData.limitExpiryDate == null) {
				tradeFinanceData.limitExpiryDate = undefined;
			}
			if (tradeFinanceData.limitExpiryDate == undefined) {
				vm.isUseExpireDate = false;
			} else {
				vm.isUseExpireDate = true;
			}
			if (tradeFinanceData != null) {
				vm.tradeFinanceModel.borrower = tradeFinanceData.borrowerType;

				if (vm.tradeFinanceModel.borrower == "SUPPLIER") {
					vm.isSupplier = true;
				} else {
					vm.isSupplier = false;
				}
				
				changeAccountType(tradeFinanceData.accountType);
				
				vm.tradeFinanceModel.financeAccount = prepareAutoSuggestLabel(tradeFinanceData);
				vm.tradeFinanceModel.tenor = tradeFinanceData.tenor;
				vm.tradeFinanceModel.percentageLoan = tradeFinanceData.prePercentageDrawdown;
				vm.tradeFinanceModel.interestRate = tradeFinanceData.interestRate;
				vm.tradeFinanceModel.agreementDate = new Date(tradeFinanceData.agreementDate);
				vm.tradeFinanceModel.creditExpirationDate = new Date(tradeFinanceData.limitExpiryDate);
				vm.tradeFinanceModel.isSuspend = tradeFinanceData.suspend;
				if(tradeFinanceData.payeeAccountId != undefined && tradeFinanceData.payeeAccountId != null){
					vm.tradeFinanceModel.payeeAccountId = tradeFinanceData.payeeAccountId.toString();
				}else if(tradeFinanceData.payeeAccountId == null){
					console.log("init null payee");
					vm.tradeFinanceModel.payeeAccountId = 'UNDEFINED_ACCOUNT';
				}
			}
		}

		var _getTradeFinanceInfo = function (buyerId, supplierId, accountId) {
			var defered = TradeFinanceService.getTradeFinanceInfo(buyerId, supplierId, accountId);
			defered.promise.then(function (response) {
				initialTradeFinance(response.data)
			}).catch(function (response) {
				log.error('Get trading finance fail');
			});
		}

		$scope.$watch('ctrl.tradeFinanceModel.financeAccount', function () {
			if (vm.loanAccountList != null && vm.tradeFinanceModel.financeAccount != null) {
				for (var i = 0; i < vm.loanAccountList.length; i++) {
					if (vm.loanAccountList[i].accountNo === vm.tradeFinanceModel.financeAccount.accountNo) {
						changeAccountType(vm.loanAccountList[i].accountType);
						break;
					}
				}
			}
		});

		function initLoad() {
			vm.headerName = currentMode.charAt(0).toUpperCase() + currentMode.slice(1).toLowerCase() + " trade finance";
			if (currentMode == 'NEW') {
				vm.isNewMode = true;
				vm.isSupplier = false;
				vm.tradeFinanceModel.payeeAccountId = 'PLEASE_SELECT'; 
			} else if (currentMode == 'EDIT' || currentMode == 'VIEW') {
				vm.isNewMode = false;
				if (currentMode == 'VIEW') {
					vm.isViewMode = true;
				}
				if ($stateParams.data == '') {
					log.error("Trade finance data is null.");
					PageNavigation.gotoPage('/customer-registration/trading-partners');
				} else {
					var buyerId = $stateParams.data.buyerId;
					var supplierId = $stateParams.data.supplierId;
					var accountId = $stateParams.data.accountId;
					_getTradeFinanceInfo(buyerId, supplierId, accountId);
				}
			}
		}
		
		initLoad();

		vm.openCalendarAgreementDate = function () {
			vm.openAgreementDate = true;
		}

		vm.openCalendarCreditExpirationDate = function () {
			vm.openCreditExpirationDate = true;
		}

		vm.openCalendarActiveDate = function () {
			vm.openActiveDate = true;
		};

		vm.openCalendarExpireDate = function () {
			vm.openExpireDate = true;
		};

		vm.add = function (accountType) {
			var organizeId = null;
			var organizeName = null;
			var organizeCode = null;

			if (vm.tradeFinanceModel.borrower === 'BUYER') {
				organizeId = borrower.buyerId;
				organizeName = borrower.buyer.memberName;
				organizeCode = borrower.buyer.memberCode;
			} else if(vm.tradeFinanceModel.borrower === 'SUPPLIER' || accountType === 'PAYEE_ACCOUNT'){
				organizeId = borrower.supplierId;
				organizeName = borrower.supplier.memberName;
				organizeCode = borrower.supplier.memberCode;
			}
			
			pageName = 'tradeFinance';
			if(accountType === 'PAYEE_ACCOUNT'){
				pageName = 'tradeFinance_payeeAccount';
			}

			if (vm.tradeFinanceModel.borrower) {
				UIFactory.showDialog({
					templateUrl: '/js/app/modules/trading-partner/financing/templates/dialog-new-account.html',
					controller: 'AccountController',
					data: {
						page: pageName,
						organizeId: organizeId,
						organizeName: organizeName,
						organizeCode: organizeCode,
						mode: 'ADD'
					},
					preCloseCallback: function (data) {
						if (data) {
							vm.tradeFinanceModel.financeAccount = prepareAutoSuggestLabel(data);
							setPayeeAccountDropdown();
							changeAccountType(data.accountType);
						}
					}
				});
			}
		}

		var _save = function () {
			var buyerId = borrower.buyerId;
			var supplierId = borrower.supplierId;
			var tradeFinanceModule = {
				buyerId: vm.isSupplier ? borrower.supplierId : borrower.buyerId,
				supplierId: vm.isSupplier ? borrower.buyerId : borrower.supplierId,
				accountId: vm.tradeFinanceModel.financeAccount.accountId,
				limitExpiryDate: vm.tradeFinanceModel.creditExpirationDate,
				tenor: vm.tradeFinanceModel.tenor,
				prePercentageDrawdown: vm.tradeFinanceModel.percentageLoan,
				interestRate: vm.tradeFinanceModel.interestRate,
				agreementDate: vm.tradeFinanceModel.agreementDate,
				suspend: vm.tradeFinanceModel.isSuspend,
				borrowerType: vm.isSupplier ? "SUPPLIER" : "BUYER",
				payeeAccountId: vm.tradeFinanceModel.payeeAccountId == 'UNDEFINED_ACCOUNT'? null : vm.tradeFinanceModel.payeeAccountId
			}

			var deferred = TradeFinanceService.createTradeFinance(buyerId, supplierId, tradeFinanceModule, vm.isSupplier);
			deferred.promise.then(function (response) {}).catch(function (response) {
				if (response) {
					if (Array.isArray(response.data)) {
						response.data.forEach(function (error) {
							$scope.errors[error.errorCode] = {
								message: error.errorMessage
							};
						});
					}
				}
				deferred.reject(response);
			});
			return deferred;
		}

		var _update = function () {
			var buyerId = borrower.buyerId;
			var supplierId = borrower.supplierId;

			if (vm.tradeFinanceModel.creditExpirationDate == "Invalid Date") {
				vm.tradeFinanceModel.creditExpirationDate = null;
			}

			var tradeFinanceModule = {
				buyerId: buyerId,
				supplierId: supplierId,
				accountId: vm.tradeFinanceModel.financeAccount.accountId,
				limitExpiryDate: vm.tradeFinanceModel.creditExpirationDate,
				tenor: vm.tradeFinanceModel.tenor,
				prePercentageDrawdown: vm.tradeFinanceModel.percentageLoan,
				interestRate: vm.tradeFinanceModel.interestRate,
				agreementDate: vm.tradeFinanceModel.agreementDate,
				suspend: vm.tradeFinanceModel.isSuspend,
				payeeAccountId: vm.tradeFinanceModel.payeeAccountId == 'UNDEFINED_ACCOUNT'? null : vm.tradeFinanceModel.payeeAccountId,
				version: $stateParams.data.version
			}

			var deferred = TradeFinanceService.updateTradeFinance(buyerId, supplierId, tradeFinanceModule.accountId, tradeFinanceModule);
			deferred.promise.then(function (response) {}).catch(function (response) {
				if (response) {
					if (Array.isArray(response.data)) {
						response.data.forEach(function (error) {
							$scope.errors[error.errorCode] = {
								message: error.errorMessage
							};
						});
					}
				}
				deferred.reject(response);
			});
			return deferred;
		}

		var _validate = function () {
			$scope.errors = {};
			var valid = true;

			if (vm.tradeFinanceModel.payeeAccountId == 'PLEASE_SELECT') {
				valid = false;
				$scope.errors.payeeAccountId = {
					message: 'Payee account is required.'
				}
			}

			if (!angular.isObject(vm.tradeFinanceModel.financeAccount)) {
				valid = false;
				$scope.errors.financeAccount = {
					message: 'Loan account is required.'
				}
			}

			if (vm.isLoanType && (vm.tradeFinanceModel.tenor == null || vm.tradeFinanceModel.tenor == '')) {
				valid = false;
				$scope.errors.tenor = {
					message: 'Tenor (Day) is required.'
				}
			}

			if (vm.isSupplier) {
				if (vm.tradeFinanceModel.percentageLoan == null || vm.tradeFinanceModel.percentageLoan == '') {
					valid = false;
					$scope.errors.percentageLoan = {
						message: 'Percentage loan (%) is required.'
					}
				}
			}

			if (!angular.isDefined(vm.tradeFinanceModel.agreementDate) || vm.tradeFinanceModel.agreementDate == null) {
				var agreementDate = document.getElementById("agreement-date-textbox").value;
				if (vm.isLoanType && agreementDate != null && agreementDate != '') {
					valid = false;
					$scope.errors.agreementDate = {
						message: 'Wrong date format data.'
					}
				} else {
					valid = false;
					$scope.errors.agreementDate = {
						message: 'Agreement date is required.'
					}
				}

			}

			if (vm.isUseExpireDate) {
				if (!angular.isDefined(vm.tradeFinanceModel.creditExpirationDate) || vm.tradeFinanceModel.creditExpirationDate == null) {
					var creditExpirationDate = document.getElementById("credit-expiration-date-textbox").value;
					if (vm.isLoanType && creditExpirationDate != null && creditExpirationDate != '') {
						valid = false;
						$scope.errors.creditExpirationDate = {
							message: 'Wrong date format data.'
						}
					} else {
						valid = false;
						$scope.errors.creditExpirationDate = {
							message: 'Credit expiration date is required.'
						}
					}
				}
			}
			return valid;
		}

		vm.save = function () {
			if (_validate()) {
				var preCloseCallback = function (confirm) {
					var params = {
							setupModel : borrower
					};
					PageNavigation.gotoPage('/trade-finance/config',params);
				}

				UIFactory.showConfirmDialog({
					data: {
						headerMessage: 'Confirm save?'
					},
					confirm: function () {
						if (currentMode == 'NEW') {
							return _save();
						} else if (currentMode == 'EDIT') {
							return _update();
						}
					},
					onFail: function (response) {
						var status = response.status;
						if (status != 400) {
							var msg = {
								404: "Trade finance has been deleted.",
								405: "Trade finance has been used.",
								409: (vm.isNewMode ? "Trade finance is existed." : 'Trade finance has been modified.')
							}
							UIFactory.showFailDialog({
								data: {
									headerMessage: vm.isNewMode ? 'Add new trade finance fail.' : 'Edit trade finance fail.',
									bodyMessage: msg[status] ? msg[status] : response.errorMessage
								},
								preCloseCallback: preCloseCallback
							});
						}
					},
					onSuccess: function (response) {
						UIFactory.showSuccessDialog({
							data: {
								headerMessage: vm.isNewMode ? 'Add new trade finance success.' : 'Edit trade finance complete.',
								bodyMessage: ''
							},
							preCloseCallback: preCloseCallback
						});
					}
				});
			}
		}

		vm.setCreditExpirationDate = function () {
			if (!vm.isUseExpireDate) {
				vm.tradeFinanceModel.creditExpirationDate = null;
			}
		}

		vm.cancel = function () {
			var params = {
					setupModel : borrower
			};
			PageNavigation.gotoPage('/trade-finance/config',params);
		}

		var _clearCriteria = function () {
			vm.tradeFinanceModel.financeAccount = null;
			vm.tradeFinanceModel.tenor = null;
			vm.tradeFinanceModel.percentageLoan = null;
			vm.tradeFinanceModel.interestRate = null;
			vm.tradeFinanceModel.agreementDate = currentDate;
			vm.tradeFinanceModel.creditExpirationDate = null;
			vm.tradeFinanceModel.isSuspend = false;
			vm.isUseExpireDate = false;
			$scope.errors = {};
		}

		vm.changeBorrower = function () {
			vm.accountType = '';
			vm.tradeFinanceModel.percentageLoan = '';
			vm.tradeFinanceModel.tenor = '';
			vm.tradeFinanceModel.interestRate = '';
			vm.isUseExpireDate = false;
			if (vm.tradeFinanceModel.borrower == "SUPPLIER") {
				vm.isSupplier = true;
			} else {
				vm.isSupplier = false;
			}
			_clearCriteria();
		}
	}
]);