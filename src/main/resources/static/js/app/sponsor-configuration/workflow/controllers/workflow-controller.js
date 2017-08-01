angular.module('gecscf.sponsorConfiguration.workflow').controller('WorkflowController',['SCFCommonService','$log','$scope','$rootScope',
    '$stateParams','$timeout','PageNavigation','Service','PagingController',function(SCFCommonService, $log
    , $scope,$rootScope, $stateParams, $timeout,PageNavigation, Service, PagingController) 
    {
        var vm = this;
        var log = $log;

        vm.pagingController = {
            tableRowCollection : null
        }
        
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
                id : 'type-{value}',
                filterType : 'translate',
                cssTemplate : 'text-left'
            },
            {
                fieldName : 'workflow',
                labelEN : 'Workflow',
                labelTH : 'Workflow',
                id : 'workflow-{value}',
                filterType : 'translate',
                cssTemplate : 'text-left'
            },
            {
                cssTemplate : 'text-center',
                sortData : false,
                cellTemplate : '<scf-button id="{{data.type}}-setup-button" class="btn-default gec-btn-action" ng-click="ctrl.setup(data)" title="Config a workflow"><i class="fa fa-cog" aria-hidden="true"></i></scf-button>'
            } ]
        }
        
        
        vm.setup = function(data){
            $timeout(function(){
                PageNavigation.gotoPage('/sponsor-configuration/workflow/setup', {workflowModel:data});
            }, 10);
        }

         var initLoad = function() {
            if(!angular.isUndefined(organizeModel)){
                var owner = organizeModel.organizeId;
                var getWorkflowUrl = "/api/v1/organizes/"+owner+"/workflows";
                var deferred = Service.requestURL(getWorkflowUrl, {}, 'GET');
                deferred.promise.then(function(response) {
                    var dataFromDB = response;
                    var list = [];
                    if(dataFromDB.length > 0){
                        for(var i=0; i<dataFromDB.length; i++){
                            list.push({
                                workflowId : dataFromDB[i].workflowId,
                                organizeId : dataFromDB[i].organizeId,
                                module : dataFromDB[i].module,
                                type : dataFromDB[i].workflowType,
                                workflow : dataFromDB[i].workflow.workflowName
                            });
                        }
                    }
                    vm.pagingController.tableRowCollection = list;
                }).catch(function(response) {
                    log.error('Cannot load workflow');
                });
            }
        }();
    } ]);