angular.module('scfApp').controller(
		'SponsorConfigController', 
		['$log', '$stateParams', 'PageNavigation', '$scope',
         	function($log, $stateParams, PageNavigation, $scope) {
				var vm = this;
			    var log = $log;
			    
			    vm.organizeModel = $stateParams.organizeModel;
			    console.log( vm.organizeModel);
			    $scope.sponsorId = vm.organizeModel.organizeId;
			    function init(){
					if(vm.organizeModel === null){
						PageNavigation.gotoPreviousPage();
					}
			    }
			    
			    init();
			}
        ]);