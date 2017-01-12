angular
		.module('scfApp')
		.controller(
				'FileLayoutsController',
				[
						'$log',
						'$scope',
						'$state',
						'SCFCommonService',
						'$stateParams',
						'$timeout',
						'PageNavigation',
						'Service',
						function($log, $scope, $state, SCFCommonService, $stateParams, $timeout,
								PageNavigation, Service) {
							var vm = this;
							vm.splitePageTxt = '';
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
							
							vm.newFileLayout = function(data){		
								var params = {fileLayoutModel: data};
								PageNavigation.gotoPage('/sponsor-configuration/file-layouts/new-file-layout',params)
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
											field : 'displayName',
										    label: 'File layout name',
										    idValueField: 'template',
										    id: 'file-layouts-{value}-file-layout-name-label',
										    sortData: true,
										    cssTemplate: 'text-left',
										}, {
											field: '',
											label: '',
											cssTemplate: 'text-center',
											sortData: false,
											cellTemplate: '<scf-button id="layout-{{data.layoutConfigId}}-setup-button" class="btn-default gec-btn-action" ng-click="fileLayoutsCtrl.newFileLayout(data)" title="Config a file layout" ng-hide="!data.completed"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>' +
											'<scf-button id="layout-{{data.layoutConfigId}}-warning-setup-button" class="btn-default gec-btn-action" ng-click="fileLayoutsCtrl.newFileLayout(data)" title="Config a file layout" ng-hide="data.completed"><img ng-hide="data.completed" data-ng-src="img/gear_warning.png" style="height: 13px; width: 14px;"/></scf-button>' +
											'<scf-button class="btn-default gec-btn-action" ng-disabled="true" ng-click="fileLayoutsCtrl.delete()" title="Delete a file layout"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></scf-button>'
										} ]
							};

							vm.data = [];
//							vm.data = [{
//						    	"displayName" : "Big C file layout"
//						    }]

							vm.decodeBase64 = function(data) {
								return atob(data);
							}
							
							vm.searchFileLayouts = function(){	
								callService();
							};
							
							vm.initLoad = function() {
				                vm.pageModel.currentPage = 0;
				                vm.pageModel.pageSizeSelectModel = '20';
								vm.searchFileLayouts();	
							}

							vm.initLoad();
							
							function callService(){
								var sponsorId = $scope.sponsorId;
								
								var offset = 0;
								if(vm.pageModel.currentPage>0){
									offset = vm.pageModel.currentPage*vm.pageModel.pageSizeSelectModel;
								}
								
								var fileLayoutsUrl = '/api/v1/organize-customers/'+sponsorId+'/sponsor-configs/SFP/layouts';
								var serviceDiferred = Service.doGet(fileLayoutsUrl, {
									offset: offset,
									limit: vm.pageModel.pageSizeSelectModel
								});									
								
								serviceDiferred.promise.then(function(response){
									vm.data = response.data;
									vm.pageModel.totalRecord = response.headers("X-Total-Count");
									vm.pageModel.totalPage = response.headers("X-Total-Page");									
									vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
								}).catch(function(response){
									log.error('Load File layouts data error');
								});
							}
							
						} ]);