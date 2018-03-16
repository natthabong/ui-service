'use strict';
var sciModule = angular.module('gecscf.supplierCreditInformation');
sciModule.controller('ViewSupplierCreditInformationController', [
	'$filter',
	'$stateParams',
	'PagingController',
	'UIFactory',
	'scfFactory',
	'PageNavigation',
	'$timeout',
	function ($filter, $stateParams, PagingController, UIFactory, scfFactory, PageNavigation, $timeout) {
		var vm = this;
		var _criteria = {};

		var accountTypes = {
			"LOAN": "Term loan",
			"OVERDRAFT": "Overdraft"
		}
		
		vm.accountId = $stateParams.accountId || null;
		vm.data = [];
		vm.tradeFinanceModel = {};
		vm.pagingController = PagingController.create('/api/v1/supplier-credit-information/accounts/' + vm.accountId, _criteria, 'GET');
		
		vm.viewAction = false;
		vm.unauthenView = function () {
			if (vm.viewAction) {
				return false;
			} else {
				return true;
			}
		}

		vm.search = function (pageModel) {
			var accountId = undefined;
			var deferred = scfFactory.getUserInfo();
			deferred.promise.then(function (response) {
				vm.pagingController.search(pageModel, function (criteriaData, response) {
					var data = response.data;
					var pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
					var currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
					var i = 0;
					var baseRowNo = pageSize * currentPage;
					angular.forEach(data, function (value, idx) {
						if(!isSameSupplier(value.supplierId, data, idx)){
							value.showSupplierFlag = true;
						}
						if (!isSameAccount(value.accountId, data, idx)) {
							value.showAccountFlag = true;
						}
						++i;
						value.rowNo = baseRowNo + i;
					});

					var item = response.data[0];
					vm.tradeFinanceModel.accountNo = vm.getAccountNoToDisplay(item);
					vm.tradeFinanceModel.format = item.format;
					vm.tradeFinanceModel.accountType = accountTypes[item.accountType];
					vm.tradeFinanceModel.creditStatus = item.accountStatus;
					vm.tradeFinanceModel.creditLimit = item.creditLimit;
					vm.tradeFinanceModel.outstandingAmount = item.outstanding;
					vm.tradeFinanceModel.futureAmount = item.futureDrawdown;
					vm.tradeFinanceModel.remainingAmount = item.bankRemaining;
					vm.tradeFinanceModel.available = item.available;
				});
			});
		};

		// Main of program
		var initLoad = function () {
			vm.search();
		}();

		vm.decodeBase64 = function (data) {
			return (data ? atob(data) : UIFactory.constants.NOLOGO);
		};

		var isSameSupplier = function (supplierId, data, index) {
			if (index == 0) {
				return false;
			} else {
				return supplierId == data[index - 1].supplierId;
			}
		}

		var isSameAccount = function (accountId, data, index) {
			if (index == 0) {
				return false;
			} else {
				return accountId == data[index - 1].accountId;
			}
		}

		vm.getAccountNoToDisplay = function (record) {
			if (record.format) {
				return $filter('accountNoDisplay')(record.accountNo);
			} else {
				return record.accountNo;
			}
		}

		vm.getPayeeAccountNoToDisplay = function (record) {
			if (record.formatPayeeAccount) {
				return $filter('accountNoDisplay')(record.payeeAccountNo);
			} else {
				return record.payeeAccountNo == null?'Undefined': record.payeeAccountNo;
			}
		}

		vm.back = function(){
			$timeout(function () {
                PageNavigation.backStep();
            }, 10);
		}
	}
]);