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
						'Service',
						'ngDialog',
						function($log, $scope, $state, SCFCommonService,
								$stateParams, $timeout, PageNavigation, Service, ngDialog) {
							
							var vm = this;
							vm.splitePageTxt = '';

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
									status : '',
									errorMessage : ''
								};
								
								var testConnectionDialog = ngDialog.open({
									id : 'test-connection-result-dialog',
									template : 'js/app/sponsor-configuration/import-channels/dialog-test-connection-result.html',
									className : 'ngdialog-theme-default',
									controller: 'TestConnectionResultController',
									controllerAs: 'ctrl',
									scope : $scope,
									data : {
										serviceInfo : vm.serviceInfo
									},
									preCloseCallback : function(value) {
										
									}
								});
								
							}

							vm.deleteChannel = function(data) {
								PageNavigation.gotoPage('/');
							}
							
							vm.disableTestConnection = function(data) {
								if(data.channelType == 'Web'){
									return true;
								}else{
									return false;
								}
								
							}

							vm.data = [];

							vm.dataTable = {
								identityField : 'channelType',
								options : {},
								columns : [
										{
											fieldName : 'channelType',
											labelEN : 'Channel',
											labelTH : 'Channel',
											id : 'channel-{value}',
											filterType : 'translate',
											cssTemplate : 'text-left',
										},
										{
											fieldName : 'status',
											labelEN : 'Status',
											labelTH : 'Status',
											id : 'status-{value}',
											filterType : 'translate',
											cssTemplate : 'text-center',
										},
										{
											fieldName : 'activeDate',
											labelEN : 'Active date',
											labelTH : 'Active date',
											id : 'active-date-{value}',
											filterType : 'date',
											filterFormat : 'dd/MM/yyyy',
											cssTemplate : 'text-center',
										},
										{
											fieldName : 'expiryDate',
											labelEN : 'Expire date',
											labelTH : 'Expire date',
										    id : 'expire-date-{value}',
										    filterType : 'date',
										    filterFormat : 'dd/MM/yyyy',
										    cssTemplate : 'text-center',
										    renderer: function(data){
											    return data || '-';
											}
										},
										{
											cssTemplate : 'text-center',
											sortData : false,
											cellTemplate : '<scf-button id="{{data.channelType}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.editChannel(data)" title="Config a channel" ng-hide="!data.completed"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>'
													+ '<scf-button id="{{data.channelType}}-warning-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.editChannel(data)" title="Config a channel" ng-hide="data.completed"><img ng-hide="data.completed" data-ng-src="img/gear_warning.png" style="height: 13px; width: 14px;"/></scf-button>'
													+ '<scf-button id="{{data.channelType}}-connection-button" class="btn-default gec-btn-action" ng-disabled="ctrl.disableTestConnection(data)" ng-click="ctrl.testConnection(data)" title="Test connection"><i class="glyphicon glyphicon-transfer" aria-hidden="true"></i></scf-button>'
										} ]
							}

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
								
								var serviceUrl = '/api/v1/organize-customers/'+sponsorId+'/sponsor-configs/SFP/channels';
								var serviceDiferred = Service.doGet(serviceUrl);	
								
								serviceDiferred.promise.then(function(response){
									vm.data = response.data;
								}).catch(function(response){
									$log.error('Load channel data error');
								});

							} 
							
							vm.initLoad = function() {
								vm.pageModel.currentPage = 0;
								vm.pageModel.pageSizeSelectModel = '20';

								vm.searchChannels();
							}

							vm.initLoad();

						} ]).controller('TestConnectionResultController', [ '$scope', '$rootScope', function($scope, $rootScope) {
							 var vm = this;
							 vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
							} ]);