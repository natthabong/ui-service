'use strict';
var productTypeModule = angular.module('productTypeSetting');
productTypeModule.controller('ProductTypeSettingController', [
		'$q',
		'$scope',
		'$stateParams',
		'Service',
		'UIFactory',
		'PageNavigation',
		'PagingController',
		'$http',
		'ngDialog',
		'$rootScope',
		function($q, $scope, $stateParams, Service, UIFactory, PageNavigation, PagingController, $http,
				ngDialog, $rootScope) {
			
			var vm = this;

			vm.gotoPage = function() {
				var params = {
						organizeId : $scope.sponsorId
				};
				
				PageNavigation.gotoPage('/customer-organize/product-type-list', params)
			}
			
		} 
]);
