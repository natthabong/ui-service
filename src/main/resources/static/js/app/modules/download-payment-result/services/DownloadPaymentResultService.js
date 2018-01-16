var downloadModule = angular.module('gecscf.downloadPaymentResult');
downloadModule.service('DownloadPaymentResultService', ['$http', '$q',
    'blockUI', function($http, $q, blockUI) {

      this.exportPaymentResultFile = function(exportCriteria) {
        blockUI.start();
        $http({
          url: '/api/v1/export-document/export',
          method: 'POST',
          data: exportCriteria,
          responseType: 'arraybuffer'
        }).success(function(data, status, headers, config) {
          var file = new Blob([data], {
            type: 'text/csv'
          });
          // trick to download store a file having its URL
          var fileURL = URL.createObjectURL(file);
          var a = document.createElement('a');
          a.href = fileURL;
          a.target = '_blank';
          a.download = headers('fileName');
          document.body.appendChild(a);
          blockUI.stop();
          a.click();
        }).error(function(data, status, headers, config) {
          blockUI.stop();
        })
      }

      this.getExportLayouts = function(ownerId) {
        var differed = $q.defer();
        var reqUrl = '/api/v1/organize-customers/' + ownerId + '/export-channels';
        $http({
          url: reqUrl,
          method: 'GET',
          params: {
            channelType: 'WEB'
          }
        }).then(function (response) {
          differed.resolve(response);
        }).catch(function (response) {
          differed.resolve(response);
        });
        return differed;
      }

    }]);