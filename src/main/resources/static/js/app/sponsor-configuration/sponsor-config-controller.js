angular.module('scfApp').controller(
		'SponsorConfigController', 
		['Service', '$log', '$stateParams', '$log', 'PageNavigation',
         	function(ViewTransactionService, $stateParams, $log, PageNavigation) {
				var vm = this;
			    var log = $log;
			    
			    vm.organizeModel = $stateParams.organizeModel;
			    
			    function init(){
					if(vm.organizeModel === null){
						PageNavigation.gotoPreviousPage();
					}
			    }
			    
			    init();
			}
        ]);