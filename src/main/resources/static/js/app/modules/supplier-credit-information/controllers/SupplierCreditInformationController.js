'use strict';
var sciModule = angular.module('gecscf.supplierCreditInformation');
sciModule.controller('SupplierCreditInformationController', [
	'$rootScope',
	'$scope',
	'$stateParams',
	'UIFactory',
	'PagingController',
	'SupplierCreditInformationService',
	'SCFCommonService',
	'$http',
	'$q',
	'blockUI',
	'scfFactory',
	function ($rootScope, $scope, $stateParams, UIFactory, PagingController, SupplierCreditInformationService, SCFCommonService, $http, $q, blockUI,scfFactory) {
		var vm = this;
		
		vm.buyer = $stateParams.buyer || null;
		vm.supplier = $stateParams.supplier || null;
		vm.showSupplier = true;
		vm.data = [];
		vm.criteria = $stateParams.criteria || {};
		vm.pagingController = PagingController.create('/api/v1/supplier-credit-information', vm.criteria,'GET');
		
        var viewModeData = {
            myOrganize: 'MY_ORGANIZE',
            customer: 'CUSTOMER'
        }
        
		vm.search = function (pageModel) {
        	var buyer = undefined;
			var supplier = undefined;
			var defered = scfFactory.getUserInfo();
				defered.promise.then(function(response){
			var organizeId = response.organizeId;
				// mode MY_ORGANIZE
				if(viewModeData.myOrganize == $stateParams.viewMode){
					supplier = organizeId;
					if (angular.isObject(vm.buyer)) {
						buyer = vm.buyer.sponsorId;
					}
				} else {
					// mode CUSTOMER
					if (angular.isObject(vm.buyer)) {
						buyer = vm.buyer.memberId;
					}
					if (angular.isObject(vm.supplier)) {
						supplier = vm.supplier.memberId;
					}
				}
				
				vm.criteria.buyerId = buyer;
				vm.criteria.supplierId = supplier;
				vm.pagingController.search(pageModel, function (criteriaData, response) {
					var data = response.data;
					var pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
					var currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
					var i = 0;
					var baseRowNo = pageSize * currentPage; 
					angular.forEach(data, function (value, idx) {
						if (isSameAccount(value.accountId, data, idx)) {
							
							value.showAccountFlag = true;
						}
						++i;
						value.rowNo = baseRowNo+i;
					});
				});
			});
		};

		// Organize auto suggestion model.
		var _organizeTypeHead = function (q) {
			q = UIFactory.createCriteria(q);
			return SupplierCreditInformationService.getOrganizeByNameOrCodeLike(q);
		}
		
		var _buyerTypeHead = function (q) {
			q = UIFactory.createCriteria(q);
			if(viewModeData.myOrganize == $stateParams.viewMode){
				return SupplierCreditInformationService.getBuyerNameOrCodeLike($rootScope.userInfo.organizeId,q);
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
			vm.search();
			if(viewModeData.myOrganize == $stateParams.viewMode){
				vm.showSupplier = false;
			}
		}();

		vm.decodeBase64 = function (data) {
			return  (data?atob(data):UIFactory.constants.NOLOGO);
		};

		var isSameAccount = function (accountId, data, index) {
			if (index == 0) {
				return true;
			} else {
				return accountId != data[index - 1].accountId;
			}
		}
	
		function inquiryAccountToApi(tpAccountModel) {
			var deffered = $q.defer();
			$http({
				url: '/api/v1/supplier-credit-information/' + tpAccountModel.accountId + '/inquiry',
				method: 'POST',
				data: tpAccountModel
			}).then(function (response) {
				deffered.resolve(response);
			}).catch(function (response) {
				deffered.reject(response);
			});
			return deffered;
		}

		function getRecordIndexByAccountId(accountId) {
			for (var i = 0; i < vm.data.length; ++i) {
				if (vm.data[i].accountId == accountId) {
					return i;
				}
			}
			return -1;
		}

		vm.inquiryAccount = function (record) {
			blockUI.start("Processing...");
			var deffered = $q.defer();
			var tpAccountModel = {
				accountId: record.accountId,
				sponsorId: record.buyerId,
				supplierId: record.supplierId
			}
			var inquiryAccountDeffered = inquiryAccountToApi(tpAccountModel);
			inquiryAccountDeffered.promise.then(function (response) {
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

	}]);