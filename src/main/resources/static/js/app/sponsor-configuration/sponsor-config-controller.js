angular.module('scfApp').controller(
		'SponsorConfigController', 
		['$log', '$stateParams', 'PageNavigation', '$scope', '$rootScope',
         	function($log, $stateParams, PageNavigation, $scope, $rootScope) {
				var vm = this;
			    var log = $log;
			    
			    if($stateParams.organizeId != null){
			    	$rootScope.organizeModel = $stateParams.organizeModel;
			    }
			    
			    vm.organizeModel = $rootScope.organizeModel;
				if(angular.isUndefined(vm.organizeModel)){
					PageNavigation.gotoPage('/settings/organizes');
				}
			    $scope.sponsorId = vm.organizeModel.organizeId;
				$rootScope.sponsorId = vm.organizeModel.organizeId;
				
				$scope.backAction = function() {
					PageNavigation.gotoPreviousPage();
			    }
				
			    function init(){
					if(vm.organizeModel === null){
						PageNavigation.gotoPreviousPage();
					}
			    }
			    init();
			}
        ]);