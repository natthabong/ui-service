'use strict';
var productTypeModule = angular.module('gecscf.organize.configuration.productType');
productTypeModule.controller('ProductTypeListController', [
		'Service',
		'UIFactory',
		'PageNavigation',
		'PagingController',
		'ngDialog',
		'$http',
		'$q',
		'$rootScope',
		'$scope',
		'$stateParams',
		'$log',
		function(Service, UIFactory, PageNavigation, PagingController, ngDialog, $http, $q, $rootScope, $scope, $stateParams, $log) {
			var vm = this;
			var log = $log;

			vm.manageAllConfig = false;
			vm.manageMyOrgConfig = false;

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
			
			vm.gotoListPage = function() {
				var params = {
					organizeId : $scope.sponsorId
				};
				
				PageNavigation.gotoPage('/customer-organize/product-types', params);
			}
			
			vm.gotoSetupPage = function() {
				var params = {
						organizeId : $scope.sponsorId
				};
				
				PageNavigation.gotoPage('/customer-organize/product-types/setup', params);
			}
			
			vm.initLoad = function() {
				vm.pageModel.currentPage = 0;
				vm.pageModel.pageSizeSelectModel = '20';
			}

			vm.initLoad();

			vm.unauthenConfig = function() {
				return false;
				if (vm.manageAllConfig || vm.manageMyOrgConfig) {
					return false;
				} else {
					return true;
				}
			}
		} 
	]
);
