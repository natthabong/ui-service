var exportChannelModule = angular
        .module('gecscf.organize.configuration.channel.export');
exportChannelModule.controller('ExportChannelListController', [
    '$log',
    '$scope',
    '$state',
    '$stateParams',
    'ngDialog',
    'PagingController',
    'PageNavigation',
    function($log, $scope, $state, $stateParams, ngDialog, PagingController, PageNavigation) {

      var vm = this;
      vm.organizeId = $stateParams.organizeId || null;
      vm.criteria = $stateParams.criteria || {};
      vm.pagingController = PagingController.create(
              '/api/v1/organize-customers/' + vm.organizeId
                      + '/export-channels', vm.criteria, 'GET');

      vm.search = function(pageModel) {
        vm.pagingController.search(pageModel, function(criteriaData, response) {
        });
      }
      
      vm.editExportChannel = function(data){
         var params = {
                channelId: data.channelId,
                organizeId:  vm.organizeId
              };
          PageNavigation.gotoPage('/customer-organize/export-channels/config', params, {
            organizeId:  vm.organizeId
          });
      }
      
      var initLoad = function() {
        vm.search();
      }();

    }]);