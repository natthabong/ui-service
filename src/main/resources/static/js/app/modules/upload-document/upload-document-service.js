angular.module('scfApp').factory('UploadDocumentService', ['$http', '$q', 'blockUI', UploadDocumentService]);

function UploadDocumentService($http, $q, blockUI) {
    return {
        upload: upload,
        getFileType: getFileType,
        confirmUpload: confirmUpload,
        verifyChannel: verifyChannel,
        verifyFileSize: verifyFileSize
    }

    function upload(fileModel) {
        blockUI.start();
        var deffered = $q.defer();
        var formData = new FormData();
        formData.append('file', fileModel.file);
        formData.append('fileConfigId', fileModel.fileConfigId);
        $http.post('/api/upload-document/upload', formData, {
            transformRequest: angular.identity,
            headers: { 'Content-type': undefined }
        }).then(function(response) {
            blockUI.stop();
            deffered.resolve(response);
        }).catch(function(response) {
            blockUI.stop();
            deffered.reject(response);
        });
        return deffered;
    }
    
    function verifyFileSize(fileModel) {
        blockUI.start();
        var deffered = $q.defer();
        var formData = new FormData();
        console.log(fileModel.file);
        console.log(fileModel.file.size+"");
        formData.append('fileSize', fileModel.file.size+"");
        formData.append('fileName', fileModel.file.name);
        formData.append('fileConfigId', fileModel.fileConfigId);
        $http.post('/api/upload-document/verify', formData, {
            transformRequest: angular.identity,
            headers: { 'Content-type': undefined }
        }).then(function(response) {
            blockUI.stop();
            deffered.resolve(response);
        }).catch(function(response) {
            blockUI.stop();
            deffered.reject(response);
        });
        return deffered;
    }

    function getFileType(processType) {
        var deffered = $q.defer();
        $http.get('/api/upload-document/file-types')
            .then(function(response) {
                deffered.resolve(response);
            }).catch(function(response) {
                deffered.reject('Get file type fail');
            });
        return deffered;
    }

    function confirmUpload(uploadConfirmPayload) {
        var deffered = $q.defer();
        $http({
            method: 'POST',
            url: '/api/upload-document/confirm-import',
            data: uploadConfirmPayload
        }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
            deffered.reject(response);
        });
        return deffered;
    }

    function verifyChannel(channel) {
        var deffered = $q.defer();
        $http.post('/api/v1/channels/' + channel + '/verify', {

        }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
            deffered.reject(response);
        });
        return deffered;
    }
}