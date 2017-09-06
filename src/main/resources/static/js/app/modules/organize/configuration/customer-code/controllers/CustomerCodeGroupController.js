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

			vm.manageAllConfig=false;
			vm.manageMyOrgConfig=false;
			
			vm.pageModel = {
				pageSizeSelectModel : '20',
				totalRecord : 0,
				currentPage : 0,
				clearSortOrder : false,
				page : 0,
				pageSize : 20
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


			vm.decodeBase64 = function(data) {
				if (angular.isUndefined(data)) {
					return '';
				}
				return atob(data);
			}

			vm.data = []

			vm.search = function() {
				var serviceUrl = '/api/v1/organize-customers/' + $scope.sponsorId + '/accounting-transactions/PAYABLE/customer-code-groups';
				var serviceDiferred = Service.doGet(serviceUrl, {
					limit : vm.pageModel.pageSizeSelectModel,
					offset : vm.pageModel.currentPage
				});

				serviceDiferred.promise.then(function(response) {
					vm.data = response.data[0];
					vm.pageModel.totalRecord = response.headers('X-Total-Count');
					vm.pageModel.totalPage = response.headers('X-Total-Page');
					vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.page, vm.pageModel.totalRecord);
				}).catch(function(response) {
					log.error('Load customer code group data error');
				});
			}

			vm.addNew = function() {
				vm.newCustCodeDialog = ngDialog.open({
					id : 'new-customer-code-setting-dialog',
					template : '/js/app/modules/sponsor-config/customer-code-groups/dialog-new-customer-code-group.html',
					className : 'ngdialog-theme-default',
					scope : $scope,
					controller : 'CustomerCodeGroupDiaglogController',
					controllerAs : 'ctrl',
					data : {
						sponsorId : $scope.sponsorId
					},
					preCloseCallback : function(value) {
						if (value != null) {
							vm.search();
						}
						return true;
					}
				});
			};

			vm.config = function(customerCodeGroup) {
				var params = {
					selectedItem : customerCodeGroup
				};
				PageNavigation.gotoPage('/sponsor-configuration/customer-code-groups/settings', params)
			}

			vm.initLoad = function() {
				vm.pageModel.currentPage = 0;
				vm.pageModel.pageSizeSelectModel = '20';

				vm.search();
			}

			vm.initLoad();
			
			vm.unauthenConfig = function(){
				if(vm.manageAllConfig || vm.manageMyOrgConfig){
					return false;
				}else{
					return true;
				}
			}
		} ]);