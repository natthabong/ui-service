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
							
							vm.viewAllConfig=false;
							vm.manageAllConfig=false;
							
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
							
							vm.newFileLayout = function(data, processType, integrateType){		
								var params = {fileLayoutModel: data, processType:processType, integrateType: integrateType};
								PageNavigation.gotoPage('/sponsor-configuration/file-layouts/new-file-layout',params);
							}
							
							vm.decodeBase64 = function(data){
								if(angular.isUndefined(data)){
									return '';
								}
								return atob(data);
							}


							vm.decodeBase64 = function(data) {
								return atob(data);
							}
							
							
							vm.init = function(processType, integrateType) {
				                vm.pageModel.currentPage = 0;
				                vm.pageModel.pageSizeSelectModel = '20';
				                vm.processType = processType;
				            	callService(processType, integrateType);
							}

							vm.data = [];
								vm.dataTable = {
										options : {
										},
										columns : [
												{
													field : 'displayName',
												    label: 'File layout name',
												    idValueField: 'layoutConfigId',
												    id: 'file-layouts-{value}-display-layout-name-label',
												    sortData: true,
												    cssTemplate: 'text-left',
												    cellTemplate : '<span id="{{ctrl.processType}}-import-layout-{{data.layoutConfigId}}-label">{{data.displayName}}</span>'
												}, {
													field: '',
													label: '',
													cssTemplate: 'text-center',
													sortData: false,
													cellTemplate: '<scf-button id="{{ctrl.processType}}-layout-{{data.displayName}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.newFileLayout(data)" title="Config a file layout"><i class="fa fa-cog" aria-hidden="true"></i></scf-button>' +
													'<scf-button id="{{ctrl.processType}}-layout-{{data.displayName}}-delete-button" class="btn-default gec-btn-action" ng-disabled="true" ng-click="ctrl.delete()" title="Delete a file layout"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
												} ]
									};
							
							vm.unauthenConfig = function(){
								if(vm.viewAllConfig || vm.manageAllConfig){
									return false;
								}else{
									return true;
								}
							}
							
							function callService(processType, integrateType){
								var sponsorId = $scope.sponsorId;
								
								var offset = 0;
								if(vm.pageModel.currentPage>0){
									offset = vm.pageModel.currentPage*vm.pageModel.pageSizeSelectModel;
								}
								
								var fileLayoutsUrl = '/api/v1/organize-customers/'+sponsorId+'/process-types/'+processType+ '/integrate-types/' + integrateType+'/layouts';
								var serviceDiferred = Service.doGet(fileLayoutsUrl, {
									offset: offset,
									limit: vm.pageModel.pageSizeSelectModel
								});									
								
								serviceDiferred.promise.then(function(response){
									vm.data = response.data;
									console.log(vm.data);
									vm.pageModel.totalRecord = response.headers("X-Total-Count");
									vm.pageModel.totalPage = response.headers("X-Total-Page");	
									vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
								}).catch(function(response){
									log.error('Load File layouts data error');
								});
							}
							
						} ]);