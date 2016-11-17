angular
		.module('scfApp')
		.controller(
				'CustomerCodeGroupController',
				[
						'$log',
						'$scope',
						'$stateParams',
						'$timeout',
						'PageNavigation',
						'Service',
						function($log, $scope, $stateParams, $timeout,
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
							
							vm.config = function(data){		
								SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
								var params = { 
							        }
								PageNavigation.gotoPage('/new-file-layout',params,params)
							}
							
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
											cellTemplate: '<scf-button id="file-layouts-{{data.sponsorIntegrateFileConfigId}}-config-button" class="btn-default gec-btn-action" ng-click="ctrl.config(data)" title="Config a file layout"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>' +
											'<scf-button class="btn-default gec-btn-action" ng-disabled="true" ng-click="ctrl.searchTransaction()" title="Delete a file layout"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
										} ]
							};

							vm.data = [{
						    	"groupName" : "Big C file layout"
						    }]
							
							vm.initLoad = function() {
				                vm.pageModel.currentPage = 0;
				                vm.pageModel.pageSizeSelectModel = '20';
				                
				                search();
							}

							vm.initLoad();
							
							
							function search(){
								var fileLayoutsUrl = '/api/v1/organize-customers/'+$scope.sponsorId+'/sponsor-configs/SFP/customer-code-groups';
								var serviceDiferred = Service.requestURL(fileLayoutsUrl, {
									limit: 10,
									offset: 0
								},'GET');						
								serviceDiferred.promise.then(function(response){
									vm.data = response.content;
									vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
								}).catch(function(response){
									log.error('Load File layouts data error');
								});
							}
							
						} ]);