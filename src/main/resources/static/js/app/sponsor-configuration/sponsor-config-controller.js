angular.module('scfApp').controller(
		'SponsorConfigController', 
		['$log', '$stateParams', 'PageNavigation', '$scope', '$rootScope',
         	function($log, $stateParams, PageNavigation, $scope, $rootScope) {
				var vm = this;
			    var log = $log;
			    
			    vm.organizeModel = $stateParams.organizeModel;
			    $scope.sponsorId = vm.organizeModel.organizeId;
				$rootScope.sponsorId = vm.organizeModel.organizeId;
				
			    function init(){
					if(vm.organizeModel === null){
						PageNavigation.gotoPreviousPage();
					}
			    }
			    
			    init();
			}
        ]);