var channelModule = angular.module('gecscf.organize.configuration.channel');
channelModule.controller('SetupFileEncryptionController', ['$scope', '$rootScope', 'ENCRYPT_TYPE_DROPDOWN', function ($scope, $rootScope, ENCRYPT_TYPE_DROPDOWN) {
  var vm = this;
  vm.encryptType = angular.copy($scope.ngDialogData.encryptType);
  vm.encryptPassword = angular.copy($scope.ngDialogData.encryptPassword);
  vm.decryptPrivateKey = angular.copy($scope.ngDialogData.decryptPrivateKey);
  vm.encryptInfo = {
    encryptType: vm.encryptType,
    encryptPassword: null,
    decryptPrivateKey: vm.decryptPrivateKey
  }

  vm.encryptTypeDropdown = ENCRYPT_TYPE_DROPDOWN;
  vm.isShowPGPInfo = false;

  vm.encryptTypeChange = function () {
    vm.showPasswordMessageError = false;
    if (vm.encryptInfo.encryptType == 'PGP') {
      vm.isShowPGPInfo = true;
    } else {
      vm.isShowPGPInfo = false;
    }
  }

  vm.encryptTypeChange();

  vm.validate = function () {
    var isValid = true;
    vm.showPasswordMessageError = false;

    if (vm.encryptInfo.encryptType == 'PGP') {
      if (vm.encryptInfo.encryptPassword == null || vm.encryptInfo.encryptPassword == '') {
        vm.showPasswordMessageError = true;
        vm.passwordMessageError = "PGP Password Require";
        isValid = false;
      }
    }

    if (isValid) {
      $scope.closeThisDialog(vm.encryptInfo);
    }
  }
}]);