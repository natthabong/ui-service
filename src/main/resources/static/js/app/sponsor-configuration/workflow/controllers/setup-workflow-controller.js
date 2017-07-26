angular.module('gecscf.sponsorConfiguration.workflow').controller('SetupWorkflowController'
    ,['SCFCommonService','$log','$scope','$rootScope','$stateParams','$timeout','PageNavigation'
    ,'Service','PagingController',function(SCFCommonService, $log
    , $scope,$rootScope, $stateParams, $timeout,PageNavigation, Service, PagingController) 
    {
        var vm = this;
        var initLoad = function() {
            if($stateParams.workflowModel == null){
                $timeout(function(){
                    PageNavigation.gotoPage('/organize-list/bank');
                }, 10);
            }
        }();

    } 
]);