angular.module('scfApp').controller('WorkflowController',['SCFCommonService','$log','$scope','$rootScope',
    '$stateParams','$timeout','PageNavigation','Service','PagingController',function(SCFCommonService, $log
    , $scope,$rootScope, $stateParams, $timeout,PageNavigation, Service, PagingController) 
    {
        var vm = this;
        
        if($stateParams.organizeModel != null){
            var organizeModel = $stateParams.organizeModel;	
        }else{
            var organizeModel = $rootScope.organizeModel;
        }

        vm.dataTable = {
            identityField : 'type',
            options : {},
            columns : [
            {
                fieldName : 'type',
                labelEN : 'Type',
                labelTH : 'Type',
                id : 'type-{value}-label',
                filterType : 'translate',
                cssTemplate : 'text-left'
            },
            {
                fieldName : 'workflow',
                labelEN : 'Workflow',
                labelTH : 'Workflow',
                id : 'workflow-{value}-label',
                filterType : 'translate',
                cssTemplate : 'text-center'
            },
            {
                cssTemplate : 'text-center',
                sortData : false,
                cellTemplate : '<scf-button id="{{data.type}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.setup(data)" title="Config a workflow"><i class="fa fa-cog fa-lg" aria-hidden="true"></i></scf-button>'
            } ]
        }
        
        
        vm.setup = function(data){

        }

         var initLoad = function() {
            if(!angular.isUndefined(organizeModel)){
                var owner = organizeModel.organizeId;
                var getWorkflowUrl = "/api/v1/organizes/"+owner+"/workflows";
                vm.pagingController = PagingController.create(getWorkflowUrl, {}, 'GET');
                vm.pagingController.search();
                
                //data test
                vm.pagingController.tableRowCollection = [{type:"test",workflow:"make-app"}];
            }
        }();
    } ]);