'use strict';
var bciModule = angular.module('gecscf.buyerCreditInformation');
bciModule.controller('BuyerCreditInformationController', [
	'$rootScope',
	'$scope',
	'$stateParams',
	'UIFactory',
	'PagingController',
	'BuyerCreditInformationService',
	'SCFCommonService',
	'$http',
	'$q',
	'blockUI',
	'scfFactory',
	'$filter',
	'AccountService',
	function ($rootScope, $scope, $stateParams, UIFactory, PagingController, BuyerCreditInformationService, SCFCommonService, $http, $q, blockUI, scfFactory, $filter, AccountService) {
		var vm = this;
		
		vm.buyer = $stateParams.buyer || null;
		vm.supplier = $stateParams.supplier || null;
		vm.showSupplier = true;
		vm.showBuyer = true;
		vm.showButtonSearchBuyer = false;
		vm.buyerMode = false;
		vm.supplierMode = false;
		vm.data = [];
		vm.criteria = $stateParams.criteria || {};
		vm.pagingController = PagingController.create('/api/v1/buyer-credit-information', vm.criteria,'GET');

        var viewModeData = {
            customer: 'CUSTOMER',
            myOrganize: 'MY_ORGANIZE',
            partner: 'PARTNER'
        }
        
		vm.search = function (pageModel) {
        	var buyerId = undefined;
			var supplierId = undefined;
			var defered = scfFactory.getUserInfo();
			defered.promise.then(function(response){
				var organizeId = response.organizeId;
				if (viewModeData.myOrganize == $stateParams.viewMode) {
					buyerId = organizeId;
					if (angular.isObject(vm.supplier)) {
						supplierId = vm.supplier.supplierId;
					}
				} else if (viewModeData.partner == $stateParams.viewMode) {
					supplierId = organizeId;
					if (angular.isObject(vm.buyer)) {
						console.log(vm.buyer);
						buyerId = vm.buyer.buyerId;
					}
				} else if (viewModeData.customer == $stateParams.viewMode) {
					if (angular.isObject(vm.buyer)) {
						buyerId = vm.buyer.memberId;
					}
					if (angular.isObject(vm.supplier)) {
						supplierId = vm.supplier.memberId;
					}
				} else {
					buyerId = null;
					supplierId = null;
				}
				
				vm.criteria.buyerId = buyerId;
				vm.criteria.supplierId = supplierId;
				vm.pagingController.search(pageModel, function (criteriaData, response) {
					var data = response.data;
					var pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
					var currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
					var i = 0;
					var baseRowNo = pageSize * currentPage; 
					angular.forEach(data, function (value, idx) {
						if (isSameAccount(value.accountId, data, idx)) {
							value.isSameAccount = true;
						}
						++i;
						value.rowNo = baseRowNo+i;
					});
				});
			});
		};

		var _supplierTypeAhead = function (q) {
			q = UIFactory.createCriteria(q);
			if(viewModeData.myOrganize == $stateParams.viewMode){
				return BuyerCreditInformationService.getItemSuggestSuppliersByBuyerId($rootScope.userInfo.organizeId, q);
			} else {
				return BuyerCreditInformationService.getItemSuggestSuppliers(q);
			}
		}
		
		var _buyerTypeAhead = function (q) {
			q = UIFactory.createCriteria(q);
			if(viewModeData.partner == $stateParams.viewMode){
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
			vm.search();
			if(viewModeData.myOrganize == $stateParams.viewMode){
				vm.showSupplier = true;
				vm.showBuyer = false;
				vm.buyerMode = true;
			} else if (viewModeData.partner == $stateParams.viewMode){
				vm.showSupplier = false;
				vm.showBuyer = true;
				vm.showButtonSearchBuyer = true;
				vm.supplierMode = true;
			} 
		}();

		vm.decodeBase64 = function (data) {
			return  (data?atob(data):UIFactory.constants.NOLOGO);
		};

		var isSameAccount = function (accountId, data, index) {
			if (index == 0) {
				return false;
			} else {
				return accountId == data[index - 1].accountId;
			}
		}
		
		vm.enquiryAvailableBalance = function(data){
			blockUI.start("Processing...");
        	var deffered = null;
        	var criteria ={
	           	buyerId: data.buyerId,
				supplierId: data.supplierId,
				accountId: data.accountId
			}
        	
			if(data.accountType == 'LOAN'){
				deffered = AccountService.enquiryCreditLimit(criteria);
			}
			else{
				//overdraft
				deffered = AccountService.enquiryAccountBalance(criteria);
			}
			            	
			deffered.promise.then(function(response) {
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

		vm.getAccountNoToDisplay = function(record){
			if(record.format){
				return $filter('accountNoDisplay')(record.accountNo);
			}else{
				return record.accountNo;
			}
			
		}
	}]);