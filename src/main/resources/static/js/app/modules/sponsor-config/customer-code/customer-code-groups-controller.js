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
					template : '/js/app/modules/sponsor-config/customer-code/dialog-new-customer-code-group.html',
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
scfApp.controller('CustomerCodeGroupSettingController', [ '$scope', '$stateParams', 'Service', 'UIModelFactory', 'CustomerCodeStatus', 'PageNavigation', 'PagingController', '$http'
	, function($scope, $stateParams, Service, UIModelFactory, 
			CustomerCodeStatus, PageNavigation, PagingController, $http) {
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
		columns : [
			{
				fieldName : '$rowNo',
				labelEN : 'No.',
				labelTH : 'ลำดับ',
				sortable : false,
				idValueField : 'supplierCode',
				id : 'cutomer-no-{value}-label',
				filterType : 'translate',
				cssTemplate : 'text-right'
			},
			{
				fieldName : 'customerName',
				labelEN : 'Customer',
				labelTH : 'Customer',
				sortable : false,
				idValueField : 'supplierCode',
				id : 'customer-{value}-label',
				filterType : 'translate',
				cssTemplate : 'text-left'
			},
			{
				fieldName : 'customerCode',
				labelEN : 'Customer code',
				labelTH : 'Customer code',
				sortable : false,
				idValueField : 'supplierCode',
				id : 'customer-code-{value}-label',
				filterType : 'translate',
				cssTemplate : 'text-left'
			},
			{
				fieldName : 'status',
				labelEN : 'Status',
				labelTH : 'Status',
				sortable : false,
				idValueField : 'supplierCode',
				id : 'status-{value}-label',
				filterType : 'translate',
				filterFormat : 'dd/MM/yyyy',
				cssTemplate : 'text-center'
			},
			{
				fieldName : 'activeDate',
				labelEN : 'Active date',
				labelTH : 'Active date',
				sortable : false,
				idValueField : 'supplierCode',
				id : 'active-date-{value}-label',
				filterType : 'date',
				filterFormat : 'dd/MM/yyyy',
				cssTemplate : 'text-center'
			},
			{
				fieldName : 'expireDate',
				labelEN : 'Expire date',
				labelTH : 'Expire date',
				sortable : false,
				idValueField : 'supplierCode',
				id : 'customer-{value}-label',
				filterType : 'date',
				cssTemplate : 'text-center'
			},
			{
				fieldName : 'remark',
				labelEN : 'Remark',
				labelTH : 'Remark',
				sortable : false,
				idValueField : 'supplierCode',
				id : 'remark-{value}-label',
				cssTemplate : 'text-left'
			},
			{
				fieldName : '',
				labelEN : '',
				labelTH : '',
				sortable : false,
				idValueField : 'supplierCode',
				id : 'remark-{value}-label',
				cssTemplate : 'text-left',
				cellTemplate : '<scf-button id="cutomer-{{data.supplierCode}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.setupCustomerCode(data)" title="Setup customer code"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>' +
					'<scf-button id="cutomer-{{data.supplierCode}}-delete-button"  class="btn-default gec-btn-action" ng-click="ctrl.deleteCustomerCode(data)" title="Delete customer code"><i class="fa fa-times-circle" aria-hidden="true"></i></scf-button>'
			}
		]
	};
	
	vm.edit = function(model) {
		
		vm.editCustCodeDialog = ngDialog.open({
			id : 'new-customer-code-setting-dialog',
			template : '/js/app/modules/sponsor-config/customer-code/dialog-edit-customer-code-group.html',
			className : 'ngdialog-theme-default',
			scope : $scope,
			controller : 'CustomerCodeGroupDiaglogController',
			controllerAs : 'ctrl',
			data : {
				sponsorId : $scope.sponsorId,
				model: vm.model
			},
			preCloseCallback : function(value) {
				return true;
			}
		});
	}
	
	vm.searchCriteria = {
			customerCode: '',
			suspend: '',
			expired: '',
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
					vm.searchCriteria.suspend = null;
					vm.searchCriteria.expired = null;
				}else{
					vm.searchCriteria.suspend = item.valueObject.suspend;
					vm.searchCriteria.expired = item.valueObject.expired;
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
//			return response.data;
			return response.data.map(function(item) {				
				item.label = item.supplierId + ': ' + item.supplierName;
				return item;
			});
		});
	}
	
	vm.customerAutoSuggestModel = UIModelFactory.createAutoSuggestModel({
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

	vm.deleteCustomerCode = function(value) {};

	vm.editCustomerCode = function(value) {};
	
	vm.newCustomerCode = function(){
		
	};
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
			expired : 0
		}
	},
	{
		label : 'Suspend',
		value : '2',
		valueObject : {
			suspend : 1,
			expired : 0
		}
	},
	{
		label : 'Expired',
		value : '3',
		valueObject : {
			suspend : 0,
			expired : 1
		}
	}
]);