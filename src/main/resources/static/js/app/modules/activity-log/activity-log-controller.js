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

		var currentParty = '';
		var partyRole = {
			sponsor : 'sponsor',
			supplier : 'supplier',
			bank : 'bank'
		}

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
                filterFormat : 'dd/MM/yyyy HH:mm',
                cssTemplate: 'text-left'
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
            	labelEN: 'user',
            	labelTH: 'user',
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

		vm.logListCriterial = {
			logDateFrom : undefined,
			logDateTo : undefined,
			module : undefined,
			refNo : '',
			userId : '',
			status : undefined,
			message : ''
		}
		
		vm.initLoad = function() {
			vm.getModule();
		}

		function prepareCriteria() {
			if (angular.isDefined(vm.logListModel.user)) {
				var userCriteria = vm.logListModel.user.userId;
			}

			vm.logListCriterial.userId = userCriteria;
			
			if (angular.isDate(vm.logListModel.logDateFrom)) {
				vm.logListCriterial.logDateFrom = vm.logListModel.logDateFrom
				if(vm.logTimeFrom!=null){
					
					var hour = 0;
					var min = 0;
					if(vm.logTimeFrom==null){
						hour = 0;
						min = 0;
					}else{
						var hour = vm.logTimeFrom.getHours()!=null?vm.logTimeFrom.getHours():0;
						var min = vm.logTimeFrom.getMinutes()!=null?vm.logTimeFrom.getMinutes():0;
					}		
					
					var datetime = new Date(vm.logListModel.logDateFrom.getFullYear(), 
							vm.logListModel.logDateFrom.getMonth(), 
							vm.logListModel.logDateFrom.getDate(), 
							hour, min, 0);
					vm.logListCriterial.logDateFrom = datetime;
					console.log(vm.logListCriterial.logDateFrom);
				}
			}else{
				vm.logListCriterial.logDateFrom = undefined;
			}

			if (angular.isDate(vm.logListModel.logDateTo)) {
				vm.logListCriterial.logDateTo = vm.logListModel.logDateTo;
				if(vm.logTimeTo!==undefined){
					var hour = 23;
					var min = 59;
					if(vm.logTimeTo==null){
						hour = 23;
						min = 59;
					}else{
						var hour = vm.logTimeTo.getHours()!=null?vm.logTimeTo.getHours():0;
						var min = vm.logTimeTo.getMinutes()!=null?vm.logTimeTo.getMinutes():0;	
					}
					
					var datetime = new Date(vm.logListModel.logDateTo.getFullYear(), 
							vm.logListModel.logDateTo.getMonth(), 
							vm.logListModel.logDateTo.getDate(), 
							hour, min, 0);
					vm.logListCriterial.logDateTo = datetime;
					console.log(vm.logListCriterial.logDateTo);
				}				
			}else{
				vm.logListCriterial.logDateTo = undefined;
			}

			vm.moduleDropdowns.forEach(function(module) {
				if (vm.logListModel.module == module.value) {
					vm.logListCriterial.module = module.valueObject;
				}
			});
			
			vm.logListCriterial.refNo = UIFactory.createCriteria(vm.logListModel.refNo);
			vm.logListCriterial.message = UIFactory.createCriteria(vm.logListModel.message);

			LogStatus.forEach(function(status) {
				if (vm.logListModel.logStatus == status.value) {
					vm.logListCriterial.status = status.valueObject;
				}
			});
			
			console.log(vm.logListCriterial);
			return vm.logListCriterial;

		}
		
		vm.pagingController = PagingController.create('api/v1/activity-logs', vm.logListCriterial, 'GET');

		vm.searchLog = function(pagingModel) {
			if (isValidateCriteriaPass()) {
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
	    			    label : module.moduleName,
	    			    value : module.moduleId,
	    			    valueObject : module.moduleId
	    			});
    		    });
	        	
	        }).catch(function(response) {
	            log.error('Get modules fail');
	        });
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
					item.identity = [ 'user-', item.userId, '-option' ].join('');
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

		var isValidateCriteriaPass = function() {
			var isValidatePass = true;
			vm.wrongDateFormat = false;
			
			if (vm.logListModel.logDateFrom!==''&&vm.logListModel.logDateTo!='') {
				if(vm.logListModel.logDateFrom > vm.logListModel.logDateTo){
					vm.wrongDateFormat = true;
					isValidatePass = false;
				}
			}

			return isValidatePass;
		};

		vm.initLoad();
		
		vm.logListModel = {
			logDateFrom : '',
			logDateTo : '',
			module : vm.moduleDropdowns[0].value,
			refNo : undefined,
			user : undefined,
			logStatus : vm.logStatusDropdowns[0].value,
			message : undefined
		}
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