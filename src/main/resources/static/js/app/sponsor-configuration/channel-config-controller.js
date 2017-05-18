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
						function($log, $scope, $state, SCFCommonService,
								$stateParams, $timeout, PageNavigation, Service) {
							
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

							vm.deleteChannel = function(data) {
								PageNavigation.gotoPage('/');
							}
							
							vm.disableTestConnection = function(data) {
								if(data.channelName == 'Web'){
									return true;
								}else{
									return false;
								}
								
							}

							vm.data = [];

							vm.dataTable = {
								identityField : 'channelName',
								options : {},
								columns : [
										{
											fieldName : 'channelName',
											label : 'Channel',
											id : 'channel-{value}',
											cssTemplate : 'text-left',
										},
										{
											fieldName : 'status',
											label : 'Status',
											id : 'channel-{value}-status',
											cssTemplate : 'text-center',
										},
										{
											fieldName : 'activeDate',
											label : 'Active date',
											id : 'channel-{value}-active-date',
											filterType : 'date',
										    format : 'dd/MM/yyyy',
											cssTemplate : 'text-center',
										},
										{
											fieldName : 'expiryDate',
										    label : 'Expire date',
										    id : 'channel-{value}-expire-date',
										    filterType : 'date',
										    format : 'dd/MM/yyyy',
										    cssTemplate : 'text-center'
										},
										{
											cssTemplate : 'text-center',
											sortData : false,
											cellTemplate : '<scf-button id="channel-{{data.importChannelId}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.editChannel(data)" title="Config a channel" ng-hide="!data.completed"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>'
													+ '<scf-button id="channel-{{data.importChannelId}}-warning-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.editChannel(data)" title="Config a channel" ng-hide="data.completed"><img ng-hide="data.completed" data-ng-src="img/gear_warning.png" style="height: 13px; width: 14px;"/></scf-button>'
													+ '<scf-button class="btn-default gec-btn-action" ng-disabled="ctrl.disableTestConnection(data)" ng-click="ctrl.deleteChannel(data)" title="Test connection"><i class="glyphicon glyphicon-transfer" aria-hidden="true"></i></scf-button>'
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
								var serviceDiferred = Service.doGet(serviceUrl, {
									offset: offset,
									limit: vm.pageModel.pageSizeSelectModel
								});		
								
								serviceDiferred.promise.then(function(response){
									vm.data = response.data;
									vm.pageModel.totalRecord = response.headers("X-Total-Count");
									vm.pageModel.totalPage = response.headers("X-Total-Page");
									vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
								}).catch(function(response){
									log.error('Load channel data error');
								});

							} 
							
							vm.initLoad = function() {
								vm.pageModel.currentPage = 0;
								vm.pageModel.pageSizeSelectModel = '20';

								vm.searchChannels();
							}

							vm.initLoad();

						} ]);