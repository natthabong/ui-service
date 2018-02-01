'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module
		.controller(
				'FileLayoutListController',
				[
						'$log',
						'$scope',
						'$state',
						'SCFCommonService',
						'$stateParams',
						'$timeout',
						'PageNavigation',
						'Service',
						'FileLayoutService',
						'UIFactory',    
						'ConfigurationUtils',
						function($log, $scope, $state, SCFCommonService, $stateParams, $timeout,
								PageNavigation, Service, FileLayoutService, UIFactory, ConfigurationUtils) {
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
								var params = {fileLayoutModel: data, processType:processType, integrateType: integrateType, organizeId:$stateParams.organizeId};
								PageNavigation.gotoPage('/sponsor-configuration/file-layouts/new-file-layout',params);
							}
							
							vm.newARFileLayout = function(data, processType, integrateType){		
								ConfigurationUtils.showCreateImportLayoutDialog({
									data : { 
										showAll: true ,
										ownerId : $stateParams.organizeId
									}, preCloseCallback : function() {
										vm.init(processType, integrateType);
									}
								});
							}
							 
							 vm.deleteLayout = function(data) {
	                UIFactory
	                    .showConfirmDialog({
	                      data : {
	                        headerMessage : 'Confirm delete?'
	                      },
	                      confirm : function() {
	                        return FileLayoutService
	                            .deleteLayout(data, vm.processType, vm.integrateType);
	                      },
	                      onFail : function(response) {
	                        var status = response.status;
	                          var msg = {
	                            404 : "File layout has been deleted.",
	                            409 : "File layout has been modified.",
	                            405 : "File Layout has been used."
	                          }
	                          UIFactory
	                              .showFailDialog({
	                                data : {
	                                  headerMessage : 'Delete file layout fail.',
	                                  bodyMessage : msg[status] ? msg[status]
	                                      : response.errorMessage
	                                },
	                                preCloseCallback : function(){
	                                  callService(vm.processType, vm.integrateType);
	                                }
	                              });
 
	                      },
	                      onSuccess : function(response) {
	                        UIFactory
	                            .showSuccessDialog({
	                              data : {
	                                headerMessage : 'Delete file layout success.',
	                                bodyMessage : ''
	                              },
	                              preCloseCallback : function(){
	                                callService(vm.processType, vm.integrateType);
	                              }
	                            });
	                      }
	                    });
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
				                vm.integrateType = integrateType;
				            	callService(processType, integrateType);
							}

							vm.data = [];
							
							vm.unauthenConfig = function(){
								if(vm.viewAllConfig || vm.manageAllConfig){
									return false;
								}else{
									return true;
								}
							}
							
							function callService(processType, integrateType){
								var sponsorId = $stateParams.organizeId;
								
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
									if (vm.processType == 'AP_DOCUMENT'){
										vm.data = response.data[0];
									}else{
										vm.data = response.data;
									}
									vm.pageModel.totalRecord = response.headers("X-Total-Count");
									vm.pageModel.totalPage = response.headers("X-Total-Page");	
									vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
								}).catch(function(response){
									log.error('Load File layouts data error');
								});
							}
							
						} ]);