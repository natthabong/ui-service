'use strict';
var bciModule = angular.module('gecscf.buyerCreditInformation');
bciModule.controller('BuyerCreditInformationController', [
	'$rootScope',
	'$scope',
	'$stateParams',
	'UIFactory',
    'PageNavigation',
	'PagingController',
	'BuyerCreditInformationService',
	'$timeout',
	'SCFCommonService',
	'$http',
	'$q',
	'blockUI',
	'scfFactory',
	'$filter',
	'AccountService',
	function ($rootScope, $scope, $stateParams, UIFactory, PageNavigation, PagingController, BuyerCreditInformationService, $timeout, SCFCommonService, $http, $q, blockUI, scfFactory, $filter, AccountService) {
		var vm = this;

		var page = null;
		vm.buyer = $stateParams.buyer || null;
		vm.supplier = $stateParams.supplier || null;
		vm.showSupplier = true;
		vm.showBuyer = true;
		vm.showButtonSearchBuyer = false;
		vm.buyerMode = false;
		vm.supplierMode = false;
		vm.data = [];
		vm.criteria = $stateParams.criteria || {};
		
		var viewModeData = {
			customer: 'CUSTOMER',
			myOrganize: 'MY_ORGANIZE',
			partner: 'PARTNER'
		}

		var _criteria = {};
	    
	    vm.criteria = $stateParams.criteria || {
	    	buyerId : null,
	    	buyerName: null, 
	    	memberBuyerId: null, 
	    	memberBuyerCode: null, 
	    	memberBuyerName: null,
	    	supplierId: null, 
	    	supplierName: null, 
	    	memberSupplierId: null, 
	    	memberSupplierCode: null, 
	    	memberSupplierName: null
	    }
        
        vm.viewAction = false;
        vm.unauthenView = function() {
            if (vm.viewAction) {
                return false;
            } else {
                return true;
            }
        }
        
        vm.pagingController = PagingController.create('/api/v1/buyer-credit-information', vm.criteria,'GET');
		vm.search = function (pageModel) {
			var buyer = undefined;
        	var buyerName = undefined;
        	var buyerCode = undefined;
			var supplier = undefined;
			var supplierName = undefined;
			var supplierCode = undefined;
			var defered = scfFactory.getUserInfo();
			defered.promise.then(function (response) {
				var organizeId = response.organizeId;
				if (viewModeData.myOrganize == $stateParams.viewMode) {
					buyer = organizeId;
					if (angular.isObject(vm.supplier)) {
						supplier = vm.supplier.supplierId;
						supplierName = vm.supplier.supplierName;
					}
					page = '/my-organize/buyer-credit-information/view';
				} else if (viewModeData.partner == $stateParams.viewMode) {
					supplier = organizeId;
					if (angular.isObject(vm.buyer)) {
						buyer = vm.buyer.buyerId;
						buyerName = vm.buyer.buyerName;
						buyerCode = vm.buyer.memberCode;
					}
					page = '/partner-organize/buyer-credit-information/view';
				} else if (viewModeData.customer == $stateParams.viewMode) {
					if (angular.isObject(vm.buyer)) {
						buyer = vm.buyer.memberId;
						buyerName = vm.buyer.memberName;
						buyerCode = vm.buyer.memberCode;
					}
					if (angular.isObject(vm.supplier)) {
						supplier = vm.supplier.memberId;
						supplierName = vm.supplier.memberName;
						supplierCode = vm.supplier.memberCode;
					}
					page = '/customer-registration/buyer-credit-information/view';
				} else {
					buyer = null;
					supplier = null;
				}

				vm.criteria.buyerId = buyer;
				vm.criteria.buyerName = buyerName;
				vm.criteria.memberBuyerId = buyer;
				vm.criteria.memberBuyerCode = buyerCode; 
				vm.criteria.memberBuyerName = buyerName;
				vm.criteria.supplierId = supplier;
				vm.criteria.supplierName = supplierName;
				vm.criteria.memberSupplierId = supplier;
				vm.criteria.memberSupplierCode = supplierCode; 
				vm.criteria.memberSupplierName = supplierName;
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
						++i;
						value.rowNo = baseRowNo + i;
					});
				});
				if($stateParams.backAction){
		    		$stateParams.backAction = false;
		    	}
			});
		};
		
		function _storeCriteria() {
			angular.copy(vm.criteria, _criteria);
		}

		var _supplierTypeAhead = function (q) {
			q = UIFactory.createCriteria(q);
			if (viewModeData.myOrganize == $stateParams.viewMode) {
				return BuyerCreditInformationService.getItemSuggestSuppliersByBuyerId($rootScope.userInfo.organizeId, q);
			} else {
				return BuyerCreditInformationService.getItemSuggestSuppliers(q);
			}
		}

		var _buyerTypeAhead = function (q) {
			q = UIFactory.createCriteria(q);
			if (viewModeData.partner == $stateParams.viewMode) {
				return BuyerCreditInformationService.getItemSuggestBuyersBySupplierId($rootScope.userInfo.organizeId, q);
			} else {
				return BuyerCreditInformationService.getItemSuggestBuyers(q);
			}
		}

		vm.supplierAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder: 'Enter organization name or code',
			itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
			query: _supplierTypeAhead
		});

		vm.buyerAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder: 'Enter organization name or code',
			itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
			query: _buyerTypeAhead
		});

		// Main of program
		var initLoad = function () {
			var backAction = $stateParams.backAction;
			if(backAction){
				vm.criteria = $stateParams.criteria;
				console.log(vm.criteria);
				if(angular.isDefined(vm.criteria.buyerName) || angular.isDefined(vm.criteria.memberBuyerName)){
					vm.buyer = {buyerId: '', buyerName: '', memberId: '', memberName: '', memberCode: ''};
					vm.buyer.buyerId = vm.criteria.buyerId;
					vm.buyer.buyerName = vm.criteria.buyerName;
					vm.buyer.memberId = vm.criteria.memberBuyerId;
					vm.buyer.memberName = vm.criteria.memberBuyerName;
					vm.buyer.memberCode = vm.criteria.memberBuyerCode;
					BuyerCreditInformationService._prepareItemBuyers(vm.buyer);
				}
				if(angular.isDefined(vm.criteria.supplierName) || angular.isDefined(vm.criteria.memberSupplierName)){
					vm.supplier = {supplierId: '', supplierName: '', memberId: '', memberName: '', memberCode: ''};
					vm.supplier.supplierId = vm.criteria.supplierId;
					vm.supplier.supplierName = vm.criteria.supplierName;
					vm.supplier.memberId = vm.criteria.memberSupplierId;
					vm.supplier.memberName = vm.criteria.memberSupplierName;
					vm.supplier.memberCode = vm.criteria.memberSupplierCode;
					if (viewModeData.myOrganize == $stateParams.viewMode) {
						BuyerCreditInformationService._prepareItemSupplierForBuyer(vm.supplier);
					} else {
						BuyerCreditInformationService._prepareItemSupplier(vm.supplier);
					}
				}
			}
			
			vm.search();
			if (viewModeData.myOrganize == $stateParams.viewMode) {
				vm.showSupplier = true;
				vm.showBuyer = false;
				vm.buyerMode = true;
			} else if (viewModeData.partner == $stateParams.viewMode) {
				vm.showSupplier = false;
				vm.showBuyer = true;
				vm.showButtonSearchBuyer = true;
				vm.supplierMode = true;
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
		
		vm.getAccountNoToDisplay = function(record){
			if(record.format){
				return $filter('accountNoDisplay')(record.accountNo);
			}else{
				return record.accountNo;
			}
			
		}
		
		vm.view = function(data) {
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
				buyerId: data.buyerId,
				supplierId: data.supplierId,
				accountId: data.accountId
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
							headerMessage: 'Inquiry credit information success.',
							bodyMessage: ''
						},
						showOkButton: true,
					});
				} else {
					UIFactory.showFailDialog({
						data: {
							headerMessage: 'Inquiry credit information failure',
							bodyMessage: 'please try again.'
						},
						showOkButton: true,
					});
				}
			}).catch(function (response) {
				blockUI.stop();
				UIFactory.showFailDialog({
					data: {
						headerMessage: 'Inquiry credit information failure',
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