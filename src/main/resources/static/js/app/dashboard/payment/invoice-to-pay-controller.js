angular.module('scfApp').controller('InvoiceToPayDashboardController', [
	'$http',
	'$log',
	'$q',
	'$rootScope',
	'$scope',
	'$state',
	'$stateParams',
	'$timeout',
	'PageNavigation',
	'Service',
	'UIFactory',
	function ($http, $log, $q, $rootScope, $scope, $state, $stateParams, $timeout, PageNavigation, Service, UIFactory) {
		var vm = this;
		var log = $log;
		var organizeId = $rootScope.userInfo.organizeId;

		vm.decodeBase64 = function (data) {
			return (data ? atob(data) :
				UIFactory.constants.NOLOGO);
		};

		vm.getInvoiceToPay = function () {
			var deffered = $q.defer();

			$http({
				method: 'GET',
				url: 'api/v1/create-transaction/document-groupby-duedate',
				params: {
					buyerId: organizeId
				}
			}).then(function (response) {
				deffered.resolve(response);
			}).catch(function (response) {
				deffered.reject(response);
			});
			return deffered;
		}

		var dataSource = vm.getInvoiceToPay();

		dataSource.promise.then(function (response) {
			vm.data = response.data;
		}).catch();

		vm.create = function (data) {
			var duedate = moment(data.dueDate);
			PageNavigation.gotoPage('/my-organize/create-payment', {
				dashboardParams: {
					dueDate: duedate.toDate(),
					supplierId: data.supplierId,
					buyerCode: data.buyerCode,
					productType: data.productType == 'NONE' ? null : data.productType
				}
			})
		}
	}
]);