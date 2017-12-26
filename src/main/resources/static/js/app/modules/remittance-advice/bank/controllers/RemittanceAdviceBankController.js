'use strict';
var sciModule = angular.module('gecscf.remittanceAdviceBank');
sciModule.controller('RemittanceAdviceBankController', [
	'$rootScope',
	'$scope',
	'$stateParams',
	'UIFactory',
	'PagingController',
	'RemittanceAdviceBankService',
	'SCFCommonService',
	'$http',
	'$q',
	'blockUI',
	function ($rootScope, $scope, $stateParams, UIFactory, PagingController, RemittanceAdviceBankService, SCFCommonService, $http, $q,blockUI) {
		var vm = this;
		vm.buyer = $stateParams.buyer || null;
		vm.supplier = $stateParams.supplier || null;
		vm.criteria = $stateParams.criteria || {};
		vm.pagingController = PagingController.create('/api/v1/remittance-advices', vm.criteria,'GET');
		vm.dateSelected = {
			effectiveDate: 'effectiveDate',
			maturityDate: 'maturityDate',
			remittanceDate: 'remittanceDate'
		}
		vm.listRemittanceAdvice = {
		    dateType: vm.dateSelected.effectiveDate,
		    dateFrom: '',
		    dateTo: '',
		    remittanceOf: 'BUYER',   
		    paidStatus: '',
			transactionNo:'',
			closeStatus: '',
		    sort:'-remittanceTime,-remittanceNo'
		}
		vm.dateModel = {
			dateFrom: '',
			dateTo: ''
		}
		vm.showBuyer = false;
		vm.showSupplier = false;
		
		// Date picker
		vm.openDateFrom = false;
		vm.dateFormat = 'dd/MM/yyyy';
		vm.openDateTo = false;
		vm.openCalendarDateFrom = function(){
			vm.openDateFrom = true;
		};
		
		vm.openCalendarDateTo = function(){
			vm.openDateTo = true;
		};
		
		vm.remittanceOfDropdown = [
			{label: 'Buyer',value: 'BUYER'},
			{label: 'Supplier',value: 'SUPPLIER'}];
		
		vm.paidStatusDropdown = [
			{label: 'All',value: ''},
			{label: 'P : Paid',value: 'P'},
			{label: 'OD : Overdue',value: 'OD'},
			{label: 'POD : Paid Overdue',value: 'POD'},
			{label: 'NL : Non Accrual Loan',value: 'NL'},
			{label: 'PNL : Paid NAL',value: 'PNL'}];
		
		vm.closeStatusDropdown = [
			{label: 'All',value: ''},
			{label: 'C : Close',value: 'C'},
			{label: 'O : Open',value: 'O'}];
		
		vm.searchRemittanceAdvice = function (pageModel) {
			var buyerId = undefined;
			var supplierId = undefined;
			vm.invalidDateCriteria = false;
			vm.invalidDateCriteriaMsg = '';
			var dateFrom = vm.dateModel.dateFrom;
	        var dateTo = vm.dateModel.dateTo;
	        if (angular.isUndefined(dateFrom)) {
				vm.invalidDateCriteria = true;
				vm.invalidDateCriteriaMsg = {
	                message : 'Wrong date format data.'
	            }
			}
			if (angular.isUndefined(dateTo)) {
				vm.invalidDateCriteria = true;
				vm.invalidDateCriteriaMsg = {
	                message : 'Wrong date format data.'
	            }
			}
			if(dateFrom != '' &&  dateFrom != null && dateTo != '' && dateTo != null){
				var dateTimeFrom = new Date(dateFrom);
				var dateTimeTo = new Date(dateTo);
				if(dateTimeFrom > dateTimeTo){
					vm.invalidDateCriteria = true;
					vm.invalidDateCriteriaMsg = {
	                    message : 'From date must be less than or equal to To date.'
	                }
				}
			}
	        vm.listRemittanceAdvice.dateFrom = dateFrom;
	        vm.listRemittanceAdvice.dateTo = dateTo;
	        
	        //set criteria
			vm.criteria.borrowerType = vm.listRemittanceAdvice.remittanceOf;
			if (angular.isObject(vm.buyer)) {
				buyerId = vm.buyer.organizeId;
			}
			if (angular.isObject(vm.supplier)) {
				supplierId = vm.supplier.organizeId;
			}
			
			// Clear previous criteria
			vm.criteria.effectiveDateFrom = undefined;
			vm.criteria.effectiveDateTo = undefined;
			vm.criteria.maturityDateFrom = undefined;
			vm.criteria.maturityDateTo = undefined;
			vm.criteria.remittanceDateFrom = undefined;
			vm.criteria.remittanceDateTo = undefined;
			if('effectiveDate' == vm.listRemittanceAdvice.dateType){
				vm.criteria.effectiveDateFrom = vm.listRemittanceAdvice.dateFrom || undefined;
				vm.criteria.effectiveDateTo = vm.listRemittanceAdvice.dateTo || undefined;
			} else if('maturityDate' == vm.listRemittanceAdvice.dateType){
				vm.criteria.maturityDateFrom = vm.listRemittanceAdvice.dateFrom || undefined;
				vm.criteria.maturityDateTo = vm.listRemittanceAdvice.dateTo || undefined;
			} else {
				vm.criteria.remittanceDateFrom = vm.listRemittanceAdvice.dateFrom || undefined;
				vm.criteria.remittanceDateTo = vm.listRemittanceAdvice.dateTo || undefined;
			}	
			vm.criteria.buyerId = buyerId;
			vm.criteria.supplierId = supplierId;
			vm.criteria.paidStatus = vm.listRemittanceAdvice.paidStatus || undefined;
			vm.criteria.closeStatus = vm.listRemittanceAdvice.closeStatus || undefined;
			vm.criteria.transactionNo = vm.listRemittanceAdvice.transactionNo || undefined;
			vm.criteria.sort = vm.listRemittanceAdvice.sort;
			
			vm.pagingController.search(pageModel, function (criteriaData, response) {
				var data = response.data;
				var pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
				var currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
				var i = 0;
				var baseRowNo = pageSize * currentPage; 
				angular.forEach(data, function (value, idx) {
					i++;
					value.rowNo = baseRowNo+i;
				});
			});
		};

		
		
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
		
		 function _supplierTypeAhead(q) {
			q = UIFactory.createCriteria(q);
			return RemittanceAdviceBankService.getItemSuggestSuppliers(q);
		}
		
		 function _buyerTypeAhead(q) {
			q = UIFactory.createCriteria(q);
			return RemittanceAdviceBankService.getItemSuggestBuyers(q);
		}
		
		// Main of program
		var initLoad = function () {
			vm.showBuyer = true;
			vm.searchRemittanceAdvice();		
		}();

		vm.onSelectRemittance = function () {
			if(vm.listRemittanceAdvice.remittanceOf == 'BUYER'){
				vm.showBuyer = true;
				vm.showSupplier = false;
			} else{
				vm.showBuyer = false;
				vm.showSupplier = true;
			}
			vm.searchRemittanceAdvice();	
		}
		
	}]);