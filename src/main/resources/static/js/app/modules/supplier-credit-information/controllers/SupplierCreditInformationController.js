'use strict';
var sciModule = angular.module('gecscf.supplierCreditInformation');
sciModule.controller('SupplierCreditInformationController', [
	'$scope',
	'$stateParams',
	'UIFactory',
	'PagingController',
	'SupplierCreditInformationService',
	'SCFCommonService',
	'$http',
	'$q',
	'blockUI',
	function ($scope, $stateParams, UIFactory, PagingController, SupplierCreditInformationService, SCFCommonService, $http, $q, blockUI) {
		var vm = this;

		vm.buyer = $stateParams.buyer || null;
		vm.supplier = $stateParams.supplier || null;
		vm.showSupplier = true;
		vm.data = [];

		vm.search = function () {
			var buyer = undefined;
			var supplier = undefined;
			if (angular.isObject(vm.buyer)) {
				if (angular.isObject(vm.supplier)) {
					buyer = vm.buyer.organizeId;
					supplier = vm.supplier.organizeId;
				} else {
					buyer = vm.buyer.organizeId;
				}
			} else if (angular.isObject(vm.supplier)) {
				supplier = vm.supplier.organizeId;
			} else {
				buyer = null;
				supplier = null;
			}
			var dataSource = $http({ url: '/api/v1/supplier-credit-information', method: 'GET', params: { buyerId: buyer, supplierId: supplier } });
			dataSource.success(function (response) {
				vm.data = response.content;
				var i = 0;
				angular.forEach(vm.data, function (value, idx) {
					if (isSameAccount(value.accountId, vm.data, idx)) {
						value.showAccountFlag = true;
					}
					value.rowNo = ++i;
				});
			});
		};

		// Organize auto suggestion model.
		var _organizeTypeHead = function (q) {
			q = UIFactory.createCriteria(q);
			return SupplierCreditInformationService.getOrganizeByNameOrCodeLike(q);
		}

		vm.organizeAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder: 'Enter organize name or code',
			itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
			query: _organizeTypeHead
		});

		// Main of program
		var initLoad = function () {
			vm.search();
			if("supplier" == $stateParams.party){
				vm.showSupplier = false;
			}
		}();

		vm.decodeBase64 = function (data) {
			return atob(data);
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