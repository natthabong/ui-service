var downloadModule = angular.module('gecscf.downloadPaymentResult');
downloadModule.controller('DownloadPaymentResultController', [
    '$scope',
    '$rootScope',
    'UIFactory',
    'PageNavigation',
    'PagingController',
    'scfFactory',
    'DownloadPaymentResultService',
    function($scope, $rootScope, UIFactory, PageNavigation, PagingController,
            scfFactory, DownloadPaymentResultService) {
      var vm = this;
      vm.openPaymentDate = false;
      vm.openCalendarPaymentDate = function() {
        vm.openPaymentDate = true;
      }
      vm.fileType = null;
      var _validate = function() {
        var valid = true;
        $scope.errors = {};
        if (angular.isUndefined(vm.paymentDate)) {
          valid = false;
          $scope.errors.paymentDate = {
            message: 'Wrong date format data.'
          }
        } else if (vm.paymentDate == null || vm.paymentDate == '') {
          valid = false;
          $scope.errors.paymentDate = {
            message: 'Payment date is required.'
          }
        }

        return valid;
      }

      vm.downloadAction = function() {
        if (_validate()) {
          var exportCriteria = {
            paymentDate: vm.paymentDate,
            fileType: vm.fileType
          }
          var differd = DownloadPaymentResultService
                  .exportPaymentResultFile(exportCriteria);
        }
      }
      vm.exportLayoutDropdowns = [];
      $scope.multiLayout = false;
      var init = function() {
        var defered = scfFactory.getUserInfo();
        defered.promise.then(function(response) {
          var organizeId = $rootScope.userInfo.organizeId;
          DownloadPaymentResultService.getExportLayouts(organizeId).promise
                  .then(function(response) {
                    var exportLayouts = response.data;
                    if (exportLayouts != null) {
                      if(exportLayouts.length > 1){
                        vm.exportLayoutDropdowns = [{
                          value: 'ALL',
                          label: 'All'
                        }];
                        $scope.multiLayout = true;
                      }
                      else{
                        $scope.multiLayout = false;
                      }
                      exportLayouts.forEach(function(data) {
                        var productTypeData = {
                          value: data.productType,
                          label: data.displayName
                        }
                        vm.exportLayoutDropdowns.push(productTypeData);
                        
                      });
                      vm.fileType = vm.exportLayoutDropdowns[0].value;
                    }
                  });
        });
      }();
    }]);