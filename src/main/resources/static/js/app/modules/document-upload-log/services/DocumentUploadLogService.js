'use strict';
angular.module('gecscf.documentUploadLog').factory('DocumentUploadLogService', ['$http', '$q', 'blockUI', DocumentUploadLogService]);

function DocumentUploadLogService($http, $q, blockUI) {
    function getFileType(currentMode, ownerId, integrateType) {
        var serviceUrl = 'api/v1/layout/' + ownerId + '/process-types';
        if(currentMode == 'MY_ORGANIZE'){
        	serviceUrl = 'api/v1/layout/me/process-types';
        }
        var deffered = $q.defer();
        $http({
            url: serviceUrl,
            method: 'GET',
            params: {
                integrateType: integrateType
            }
        }).then(function (response) {
            deffered.resolve(response);
        }).catch(function (response) {
            deffered.reject(response);
        });
        return deffered;
    }
    function getFunding() {
        var serviceUrl = 'api/v1/fundings';
        var deffered = $q.defer();
        $http({
            url: serviceUrl,
            method: 'GET',
        }).then(function (response) {
            deffered.resolve(response);
        }).catch(function (response) {
            deffered.reject(response);
        });
        return deffered;
    }
    return {
        getFileType : getFileType,
        getFunding : getFunding
    }
}