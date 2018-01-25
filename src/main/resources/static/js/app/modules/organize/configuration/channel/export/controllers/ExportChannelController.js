var exportChannelModule = angular
        .module('gecscf.organize.configuration.channel.export');
exportChannelModule.controller('ExportChannelController', ['$log', '$scope',
    '$state', '$stateParams', function($log, $scope, $state, $stateParams) {

      var vm = this;
      var channelId = $stateParams.channelId;
      var organizeId = $stateParams.organizeId;

    }]);