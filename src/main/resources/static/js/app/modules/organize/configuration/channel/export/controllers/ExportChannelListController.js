'use strict';
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
    'ConfigurationUtils',
    function($log, $scope, $state, $stateParams, ngDialog, PagingController,
            PageNavigation, ConfigurationUtils) {

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

      vm.newChannel = function(callback) {
        ConfigurationUtils.showCreateExportChannelDialog({
          data: {
            organizeId: ownerId,
            channelType: 'WEB',
            showAll: true
          },
          preCloseCallback: function() {
            callback();
          }
        });
      }
      vm.newExportChannel = function(callback) {
        ConfigurationUtils.showCreateExportChannelDialog({
          data : { 
            organizeId :  vm.organizeId,
            channelType : 'WEB',
            showAll: true
          }, preCloseCallback : function() {
            callback();
          }
        });
      }
      vm.editExportChannel = function(data) {
        var params = {
          channelId: data.channelId,
          organizeId: vm.organizeId
        };
        PageNavigation.gotoPage('/customer-organize/export-channels/config',
                params, {
                  organizeId: vm.organizeId
                });
      }

      var initLoad = function() {
        vm.search();
      }();

    }]);