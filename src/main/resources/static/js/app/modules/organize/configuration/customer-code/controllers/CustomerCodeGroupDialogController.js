'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller("CustomerCodeDiaglogController", ['$scope', '$rootScope', 'UIFactory', '$http', 'SCFCommonService', function($scope, $rootScope, UIFactory, $http, SCFCommonService) {
	var vm = this;
	var sponsorId = $scope.ngDialogData.sponsorId;
	$scope.errors = {};
	vm.submitForm = false;
	vm.model = angular.copy($scope.ngDialogData.model);
	vm.isNewCusotmerCode = $scope.ngDialogData.isNewCusotmerCode;
	vm.isAddMoreCustomerCode = $scope.ngDialogData.isAddMoreCustomerCode;
	vm.isUseExpireDate = false;
	vm.isOpenActiveDate = false;
	vm.isOpenExpiryDate = false;
	vm.dateFormat = "dd/MM/yyyy";
	vm.customerSuggestModel = '';
	
	
	vm.invalideExpiryDate = false;
	
	vm.openActiveDate = function(){
		vm.isOpenActiveDate = true;
	}
	vm.openExpiryDate = function(){
		vm.isOpenExpiryDate = true;
	}
	
	var queryCustomerCode = function(value){

		var serviceUrl = 'api/v1/organize-customers/' + sponsorId + '/trading-partners'
		return $http.get(serviceUrl, {
			params: {
				q : value,
				offset: 0,
				limit: 5
			}
		}).then(function(response){
			return response.data.map(function(item) {	
				item.identity = ['customer-',item.supplierId,'-option'].join('');
				item.label = [item.supplierId, ': ',item.supplierName].join('');
				return item;
			});
		});
	}
	
	var getCurrentDate = function(){
		var differed = $http.get('api/v1/date');
		return differed;
	}
	
	var prepreSupplierDisplay= function(){
		var customerCodeQuery = queryCustomerCode(vm.model.organizeId);
		customerCodeQuery.then(function(values){
			values.forEach(function(value){
				if(value.supplierId == vm.model.organizeId){
					vm.customerSuggestModel = value;
				}
			});			
		});
	}
		
	var initialData = function(){
		var supplierIdInitial = null;
		if(vm.isNewCusotmerCode){
			if(vm.isAddMoreCustomerCode){
				supplierIdInitial = vm.model.organizeId;
				prepreSupplierDisplay();
			}
			
			vm.model = {
				activeDate: new Date(),
				suspend: false,
				organizeId: supplierIdInitial
			}
			
			var currentDate = getCurrentDate();
			currentDate.then(function(response){
				vm.model.activeDate = new Date(response.data.currentDate);
			});		
			
		}else{

			// vm.model.activeDate =
			// SCFCommonService.convertStringTodate(vm.model.activeDate);
			if(vm.model.activeDate != null){
				vm.model.activeDate = new Date(vm.model.activeDate);
			}else{
				vm.model.activeDate = null;
			}
			
			if(vm.model.expiryDate != null){
				// vm.model.expiryDate =
				// SCFCommonService.convertStringTodate(vm.model.expiryDate);
		        vm.model.expiryDate = new Date(vm.model.expiryDate);
				vm.isUseExpireDate = true;
			}
			
			prepreSupplierDisplay();
		}
	}
	
	initialData();
	
	vm.checkUseExpiryDate = function(){
		if(vm.isUseExpireDate){
			vm.model.expiryDate = new Date();
		}else{
			vm.model.expiryDate = null;
		}
	}
	
	vm.customerAutoSuggest = UIFactory.createAutoSuggestModel({
		placeholder : 'Enter organize name or code',
		itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
		query: queryCustomerCode
	});
	
	vm.saveCustomer = function(){
		var validatePass = true;
		vm.wrongDateFormat = false;
		vm.invalideExpiryDate = false;
		
		if(angular.isDefined(vm.customerSuggestModel)){
			vm.model.organizeId = vm.customerSuggestModel.supplierId;
		}
		
		if($scope.newEditCustCode.customer.$error.required){
			validatePass = false;
		}
		
		if($scope.newEditCustCode.supplier.$error.required){
			validatePass = false;
		}

		$scope.errors.activeDate = false;
		$scope.errors.activeDateLessThan = false;
		$scope.errors.expiryDate = false;
		
		if (!angular.isDefined(vm.model.activeDate)) {
			validatePass = false;
		    $scope.errors.activeDate = {
	    		message : 'Wrong date format data.'
		    }
		}else if(vm.model.activeDate =='' || vm.model.activeDate == null){
			validatePass = false;
		    $scope.errors.activeDate = {
	    		message : 'Active date is required.'
		    }
		}
		
		if (vm.isUseExpireDate) {
			if (!angular.isDefined(vm.model.expiryDate)) {
		    	validatePass = false;
				$scope.errors.expiryDate = {
				    message : 'Wrong date format data.'
				}
		    }else if(vm.model.expiryDate == null|| vm.model.expiryDate ==''){				    	
		    	validatePass = false;
			    $scope.errors.expiryDate = {
		    		message : 'Expire date is required.'
			    }
		    }else if (angular.isDefined(vm.model.activeDate)
				    && vm.model.expiryDate < vm.model.activeDate) {
		    	validatePass = false;
		    	$scope.errors.activeDateLessThan = {
				    message : 'Active date must be less than or equal to expire date.'
				}
			}
		}
		
		if(validatePass){
			$scope.closeThisDialog(vm.model);
		}
	}
}]);