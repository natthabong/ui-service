angular.module('scfApp').controller('InvoiceToPayDashboardController', [
	'$http',
	'$log',
	'$q',
	'$rootScope',
	'PageNavigation',
	'UIFactory',
	function ($http, $log, $q, $rootScope, PageNavigation, UIFactory) {
		var vm = this;
		var log = $log;
		var organizeId = $rootScope.userInfo.organizeId;

		vm.canCreatePayment = false;

		vm.decodeBase64 = function (data) {
			return (data ? atob(data) :
				UIFactory.constants.NOLOGO);
		};

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

		vm.getInvoiceToPay = function () {
			$http({
				method: 'GET',
				url: 'api/v1/create-transaction/document-groupby-duedate',
				params: {}
			}).then(function (response) {
				vm.data = response.data;
			}).catch(function (response) {
				log.error('Fail to load invoice to pay (top 10).');
			});
		}
		
		vm.showProductType = function (productType){
			if(productType == 'NONE'){
				return '';
			}else{
				return ' '+productType;
			}
		}

		function init() {
			vm.getInvoiceToPay();
		}
		init();
	}
]);