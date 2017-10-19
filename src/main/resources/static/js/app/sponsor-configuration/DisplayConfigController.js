angular.module('scfApp').controller('DisplayConfigController', ['Service',
    '$log',
    '$scope',
    'PageNavigation',
    'SCFCommonService',
    function(Service, $log, $scope, PageNavigation, SCFCommonService) {
        var vm = this;
        var log = $log;

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
            	displayMode: mode
            };

            if(mode == 'TRANSACTION_DOCUMENT'){
                PageNavigation.gotoPage('/sponsor-configuration/create-transaction-displays/settings', params);
            }else if(mode == 'DOCUMENT'){
                PageNavigation.gotoPage('/sponsor-configuration/document-display/settings', params);
            }
            
        };
    }
]);