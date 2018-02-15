var importChannelModule = angular
        .module('gecscf.organize.configuration.channel.import');
importChannelModule
.controller('TestConnectionResultController', [ '$scope', '$rootScope', '$q','$http', function($scope, $rootScope, $q, $http) {
  
  var vm = this;
  vm.serviceInfo = angular.copy($scope.ngDialogData.serviceInfo);
  vm.data = angular.copy($scope.ngDialogData.data);
  
  
  var verifySystemStatusFTP = function(data){
       var deffered = $q.defer();
     $http({
        method: 'POST',
        url: 'api/v1/check-ftp-connection/connections/'+data.jobId
     }).then(function(response) {
        if(response.data.returnCode == "200"){
         vm.serviceInfo.status = "success";
       }else{
         vm.serviceInfo.errorMessage = response.data.returnCode + ' - ' + response.data.returnMessage;
       vm.serviceInfo.status = "fail";
       }
        
     }).catch(function(response) {
        vm.serviceInfo.errorMessage = response.status + ' - ' + response.statusText;
        vm.serviceInfo.status = "fail";
     });
   }(vm.data);
  
 } ]);