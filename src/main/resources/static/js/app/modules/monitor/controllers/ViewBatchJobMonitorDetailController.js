'use strict';
var scfApp = angular.module('gecscf.monitoring');
scfApp.controller('ViewBatchJobMonitorDetailController', 
[ '$scope', 'Service', '$stateParams', 'UIFactory', '$q','$rootScope', '$http','PageNavigation','PagingController', '$timeout',
	'JobStatus',
	function($scope, Service, $stateParams, UIFactory, $q, $rootScope, $http, PageNavigation, PagingController, $timeout, JobStatus) {
        var vm = this;

        vm.batchTrackingDetail = $stateParams.trackingDetailModel;
        var batchTracking = $stateParams.params;
        vm.jobStatusDropdowns = JobStatus;
        vm.status = '';
        
        vm.criteria = {
        	completed : null
		}
        
        vm.back = function(){
            $timeout(function(){
                PageNavigation.backStep();
            }, 10);
        }

        vm.pagingController = PagingController.create('/api/v1/organizations/'+batchTracking.jobGroup+'/batch-jobs/'+batchTracking.jobId+'/logs/'+vm.batchTrackingDetail.id+'/details', vm.criteria, 'GET');
        vm.pagingController.offsetBase = false;
        
        vm.searchTrackingDetail = function(pageModel) {
        	JobStatus.forEach(function(status) {
				if (vm.status == status.value) {
					vm.criteria.completed = status.valueObject;
				}
			});
            vm.pagingController.search(pageModel);
	    }
        
        var initial = function(){
            if(batchTracking.length == 0){
                PageNavigation.gotoPage("/monitoring/customer-system-integration",undefined,undefined);
            }else{
            	vm.searchTrackingDetail();
            }
        }
        initial();

} ]);
scfApp.constant("JobStatus", [ {
    label : 'All',
    value : '',
    valueObject : null
}, {
    label : 'Completed',
    value : 'true',
    valueObject : true
}, {
    label : 'Incomplete',
    value : 'false',
    valueObject : false
}]);