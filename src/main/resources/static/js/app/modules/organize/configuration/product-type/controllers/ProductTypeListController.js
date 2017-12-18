'use strict';
var productTypeModule = angular.module('gecscf.organize.configuration.productType');
productTypeModule.controller('ProductTypeListController', [
		'PageNavigation',
		'PagingController',
		'Service',
		'UIFactory',
		'ngDialog',
		'$http',
		'$log',
		'$q',
		'$rootScope',
		'$scope',
		'$stateParams',
		function(PageNavigation, PagingController, Service, UIFactory, ngDialog, $http, $log, $q, $rootScope, $scope, $stateParams) {
			var vm = this;
			var log = $log;

			vm.manageAllConfig = false;
			vm.manageMyOrgConfig = false;

			vm.dataTable = {
				identityField:'customerCode',
				columns : [
					{
						fieldName : '$rowNo',
						labelEN : 'No.',
						labelTH : 'ลำดับ',
						sortable : true,
						id : '$rowNo-{value}',
						filterType : 'translate',
						cssTemplate : 'text-right'
					},
					{
						fieldName : 'productType',
						labelEN : 'Product type',
						labelTH : 'ประเภทสินค้า',
						sortable : true,
						id : 'product-type-{value}',
						filterType : 'translate',
						cssTemplate : 'text-left'
					},
					{
						fieldName : 'name',
						labelEN : 'Name',
						labelTH : 'ชื่อ',
						sortable : true,
						id : 'name-{value}',
						filterType : 'translate',
						cssTemplate : 'text-left'
					},
					{
						labelEN : '',
						labelTH : '',
						sortable : false,
						cssTemplate : 'text-left',
						cellTemplate : '<scf-button id="{{data.customerCode}}-edit-button" class="btn-default gec-btn-action" ng-disabled="ctrl.unauthen()" ng-click="ctrl.customerCodeSetup(data)" title="Setup customer code"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></scf-button>' +
							'<scf-button id="{{data.customerCode}}-delete-button"  class="btn-default gec-btn-action" ng-disabled="ctrl.unauthen()" ng-click="ctrl.deleteCustomerCode(data)" title="Delete customer code"><i class="fa fa-trash-o" aria-hidden="true"></i></scf-button>'
					}
				]
			};

			vm.gotoListPage = function() {
				var params = {
					organizeId : $scope.sponsorId
				};

				PageNavigation.gotoPage('/customer-organize/product-types', params);
			}

			vm.gotoNewProductTypePage = function() {
				var params = {
					organizeId : $scope.sponsorId
				};

				PageNavigation.gotoPage('/customer-organize/product-types/setup', params);
			}
			
			vm.gotoEditProductTypePage = function() {
				var params = {
					organizeId : $scope.sponsorId
//					productType : 
				};

				PageNavigation.gotoPage('/customer-organize/product-types/setup', params);
			}
			
			vm.gotoPreviousPage = function() {
				PageNavigation.gotoPreviousPage();
			}

			vm.initLoad = function() {
				var organizeId = $rootScope.userInfo.organizeId;
				var url = '/api/v1/organize-customers/'+ 'YAMAHA_CO' + '/product-types';
				vm.pagingController = PagingController.create(url, null, 'GET');
				console.log(vm.pagingController);
			}

			vm.unauthenConfig = function() {
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
