angular
		.module('scfApp')
		.controller(
				'CustomerCodeGroupController',
				[
						'SCFCommonService',
						'$log',
						'$scope',
						'$stateParams',
						'$timeout',
						'PageNavigation',
						'Service',
						function(SCFCommonService, $log, $scope, $stateParams, $timeout,
								PageNavigation, Service) {
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
										    idValueField: 'template',
										    id: 'customer-code-group-{value}-group-name',
										    sortData: true,
										    cssTemplate: 'text-left',
										}, {
											field: '',
											label: '',
											cssTemplate: 'text-center',
											sortData: false,
											cellTemplate: '<scf-button id="customer-code-group-{{data.groupId}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="Config a customer code groups" ng-hide="!data.completed"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>' +
											'<scf-button id="customer-code-group-{{data.groupId}}-warning-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="Config a customer code groups" ng-hide="data.completed"><img ng-hide="data.completed" data-ng-src="img/gear_warning.png" style="height: 13px; width: 14px;"/></scf-button>' +
											'<scf-button class="btn-default gec-btn-action" ng-disabled="true" ng-click="ctrl.search()" title="Delete a file layout"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
										} ]
							};

							vm.data = []
							
							vm.search = function(){
								var serviceUrl = '/api/v1/organize-customers/'+$scope.sponsorId+'/sponsor-configs/SFP/customer-code-groups';
								var serviceDiferred = Service.doGet(serviceUrl, {
									limit:  vm.pageModel.currentPage,
									offset: vm.pageModel.pageSizeSelectModel
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
							
							vm.initLoad = function() {
				                vm.pageModel.currentPage = 0;
				                vm.pageModel.pageSizeSelectModel = '20';
				                
				                vm.search();
							}

							vm.initLoad();
						} ]);