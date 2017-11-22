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
		    sort:'-remittanceTime'
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
//	        vm.listRemittanceAdvice.dateFrom = SCFCommonService.convertDate(dateFrom);
//	        vm.listRemittanceAdvice.dateTo = SCFCommonService.convertDate(dateTo);
	        
	        //set criteria
			vm.criteria.borrowerType = vm.listRemittanceAdvice.remittanceOf;
			if (angular.isObject(vm.buyer)) {
				vm.criteria.buyerId = vm.buyer.organizeId;
			}
			if (angular.isObject(vm.supplier)) {
				vm.criteria.supplierId = vm.supplier.organizeId;
			}
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
			vm.criteria.paidStatus = vm.listRemittanceAdvice.paidStatus || undefined;
			vm.criteria.closeStatus = vm.listRemittanceAdvice.closeStatus || undefined;
			vm.criteria.transactionNo = vm.listRemittanceAdvice.transactionNo || undefined;
			vm.criteria.sort = vm.listRemittanceAdvice.sorting;
			
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
			placeholder: 'Enter organize name or code',
			itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
			query: _supplierTypeAhead
		});
		
		vm.buyerAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder: 'Enter organize name or code',
			itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
			query: _buyerTypeAhead
		});
		
		var _supplierTypeAhead = function (q) {
			q = UIFactory.createCriteria(q);
			console.log("test"+q);
			return RemittanceAdviceBankService.getItemSuggestSuppliers(q);
		}
		
		var _buyerTypeAhead = function (q) {
			q = UIFactory.createCriteria(q);
			console.log("test"+q);
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