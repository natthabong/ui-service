'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('DocumentUploadLogController', [ '$scope', 'Service', '$stateParams', '$log', 'SCFCommonService', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http', 'LogStatus','PageNavigation',
	function($scope, Service, $stateParams, $log, SCFCommonService, PagingController, UIFactory, $q, $rootScope, $http, LogStatus,PageNavigation) {
		var vm = this;
		var log = $log;
		var userId = $rootScope.userInfo.userId;

		vm.splitePageTxt = '';

		vm.dateFormat = "dd/MM/yyyy";
		vm.openDateFrom = false;
		vm.openDateTo = false;
		vm.defaultPageSize = '20';
		vm.defaultPage = 0;
		
		vm.headerName = '';
		var sponsorAutoSuggestServiceUrl = '';
		vm.sponsorTxtDisable = false;
		
		var mode = {
			SPONSOR : 'sponsor',
			BANKVIEWSPONSOR : 'banksponsor',
			BANKVIEWBANK : 'bankbank'
		}
		var currentMode = $stateParams.mode;
		// vm.fileTypeDropdowns = [{
		// 	label : undefined,
		// 	value : undefined
		// }];
		// vm.logListModel;
		// vm.fileTypeDropdowns = [{
		// 	label : undefined,
	  	// 	value : undefined
		// }];
		vm.logListModel = null;
		vm.documentListModel = {
			sponsor : undefined
		}
		
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
            	fieldName: 'channel',
                labelEN: 'Channel',
                labelTH: 'Channel',
                idValueField: '$rowNo',
                id: 'module-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },{
            	fieldName: 'fileType',
            	labelEN: 'Message',
            	labelTH: 'Message',
            	idValueField: '$rowNo',
                id: 'message-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },{
            	fieldName: 'fileName',
            	labelEN: 'Ref no',
            	labelTH: 'Ref no',
            	idValueField: '$rowNo',
                id: 'ref-no-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },{
            	fieldName: 'success',
            	labelEN: 'User',
            	labelTH: 'User',
            	idValueField: '$rowNo',
                id: 'user-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },{
            	fieldName: 'fail',
            	labelEN: 'Status',
            	labelTH: 'Status',
            	idValueField: '$rowNo',
                id: 'status-{value}',
                sortable: false,
                filterType : 'translate',
                cssTemplate: 'text-left'
            },{
            	fieldName: '',
            	labelEN: 'Action',
            	labelTH: 'Action',
                id: 'status-{value}',
				cellTemplate: '<scf-button class="btn-default gec-btn-action" ng-click="ctrl.viewLog(data)" title="Verify a transaction"><i class="fa fa-inbox" ></i></scf-button>'
            }
			]
		};


		vm.viewLog = function(data){
		
		var params = { documentUploadLogModel: data,
				roleType: 'sponsor'
			}
			PageNavigation.gotoPage('/document-upload-log/view-log',params,params)
		}
		// Prepare Auto Suggest
		var initSponsorAutoSuggest = function() {
			var sponsorInfo = angular.copy($rootScope.userInfo);
			sponsorInfo = prepareAutoSuggestLabel(sponsorInfo);
			vm.documentListModel.sponsor = sponsorInfo;
			return vm.documentListModel.sponsor.organizeId;
		}

		vm.sponsorAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Please Enter organize name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : querySponsorCode
			});

		var querySponsorCode = function(value) {
			console.log(value)
			value = value = UIFactory.createCriteria(value);
			return $http.get(sponsorAutoSuggestServiceUrl, {
			params : {
				q : value,
				offset : 0,
				limit : 5
			}
			}).then(function(response) {
				return response.data.map(function(item) {
					item = prepareAutoSuggestLabel(item);
					return item;
				});
			});
		};

		var prepareAutoSuggestLabel = function(item) {
			item.identity = [ 'sponsor-', item.organizeId, '-option' ].join('');
			item.label = [ item.organizeId, ': ', item.organizeName ].join('');
			return item;
		}
		// Prepare Auto Suggest

		
		vm.initLoad = function() {
			if (currentMode == mode.SPONSOR) {
				vm.headerName = 'Document upload log';
				vm.sponsorTxtDisable = true;
				sponsorAutoSuggestServiceUrl = 'api/v1/sponsors';
				var sponsorID = initSponsorAutoSuggest();
				var fileType = vm.getFileType(sponsorID,'SFP','SPONSOR_UPLOAD');
			}else if(currentMode == mode.BANKVIEWSPONSOR){
				vm.headerName = 'Sponsor document upload';
				vm.sponsorTxtDisable = false;
			}else if(currentMode == mode.BANKVIEWBANK){
				vm.headerName = 'Bank document upload';
				vm.sponsorTxtDisable = false;
			}
			
			// vm.getFileType();
			vm.searchLog();
		}

		vm.getFileType = function(sponsorID,sponsorConfigId,integrateType) {
			var uri = 'api/v1/organize-customers/'+sponsorID+'/sponsor-configs/'+sponsorConfigId+'/process-types';
			var deffered = Service.doGet(uri,{integrateType : integrateType});
			deffered.promise.then(function(response) {
				response.data.forEach(function(module) {
					vm.fileTypeDropdowns = [];
					var label = undefined;
					var value = undefined;
					if(module == 'AP_DOCUMENT'){
						label = 'AP document';
						value =  module;
					}
					vm.fileTypeDropdowns.push({
					    label : label,
						value : value
					});
				});
				console.log(vm.fileTypeDropdowns)
				prepareFileTypeDropDown(vm.fileTypeDropdowns);
				
	        }).catch(function(response) {
	            log.error('Get modules fail');
	        });
	    }

		var prepareFileTypeDropDown = function(items){
			console.log(items.label)
			vm.logListModel = items[0].value;
			console.log(vm.logListModel)
		}

		vm.criteria = {};

		var uri = 'api/v1/upload-logs';
		vm.pagingController = PagingController.create(uri, vm.criteria, 'GET');
		
		vm.searchLog = function(pagingModel) {
			console.log("hi")
			var logDiferred = vm.pagingController.search(pagingModel);
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