angular
		.module('scfApp')
		.controller(
				'ChannelConfigsController',
				[
						'$log',
						'$scope',
						'$state',
						'SCFCommonService',
						'$stateParams',
						'$timeout',
						'PageNavigation',
						'PagingController',
						'Service',
						'ngDialog',
						function($log, $scope, $state, SCFCommonService,
								$stateParams, $timeout, PageNavigation, PagingController, Service, ngDialog) {
							
							var vm = this;
							vm.splitePageTxt = '';
							vm.processType = '';

							vm.pageModel = {
								pageSizeSelectModel : '20',
								totalRecord : 0,
								currentPage : 0,
								clearSortOrder : false,
								pageSize : 20
							};

							vm.pageModel.pageSizeList = [ {
								label : '10',
								value : '10'
							}, {
								label : '20',
								value : '20'
							}, {
								label : '50',
								value : '50'
							} ];

							vm.newChannel = function() {
								//TODO NEW
								PageNavigation.gotoPage('/');
							}

							vm.editChannel = function(data) {
								var params = {
						            	selectedItem: data
						            };
						        PageNavigation.gotoPage('/sponsor-configuration/import-channels/settings', params);
							}
							
							
							vm.testConnection = function(data){
								vm.serviceInfo = {
									status : 'loading',
									errorMessage : ''
								};
								
								var testConnectionDialog = ngDialog.open({
									id : 'test-connection-result-dialog',
									template : 'js/app/sponsor-configuration/dialog-test-connection-result.html',
									className : 'ngdialog-theme-default',
									controller: 'TestConnectionResultController',
									controllerAs: 'ctrl',
									scope : $scope,
									data : {
										serviceInfo : vm.serviceInfo,
										data : data
									},
									preCloseCallback : function(value) {
										
									}
								});
							}
							
							vm.deleteChannel = function(data) {
								PageNavigation.gotoPage('/');
							}
							
							vm.disableTestConnection = function(data) {
								if(data.channelType == 'WEB' || !data.completed){
									return true;
								}else{
									return false;
								}
								
							}
							
							vm.data = [];
							
							vm.dataTable = null;
							
							

							vm.searchChannels = function(pageModel){
								var sponsorId = $scope.sponsorId
						        if (pageModel === undefined) {
						            vm.pageModel.pageSizeSelectModel = '20';
						            vm.pageModel.currentPage = 0;
						        } else {
						            vm.pageModel.pageSizeSelectModel = pageModel.pageSize;
						            vm.pageModel.currentPage = pageModel.page;
						        }
	
								var offset = 0;
								if(vm.pageModel.currentPage>0){
									offset = vm.pageModel.currentPage*vm.pageModel.pageSizeSelectModel
								}
								
								var serviceUrl = '/api/v1/organize-customers/'+sponsorId+'/process-types/'+ vm.processType +'/channels';
								var serviceDiferred = Service.doGet(serviceUrl);	
								
								serviceDiferred.promise.then(function(response){
									vm.data = response.data;
								}).catch(function(response){
									$log.error('Load channel data error');
								});

							} 
							
							vm.initLoad = function(processType) {
								vm.processType = processType;
								vm.pageModel.currentPage = 0;
								vm.pageModel.pageSizeSelectModel = '20';
								vm.getDataTable();
								vm.searchChannels();
								
							}
							
							vm.getDataTable = function(){
								if(vm.processType == 'AP_DOCUMENT'){
									vm.dataTable = {
									identityField : 'channelType',
									options : {},
									columns : [
											{
												fieldName : 'channelType',
												labelEN : 'Channel',
												labelTH : 'Channel',
												id : 'ap-channel-{value}',
												filterType : 'translate',
												cssTemplate : 'text-left'
											},
											{
												fieldName : 'status',
												labelEN : 'Status',
												labelTH : 'Status',
												id : 'ap-status-{value}',
												filterType : 'translate',
												cssTemplate : 'text-center'
											},
											{
												fieldName : 'activeDate',
												labelEN : 'Active date',
												labelTH : 'Active date',
												id : 'ap-active-date-{value}',
												filterType : 'date',
												filterFormat : 'dd/MM/yyyy',
												cssTemplate : 'text-center'
											},
											{
												fieldName : 'expiryDate',
												labelEN : 'Expire date',
												labelTH : 'Expire date',
											    id : 'ap-expire-date-{value}',
											    filterType : 'date',
											    filterFormat : 'dd/MM/yyyy',
											    cssTemplate : 'text-center'
											},
											{
												cssTemplate : 'text-center',
												sortData : false,
												cellTemplate : '<scf-button id="ap-{{data.channelType}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.editChannel(data)" title="Config a channel"><i class="fa fa-cog" aria-hidden="true"></i></scf-button>'
														+ '<scf-button id="ap-{{data.channelType}}-connection-button" class="btn-default gec-btn-action" ng-disabled="ctrl.disableTestConnection(data)" ng-click="ctrl.testConnection(data)" title="Test connection"><i class="glyphicon glyphicon-transfer" aria-hidden="true"></i></scf-button>'
											} ]
									}
									
								}else{
									vm.dataTable = {
									identityField : 'channelType',
									options : {},
									columns : [
											{
												fieldName : 'channelType',
												labelEN : 'Channel',
												labelTH : 'Channel',
												id : 'ar-channel-{value}',
												filterType : 'translate',
												cssTemplate : 'text-left'
											},
											{
												fieldName : 'layoutConfigId',
												labelEN : 'Import file layout',
												labelTH : 'Import file layout',
												id : 'ar-import-file-layout-{value}',
												filterType : 'translate',
												cssTemplate : 'text-left'
											},
											{
												fieldName : 'status',
												labelEN : 'Status',
												labelTH : 'Status',
												id : 'ar-status-{value}',
												filterType : 'translate',
												cssTemplate : 'text-center'
											},
											{
												fieldName : 'activeDate',
												labelEN : 'Active date',
												labelTH : 'Active date',
												id : 'ar-active-date-{value}',
												filterType : 'date',
												filterFormat : 'dd/MM/yyyy',
												cssTemplate : 'text-center'
											},
											{
												fieldName : 'expiryDate',
												labelEN : 'Expire date',
												labelTH : 'Expire date',
											    id : 'ar-expire-date-{value}',
											    filterType : 'date',
											    filterFormat : 'dd/MM/yyyy',
											    cssTemplate : 'text-center'
											},
											{
												cssTemplate : 'text-center',
												sortData : false,
												cellTemplate : '<scf-button id="ar-{{data.channelType}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.editChannel(data)" title="Config a channel"><i class="fa fa-cog" aria-hidden="true"></i></scf-button>'
														+ '<scf-button id="{{ctrl.processType}}-layout-{{data.displayName}}-delete-button" class="btn-default gec-btn-action" ng-disabled="false" ng-click="ctrl.delete()" title="Delete a channel"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
														+ '<scf-button id="ar-{{data.channelType}}-connection-button" class="btn-default gec-btn-action" ng-disabled="ctrl.disableTestConnection(data)" ng-click="ctrl.testConnection(data)" title="Test connection"><i class="glyphicon glyphicon-transfer" aria-hidden="true"></i></scf-button>'
											} ]
										}
								}
							}

							//vm.initLoad();

						} ]).controller('TestConnectionResultController', [ '$scope', '$rootScope', '$q','$http', function($scope, $rootScope, $q, $http) {
							 var vm = this;
							 vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
							 vm.data = angular.copy($scope.ngDialogData.data);
							 
							 
							 var verifySystemStatusFTP = function(data){
						        var deffered = $q.defer();
							    $http({
							       method: 'POST',
							       url: 'api/v1/check-ftp-connection/connections/'+data.jobId
							    }).then(function(response) {
							       if(response.data.returnCode == "200"){
								    	vm.serviceInfo.status = "success";
								    }else{
								    	vm.serviceInfo.errorMessage = response.data.returnCode + ' - ' + response.data.returnMessage;
										vm.serviceInfo.status = "fail";
								    }
							       
							    }).catch(function(response) {
							       vm.serviceInfo.errorMessage = response.status + ' - ' + response.statusText;
							       vm.serviceInfo.status = "fail";
							    });
						    }
							 
							 verifySystemStatusFTP(vm.data);
							 
							} ]);