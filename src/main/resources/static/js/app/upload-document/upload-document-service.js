angular.module('scfApp').factory('UploadDocumentService',['$http', '$q', UploadDocumentService]);
function UploadDocumentService($http, $q){
	return {
		upload: upload,
		getFileType: getFileType
	}
	function upload(fileModel){
		var deffered = $q.defer();
		var formData = new FormData();
		formData.append('file', fileModel.file);
		formData.append('fileType', fileModel.fileType);
		$http.post('/api/upload-document/upload', formData, {
			transformRequest: angular.identity,
			headers:{'Content-type': undefined}
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject('Upload file fail');
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
}