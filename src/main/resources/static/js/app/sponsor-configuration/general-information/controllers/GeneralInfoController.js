'use strict';
angular.module('gecscf.sponsorConfiguration.generalInfo').controller('GeneralInfoController', [
	'$stateParams',
	'GeneralInfoService',
	'PagingController',
	'scfFactory',
	function ($stateParams, GeneralInfoService, PagingController, scfFactory) {
		var vm = this;
		vm.criteria = undefined;
		vm.pagingController = undefined;

		function setCriteria() {
			vm.criteria = {
				organizeId: $stateParams.organizeId
			}
		}

		function loadTableData(pageModel) {
			var url = '/api/v1/organize-customers';
			var method = 'GET';
			vm.pagingController = PagingController.create(url, vm.criteria, method);
			vm.pagingController.search(pageModel, function (criteria, response) {
				var data = response.data;
				var pageSize = parseInt(vm.pagingController.pagingModel.pageSizeSelectModel);
				var currentPage = parseInt(vm.pagingController.pagingModel.currentPage);
				var i = 0;
				var baseRowNo = pageSize * currentPage;
				angular.forEach(data, function (value, idx) {
					++i;
					value.rowNo = baseRowNo + i;
				});
			});
		}

		function main() {
			setCriteria();
			loadTableData();
		};
		main();
	}

]);