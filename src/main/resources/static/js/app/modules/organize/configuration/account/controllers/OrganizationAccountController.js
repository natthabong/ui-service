'use strict';
angular.module('gecscf.organize.configuration').controller('OrganizationAccountController', [
	'$stateParams',
	'OrganizationAccountService',
	'PagingController',
	'UIFactory',
	'$filter',
	function ($stateParams, OrganizationAccountService, PagingController, UIFactory, $filter) {
		var vm = this;
		vm.canManage=false;
		vm.criteria = {
			organizeId: $stateParams.organizeId
		};
		
		vm.unauthenManage = function() {
            if (vm.canManage) {
                return false;
            } else {
                return true;
            }
        }
		
		function loadTableData(pageModel) {
			var url = '/api/v1/accounts';
			var method = 'GET';
			vm.pagingController = PagingController.create(url, vm.criteria, method);
			vm.pagingController.search(pageModel);
		}
		
		vm.getAccountNoToDisplay = function (record) {
			if (record.format) {
				return $filter('accountNoDisplay')(record.accountNo);
			} else {
				return record.accountNo;
			}

		}
		
		vm.addAccount = function () {
			UIFactory.showDialog({
				templateUrl: '/js/app/modules/organize/configuration/account/templates/dialog-new-account.html',
				controller: 'AccountController',
				data: {
					mode: 'ADD',
					organizeId: vm.criteria.organizeId
				},
				preCloseCallback: function (data) {
					if (data) {
						vm.search();
					}
				}
			});
		}

		function init() {
			loadTableData();
		};
		init();
	}

]);