'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller("CustomerCodeDiaglogController", ['$scope', '$rootScope', 'UIFactory', '$http', 'SCFCommonService', function($scope, $rootScope, UIFactory, $http, SCFCommonService) {
	var vm = this;
	var ownerId = $scope.ngDialogData.sponsorId;
	$scope.errors = {};
	vm.submitForm = false;
	vm.model = angular.copy($scope.ngDialogData.model);
	vm.isNewCusotmerCode = $scope.ngDialogData.isNewCusotmerCode;
	vm.isAddMoreCustomerCode = $scope.ngDialogData.isAddMoreCustomerCode;

	var accountingTransactionType = angular.copy($scope.ngDialogData.accountingTransactionType);
	vm.isSetSupplierCode = accountingTransactionType == 'PAYABLE' ? true : false;
	vm.headerMessage = vm.isSetSupplierCode ? "supplier" : "buyer";
	vm.isUseExpireDate = false;
	vm.isOpenActiveDate = false;
	vm.isOpenExpiryDate = false;
	vm.dateFormat = "dd/MM/yyyy";
	vm.customerSuggestModel = '';

	vm.initialLabel = vm.isSetSupplierCode ? {
		customer : "Supplier",
		customerCode : "Supplier code"
	} : {
		customer : "Buyer",
		customerCode : "Buyer code"
	};
	
	
	vm.invalideExpiryDate = false;
	
	vm.openActiveDate = function(){
		vm.isOpenActiveDate = true;
	}
	vm.openExpiryDate = function(){
		vm.isOpenExpiryDate = true;
	}
	
	var queryCustomerCode = function(value){
		var serviceUrl = 'api/v1/organize-customers/' + ownerId + '/trading-partners'
		return $http.get(serviceUrl, {
			params: {
				q : value,
				offset: 0,
				limit: 5,
				accountingTransactionType : accountingTransactionType
			}
		}).then(function(response){
			if(accountingTransactionType=="PAYABLE"){
				return response.data.map(function(item) {	
					item.identity = ['customer-',item.supplierId,'-option'].join('');
					item.label = [item.supplierId, ': ',item.supplierName].join('');
					return item;
				});
			}else{
				return response.data.map(function(item) {	
					item.identity = ['customer-',item.buyerId,'-option'].join('');
					item.label = [item.buyerId, ': ',item.buyerName].join('');
					return item;
				});
			}
			
		});
	}
	
	var getCurrentDate = function(){
		var differed = $http.get('api/v1/date');
		return differed;
	}
	
	var prepreOrganizeDisplay= function(){
		var customerCodeQuery = queryCustomerCode(vm.model.organizeId);
		customerCodeQuery.then(function(values){
			values.forEach(function(value){
				if(accountingTransactionType=="PAYABLE"){
					if(value.supplierId == vm.model.organizeId){
						vm.customerSuggestModel = value;
					}
				}else{
					if(value.buyerId == vm.model.organizeId){
						vm.customerSuggestModel = value;
					}
				}
			});			
		});
	}
		
	var initialData = function(){
		var organizeIdInitial = null;
		if(vm.isNewCusotmerCode){
			if(vm.isAddMoreCustomerCode){
				organizeIdInitial = vm.model.organizeId;
				prepreOrganizeDisplay();
			}
			
			vm.model = {
				activeDate: new Date(),
				suspend: false,
				organizeId: organizeIdInitial
			}
			
			var currentDate = getCurrentDate();
			currentDate.then(function(response){
				vm.model.activeDate = new Date(response.data.currentDate);
			});		
			
		}else{
			if(vm.model.activeDate != null){
				vm.model.activeDate = new Date(vm.model.activeDate);
			}else{
				vm.model.activeDate = null;
			}
			
			if(vm.model.expiryDate != null){
		        vm.model.expiryDate = new Date(vm.model.expiryDate);
				vm.isUseExpireDate = true;
			}
			
			prepreOrganizeDisplay();
		}
	}();
	
	vm.checkUseExpiryDate = function(){
		if(vm.isUseExpireDate){
			vm.model.expiryDate = new Date();
		}else{
			vm.model.expiryDate = null;
		}
	}
	
	vm.customerAutoSuggest = UIFactory.createAutoSuggestModel({
		placeholder : 'Enter organization name or code',
		itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
		query: queryCustomerCode
	});
	
	vm.saveCustomer = function(){
		var validatePass = true;
		vm.wrongDateFormat = false;
		vm.invalideExpiryDate = false;
		
		if(angular.isDefined(vm.customerSuggestModel)){
			if(accountingTransactionType=="PAYABLE"){
				vm.model.organizeId = vm.customerSuggestModel.supplierId;
			}else{
				vm.model.organizeId = vm.customerSuggestModel.buyerId;
			}
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