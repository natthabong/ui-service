'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('BatchJobTrackingController', [ '$scope', 'Service', '$stateParams', '$log', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','ngDialog',
	function($scope, Service, $stateParams, $log, PagingController, UIFactory, $q, $rootScope, $http, PageNavigation, ngDialog) {
        var vm = this;

        vm.splitePageTxt = '';
        
        vm.dateFormat = "dd/MM/yyyy";
		vm.openDateFrom = false;
		vm.openDateTo = false;
		vm.defaultPageSize = '20';
		vm.defaultPage = 0;
		
		vm.logTimeFromHour = '';
		vm.logTimeFromMinute = '';
		vm.logTimeToHour = '';
		vm.logTimeToMinute = '';
		
		vm.batchJobTracking = $stateParams.params;
		var ownerId = vm.batchJobTracking.jobGroup;
		var jobId = vm.batchJobTracking.jobId;
		
        vm.backPage = function(){
            PageNavigation.gotoPreviousPage();
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
		
		vm.dataTable = {
			options : {
				
			},
			columns : [
				{
					fieldName : 'date',
					field : 'actionTime',
					label : 'Date',
					idValueField : 'template',
					id : 'date-{value}-label',
					sortable : false,
	                filterType : 'date',
	                filterFormat : 'dd/MM/yyyy HH:mm:ss',
					cssTemplate : function(record){
						return cssTemplate(record,'left')
					}
				},{
					fieldName : 'processNo',
					field : 'processNo',
					label : 'Process no',
					idValueField : 'template',
					id : 'process-no-{value}-label',
					sortable : false,
					cssTemplate : function(record){
						return cssTemplate(record,'left')
					}
				},{
					fieldName : 'jobName',
					field : 'jobName',
					label : 'Batch job',
					idValueField : 'template',
					id : 'batch-job-{value}-label',
					sortable : false,
					cssTemplate : function(record){
						return cssTemplate(record,'left')
					}
				},{
					fieldName : 'node',
					field : 'node',
					label : 'Node',
					idValueField : 'template',
					id : 'node-{value}-label',
					sortable : false,
					cssTemplate : function(record){
						return cssTemplate(record,'left')
					}
				},{
					fieldName : 'ipAddress',
					field : 'ipAddress',
					label : 'IP',
					idValueField : 'template',
					id : 'ip-address-{value}-label',
					sortable : false,
					cssTemplate : function(record){
						return cssTemplate(record,'left')
					}
				},{
					fieldName : 'action',
					field : 'action',
					label : 'Action',
					idValueField : 'template',
					id : 'action-{value}-label',
					sortable : false,
					cellTemplate : '{{data | batchJob}}',
					cssTemplate : function(record){
						return cssTemplate(record,'left')
					}
				},{
					cssTemplate : 'text-center',
					sortable : false,
					cellTemplate : '<scf-button ng-disabled="!data.errorMessage" class="btn-default gec-btn-action" id="{{$parent.$index + 1}}-view-button" ng-click="ctrl.viewMessage(data)" title="View"><i class="fa fa-search" aria-hidden="true"></i></scf-button>'
				} ]
		}
		
		vm.searchCriteria = {
			batchJobId: undefined,
			logDateFrom : undefined,
			logDateTo : undefined,
			processNo : ''
		}
		
		vm.initLoad = function() {
			if($stateParams.params.length == 0){
            	PageNavigation.gotoPreviousPage();
            }
			
			vm.logListModel.batchJobName = vm.batchJobTracking.jobName;
			vm.searchBatchJobLog();
		}
		
		function prepareCriteria() {
			if (angular.isDate(vm.logListModel.logDateFrom)) {
				vm.searchCriteria.logDateFrom = vm.logListModel.logDateFrom

				var hour = 0;
				var min = 0;
				
				if(vm.logTimeFromHour!==''&&vm.logTimeFromMinute!==''){
					hour = vm.logTimeFromHour;
					min = vm.logTimeFromMinute;
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
				
				if(vm.logTimeToHour!==''&&vm.logTimeToMinute!==''){
					hour = vm.logTimeToHour;
					min = vm.logTimeToMinute;
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

		vm.pagingController = PagingController.create('api/v1/organizes/'+ownerId+'/batch-jobs/'+jobId+"/logs", vm.searchCriteria, 'GET');

		vm.viewMessage = function(data){
			var params = {params: data};
			PageNavigation.gotoPage('/view-batch-job-tracking-message', params,[]);
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
				if(vm.logTimeFromHour!==''&&vm.logTimeFromMinute!==''&&!angular.isDate(vm.logListModel.logDateFrom)){
					valid = false;
				}else if(vm.logTimeToHour!==''&&vm.logTimeToMinute!==''&&!angular.isDate(vm.logListModel.logDateTo)){
					valid = false;
				}
			}
			
			//Wrong time format
			if(angular.isDefined(vm.logListModel.logDateFrom)){
				if(vm.logTimeFromHour===''&&vm.logTimeFromMinute===''){
					valid = true;
				}else if(vm.logTimeFromHour!==''&&vm.logTimeFromMinute!==''){
					if(isNaN(parseInt(vm.logTimeFromHour)) || vm.logTimeFromHour.length == 1 || vm.logTimeFromHour<0 || vm.logTimeFromHour>=24){
						valid = false;
					}else{
						if (isNaN(parseInt(vm.logTimeFromMinute)) || vm.logTimeFromMinute.length == 1 || vm.logTimeFromMinute<0 || vm.logTimeFromMinute>=60) {
							valid = false;
						}
					}
				}else{
					valid = false;
				}
			}
			
			if(valid){
				if(angular.isDefined(vm.logListModel.logDateTo)){
					if(vm.logTimeToHour===''&&vm.logTimeToMinute===''){
						valid = true;
					}else if((vm.logTimeToHour!==''&&vm.logTimeToMinute!=='')){
						if(isNaN(parseInt(vm.logTimeToHour)) || vm.logTimeToHour.length == 1 || vm.logTimeToHour<0 || vm.logTimeToHour>=24){
							valid = false;
						}else{
							if (isNaN(parseInt(vm.logTimeToMinute)) || vm.logTimeToMinute.length == 1 || vm.logTimeToMinute<0 || vm.logTimeToMinute>=60) {
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
					var hourFrom = vm.logTimeFromHour;
					var minuteFrom = vm.logTimeFromMinute;
					var hourTo = vm.logTimeToHour;
					var minuteTo = vm.logTimeToMinute;
					
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
			processNo : undefined
		}
		
		vm.initLoad();
		
} ]);