'use strict';
angular.module('gecscf.organize.configuration.productType').controller('ProductTypeController', [
	'$stateParams',
	'PageNavigation',
	function ($stateParams, PageNavigation) {
		var vm = this;
		var organizeId = $stateParams.organizeId;

		vm.manageAllConfig = false;
		vm.manageConfig = false;
		vm.viewAction = false;

		vm.gotoConfigPage = function () {
			var params = {
				organizeId: organizeId
			};
			PageNavigation.gotoPage('/organizations/product-types/configuration', params);
		}

		vm.gotoListPage = function () {
			var params = {
				organizeId: organizeId
			};
			PageNavigation.gotoPage('/organizations/product-types/list', params);
		}

		vm.unauthenConfig = function () {
			if (vm.manageAllConfig || vm.manageConfig) {
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