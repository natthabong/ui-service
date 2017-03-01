'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller(
	'CustomerCodeGroupController',
	[
		'SCFCommonService',
		'$log',
		'$scope',
		'$stateParams',
		'$timeout',
		'PageNavigation',
		'Service',
		'ngDialog',
		function(SCFCommonService, $log, $scope, $stateParams, $timeout,
			PageNavigation, Service, ngDialog) {
			var vm = this;
			var log = $log;

			vm.pageModel = {
				pageSizeSelectModel : '20',
				totalRecord : 0,
				currentPage : 0,
				clearSortOrder : false,
				page : 0,
				pageSize : 20
			};

			vm.pageSizeList = [ {
				label : '10',
				value : '10'
			}, {
				label : '20',
				value : '20'
			}, {
				label : '50',
				value : '50'
			} ];


			vm.decodeBase64 = function(data) {
				if (angular.isUndefined(data)) {
					return '';
				}
				return atob(data);
			}

			vm.dataTable = {
				options : {
				},
				columns : [
					{
						field : 'groupName',
						label : 'Group Name',
						idValueField : 'groupName',
						id : 'customer-code-group-{value}-group-name',
						sortData : true,
						cssTemplate : 'text-left',
					}, {
						field : '',
						label : '',
						cssTemplate : 'text-center',
						sortData : false,
						cellTemplate : '<scf-button id="customer-code-group-{{data.groupName}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="Config a customer code groups" ng-hide="!data.completed"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>' +
							'<scf-button id="customer-code-group-{{data.groupName}}-warning-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="Config a customer code groups" ng-hide="data.completed"><img ng-hide="data.completed" data-ng-src="img/gear_warning.png" style="height: 13px; width: 14px;"/></scf-button>' +
							'<scf-button class="btn-default gec-btn-action" ng-disabled="true" ng-click="ctrl.search()" title="Delete a file layout"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
					} ]
			};

			vm.data = []

			vm.search = function() {
				var serviceUrl = '/api/v1/organize-customers/' + $scope.sponsorId + '/sponsor-configs/SFP/customer-code-groups';
				var serviceDiferred = Service.doGet(serviceUrl, {
					limit : vm.pageModel.pageSizeSelectModel,
					offset : vm.pageModel.currentPage
				});

				serviceDiferred.promise.then(function(response) {
					vm.data = response.data;
					vm.pageModel.totalRecord = response.headers('X-Total-Count');
					vm.pageModel.totalPage = response.headers('X-Total-Page');
					vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
				}).catch(function(response) {
					log.error('Load customer code group data error');
				});
			}

			vm.addNew = function() {
				vm.newCustCodeDialog = ngDialog.open({
					id : 'new-customer-code-setting-dialog',
					template : '/js/app/modules/sponsor-config/customer-code-groups/dialog-new-customer-code-group.html',
					className : 'ngdialog-theme-default',
					scope : $scope,
					controller : 'CustomerCodeGroupDiaglogController',
					controllerAs : 'ctrl',
					data : {
						sponsorId : $scope.sponsorId
					},
					preCloseCallback : function(value) {
						if (value != null) {
							vm.search();
						}
						return true;
					}
				});
			};

			vm.config = function(customerCodeGroup) {
				var params = {
					selectedItem : customerCodeGroup
				};
				PageNavigation.gotoPage('/sponsor-configuration/customer-code-groups/settings', params)
			}

			vm.initLoad = function() {
				vm.pageModel.currentPage = 0;
				vm.pageModel.pageSizeSelectModel = '20';

				vm.search();
			}

			vm.initLoad();
		} ]);
scfApp.controller('CustomerCodeGroupDiaglogController',
	[
		'SCFCommonService',
		'$log',
		'$scope',
		'$stateParams',
		'$timeout',
		'PageNavigation',
		'Service',
		'blockUI',
		function(SCFCommonService, $log, $scope, $stateParams, $timeout,
			PageNavigation, Service, blockUI) {

			var vm = this;
			vm.sponsorId = $scope.sponsorId;
			if($scope.ngDialogData.model !=null){
				vm.customerCodeGroupRequest = $scope.ngDialogData.model;
			}
			
			vm.saveNewCustomerGroup = function() {
				blockUI.start();
				vm.customerCodeGroupRequest.sponsorId = vm.sponsorId;
				vm.customerCodeGroupRequest.completed = false;

				var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/customer-code-groups';

				var serviceDiferred = Service.requestURL(serviceUrl, vm.customerCodeGroupRequest, 'POST');
				serviceDiferred.promise.then(function(response) {
					blockUI.stop();
					if (response !== undefined) {
						if (response.message !== undefined) {
							vm.messageError = response.message;
						} else {
							$scope.closeThisDialog(response);
						}
					}
				}).catch(function(response) {
					blockUI.stop();
					$log.error('Save customer Code Group Fail');
				});
			};
			
			vm.saveCustomerGroup = function() {
				blockUI.start();
				var groupId = vm.customerCodeGroupRequest.groupId;
				var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/customer-code-groups/'+groupId;
				
				var serviceDiferred = Service.requestURL(serviceUrl, vm.customerCodeGroupRequest, 'PUT');
				serviceDiferred.promise.then(function(response) {
					blockUI.stop();
					if (response !== undefined) {
						if (response.message !== undefined) {
							vm.messageError = response.message;
						} else {
							$scope.closeThisDialog(response);
						}
					}
				}).catch(function(response) {
					blockUI.stop();
					$log.error('Save customer Code Group Fail');
				});
			};

		} ])
scfApp.controller('CustomerCodeGroupSettingController', [ '$q','$scope', '$stateParams', 'Service', 'UIFactory', 'CustomerCodeStatus', 'PageNavigation', 'PagingController', '$http', 'ngDialog', 
	function($q, $scope, $stateParams, Service, UIFactory, 
			CustomerCodeStatus, PageNavigation, PagingController, $http, ngDialog) {
	var vm = this;
	var selectedItem = $stateParams.selectedItem;
	var groupId = selectedItem.groupId;
	vm.model = selectedItem;
	vm.sponsorId = selectedItem.sponsorId;
	vm.criteria = {};

	var customerCodeURL = '/api/v1/organize-customers/'+ vm.sponsorId +'/sponsor-configs/SFP/customer-code-groups/'+groupId+'/customer-codes';
	
	vm.statusDropdown = CustomerCodeStatus;

	vm.backToSponsorConfigPage = function() {
		PageNavigation.gotoPreviousPage();
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
				labelEN : 'Customer',
				labelTH : 'Customer',
				sortable : false,
				id : 'customer-{value}',
				filterType : 'translate',
				cssTemplate : 'text-left'
			},
			{
				fieldName : 'customerCode',
				labelEN : 'Customer code',
				labelTH : 'Customer code',
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
				    return data || '-';
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
				cellTemplate : '<scf-button id="{{data.customerCode}}-edit-button" class="btn-default gec-btn-action" ng-click="ctrl.customerCodeSetup(data)" title="Setup customer code"><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></scf-button>' +
					'<scf-button id="{{data.customerCode}}-delete-button"  class="btn-default gec-btn-action" ng-click="ctrl.deleteCustomerCode(data)" title="Delete customer code"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
			}
		]
	};
	
	var deleteCustomerCode = function(customerCode){
	    
		var serviceUrl = '/api/v1/organize-customers/'+ vm.sponsorId +'/sponsor-configs/SFP/customer-code-groups/'+groupId+'/customers/'+customerCode.supplierId+'/customer-codes/' + customerCode.customerCode;
		var deferred = $q.defer();
		$http({
		    method: 'DELETE',
		    url: serviceUrl
		  }).then(function(response){
		      return deferred.resolve(response);
		 }).catch(function(response){
		      return deferred.reject(response);
		 });
		 return deferred;
	}
	
	/* Edit a customer code group name */
	vm.edit = function(model) {
		
		vm.editCustCodeDialog = ngDialog.open({
			id : 'new-customer-code-setting-dialog',
			template : '/js/app/modules/sponsor-config/customer-code-groups/dialog-edit-customer-code-group.html',
			className : 'ngdialog-theme-default',
			scope : $scope,
			controller : 'CustomerCodeGroupDiaglogController',
			controllerAs : 'ctrl',
			data : {
				sponsorId : $scope.sponsorId,
				model: vm.model
			}
		});
	}
	
	
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
		    var msg = {409:'Customer code has already been deleted.', 405:'Customer code is used.'};
		    UIFactory.showFailDialog({
			data: {
			    headerMessage: 'Delete customer code failed.',
			    bodyMessage: msg[response.status]?msg[response.status]:response.statusText
			},
			preCloseCallback: preCloseCallback
		    });
		},
		onSuccess: function(response){
		    UIFactory.showSuccessDialog({
			data: {
			    headerMessage: 'Delete customer code completed.',
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
			supplierId: ''
	}
	var prepareSearchCriteria = function(){
		
		
		vm.searchCriteria.customerCode = vm.criteria.customerCode || '';
		
		if(angular.isDefined(vm.criteria.customer)){
			vm.searchCriteria.supplierId = vm.criteria.customer.supplierId;
		}else{
			vm.searchCriteria.supplierId = '';
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
	vm.pagingController = PagingController.create(customerCodeURL, vm.searchCriteria, 'GET');
	
	var queryCustomerCode = function(value){
		var serviceUrl = 'api/v1/organize-customers/' + vm.sponsorId + '/trading-partners'
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
	
	vm.customerAutoSuggestModel = UIFactory.createAutoSuggestModel({
		placeholder : 'Enter Organize name or code',
		itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
		query: queryCustomerCode
	});

	vm.search = function(criteria) {
		prepareSearchCriteria();
		vm.pagingController.search();
	};

	vm.initialPage = function() {
		vm.search();
	}
	vm.initialPage();
	
	
	var saveCustomerCode = function(customerCode){
		
		var saveCustomerDiferred = '';
		if(vm.isNewCusotmerCode){
			customerCode.groupId = groupId;
			
			var newCustCodeURL = '/api/v1/organize-customers/'+ vm.sponsorId +'/sponsor-configs/SFP/customer-code-groups/'+groupId+'/customer-codes';
			saveCustomerDiferred = Service.requestURL(newCustCodeURL, customerCode);
		}else{
			var editCustCodeURL = '/api/v1/organize-customers/'+ vm.sponsorId +'/sponsor-configs/SFP/customer-code-groups/'+groupId+'/customer-codes/'+ vm.oldCustomerCode;
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
			    supplierId: customerCode.supplierId
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
			    var msg = {405:'Customer code is used.'};
			    dialogFail = UIFactory.showFailDialog({
				data: {
				    headerMessage: vm.isNewCusotmerCode?'New customer code failed.':'Edit customer code failed.',
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
				    headerMessage: vm.isNewCusotmerCode == true?'New customer code completed.':'Edit customer code completed.',
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
	    
		vm.isNewCusotmerCode = angular.isUndefined(model);
		if(!vm.isNewCusotmerCode){
			vm.isNewCusotmerCode = angular.isUndefined(model.customerCode);
			vm.isAddMoreCustomerCode = vm.isNewCusotmerCode;
			if(!vm.isNewCusotmerCode){
				vm.oldCustomerCode = model.customerCode;
			}
		}
		
		vm.newCustCodeDialog = ngDialog.open({
			template: '/js/app/modules/sponsor-config/customer-code-groups/dialog-new-customer-code.html',
			className: 'ngdialog-theme-default modal-width-60',
			scope : $scope,
			controller : 'CustomerCodeDiaglogController',
			controllerAs : 'ctrl',
			data : {
				sponsorId : $scope.sponsorId,
				model: model,
				isNewCusotmerCode: vm.isNewCusotmerCode,
				isAddMoreCustomerCode: vm.isAddMoreCustomerCode
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

}
]);
scfApp.controller("CustomerCodeDiaglogController", ['$scope', '$rootScope', 'UIFactory', '$http', 'SCFCommonService', function($scope, $rootScope, UIFactory, $http, SCFCommonService) {
	var vm = this;
	var sponsorId = $rootScope.sponsorId;
	
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
	
	var prepreSupplierDisplay= function(){
		var customerCodeQuery = queryCustomerCode(vm.model.supplierId);
		customerCodeQuery.then(function(values){
			values.forEach(function(value){
				if(value.supplierId == vm.model.supplierId){
					vm.customerSuggestModel = value;
				}
			});			
		});
	}
		
	var initialData = function(){
		var supplierIdInitial = null;
		if(vm.isNewCusotmerCode){
			if(vm.isAddMoreCustomerCode){
				supplierIdInitial = vm.model.supplierId;
				prepreSupplierDisplay();
			}
			
			vm.model = {
					activeDate: new Date(),
					suspend: false,
					supplierId: supplierIdInitial
			}
		}else{

			// vm.model.activeDate =
			// SCFCommonService.convertStringTodate(vm.model.activeDate);
			vm.model.activeDate = new Date(vm.model.activeDate);
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
			vm.model.expiryDate = undefined;
		}
	}
	
	vm.customerAutoSuggest = UIFactory.createAutoSuggestModel({
		placeholder : 'Enter Organize name or code',
		itemTemplateUrl: 'ui/template/autoSuggestTemplate.html',
		query: queryCustomerCode
	});
	
	vm.saveCustomer = function(){
		var validatePass = true;
		vm.wrongDateFormat = false;
		vm.invalideExpiryDate = false;
		
		if(angular.isDefined(vm.customerSuggestModel)){
			vm.model.supplierId = vm.customerSuggestModel.supplierId;
		}
		
		if(vm.isUseExpireDate){			
			if(angular.isDefined(vm.model.expiryDate)){
				// check date format
				if(!angular.isDate(vm.model.expiryDate)){
					vm.wrongDateFormat = true;
					validatePass = false;
				}
				
				if(vm.model.activeDate > vm.model.expiryDate){
					vm.invalideExpiryDate = true;
					validatePass = false;
				}
			}
		}
		
		if($scope.newEditCustCode.customer.$error.required){
			validatePass = false;
		}
		
		if($scope.newEditCustCode.supplier.$error.required){
			validatePass = false;
		}

		if($scope.newEditCustCode.activeDate.$error.required){
			validatePass = false;
		}else{
			if(!angular.isDate(vm.model.activeDate)){
				vm.wrongDateFormat = true;
				validatePass = false;
			}
			// check date format
			if(vm.isUseExpireDate && !angular.isDate(vm.model.expiryDate)){
				vm.wrongDateFormat = true;
				validatePass = false;
			}
		}
		
		if(validatePass){
			$scope.closeThisDialog(vm.model);
		}
	}
	
}]);
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