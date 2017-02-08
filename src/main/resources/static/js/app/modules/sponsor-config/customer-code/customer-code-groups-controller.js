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
								page: 0,
								pageSize: 20
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
							
							
							vm.decodeBase64 = function(data){
								if(angular.isUndefined(data)){
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
										    label: 'Group Name',
										    idValueField: 'groupName',
										    id: 'customer-code-group-{value}-group-name',
										    sortData: true,
										    cssTemplate: 'text-left',
										}, {
											field: '',
											label: '',
											cssTemplate: 'text-center',
											sortData: false,
											cellTemplate: '<scf-button id="customer-code-group-{{data.groupName}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="Config a customer code groups" ng-hide="!data.completed"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>' +
											'<scf-button id="customer-code-group-{{data.groupName}}-warning-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="Config a customer code groups" ng-hide="data.completed"><img ng-hide="data.completed" data-ng-src="img/gear_warning.png" style="height: 13px; width: 14px;"/></scf-button>' +
											'<scf-button class="btn-default gec-btn-action" ng-disabled="true" ng-click="ctrl.search()" title="Delete a file layout"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
										} ]
							};

							vm.data = []
							
							vm.search = function(){
								var serviceUrl = '/api/v1/organize-customers/'+$scope.sponsorId+'/sponsor-configs/SFP/customer-code-groups';
								var serviceDiferred = Service.doGet(serviceUrl, {
									limit:  vm.pageModel.pageSizeSelectModel,
									offset: vm.pageModel.currentPage
								});		
								
								serviceDiferred.promise.then(function(response){
									vm.data = response.data;
					                vm.pageModel.totalRecord = response.headers('X-Total-Count');
					                vm.pageModel.totalPage = response.headers('X-Total-Page');
					                vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
								}).catch(function(response){
									log.error('Load customer code group data error');
								});
							}
							
							vm.addNew = function() {
								vm.newCustCodeDialog = ngDialog.open({
									id : 'new-customer-code-setting-dialog',
									template : '/js/app/modules/sponsor-config/customer-code/dialog-new-customer-code-group.html',
									className : 'ngdialog-theme-default',
									scope : $scope,
									controller: 'CustomerCodeGroupDiaglogController',
					                controllerAs: 'ctrl',
					                data: {sponsorId: $scope.sponsorId},
				                    preCloseCallback: function(value) {
				                    	if(value!=null){
				                    		vm.search();
				                    	}
				                        return true;
				                    }
								});
							};
							
							vm.initLoad = function() {
				                vm.pageModel.currentPage = 0;
				                vm.pageModel.pageSizeSelectModel = '20';
				                
				                vm.search();
							}

							vm.initLoad();
						} ]);
scfApp.controller( 'CustomerCodeGroupDiaglogController',
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
							
						} ])