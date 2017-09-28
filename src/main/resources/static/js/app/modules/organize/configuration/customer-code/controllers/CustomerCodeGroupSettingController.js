'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('CustomerCodeGroupSettingController', [ '$q','$scope', '$stateParams', 'Service', 'UIFactory', 'CustomerCodeStatus', 'PageNavigation', 'PagingController', '$http', 'ngDialog', '$rootScope',
	function($q, $scope, $stateParams, Service, UIFactory, 
			CustomerCodeStatus, PageNavigation, PagingController, $http, ngDialog, $rootScope) {
	var vm = this;
	
	vm.manageAll=false;
	vm.manageMyOrg=false;
//	var selectedItem;
	
//	var mode = {
//			ALL: 'all',
//			PERSONAL: 'personal'
//	}
	
	var accountingTransactionType = $stateParams.accountingTransactionType;
	var isSetSupplierCode = accountingTransactionType == 'PAYABLE' ? true : false;
	
	var viewMode = $stateParams.viewMode;
	var ownerId = viewMode == 'MY_ORGANIZE' ? $rootScope.userInfo.organizeId : $stateParams.organizeId;
//	var groupId = null;
	vm.criteria = {};
	
	vm.statusDropdown = CustomerCodeStatus;

	vm.backToSponsorConfigPage = function() {
		PageNavigation.gotoPreviousPage();
	}

	var customerCodeName = "Supplier";
    if(!isSetSupplierCode){
    	customerCodeName = "Buyer";
    }
    
	vm.dataTable = {
		identityField:'customerCode',
		columns : [
			{
				fieldName : '$rowNo',
				labelEN : 'No.',
				labelTH : 'ลำดับ',
				sortable : false,
				id : '$rowNo-{value}',
				filterType : 'translate',
				cssTemplate : 'text-right'
			},
			{
				fieldName : 'customerName',
				labelEN : customerCodeName,
				labelTH : customerCodeName,
				sortable : false,
				id : 'customer-{value}',
				filterType : 'translate',
				cssTemplate : 'text-left'
			},
			{
				fieldName : 'customerCode',
				labelEN : customerCodeName+' code',
				labelTH : customerCodeName+' code',
				sortable : false,
				id : 'customer-code-{value}',
				filterType : 'translate',
				cssTemplate : 'text-left'
			},
			{
				fieldName : 'status',
				labelEN : 'Status',
				labelTH : 'Status',
				sortable : false,
				id : 'status-{value}',
				filterType : 'translate',
				filterFormat : 'dd/MM/yyyy',
				cssTemplate : 'text-center'
			},
			{
				fieldName : 'activeDate',
				labelEN : 'Active date',
				labelTH : 'Active date',
				sortable : false,
				id : 'active-date-{value}',
				filterType : 'date',
				filterFormat : 'dd/MM/yyyy',
				cssTemplate : 'text-center'
			},
			{
				fieldName : 'expiryDate',
				labelEN : 'Expire date',
				labelTH : 'Expire date',
				sortable : false,
				id : 'expire-date-{value}',
				filterType : 'date',
				cssTemplate : 'text-center',
				renderer: function(data){
				    return data || '';
				}
			},
			{
				fieldName : 'remark',
				labelEN : 'Remark',
				labelTH : 'Remark',
				sortable : false,
				id : 'remark-{value}',
				cssTemplate : 'text-left'
			},
			{
				labelEN : '',
				labelTH : '',
				sortable : false,
				cssTemplate : 'text-left',
				cellTemplate : '<scf-button id="{{data.customerCode}}-edit-button" class="btn-default gec-btn-action" ng-disabled="ctrl.unauthen()" ng-click="ctrl.customerCodeSetup(data)" title="Setup customer code"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>' +
					'<scf-button id="{{data.customerCode}}-delete-button"  class="btn-default gec-btn-action" ng-disabled="ctrl.unauthen()" ng-click="ctrl.deleteCustomerCode(data)" title="Delete customer code"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
			}
		]
	};
	
	var deleteCustomerCode = function(customerCode){
	    
		var serviceUrl = '/api/v1/organize-customers/'+ ownerId +'/accounting-transactions/'+accountingTransactionType+'/customers/'+customerCode.organizeId+'/customer-codes/' + customerCode.customerCode;
		var deferred = $q.defer();
		$http({
			method : 'POST',
			url : serviceUrl,
			headers : {
				'If-Match' : customerCode.version,
				'X-HTTP-Method-Override': 'DELETE'
			},
			data: customerCode
		  }).then(function(response){
		      return deferred.resolve(response);
		 }).catch(function(response){
		      return deferred.reject(response);
		 });
		 return deferred;
	}
	
	/* Edit a customer code group name */
//	vm.edit = function(model) {
//		
//		vm.editCustCodeDialog = ngDialog.open({
//			id : 'new-customer-code-setting-dialog',
//			template : '/js/app/modules/organize/configuration/customer-code/templates/dialog-edit-customer-code-group.html',
//			className : 'ngdialog-theme-default',
//			scope : $scope,
//			controller : 'CustomerCodeGroupDiaglogController',
//			controllerAs : 'ctrl',
//			data : {
//				sponsorId : $scope.sponsorId,
//				model: vm.model
//			}
//		});
//	}
	
	vm.deleteCustomerCode = function(customerCode){
	    var preCloseCallback = function(confirm) {
	    	vm.search(vm.criteria);
	    }
	    
	    UIFactory.showConfirmDialog({
		data: { 
		    headerMessage: 'Confirm delete?'
		},
		confirm: function(){
		    return deleteCustomerCode(customerCode);
		},
		onFail: function(response){
		    var msg = {404: customerCodeName+' code has been deleted.', 405: customerCodeName+' code has been used.', 409: customerCodeName+' code has been modified.'};
		    UIFactory.showFailDialog({
			data: {
			    headerMessage: 'Delete '+customerCodeName.toLowerCase()+' code fail.',
			    bodyMessage: msg[response.status]?msg[response.status]:response.statusText
			},
			preCloseCallback: preCloseCallback
		    });
		},
		onSuccess: function(response){
		    UIFactory.showSuccessDialog({
			data: {
			    headerMessage: 'Delete '+customerCodeName.toLowerCase()+' code success.',
			    bodyMessage: ''
			},
			preCloseCallback: preCloseCallback
		    });
		}
	    });
	    
	}
	
	vm.searchCriteria = {
			customerCode: '',
			suspend: '',
			status: '',
			organizeId: ''
	}
	var prepareSearchCriteria = function(){
		
		
		vm.searchCriteria.customerCode = vm.criteria.customerCode || '';
		
		if(angular.isDefined(vm.criteria.customer)){
			if(accountingTransactionType=="PAYABLE"){
				vm.searchCriteria.organizeId = vm.criteria.customer.supplierId;
			}else{
				vm.searchCriteria.organizeId = vm.criteria.customer.sponsorId;
			}
		}else{
			vm.searchCriteria.organizeId = '';
		}
		CustomerCodeStatus.forEach(function(item) {
			if(item.value == vm.criteria.status){
				if(item.valueObject == null){
					vm.searchCriteria.suspend = undefined;
					vm.searchCriteria.status = undefined;
				}else{
					vm.searchCriteria.suspend = item.valueObject.suspend;
					vm.searchCriteria.status = item.valueObject.status;
				}
			}
		});		
	}
// vm.pagingController = PagingController.create(customerCodeURL,
// vm.searchCriteria, 'GET');
	
	var queryCustomerCode = function(value){

		var serviceUrl = 'api/v1/organize-customers/' + ownerId + '/trading-partners'
		return $http.get(serviceUrl, {
			params: {
				q : value,
				offset: 0,
				limit: 5,
				accountingTransactionType: accountingTransactionType
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
					item.identity = ['customer-',item.sponsorId,'-option'].join('');
					item.label = [item.sponsorId, ': ',item.sponsorName].join('');
					return item;
				});
			}
		});
	}
	
	vm.customerAutoSuggestModel = UIFactory.createAutoSuggestModel({
		placeholder : 'Enter organize name or code',
		itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
		query: queryCustomerCode
	});

	vm.search = function(criteria) {
		prepareSearchCriteria();
		vm.pagingController.search();
	};

	vm.initialPage = function() {
		
//		groupId = selectedItem.groupId;
//	    vm.model = selectedItem;
//	    vm.sponsorId = selectedItem.ownerId;
	    var customerCodeURL = '/api/v1/organize-customers/'+ ownerId +'/accounting-transactions/'+accountingTransactionType+'/customer-codes';
	    vm.pagingController = PagingController.create(customerCodeURL, vm.searchCriteria, 'GET');
		vm.search();
	}
	
	vm.initialPage();
	
//	if(currentMode == mode.PERSONAL){
//		vm.personalMode = true;
//		var serviceUrl = '/api/v1/organize-customers/' + organizeId + '/accounting-transactions/'+accountingTransactionType+'/customer-code-groups';
//		var serviceDiferred = Service.doGet(serviceUrl, {
//			limit : 1,
//			offset : 0
//		});
//		serviceDiferred.promise.then(function(response) {
//			selectedItem = response.data[0];
//			vm.initialPage(selectedItem);
//
//		}).catch(function(response) {
//			log.error('Load customer code group data error');
//		});
//		
//	}else{
//		vm.personalMode = false;
//		selectedItem = $stateParams.selectedItem;
//		console.log(selectedItem);
//		vm.initialPage(selectedItem);
//	}
	
	var saveCustomerCode = function(customerCode){
		
		var saveCustomerDiferred = '';
		if(vm.isNewCusotmerCode){
//			customerCode.groupId = groupId;
			
			var newCustCodeURL = '/api/v1/organize-customers/'+ ownerId +'/accounting-transactions/'+accountingTransactionType+'/customer-codes';
			saveCustomerDiferred = Service.requestURL(newCustCodeURL, customerCode);
		}else{
			var editCustCodeURL = '/api/v1/organize-customers/'+ ownerId +'/accounting-transactions/'+accountingTransactionType+'/customer-codes/'+ vm.oldCustomerCode;
			saveCustomerDiferred = Service.doPut(editCustCodeURL, customerCode);
		}
		return saveCustomerDiferred;
		
	}
	
	var dialogSuccess, dialogFail = ''
	vm.confirmSaveCustomerCode = function(customerCode){
		var preCloseCallback = function(confirm) {
			vm.search(vm.criteria);
		}
		
		var addMoreBtn = {label:"Add more", id: "add-more-button", action: function(){
			closeDialogSucccess();
			
			vm.customerCodeSetup({
			    organizeId: customerCode.organizeId
			});
		}};
		
		var okBtn = {label: "OK", id: "ok-button", action: function(){
			closeDialogSucccess();
		}};
		var dialogSuccessBtn = [];
		
		if(vm.isNewCusotmerCode){
			dialogSuccessBtn.push(addMoreBtn);
			dialogSuccessBtn.push(okBtn);
		}else{
			dialogSuccessBtn.push(okBtn);
		}
		
		UIFactory.showConfirmDialog({
			data: {
			    headerMessage: 'Confirm save?'
			},
			confirm: function(){
			    return saveCustomerCode(customerCode);
			},
			onFail: function(response){
				var msg = {400:'Customer is not trading partner with this sponsor.', 404: customerCodeName+' code has been deleted.', 405: customerCodeName+' code has been used.', 409: customerCodeName+' code has been modified.'};
			    dialogFail = UIFactory.showFailDialog({
				data: {
				    headerMessage: vm.isNewCusotmerCode?'Add new '+customerCodeName.toLowerCase()+' code fail.':'Edit '+customerCodeName.toLowerCase()+' code fail.',
				    bodyMessage: msg[response.status]?msg[response.status]:response.message
				},
				preCloseCallback: function(){
					preCloseCallback();
				}
			    });
			},
			onSuccess: function(response){
			    closeCustomerCodeSetup();
				dialogSuccess = UIFactory.showSuccessDialog({
				data: {
				    headerMessage: vm.isNewCusotmerCode == true?'Add new '+customerCodeName.toLowerCase()+' code success.':'Edit '+customerCodeName.toLowerCase()+' code complete.',
				    bodyMessage: ''
				},
				preCloseCallback: function(){
					preCloseCallback();
					if(!vm.isNewCusotmerCode){
						closeCustomerCodeSetup();
					}					
				},
				buttons: dialogSuccessBtn
			    });
			}
		    });
	};
	
	vm.customerCodeSetup = function(model){
		vm.isAddMoreCustomerCode = false;
		vm.isNewCusotmerCode = angular.isUndefined(model);
		if(!vm.isNewCusotmerCode){
			vm.isNewCusotmerCode = angular.isUndefined(model.customerCode);
			vm.isAddMoreCustomerCode = vm.isNewCusotmerCode;
			if(!vm.isNewCusotmerCode){
				vm.oldCustomerCode = model.customerCode;
			}
		}
		
		vm.newCustCodeDialog = ngDialog.open({
			template: '/js/app/modules/organize/configuration/customer-code/templates/dialog-new-customer-code.html',
			className: 'ngdialog-theme-default modal-width-60',
			scope : $scope,
			controller : 'CustomerCodeDiaglogController',
			controllerAs : 'ctrl',
			data : {
				sponsorId : ownerId,
				model: model,
				isNewCusotmerCode: vm.isNewCusotmerCode,
				isAddMoreCustomerCode: vm.isAddMoreCustomerCode,
				accountingTransactionType : accountingTransactionType
			},
			preCloseCallback : function(value) {
				if(angular.isDefined(value)){
					vm.confirmSaveCustomerCode(value);
					return false;
				}				
				return true;
			}
		});
	}
	
	var closeCustomerCodeSetup = function(){
		vm.newCustCodeDialog.close();
	}
	var closeDialogSucccess = function(){
		dialogSuccess.close();
	}
	var closeDialogFail = function(){
		dialogFail.close();
	}
	
	vm.unauthen = function(){
		if(vm.manageAll || vm.manageMyOrg){
			return false;
		}else{
			return true;
		}
	}
}
]);
scfApp.constant('CustomerCodeStatus', [
	{
		label : 'All',
		value : '',
		valueObject : null
	},
	{
		label : 'Active',
		value : '1',
		valueObject : {
			suspend : 0,
			status : 'ACTIVE'
		}
	},
	{
		label : 'Suspend',
		value : '2',
		valueObject : {
			suspend : 1,
			status : undefined
		}
	},
	{
		label : 'Expired',
		value : '3',
		valueObject : {
			suspend : 0,
			status : 'EXPIRED'
		}
	},
	{
		label : 'Pending',
		value : '4',
		valueObject : {
			suspend : 0,
			status : 'PENDING'
		}
	}
]);