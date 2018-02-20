var importChannelModule = angular.module('gecscf.organize.configuration.channel.import');
importChannelModule.controller(
	'ImportChannelListController', [
		'$log',
		'$scope',
		'$state',
		'SCFCommonService',
		'$stateParams',
		'$timeout',
		'PageNavigation',
		'PagingController',
		'ImportChannelService',
		'Service',
		'ngDialog',
		'ConfigurationUtils',
		'UIFactory',
		function ($log, $scope, $state, SCFCommonService,
			$stateParams, $timeout, PageNavigation, PagingController, ImportChannelService, Service, ngDialog, ConfigurationUtils, UIFactory) {

			var vm = this;
			vm.splitePageTxt = '';
			vm.processType = '';

			vm.hiddenFundingColumn = true;

			var parameters = PageNavigation.getParameters();
			var ownerId = parameters.organizeId;
			vm.pageModel = {
				pageSizeSelectModel: '20',
				totalRecord: 0,
				currentPage: 0,
				clearSortOrder: false,
				pageSize: 20
			};

			vm.pageModel.pageSizeList = [{
				label: '10',
				value: '10'
			}, {
				label: '20',
				value: '20'
			}, {
				label: '50',
				value: '50'
			}];

			vm.decodeBase64 = function (data) {
				return (data ? atob(data) :
					UIFactory.constants.NOLOGO);
			};

			vm.newChannel = function (callback) {
				ConfigurationUtils.showCreateImportChannelDialog({
					data: {
						organizeId: ownerId,
						processType: vm.processType,
						channelType: 'WEB'
					},
					preCloseCallback: function () {
						callback();
					}
				});
			}


			vm.editChannel = function (data) {
				var params = {
					channelId: data.channelId,
					organizeId: data.organizeId,
					processType: data.processType
				};
				PageNavigation.gotoPage('/customer-organize/import-channels/config', params, {
					organizeId: data.organizeId
				});
			}

			vm.viewChannel = function (data) {
				var params = {
					channelId: data.channelId,
					organizeId: data.organizeId,
					processType: data.processType
				};
				PageNavigation.gotoPage('/customer-organize/import-channels/view', params, {
					organizeId: data.organizeId
				});
			}

			vm.deleteChannel = function (data) {
				UIFactory
					.showConfirmDialog({
						data: {
							headerMessage: 'Confirm delete?'
						},
						confirm: function () {
							return ImportChannelService
								.remove(data);
						},
						onFail: function (response) {
							var status = response.status;
							if (status != 400) {
								var msg = {
									404: "Import channel has been deleted.",
									409: "Import channel has been modified."
								}
								UIFactory
									.showFailDialog({
										data: {
											headerMessage: 'Delete import channel fail.',
											bodyMessage: msg[status] ? msg[status] : response.errorMessage
										},
										preCloseCallback: loadData
									});
							}

						},
						onSuccess: function (response) {
							UIFactory
								.showSuccessDialog({
									data: {
										headerMessage: 'Delete import channel success.',
										bodyMessage: ''
									},
									preCloseCallback: loadData
								});
						}
					});
			}

			var loadData = function () {
				vm.searchChannels();
			}


			vm.testConnection = function (data) {
				vm.serviceInfo = {
					status: 'loading',
					errorMessage: ''
				};

				var testConnectionDialog = ngDialog.open({
					id: 'test-connection-result-dialog',
					template: 'js/app/sponsor-configuration/dialog-test-connection-result.html',
					className: 'ngdialog-theme-default',
					controller: 'TestConnectionResultController',
					controllerAs: 'ctrl',
					scope: $scope,
					data: {
						serviceInfo: vm.serviceInfo,
						data: data
					},
					preCloseCallback: function (value) {

					}
				});
			}

			vm.disableTestConnection = function (data) {
				if (data.channelType == 'WEB') {
					return true;
				} else {
					return false;
				}

			}
			vm.data = [];
			vm.dataTable = null;

			vm.searchChannels = function (pageModel) {
				var sponsorId = $stateParams.organizeId;
				if (pageModel === undefined) {
					vm.pageModel.pageSizeSelectModel = '20';
					vm.pageModel.currentPage = 0;
				} else {
					vm.pageModel.pageSizeSelectModel = pageModel.pageSize;
					vm.pageModel.currentPage = pageModel.page;
				}

				var offset = 0;
				if (vm.pageModel.currentPage > 0) {
					offset = vm.pageModel.currentPage * vm.pageModel.pageSizeSelectModel
				}

				var serviceUrl = '/api/v1/organize-customers/' + sponsorId + '/process-types/' + vm.processType + '/channels';
				var serviceDiferred = Service.doGet(serviceUrl);

				serviceDiferred.promise.then(function (response) {
					vm.data = response.data;
				}).catch(function (response) {
					$log.error('Load channel data error');
				});

			}

			vm.initLoad = function (processType) {
				vm.processType = processType;
				vm.pageModel.currentPage = 0;
				vm.pageModel.pageSizeSelectModel = '20';
				vm.searchChannels();
			};

		}
	]
)