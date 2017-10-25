'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('ActivityLogController', [ '$scope', 'Service', '$stateParams', '$log', 'SCFCommonService', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http', 'LogStatus',
	function($scope, Service, $stateParams, $log, SCFCommonService, PagingController, UIFactory, $q, $rootScope, $http, LogStatus) {
		var vm = this;
		var log = $log;
		var userId = $rootScope.userInfo.userId;

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
		
		var mode = {
			PERSONAL : 'personal',
			ALL : 'all'
		}
		var currentMode = $stateParams.mode;
		vm.moduleDropdowns = [{
			label : 'All',
	  		value : '',
	  		valueObject : null
		}];
		
		vm.logStatusDropdowns = LogStatus;

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
			columns: [{
            	fieldName: 'actionTime',
            	labelEN: 'Date',
            	labelTH: 'Date',
            	idValueField: '$rowNo',
                id: 'log-date-{value}',
                sortable: false,
                filterType : 'date',
                format : 'dd/MM/yyyy HH:mm',
                cssTemplate: 'text-center'
            },{
            	fieldName: 'module',
                labelEN: 'Module',
                labelTH: 'Module',
                idValueField: '$rowNo',
                id: 'module-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },{
            	fieldName: 'message',
            	labelEN: 'Message',
            	labelTH: 'Message',
            	idValueField: '$rowNo',
                id: 'message-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },{
            	fieldName: 'refNo',
            	labelEN: 'Ref no',
            	labelTH: 'Ref no',
            	idValueField: '$rowNo',
                id: 'ref-no-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },{
            	fieldName: 'actionBy',
            	labelEN: 'User',
            	labelTH: 'User',
            	idValueField: '$rowNo',
                id: 'user-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },{
            	fieldName: 'status',
            	labelEN: 'Status',
            	labelTH: 'Status',
            	idValueField: '$rowNo',
                id: 'status-{value}',
                sortable: false,
                filterType : 'translate',
                cssTemplate: 'text-left'
            }]
		};

		vm.searchCriteria = {
			logDateFrom : undefined,
			logDateTo : undefined,
			module : undefined,
			refNo : '',
			userId : '',
			status : undefined,
			message : ''
		}
		
		vm.initLoad = function() {
			if (currentMode == mode.PERSONAL) {
				vm.isPersonalMode = true;
				var userInfo = angular.copy($rootScope.userInfo);
				vm.logListModel.user = userInfo;
				prepareAutoSuggestLabel(userInfo);
				
			}else{
				vm.isPersonalMode = false;
			}
			
			
			
			vm.getModule();
			vm.searchLog();
		}

		function prepareCriteria() {
			if (angular.isDefined(vm.logListModel.user)) {
				var userCriteria = vm.logListModel.user.userId;
			}

			vm.searchCriteria.userId = userCriteria;
			
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

			vm.moduleDropdowns.forEach(function(module) {
				if (vm.logListModel.module == module.value) {
					vm.searchCriteria.module = module.valueObject;
				}
			});
			
			vm.searchCriteria.refNo = UIFactory.createCriteria(vm.logListModel.refNo);
			vm.searchCriteria.message = UIFactory.createCriteria(vm.logListModel.message);

			LogStatus.forEach(function(status) {
				if (vm.logListModel.logStatus == status.value) {
					vm.searchCriteria.status = status.valueObject;
				}
			});
			
			return vm.searchCriteria;

		}
		
		var uri = currentMode==mode.PERSONAL? 'api/v1/activity-logs/me' : 'api/v1/activity-logs';
		vm.pagingController = PagingController.create(uri, vm.searchCriteria, 'GET');

		vm.searchLog = function(pagingModel) {
			if (isValid()) {
				var criteria = prepareCriteria();
				var logDiferred = vm.pagingController.search(pagingModel);
				vm.showInfomation = true;
			}
		}

		vm.openCalendarDateFrom = function() {
			vm.openDateFrom = true;
		}

		vm.openCalendarDateTo = function() {
			vm.openDateTo = true;
		}

		vm.getModule = function() {
        	        var deffered = Service.doGet('/api/v1/modules');
        	        deffered.promise.then(function(response) {
        	        	response.data.forEach(function(module) {
        	    			vm.moduleDropdowns.push({
        	    			    label : module,
        	    			    value : module,
        	    			    valueObject : module
        	    			});
            		    });
        	        	
	        }).catch(function(response) {
	            log.error('Get modules fail');
	        });
	    }

		var prepareAutoSuggestLabel = function(item) {
		        item.identity = [ 'user-', item.displayName, '-option' ].join('');
			item.label =  item.displayName;
			return item;
		}
		var queryDisplayName = function(value) {
			value = value = UIFactory.createCriteria(value);
			
			var userServiceUrl = 'api/v1/users';
			return $http.get(userServiceUrl, {
				params : {
					q : value,
					offset : 0,
					limit : 5
				}
			}).then(function(response) {
				return response.data.map(function(item) {
					item.identity = [ 'user-', item.displayName, '-option' ].join('');
					item.label = [ item.displayName ].join('');
					return item;
				});
			});
		};
		vm.userAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Search by display name',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : queryDisplayName
		});

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
			if(valid){
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
			module : vm.moduleDropdowns[0].value,
			refNo : undefined,
			user : undefined,
			logStatus : vm.logStatusDropdowns[0].value,
			message : undefined
		}
		
		vm.initLoad();
		
	} ]);
scfApp.constant("LogStatus", [
	{
		label : 'All',
		value : '',
		valueObject : null
	},
	{
		label : 'Completed',
		value : 'COMPLETED',
		valueObject : 'COMPLETED'
	},
	{
		label : 'Incomplete',
		value : 'INCOMPLETE',
		valueObject : 'INCOMPLETE'
	}
]);