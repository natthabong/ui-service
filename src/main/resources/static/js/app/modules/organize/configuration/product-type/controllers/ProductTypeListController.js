'use strict';
var productTypeModule = angular.module('gecscf.organize.configuration.productType');
productTypeModule.controller('ProductTypeListController', [
		'PageNavigation',
		'PagingController',
		'$log',
		'$scope',
		'$stateParams',
		function(PageNavigation, PagingController, $log, $scope, $stateParams) {
			var vm = this;
			var log = $log;
			var organizeId = $stateParams.organizeId;

			vm.manageAllConfig = false;
			vm.manageMyOrgConfig = false;
			
			var url = '/api/v1/organize-customers/'+ organizeId + '/product-types';
			
			vm.criteria = $stateParams.criteria || {};
			vm.pagingController = PagingController.create(url, vm.criteria,'GET');

			vm.gotoListPage = function() {
				var params = {
					organizeId: $scope.sponsorId
				};

				PageNavigation.gotoPage('/customer-organize/product-types', params);
			}

			vm.newProductType = function() {
				var params = {
					organizeId: organizeId
				};

				PageNavigation.gotoPage('/customer-organize/product-types/setup', params, {
					organizeId: organizeId,
					criteria: vm.criteria
				});
			}

			vm.editProductType = function(data) {
				var params = {
					organizeId: organizeId,
					productType : data.productType,
					model: data
				};

				PageNavigation.gotoPage('/customer-organize/product-types/setup', params, {
					organizeId: organizeId,
					criteria: vm.criteria
				});
			}

			vm.gotoPreviousPage = function() {
				PageNavigation.gotoPreviousPage();
			}

			vm.unauthenConfig = function() {
				if (vm.manageAllConfig || vm.manageMyOrgConfig) {
					return false;
				} else {
					return true;
				}
			}
			
			vm.searchProductType = function (pageModel) {
				vm.pagingController.search(pageModel, function (criteriaData, response) {
					$scope.currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
					$scope.pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
				});
			}
			
			var init = function () {
				vm.searchProductType();
			}();

			
			
		}
	]
);
