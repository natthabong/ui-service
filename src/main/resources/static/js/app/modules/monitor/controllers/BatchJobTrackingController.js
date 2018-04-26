'use strict';
var scfApp = angular.module('gecscf.monitoring');
scfApp.controller('BatchJobTrackingController', [ '$scope', 'Service', '$stateParams', '$log', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','ngDialog','$timeout',
	function($scope, Service, $stateParams, $log, PagingController, UIFactory, $q, $rootScope, $http, PageNavigation, ngDialog, $timeout) {
        var vm = this;

        vm.splitePageTxt = '';
        
        vm.dateFormat = "dd/MM/yyyy";
		vm.openDateFrom = false;
		vm.openDateTo = false;
		vm.defaultPageSize = '20';
		vm.defaultPage = 0;
		
		vm.batchJobTracking = $stateParams.params;
		var customerModel = $stateParams.customerModel;
		var ownerId = vm.batchJobTracking.jobGroup;
		var jobId = vm.batchJobTracking.jobId;
		
        vm.backPage = function(){
        	$timeout(function () {
                PageNavigation.backStep();
            }, 10);
        }

		vm.pageModel = {
			pageSizeSelectModel : vm.defaultPageSize,
			totalRecord : 0,
			totalPage : 0,
			currentPage : vm.defaultPage,
			clearSortOrder : false
		};
		
		vm.pageSizeList = [ {
			label : '10',
			value : '10'
		}, {
			label : '20',
			value : '20'
		}, {
			label : '50',
			value : '50'
		} ];

		var cssTemplate = function(record,align){
			if(record.messageType === 'WARNING')
				return 'message-warnning-text-'+align
			else
				return 'text-'+align
		}
		
		
		vm.searchCriteria = {
			batchJobId: undefined,
			logDateFrom : undefined,
			logDateTo : undefined,
			processNo : ''
		}
		
		vm.initLoad = function() {
			var backAction = $stateParams.backAction;
			var currentPage = 0;
			if(backAction){
				vm.batchJobTracking = $stateParams.params;
				vm.logListModel = $stateParams.logListModel;
				currentPage = $stateParams.pagingModel.currentPage;
			}
			
			if($stateParams.params.length == 0){
				PageNavigation.gotoPage("/monitoring/customer-system-integration",undefined,undefined);
            }
			
			vm.logListModel.batchJobName = vm.batchJobTracking.jobName;
			vm.searchBatchJobLog();
			vm.pagingController.pagingModel.currentPage = currentPage;
		}
		
		function prepareCriteria() {
			if (angular.isDate(vm.logListModel.logDateFrom)) {
				vm.searchCriteria.logDateFrom = vm.logListModel.logDateFrom

				var hour = 0;
				var min = 0;
				
				if(vm.logListModel.logTimeFromHour!==''&&vm.logListModel.logTimeFromMinute!==''){
					hour = vm.logListModel.logTimeFromHour;
					min = vm.logListModel.logTimeFromMinute;
				}		
				
				var datetime = new Date(vm.logListModel.logDateFrom.getFullYear(), 
						vm.logListModel.logDateFrom.getMonth(), 
						vm.logListModel.logDateFrom.getDate(), 
						hour, min, 0);
				vm.searchCriteria.logDateFrom = datetime;
			}else{
				vm.searchCriteria.logDateFrom = undefined;
			}

			if (angular.isDate(vm.logListModel.logDateTo)) {
				vm.searchCriteria.logDateTo = vm.logListModel.logDateTo;
				
				var hour = 23;
				var min = 59;
				
				if(vm.logListModel.logTimeToHour!==''&&vm.logListModel.logTimeToMinute!==''){
					hour = vm.logListModel.logTimeToHour;
					min = vm.logListModel.logTimeToMinute;
				}		
				
				var datetime = new Date(vm.logListModel.logDateTo.getFullYear(), 
						vm.logListModel.logDateTo.getMonth(), 
						vm.logListModel.logDateTo.getDate(), 
						hour, min, 0);
				vm.searchCriteria.logDateTo = datetime;
			}else{
				vm.searchCriteria.logDateTo = undefined;
			}
			
			vm.searchCriteria.batchJobId = UIFactory.createCriteria(jobId);
			vm.searchCriteria.processNo = UIFactory.createCriteria(vm.logListModel.processNo);
			return vm.searchCriteria;
		}

		vm.pagingController = PagingController.create('/api/v1/organizes/'+ownerId+'/batch-jobs/'+jobId+"/logs", vm.searchCriteria, 'GET');
		vm.pagingController.offsetBase = false;
		
		vm.viewDetail = function(data){
			var params = {params: vm.batchJobTracking, customerModel: customerModel, logListModel: vm.logListModel, pagingModel: vm.pagingController.pagingModel, trackingDetailModel: data};
			PageNavigation.nextStep('/view-batch-job-tracking-detail', params,{params : params.params ,customerModel : params.customerModel, logListModel : params.logListModel, pagingModel : params.pagingModel, trackingDetailModel : params.trackingDetailModel});
		}

		vm.searchBatchJobLog = function(pageModel){
			if (isValid()) {
				var criteria = prepareCriteria();
				var logDiferred = vm.pagingController.search(pageModel);
				vm.showInfomation = true;
			}
		}
		
		vm.openCalendarDateFrom = function() {
			vm.openDateFrom = true;
		}

		vm.openCalendarDateTo = function() {
			vm.openDateTo = true;
		}
		
		var isValid = function() {
			var valid = true;
			vm.wrongDateFormat = false;
			vm.wrongDateFromTo = false;
			
			//Wrong date format
			if (angular.isUndefined(vm.logListModel.logDateFrom)||angular.isUndefined(vm.logListModel.logDateTo)) {
				valid = false;
			}else{
				if(vm.logListModel.logTimeFromHour!==''&&vm.logListModel.logTimeFromMinute!==''&&!angular.isDate(vm.logListModel.logDateFrom)){
					valid = false;
				}else if(vm.logListModel.logTimeToHour!==''&&vm.logListModel.logTimeToMinute!==''&&!angular.isDate(vm.logListModel.logDateTo)){
					valid = false;
				}
			}
			
			//Wrong time format
			if(angular.isDefined(vm.logListModel.logDateFrom)){
				if(vm.logListModel.logTimeFromHour===''&&vm.logListModel.logTimeFromMinute===''){
					valid = true;
				}else if(vm.logListModel.logTimeFromHour!==''&&vm.logListModel.logTimeFromMinute!==''){
					if(isNaN(parseInt(vm.logListModel.logTimeFromHour)) || vm.logListModel.logTimeFromHour.length == 1 || vm.logListModel.logTimeFromHour<0 || vm.logListModel.logTimeFromHour>=24){
						valid = false;
					}else{
						if (isNaN(parseInt(vm.logListModel.logTimeFromMinute)) || vm.logListModel.logTimeFromMinute.length == 1 || vm.logListModel.logTimeFromMinute<0 || vm.logListModel.logTimeFromMinute>=60) {
							valid = false;
						}
					}
				}else{
					valid = false;
				}
			}
			
			if(valid){
				if(angular.isDefined(vm.logListModel.logDateTo)){
					if(vm.logListModel.logTimeToHour===''&&vm.logListModel.logTimeToMinute===''){
						valid = true;
					}else if((vm.logListModel.logTimeToHour!==''&&vm.logListModel.logTimeToMinute!=='')){
						if(isNaN(parseInt(vm.logListModel.logTimeToHour)) || vm.logListModel.logTimeToHour.length == 1 || vm.logListModel.logTimeToHour<0 || vm.logListModel.logTimeToHour>=24){
							valid = false;
						}else{
							if (isNaN(parseInt(vm.logListModel.logTimeToMinute)) || vm.logListModel.logTimeToMinute.length == 1 || vm.logListModel.logTimeToMinute<0 || vm.logListModel.logTimeToMinute>=60) {
								valid = false;
							}
						}
					}else{
						valid = false;
					}
				}
			}
			
			
			if(!valid){
				vm.wrongDateFormat = true;
				vm.wrongDateFromTo = false;
			}else{
				//Wrong date from to
				if (angular.isDate(vm.logListModel.logDateFrom)&&angular.isDate(vm.logListModel.logDateTo)) {
					var hourFrom = vm.logListModel.logTimeFromHour;
					var minuteFrom = vm.logListModel.logTimeFromMinute;
					var hourTo = vm.logListModel.logTimeToHour;
					var minuteTo = vm.logListModel.logTimeToMinute;
					
					if(hourFrom===''){
						hourFrom = 0;
					}
					if(minuteFrom===''){
						minuteFrom = 0;
					}
					if(hourTo===''){
						hourTo = 23;
					}
					if(minuteTo===''){
						minuteTo = 59;
					}
					
					var datetimeFrom = new Date(vm.logListModel.logDateFrom.getFullYear(), 
							vm.logListModel.logDateFrom.getMonth(), 
							vm.logListModel.logDateFrom.getDate(), 
							hourFrom, minuteFrom, 0);
					var datetimeTo = new Date(vm.logListModel.logDateTo.getFullYear(), 
							vm.logListModel.logDateTo.getMonth(), 
							vm.logListModel.logDateTo.getDate(), 
							hourTo, minuteTo, 0);
					
					if(datetimeFrom > datetimeTo){
						valid = false;
						vm.wrongDateFormat = false;
						vm.wrongDateFromTo = true;
					}
				}
			}
			
			return valid;
		};
		
		vm.logListModel = {
			batchJobName : undefined,
			logDateFrom : '',
			logDateTo : '',
			logTimeFromHour: '',
			logTimeFromMinute: '',
			logTimeToHour: '',
			logTimeToMinute: '',
			processNo : undefined
		}
		
		vm.initLoad();
		
} ]);