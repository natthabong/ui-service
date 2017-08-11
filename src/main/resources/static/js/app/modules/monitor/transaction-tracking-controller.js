'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('TransactionTrackingController', [ '$scope', 'Service', '$stateParams', '$log', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','TransactionTrackingService','ngDialog','SCFCommonService','$state','$cookieStore','$cookieStore',
	function($scope, Service, $stateParams, $log, PagingController, UIFactory, $q, $rootScope, $http, PageNavigation
			,TransactionTrackingService, ngDialog, SCFCommonService, $state, $cookieStore) {
        var vm = this;

        vm.dateFormat = "dd/MM/yyyy";
		vm.openDateFrom = false;
		vm.openDateTo = false;
		
		vm.logTimeFromHour = '';
		vm.logTimeFromMinute = '';
		vm.logTimeToHour = '';
		vm.logTimeToMinute = '';
		

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
					fieldName : 'refNo',
					field : 'refNo',
					label : 'Ref no',
					idValueField : 'template',
					id : 'ref-no-{value}-label',
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
				},
				{
					fieldName : 'action',
					field : 'action',
					label : 'Action',
					idValueField : 'template',
					id : 'action-{value}-label',
					sortable : false,
					cellTemplate : '{{data | transactionTracking}}',
					cssTemplate : function(record){
						return cssTemplate(record,'left')
					}
				},{
					cssTemplate : 'text-center',
					sortable : false,
					cellTemplate : '<scf-button ng-disabled="!data.transactionMessage" class="btn-default gec-btn-action" id="{{$parent.$index + 1}}-view-button" ng-click="ctrl.viewMessage(data)" title="View"><i class="fa fa-search" aria-hidden="true"></i></scf-button>'
				} ]
		}
		
		vm.criteria = $stateParams.criteria || {
			logDateFrom : null,
			logDateTo : null,
			refNo : null,
			processNo : null
		}

		vm.storeSearchCriteria = {
			logDateFrom : null,
			logDateTo : null,
			refNo : null,
			processNo : null
		}
		
		function prepareCriteria() {
			if (angular.isDate(vm.criteria.logDateFrom)) {

				var hour = 0;
				var min = 0;
				
				if(vm.logTimeFromHour!==''&&vm.logTimeFromMinute!==''){
					hour = vm.logTimeFromHour;
					min = vm.logTimeFromMinute;
				}		
				
				var datetime = new Date(vm.criteria.logDateFrom.getFullYear(), 
						vm.criteria.logDateFrom.getMonth(), 
						vm.criteria.logDateFrom.getDate(), 
						hour, min, 0);
				vm.criteria.logDateFrom = datetime;
			}else{
				vm.criteria.logDateFrom = null;
			}

			if (angular.isDate(vm.criteria.logDateTo)) {
				
				var hour = 23;
				var min = 59;
				
				if(vm.logTimeToHour!==''&&vm.logTimeToMinute!==''){
					hour = vm.logTimeToHour;
					min = vm.logTimeToMinute;
				}		
				
				var datetime = new Date(vm.criteria.logDateTo.getFullYear(), 
						vm.criteria.logDateTo.getMonth(), 
						vm.criteria.logDateTo.getDate(), 
						hour, min, 0);
				vm.criteria.logDateTo = datetime;
			}else{
				vm.criteria.logDateTo = null;
			}
			
			return vm.criteria;

		}

		var isValid = function() {
			var valid = true;
			vm.wrongDateFormat = false;
			vm.wrongDateFromTo = false;
			
			//Wrong date format
			if (angular.isUndefined(vm.criteria.logDateFrom)||angular.isUndefined(vm.criteria.logDateTo)) {
				valid = false;
			}else{
				if(vm.logTimeFromHour!==''&&vm.logTimeFromMinute!==''&&!angular.isDate(vm.criteria.logDateFrom)){
					valid = false;
				}else if(vm.logTimeToHour!==''&&vm.logTimeToMinute!==''&&!angular.isDate(vm.criteria.logDateTo)){
					valid = false;
				}
			}
			
			//Wrong time format
			if(valid){
				if(angular.isDefined(vm.criteria.logDateFrom)){
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
			}
			if(valid){
				if(angular.isDefined(vm.criteria.logDateTo)){
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
				}else{
					valid = false;
				}
			}
			
			if(!valid){
				vm.wrongDateFormat = true;
				vm.wrongDateFromTo = false;
			}else{
				//Wrong date from to
				if (angular.isDate(vm.criteria.logDateFrom)&&angular.isDate(vm.criteria.logDateTo)) {
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
					
					var datetimeFrom = new Date(vm.criteria.logDateFrom.getFullYear(), 
							vm.criteria.logDateFrom.getMonth(), 
							vm.criteria.logDateFrom.getDate(), 
							hourFrom, minuteFrom, 0);
					
					var datetimeTo = new Date(vm.criteria.logDateTo.getFullYear(), 
							vm.criteria.logDateTo.getMonth(), 
							vm.criteria.logDateTo.getDate(), 
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

		vm.pagingController = PagingController.create('api/v1/transaction-trackings', vm.criteria, 'GET');
		
		vm.searchTrackingLog = function(pageModel){
			if (isValid()) { 
				prepareCriteria();
				var logDiferred = vm.pagingController.search(pageModel || ( $stateParams.backAction? {
					offset : vm.criteria.offset,
					limit : vm.criteria.limit
				}: undefined));
				$stateParams.backAction = false;
				
				vm.showInfomation = true;
				angular.copy(vm.criteria,vm.storeSearchCriteria);
			}else{
				vm.showInfomation = false;
			}
		}
		
		vm.initLoad = function() {
			if($stateParams.backAction){
				if(vm.criteria.logDateFrom != '' && vm.criteria.logDateFrom != null){
					var dateTimeFrom = new Date(vm.criteria.logDateFrom);
					vm.criteria.logDateFrom = dateTimeFrom;
					vm.logTimeFromHour = dateTimeFrom.getHours();
					vm.logTimeFromMinute = dateTimeFrom.getMinutes();
				}
				
				if(vm.criteria.logDateTo != '' && vm.criteria.logDateTo != null){
					var dateTimeTo = new Date(vm.criteria.logDateTo);
					vm.criteria.logDateTo = dateTimeTo;
					vm.logTimeToHour = dateTimeTo.getHours();
					vm.logTimeToMinute = dateTimeTo.getMinutes();
				}
			}
			vm.searchTrackingLog();	
		}();
		
		vm.viewMessage = function(data){
			SCFCommonService.parentStatePage().saveCurrentState($state.current.name);
			var params = {params: data};
			PageNavigation.nextStep('/view-transaction-tracking-message', params,{criteria : vm.storeSearchCriteria});
		}
		
		vm.openCalendarDateFrom = function() {
			vm.openDateFrom = true;
		}

		vm.openCalendarDateTo = function() {
			vm.openDateTo = true;
		}
		
} ]);