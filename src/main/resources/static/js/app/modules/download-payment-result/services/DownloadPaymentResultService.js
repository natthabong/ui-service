
var downloadModule = angular.module('gecscf.downloadPaymentResult');
downloadModule.factory('DownloadPaymentResultService', [ '$http', '$q', 'Service', 'blockUI', function($http, $q, Service, blockUI) {
	
	var exportCSVFile = function(exportCriteria){
		blockUI.start();
		$http({
			url : '/api/export-document/export',
			method : 'POST',
			data : exportCriteria,
            responseType : 'arraybuffer'
		}).success(function(data, status, headers, config) {
			blockUI.stop();
		}).error(function(data, status, headers, config) {
			blockUI.stop();
		})
	}
	
	return {
		exportCSVFile : exportCSVFile
	}
}]);