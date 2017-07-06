var downloadModule = angular.module('gecscf.downloadPaymentResult');
downloadModule.factory('DownloadPaymentResultService', [ '$http', '$q',
		'Service', 'blockUI', function($http, $q, Service, blockUI) {

			var exportCSVFile = function(exportCriteria) {
				blockUI.start();
				$http({
					url : '/api/export-document/export',
					method : 'POST',
					data : exportCriteria,
					responseType : 'arraybuffer'
				}).success(function(data, status, headers, config) {
					console.log(headers);
					var file = new Blob([ data ], {
						type : 'text/csv'
					});
					// trick to download store a file having its URL
					var fileURL = URL.createObjectURL(file);
					var a = document.createElement('a');
					a.href = fileURL;
					a.target = '_blank';
					a.download = headers('fileName') + '.csv';
					document.body.appendChild(a);
					blockUI.stop();
					a.click();
				}).error(function(data, status, headers, config) {
					blockUI.stop();
				})
			}

			return {
				exportCSVFile : exportCSVFile
			}
		} ]);