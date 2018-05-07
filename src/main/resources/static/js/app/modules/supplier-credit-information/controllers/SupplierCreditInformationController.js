'use strict';
var sciModule = angular.module('gecscf.supplierCreditInformation');
sciModule.controller('SupplierCreditInformationController', [
	'$rootScope',
	'$scope',
	'$stateParams',
	'UIFactory',
	'PageNavigation',
	'PagingController',
	'SupplierCreditInformationService',
	'$timeout',
	'SCFCommonService',
	'$http',
	'$q',
	'blockUI',
	'scfFactory',
	'$filter',
	'AccountService',
	function ($rootScope, $scope, $stateParams, UIFactory, PageNavigation, PagingController, SupplierCreditInformationService, $timeout, SCFCommonService, $http, $q, blockUI, scfFactory, $filter, AccountService) {
		var vm = this;

		var page = null;
		vm.buyer = $stateParams.buyer || null;
		vm.supplier = $stateParams.supplier || null;
		vm.showSupplier = true;
		vm.data = [];

		var viewModeData = {
			myOrganize: 'MY_ORGANIZE',
			customer: 'CUSTOMER'
		}

		var _criteria = {};

		vm.criteria = $stateParams.criteria || {
	    	buyerId : null,
	    	buyerName: null,
	    	supplierId: null, 
	    	memberId: null, 
	    	memberCode: null, 
	    	memberName: null
	    }

		vm.viewAction = false;
        vm.unauthenView = function() {
            if (vm.viewAction) {
                return false;
            } else {
                return true;
            }
        }

		vm.pagingController = PagingController.create('/api/v1/supplier-credit-informations', _criteria,'GET');
		vm.search = function (pageModel) {
			var buyer = undefined;
			var buyerName = undefined;
			var supplier = undefined;
			var supplierName = undefined;
			var supplierCode = undefined;
			var defered = scfFactory.getUserInfo();
			defered.promise.then(function (response) {
				var organizeId = response.organizeId;
				// mode MY_ORGANIZE
				if (viewModeData.myOrganize == $stateParams.viewMode) {
					supplier = organizeId;
					if (angular.isObject(vm.buyer)) {
						buyer = vm.buyer.buyerId;
						buyerName = vm.buyer.buyerName;
					}
					page = '/my-organize/supplier-credit-information/view';
				} else {
					// mode CUSTOMER
					if (angular.isObject(vm.buyer)) {
						buyer = vm.buyer.memberId;
						buyerName = vm.buyer.memberName;
					}
					if (angular.isObject(vm.supplier)) {
						supplier = vm.supplier.memberId;
						supplierName = vm.supplier.memberName;
						supplierCode = vm.supplier.memberCode;
					}
					page = '/customer-registration/supplier-credit-information/view';
				}

				vm.criteria.buyerId = buyer;
				vm.criteria.buyerName = buyerName;
				vm.criteria.supplierId = supplier;
				vm.criteria.memberId = supplier;
				vm.criteria.memberCode = supplierCode; 
				vm.criteria.memberName = supplierName;
				_storeCriteria();
				vm.pagingController.search(pageModel, function (criteriaData, response) {
					var data = response.data;
					var pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
					var currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
					var i = 0;
					var baseRowNo = pageSize * currentPage;
					angular.forEach(data, function (value, idx) {
						if (!isSameAccount(value.accountId, data, idx)) {
							value.showAccountFlag = true;
						}
						value.showAccountFlag = true;
						++i;
						value.rowNo = baseRowNo + i;
					});
				});
				if ($stateParams.backAction) {
					$stateParams.backAction = false;
				}
			});
		};

		function _storeCriteria() {
			angular.copy(vm.criteria, _criteria);
		}

		// Organize auto suggestion model.
		var _organizeTypeHead = function (q) {
			q = UIFactory.createCriteria(q);
			return SupplierCreditInformationService.getOrganizeByNameOrCodeLike(q);
		}

		var _buyerTypeHead = function (q) {
			q = UIFactory.createCriteria(q);
			if (viewModeData.myOrganize == $stateParams.viewMode) {
				return SupplierCreditInformationService.getBuyerNameOrCodeLike($rootScope.userInfo.organizeId, q);
			} else {
				return SupplierCreditInformationService.getBuyerForBankByNameOrCodeLike(q);
			}
		}

		vm.organizeAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder: 'Enter organization name or code',
			itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
			query: _organizeTypeHead
		});

		vm.buyerAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder: 'Enter organization name or code',
			itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
			query: _buyerTypeHead
		});

		// Main of program
		var initLoad = function () {
			var backAction = $stateParams.backAction;
			if(backAction){
				vm.criteria = $stateParams.criteria;
				if(angular.isDefined(vm.criteria.buyerName)){
					vm.buyer = {buyerId: '', buyerName: '', memberId: '', memberName: ''};
					vm.buyer.buyerId = vm.criteria.buyerId;
					vm.buyer.buyerName = vm.criteria.buyerName;
					vm.buyer.memberId = vm.criteria.buyerId;
					vm.buyer.memberName = vm.criteria.buyerName;
					SupplierCreditInformationService._prepareItemBuyers(vm.buyer);
				}
				if(angular.isDefined(vm.criteria.memberName)){
					vm.supplier = {memberId: '', memberName: '', memberCode: ''};
					vm.supplier.memberId = vm.criteria.memberId;
					vm.supplier.memberName = vm.criteria.memberName;
					vm.supplier.memberCode = vm.criteria.memberCode;
					SupplierCreditInformationService._prepareItem(vm.supplier);
				}
			}

			vm.search();
			if (viewModeData.myOrganize == $stateParams.viewMode) {
				vm.showSupplier = false;
			}
		}();

		vm.decodeBase64 = function (data) {
			return (data ? atob(data) : UIFactory.constants.NOLOGO);
		};

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

		vm.view = function (data) {
			var params = {
				accountId: data.accountId
			};
			$timeout(function() {
				PageNavigation.nextStep(page, params, {criteria : _criteria});
			}, 10);
		}

		vm.enquiryAvailableBalance = function (data) {
			blockUI.start("Processing...");
			var deffered = null;
			var criteria = {
				buyerId: data.tradeFinances[0].buyer.memberId,
				supplierId: data.tradeFinances[0].supplier.memberId,
				accountId: data.accountId,
                borrowerType: 'SUPPILER',
                fundingId: data.fundingId,
                organizeId: data.tradeFinances[0].supplier.memberId
			}

			if (data.accountType == 'LOAN') {
				deffered = AccountService.enquiryCreditLimit(criteria);
			} else {
				//overdraft
				deffered = AccountService.enquiryAccountBalance(criteria);
			}

			deffered.promise.then(function (response) {
				blockUI.stop();
				if (response.status == 200) {
					vm.search();
					UIFactory.showSuccessDialog({
						data: {
							headerMessage: 'Enquiry credit information success.',
							bodyMessage: ''
						},
						showOkButton: true,
					});
				} else {
					UIFactory.showFailDialog({
						data: {
							headerMessage: 'Enquiry credit information failure',
							bodyMessage: 'please try again.'
						},
						showOkButton: true,
					});
				}
			}).catch(function (response) {
				blockUI.stop();
				UIFactory.showFailDialog({
					data: {
						headerMessage: 'Enquiry credit information failure',
						bodyMessage: ' please try again.'
					},
					showOkButton: true,
				});
			});
		}

		function getRecordIndexByAccountId(accountId) {
			for (var i = 0; i < vm.data.length; ++i) {
				if (vm.data[i].accountId == accountId) {
					return i;
				}
			}
			return -1;
		}
	}
]);