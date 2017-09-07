'use strict';
angular.module('scfApp').factory('DocumentUploadLogService', ['$http', '$q', 'blockUI', DocumentUploadLogService]);

function DocumentUploadLogService($http, $q, blockUI) {
    function getFileType(ownerId, integrateType) {
        var serviceUrl = 'api/v1/organize-customers/' + ownerId + '/process-types';
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
    return {
        getFileType: getFileType
    }
}