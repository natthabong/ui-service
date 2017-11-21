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
	function ($rootScope, $scope, $stateParams, UIFactory, PagingController, RemittanceAdviceBankService, SCFCommonService, $http, $q) {
		var vm = this;
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
		
		// Datepicker
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
		
		vm.buyerTxtDisable = false;
		vm.supplierTxtDisable = false;
		
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
			return RemittanceAdviceBankService.getItemSuggestSuppliers(q);
		}
		
		var _buyerTypeAhead = function (q) {
			q = UIFactory.createCriteria(q);
			return RemittanceAdviceBankService.getItemSuggestBuyers(q);
		}
		
		vm.buyer = $stateParams.buyer || null;
		vm.supplier = $stateParams.supplier || null;
		
		vm.criteria = $stateParams.criteria || {};
		vm.pagingController = PagingController.create('/api/v1/remittance-advices', vm.criteria,'GET');
    
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
	        vm.listRemittanceAdvice.dateFrom = SCFCommonService.convertDate(dateFrom);
	        vm.listRemittanceAdvice.dateTo = SCFCommonService.convertDate(dateTo);
	        
	        //set criteria
			vm.criteria.borrowerType = vm.listRemittanceAdvice.remittanceOf;
			if (angular.isObject(vm.buyer)) {
				vm.criteria.buyerId = vm.buyer.organizeId;
			}
			if (angular.isObject(vm.supplier)) {
				vm.criteria.supplierId = vm.supplier.organizeId;
			}
			if('effectiveDate' == vm.listRemittanceAdvice.dateType){
				vm.criteria.effectiveDateFrom = vm.listRemittanceAdvice.dateFrom;
				vm.criteria.effectiveDateTo = vm.listRemittanceAdvice.dateTo;
			} else if('maturityDate' == vm.listRemittanceAdvice.dateType){
				vm.criteria.maturityDateFrom = vm.listRemittanceAdvice.dateFrom;
				vm.criteria.maturityDateTo = vm.listRemittanceAdvice.dateTo;
			} else {
				vm.criteria.remittanceDateFrom = vm.listRemittanceAdvice.dateFrom;
				vm.criteria.remittanceDateTo = vm.listRemittanceAdvice.dateTo;
			}	
			vm.criteria.paidStatus = vm.listRemittanceAdvice.paidStatus;
			vm.criteria.closeStatus = vm.listRemittanceAdvice.closeStatus;
			vm.criteria.transactionNo = vm.listRemittanceAdvice.transactionNo;
			vm.criteria.sorting = vm.listRemittanceAdvice.sorting;
			
			vm.pagingController.search(pageModel, function (criteriaData, response) {
				var data = response.data;
				var pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
				var currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
				var i = 0;
				var baseRowNo = pageSize * currentPage; 
				angular.forEach(data, function (value, idx) {
					value.rowNo = baseRowNo+i;
				});
			});
		};

		// Main of program
		var initLoad = function () {
			vm.showBuyer = true;
			vm.searchRemittanceAdvice();		
		}();

	}]);