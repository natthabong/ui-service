'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('TransactionTrackingController', [ '$scope', 'Service', '$stateParams', '$log', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','TransactionTrackingService','ngDialog',
	function($scope, Service, $stateParams, $log, PagingController, UIFactory, $q, $rootScope, $http, PageNavigation, TransactionTrackingService,ngDialog) {
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
		
		vm.dataTable = {
			identityField: '$rowNo',
			columns : [
				{
					fieldName : 'actionTime',
					labelEN : 'Date',
					labelTH : 'Date',
					id : 'action-time-{value}',
					sortable : false,
	                filterType : 'date',
	                format : 'dd/MM/yyyy HH:mm:ss',
					cssTemplate : 'text-left',
				},{
					fieldName : 'processNo',
					labelEN : 'Process no',
					labelTH : 'Process no',
					id : 'process-no-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					fieldName : 'refNo',
					labelEN : 'Ref no',
					labelTH : 'Ref no',
					id : 'ref-no-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					fieldName : 'node',
					labelEN : 'Node',
					labelTH : 'Node',
					id : 'node-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},{
					fieldName : 'ipAddress',
					labelEN : 'IP',
					labelTH : 'IP',
					id : 'ip-address-{value}',
					sortable : false,
					cssTemplate : 'text-left',
				},
				{
					fieldName : 'action',
					labelEN : 'Action',
					labelTH : 'Action',
					id : 'action-{value}',
					sortable : false,
					filterType: 'translate',
					cssTemplate : 'text-left',
				},{
					cssTemplate : 'text-center',
					sortable : false,
					idValueField: '$rowNo',
					cellTemplate : '<scf-button ng-disabled="!data.transactionMessage" class="btn-default gec-btn-action" id="{{$parent.$index + 1}}-view-button" ng-click="ctrl.viewMessage(data)" title="View"><i class="fa fa-search" aria-hidden="true"></i></scf-button>'
				} ]
		}
		
		vm.searchCriteria = {
			logDateFrom : undefined,
			logDateTo : undefined,
			refNo : '',
			processNo : ''
		}
		
		vm.initLoad = function() {
			vm.searchTrackingLog();
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
			
			vm.searchCriteria.refNo = UIFactory.createCriteria(vm.logListModel.refNo);
			vm.searchCriteria.processNo = UIFactory.createCriteria(vm.logListModel.processNo);
			
			return vm.searchCriteria;

		}

		vm.pagingController = PagingController.create('api/v1/transaction-trackings', vm.searchCriteria, 'GET');

		vm.viewMessage = function(data){
			// ---- for test -------
			// vm.transaction = {
			// 	refNo:'aaaaaaaaaaaaaaaaaaaaaaaaa',
			// 	processNo:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			// 	transactionMessage:'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttet'
			// }
			// var params = {params: vm.transaction};
			var params = {params: data};
			PageNavigation.gotoPage('/view-transaction-tracking-message', params,[]);
		}

		vm.searchTrackingLog = function(pageModel){
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
				if((vm.logTimeFromHour!==''&&vm.logTimeFromMinute!=='')||(vm.logTimeFromHour===''&&vm.logTimeFromMinute==='')){
					if(vm.logTimeFromHour.length == 1 || vm.logTimeFromHour<0 || vm.logTimeFromHour>=24){
						valid = false;
					}else{
						if (vm.logTimeFromMinute.length == 1 || vm.logTimeFromMinute<0 || vm.logTimeFromMinute>=60) {
							valid = false;
						}
					}
				}else{
					valid = false;
				}
			}
			
			if(angular.isDefined(vm.logListModel.logDateTo)){
				if((vm.logTimeToHour!==''&&vm.logTimeToMinute!=='')||(vm.logTimeToHour===''&&vm.logTimeToMinute==='')){
					if(vm.logTimeToHour.length == 1 || vm.logTimeToHour<0 || vm.logTimeToHour>=24){
						valid = false;
					}else{
						if (vm.logTimeToMinute.length == 1 || vm.logTimeToMinute<0 || vm.logTimeToMinute>=60) {
							valid = false;
						}
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
			logDateFrom : '',
			logDateTo : '',
			refNo : undefined,
			processNo : undefined
		}
		
		vm.initLoad();
		
} ]);