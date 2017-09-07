angular.module('gecscf.sponsorConfiguration.workflow').controller('SetupWorkflowController'
    ,['SCFCommonService','$log','UIFactory','$scope','$rootScope','$stateParams','$timeout','PageNavigation'
    ,'Service','PagingController','WorkflowService',function(SCFCommonService, $log, UIFactory
    , $scope,$rootScope, $stateParams, $timeout,PageNavigation, Service, PagingController,WorkflowService) 
    {
        var vm = this;
        var log = $log;

        vm.criteria = {

        };
        vm.workflowDorpDown = [];

        function _loadWorkflowDropDown(){
            vm.workflowDorpDown = [];
            var deffered = WorkflowService.getWorkflowDropDown();
            deffered.promise.then(function(response){
                var workflowList = response.data;
                if (workflowList !== undefined) {
                    workflowList.forEach(function(obj) {
                        var workflowObj = {
                            label: obj.workflowName,
                            value: obj.workflowId
                        }
                        vm.workflowDorpDown.push(workflowObj);
                    });
                }
                // 
            }).catch(function(response){
                log.error("Cannot load workflow Dropdown")
            });
        }

        function _loadWorkflow(workflowModel){
            var deffered = WorkflowService.getWorkflow(workflowModel);
            deffered.promise.then(function(response){
                vm.criteria = response.data;
                vm.criteria.workflowId = vm.criteria.workflowId.toString();
                _loadWorkflowDropDown();
            }).catch(function(response){
                log.error("Cannot load workflow")
            });
        }

        var initLoad = function() {
            if($stateParams.workflowModel == null){
                $timeout(function(){
                    PageNavigation.gotoPage('/customer-registration/organizes');
                }, 10);
            }else{
                var workflowModel = $stateParams.workflowModel;
                _loadWorkflow(workflowModel);
            }
        }();
        
        var _save = function(workflowModel){
            var deffered = WorkflowService.saveWorkflow(workflowModel);
            deffered.promise.then(function(response){

            }).catch(function(response){

            });
            return deffered;
        }

		vm.save = function() {
            var preCloseCallback = function(confirm) {
                PageNavigation.gotoPreviousPage(true);
            }
            
            UIFactory.showConfirmDialog({
                data : {
                    headerMessage : 'Confirm save?'
                },
                confirm : function() {
                    return _save(vm.criteria);
                },
                onFail : function(response) {
                    console.log(response)
                    if(response.status != 400){
                    var msg = {
                            409 : 'Workflow has been modified.'
                    };
                        UIFactory.showFailDialog({
                        data : {
                            headerMessage : 'Edit workflow fail.',
                            bodyMessage : msg[response.status] ? msg[response.status] : response.statusText
                        },
                        preCloseCallback : preCloseCallback
                    });
                    }
                },
                onSuccess : function(response) {
                    UIFactory.showSuccessDialog({
                        data : {
                            headerMessage : 'Edit workflow complete.',
                            bodyMessage : ''
                        },
                        preCloseCallback : preCloseCallback
                    });
                }
            });
		}

        vm.cancel = function(){
            $timeout(function(){
                PageNavigation.gotoPreviousPage();
            }, 10);
        }
    } 
]);