
var downloadModule = angular.module('gecscf.downloadPaymentResult');
downloadModule.controller('DownloadPaymentResultController', [
	'$scope',
	'$stateParams',
	'UIFactory',
	'PageNavigation',
	'PagingController',
	'DownloadPaymentResultService',
	function($scope, $stateParams, UIFactory, PageNavigation, PagingController, DownloadPaymentResultService) {
		var vm = this;
		vm.openPaymentDate = false;
		vm.openCalendarPaymentDate = function(){
			vm.openPaymentDate = true;
		}
		
		var _validate = function(){
			var valid = true;
			$scope.errors = {};
			if(angular.isUndefined(vm.paymentDate)){
				valid = false;
				$scope.errors.paymentDate = {
						message : 'Wrong date format data.'
			    }
			}else if(vm.paymentDate == null || vm.paymentDate == ''){
				valid = false;
				$scope.errors.paymentDate = {
						message : 'Payment date is required.'
			    }
			}

			return valid;
		}

		vm.downloadAction = function(){
			if(_validate()){
				var exportCriteria = {
						paymentDate : vm.paymentDate
				}
				var differd = DownloadPaymentResultService.exportPaymentResultFile(exportCriteria);
			}
		}
	}
]);