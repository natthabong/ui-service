'use strict';
var sciModule = angular.module('gecscf.supplierCreditInformation');
sciModule.controller('ViewSupplierCreditInformationController', [
	'$rootScope',
	'$scope',
	'$stateParams',
	'UIFactory',
	'PagingController',
	'SupplierCreditInformationService',
	'$timeout',
	'SCFCommonService',
	'$http',
	'$q',
	'blockUI',
	'scfFactory',
	'PageNavigation', 
	'$filter',
	'AccountService',
	function ($rootScope, $scope, $stateParams, UIFactory, PagingController, SupplierCreditInformationService, $timeout, SCFCommonService, $http, $q, blockUI,scfFactory,PageNavigation, $filter, AccountService) {
		var vm = this;
		vm.accountId = $stateParams.accountId || null;
		vm.data = [];
		vm.tradeFinanceModel = {};
		var _criteria = {};
		vm.pagingController = PagingController.create('/api/v1/supplier-credit-information/accounts/'+vm.accountId, _criteria,'GET');
		
        vm.viewAction = false;
        vm.unauthenView = function() {
            if (vm.viewAction) {
                return false;
            } else {
                return true;
            }
        }
        
		vm.search = function (pageModel) {
        	var accountId = undefined;
			var defered = scfFactory.getUserInfo();
			defered.promise.then(function(response){
				vm.pagingController.search(pageModel, function (criteriaData, response) {
					var data = response.data;
					var pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
					var currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
					var i = 0;
					var baseRowNo = pageSize * currentPage; 
					angular.forEach(data, function (value, idx) {
						if(isSameSupplier(value.supplierId, data, idx)){
							value.showSupplierFlag = true;
						}
						if (isSameAccount(value.accountId, data, idx)) {
							value.showAccountFlag = true;
						}
						++i;
						value.rowNo = baseRowNo+i;
					});
					
					var item = response.data[0];
					vm.tradeFinanceModel.accountNo = vm.getAccountNoToDisplay(item);
					vm.tradeFinanceModel.format = item.format;
					vm.tradeFinanceModel.accountType = item.accountType;
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
			return  (data?atob(data):UIFactory.constants.NOLOGO);
		};

		var isSameSupplier = function (supplierId, data, index) {
			if (index == 0) {
				return true;
			} else {
				return supplierId != data[index - 1].supplierId;
			}
		}
		
		var isSameAccount = function (accountId, data, index) {
			if (index == 0) {
				return true;
			} else {
				return accountId != data[index - 1].accountId;
			}
		}
	
		vm.getAccountNoToDisplay = function(record){
			if(record.format){
				return $filter('accountNoDisplay')(record.accountNo);
			}else{
				return record.accountNo;
			}
			
		}
		
		vm.getPayeeAccountNoToDisplay = function(record){
			if(record.formatPayeeAccount){
				return $filter('accountNoDisplay')(record.payeeAccountNo);
			}else{
				return record.payeeAccountNo;
			}
			
		}
		
		vm.back = function(){
			$timeout(function () {
                PageNavigation.backStep();
            }, 10);
		}
	}]);