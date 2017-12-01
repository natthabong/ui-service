'use strict';
var txnModule = angular.module('gecscf.transaction');
txnModule
    .controller(
        'SelectReasonCodePopupController', [
            '$scope',
            'UIFactory',
            function($scope, UIFactory) {
                var vm = this;
              
                var data = $scope.ngDialogData;
                
                //copy array value and remove default reason code at first position (full partial code)
                vm.reasonCodeDropdown = data.reasonCodeDropdown.slice(1,data.reasonCodeDropdown.length );
                
                vm.model = {
                   reasonCode: vm.reasonCodeDropdown[0].value
                }
                
                vm.selected = function() {
                    $scope.closeThisDialog(vm.model.reasonCode);
                }

            }
        ]);