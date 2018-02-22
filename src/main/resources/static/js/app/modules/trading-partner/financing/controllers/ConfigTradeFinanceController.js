'use strict';
var tradeFinanceModule = angular.module('gecscf.tradingPartner.financing');
tradeFinanceModule.controller('ConfigTradeFinanceController', ['$scope', '$stateParams', 'UIFactory',
	'PageNavigation', 'PagingController', 'ConfigTradeFinanceService', '$log', 'SCFCommonService', '$state', '$cookieStore', '$timeout', '$filter',
	function ($scope, $stateParams, UIFactory, PageNavigation, PagingController, ConfigTradeFinanceService, $log, SCFCommonService, $state, $cookieStore, $timeout, $filter) {

		var vm = this;
		vm.canManage = false;
		vm.canView = false;
		var log = $log;
		var listStoreKey = 'config';

		vm.supportedPaymentBy = "Not supported payment by debit";
		vm.tradingPartner = null;
		vm.payeeAccount = 'Undefined';

		var buyerId = null;
		var supplierId = null;

		vm.financeModel = null;

		vm.pagingController = {
			tableRowCollection: undefined
		};


		vm.dataTable = {
			options: {

			},
			columns: [
				{
					fieldName: 'borrowerName',
					field: 'borrowerName',
					label: 'Borrower',
					idValueField: 'template',
					id: 'borrower-name-{value}-label',
					sortable: false,
					dataRenderer: function (record) {
						return ($filter('borrowDisplay')(record.borrowerType, record.borrowerName));
					}
				}, {
					fieldName: 'accountNo',
					field: 'accountNo',
					label: 'Loan account',
					idValueField: 'template',
					id: 'finance-account-{value}-label',
					sortable: false,
					dataRenderer: function (record) {
						if (record.format) {
							return ($filter('accountNoDisplay')(record.accountNo));
						} else {
							return record.accountNo;
						}
					}
				}, {
					fieldName: 'defaultLoanNo',
					field: 'defaultLoanNo',
					label: 'Default account',
					idValueField: 'template',
					id: 'default-loan-no-{value}-label',
					sortable: false,
					cellTemplate: '<img	style="height: 16px; width: 16px;" ng-show="data.defaultLoanNo" data-ng-src="img/checkmark.png"/>',
				}, {
					cssTemplate: 'text-center',
					sortable: false,
					cellTemplate: '<scf-button id="{{$parent.$index + 1}}-view-button" class="btn-default gec-btn-action" ng-disabled="!ctrl.canView" ng-click="ctrl.view(data)" title="View"><i class="fa fa-search" aria-hidden="true"></i></scf-button>'
					+ '<scf-button id="{{$parent.$index + 1}}-edit-button" class="btn-default gec-btn-action" ng-disabled="!ctrl.canManage" ng-click="ctrl.edit(data)" title="Edit"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>'
					+ '<scf-button id="{{$parent.$index + 1}}-delete-button" class="btn-default gec-btn-action" ng-disabled="!ctrl.canManage || data.defaultLoanNo" ng-click="ctrl.deleteTradeFinance(data)" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
					+ '<scf-button id="{{$parent.$index + 1}}-set-default-button" class="btn-default gec-btn-action" ng-disabled="!ctrl.canManage || ctrl.isSupplier(data.borrowerType)" ng-click="ctrl.setDefaultCode(data)" title="Set default"><i class="fa fa-check-square-o" aria-hidden="true"></i></scf-button>'
				}]
		}

		vm.isSupplier = function (data) {
			var disable = false;
			if (data === "SUPPLIER") {
				disable = true;
			}
			return disable;
		}

		var storeCriteria = function () {
			$cookieStore.put(listStoreKey, vm.financeModel);
		}

		var getFinanceInfo = function (buyerId, supplierId) {
			var defered = ConfigTradeFinanceService.getTradeFinanceInfo(buyerId, supplierId);
			defered.promise.then(function (response) {
				vm.pagingController.tableRowCollection = null;
				if (response.data[0] != null) {
					vm.pagingController.tableRowCollection = response.data;
				}
			}).catch(function (response) {
				log.error('Get trading finance fail');
			});
		}

		var getPayeeAccountDetails = function (supplierId, accountId) {
			var defered = ConfigTradeFinanceService.getPayeeAccountDetails(supplierId, accountId);
			defered.promise.then(function (response) {
				var account = response.data;
				if(account != null){
					vm.payeeAccount = account.format ? ($filter('accountNoDisplay')(account.accountNo)) : account.accountNo;
				}
			}).catch(function (response) {
				log.error('Get payee account details fail');
				vm.payeeAccount = "Undefined";
			});
		}

		var loadTradingPartner = function (buyerId, supplierId) {
			var deffered = ConfigTradeFinanceService.getTradingPartner(buyerId, supplierId);
			deffered.promise.then(function (response) {
				vm.tradingPartner = response.data;
				if (vm.tradingPartner != null) {
					vm.supportedPaymentBy = vm.tradingPartner.supportDebit ? "Supported payment by debit" : "Not supported payment by debit";
					if (vm.tradingPartner.debitPayeeAccount == null) {
						vm.payeeAccount = "";
					} else if (vm.tradingPartner.debitPayeeAccount == 0) {
						vm.payeeAccount = "Undefined";
					} else {
						getPayeeAccountDetails(supplierId, vm.tradingPartner.debitPayeeAccount);
					}
				}
			}).catch(function (response) {
				log.error('Get trading partner fail');
			});
		}

		var initLoad = function () {
			var backAction = $stateParams.backAction;

			if (backAction === true) {
				vm.financeModel = $cookieStore.get(listStoreKey);
			} else {
				vm.financeModel = $stateParams.setupModel;
			}

			if (vm.financeModel == null) {
				PageNavigation.gotoPage('/customer-registration/trading-partners');
			}
			
			buyerId = vm.financeModel.buyerId;
			supplierId = vm.financeModel.supplierId;

			loadTradingPartner(buyerId, supplierId);
			getFinanceInfo(buyerId, supplierId);
		} ();

		vm.setupDebitPayment = function () {
			UIFactory.showDialog({
				templateUrl: '/js/app/modules/trading-partner/financing/templates/dialog-setup-debit-payment-information.html',
				controller: 'SetupDebitPaymentController',
				controllerAs: 'ctrl',
				scope: $scope,
				data: {
					tradingPartnerModel: vm.tradingPartner,
					payeeOrganizeName: vm.financeModel.supplierName
				},
				preCloseCallback: function (data) {
					if(angular.isDefined(data) && data != null){
						loadTradingPartner(data.buyerId, data.supplierId);
					}
				}
			});
		}

		vm.back = function () {
			$timeout(function () {
				PageNavigation.backStep();
			}, 10);
		}

		vm.setDefaultCode = function (data) {
			var deffered = ConfigTradeFinanceService.setDefaultCode(data);
			deffered.promise.then(function (response) {
				getFinanceInfo(data.buyerId, data.supplierId);
			}).catch(function (response) {
				log.error("Can not set default code !");
			});
		}

		vm.newTF = function () {
			SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
			storeCriteria();
			var param = {
				params: vm.financeModel,
			}
			PageNavigation.gotoPage('/trade-finance/new', param, param);
		}

		vm.edit = function (data) {
			SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
			storeCriteria();
			var param = {
				params: vm.financeModel,
				data: data
			}
			PageNavigation.gotoPage('/trade-finance/edit', param, param);
		}

		vm.view = function (data) {
			SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
			storeCriteria();
			var param = {
				params: vm.financeModel,
				data: data
			}
			PageNavigation.gotoPage('/trade-finance/view', param, param);
		}

		vm.deleteTradeFinance = function (record) {
			var preCloseCallback = function (confirm) {
				getFinanceInfo(vm.financeModel.buyerId, vm.financeModel.supplierId);
			}

			UIFactory.showConfirmDialog({
				data: {
					headerMessage: 'Confirm delete?'
				},
				confirm: function () {
					return ConfigTradeFinanceService.deleteTradeFinance(record);
				},
				onFail: function (response) {
					var msg = {
						404: 'Trade finance has been deleted.',
						405: 'Trade finance has been used.',
						409: 'Trade finance has been modified.'
					};
					UIFactory.showFailDialog({
						data: {
							headerMessage: 'Delete trade finance fail.',
							bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
						},
						preCloseCallback: preCloseCallback
					});
				},
				onSuccess: function (response) {
					UIFactory.showSuccessDialog({
						data: {
							headerMessage: 'Delete trade finance success.',
							bodyMessage: ''
						},
						preCloseCallback: preCloseCallback
					});
				}
			});
		}
	}]);
