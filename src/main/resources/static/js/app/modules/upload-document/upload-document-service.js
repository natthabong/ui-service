angular.module('scfApp').factory('UploadDocumentService',['$http', '$q', 'blockUI', UploadDocumentService]);
function UploadDocumentService($http, $q, blockUI){
	return {
		upload: upload,
		getFileType: getFileType,
		confirmUpload: confirmUpload
	}
	function upload(fileModel){
	    	blockUI.start();
		var deffered = $q.defer();
		var formData = new FormData();
		formData.append('file', fileModel.file);
		formData.append('fileConfigId', fileModel.fileConfigId);
		$http.post('/api/upload-document/upload', formData, {
			transformRequest: angular.identity,
			headers:{'Content-type': undefined}
		}).then(function(response){
		    	blockUI.stop();
			deffered.resolve(response);
		}).catch(function(response){
		    	blockUI.stop();
			deffered.reject(response);
		});
		return deffered;
	}
	
	function getFileType(){
		var deffered = $q.defer();		
		$http.post('/api/upload-document/file-types')
		.then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject('Get file type fail');
		});
		return deffered;
	}
	
	function confirmUpload(uploadConfirmPayload){
		var deffered = $q.defer();		
		$http({
            method: 'POST',
            url: '/api/upload-document/confirm-import',
            data: uploadConfirmPayload
        }).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject(response);
		});
		return deffered;
	}
}