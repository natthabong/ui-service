'use strict';
angular.module('gecscf.organize.configuration.productType').controller('ProductTypeController', [
	'$stateParams',
	'PageNavigation',
	'ProductTypeService',
	function ($stateParams, PageNavigation, ProductTypeService) {
		var vm = this;
		var organizeId = $stateParams.organizeId;

		vm.manageAllConfig = false;
		vm.manageMyOrgConfig = false;
		vm.viewAction = false;

		vm.gotoConfigPage = function () {
			var params = {
				organizeId: organizeId
			};
			PageNavigation.gotoPage('/sponsor-configuration/product-type-list', params);
		}

		vm.gotoListPage = function () {
			var params = {
				organizeId: organizeId
			};
			PageNavigation.gotoPage('/sponsor-configuration/product-types-setup', params);
		}

		vm.unauthenConfig = function () {
			if (vm.manageAllConfig || vm.manageMyOrgConfig) {
				return false;
			} else {
				return true;
			}
		}

		vm.unauthenView = function () {
			if (vm.viewAction) {
				return false;
			} else {
				return true;
			}
		}

	}
]);