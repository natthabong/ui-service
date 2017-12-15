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
			var organizeId = $rootScope.userInfo.organizeId;

			vm.manageAllConfig = false;
			vm.manageMyOrgConfig = false;
			
			vm.pageModel = {
				pageSizeSelectModel : '10',
				totalRecord : 0,
				currentPage : 0,
				clearSortOrder : false,
				page : 0,
				pageSize : 10
			};
			
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
				var url = '/api/v1/organize-customers/'+ organizeId + '/product-types';
				vm.pagingController = PagingController.create(url, null, 'GET');
				
				console.log(vm.pagingController);
			}

			vm.unauthenConfig = function() {
				return false;
				if (vm.manageAllConfig || vm.manageMyOrgConfig) {
					return false;
				} else {
					return true;
				}
			}
			
			vm.initLoad();
		} 
	]
);
