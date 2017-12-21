angular.module('scfApp').controller('DisplayConfigController', ['Service',
    '$log',
    '$scope',
    'PageNavigation',
    'SCFCommonService',
    '$stateParams',
    function(Service, $log, $scope, PageNavigation, SCFCommonService,$stateParams) {
        var vm = this;
        var log = $log;
        var organizeId = $stateParams.organizeId;
        vm.viewAllConfig=false;
		vm.manageAllConfig=false;

        vm.unauthenConfig = function(){
			if(vm.viewAllConfig || vm.manageAllConfig){
				return false;
			}else{
				return true;
			}
		}
        
        vm.setupDisplayDocument = function(type, mode) {
            var params = {
            	accountingTransactionType: type,
            	displayMode: mode,
                organizeId: organizeId
            };

            if(mode == 'TRANSACTION_DOCUMENT'){
                PageNavigation.gotoPage('/sponsor-configuration/create-transaction-displays/settings', params);
            }else if(mode == 'DOCUMENT'){
                PageNavigation.gotoPage('/sponsor-configuration/document-display/settings', params);
            }
            
        };
    }
]);