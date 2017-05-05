'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('DocumentUploadLogController', [ '$scope', 'Service', '$stateParams', '$log', 'SCFCommonService', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http', 'docStatus','PageNavigation','docChannel',
	function($scope, Service, $stateParams, $log, SCFCommonService, PagingController, UIFactory, $q, $rootScope, $http, docStatus, PageNavigation, docChannel) {
		var vm = this;
		var log = $log;
		var userId = $rootScope.userInfo.userId;

		vm.splitePageTxt = '';

		vm.dateFormat = "dd/MM/yyyy";
		vm.openDateFrom = false;
		vm.openDateTo = false;
		vm.defaultPageSize = '20';
		vm.defaultPage = 0;
		vm.showSponsor = true;
		
		vm.headerName = '';
		var sponsorAutoSuggestServiceUrl = '';
		vm.sponsorTxtDisable = false;
		var hideColSponsor;
		var hideColFileType;
		
		vm.criteria =  {
				oraganizeId : null,
				fileType : null,
				uploadDateFrom : null,
				uploadDateTo : null,
				channel : null,
				status : null,
				isBankDoc : false
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
		
		var mode = {
			SPONSOR : 'sponsor',
			BANKVIEWSPONSOR : 'banksponsor',
			BANKVIEWBANK : 'bankbank'
		}
		var currentMode = $stateParams.mode;

		vm.openCalendarDateFrom = function() {
			vm.openDateFrom = true;
		}

		vm.openCalendarDateTo = function() {
			vm.openDateTo = true;
		}

		vm.documentUploadLogModel = {
			sponsor : undefined,
			role : undefined
		}
		
		vm.pageModel = {
			pageSizeSelectModel : vm.defaultPageSize,
			totalRecord : 0,
			totalPage : 0,
			currentPage : vm.defaultPage,
			clearSortOrder : false
		};

		// Prepare Auto Suggest
		var initSponsorAutoSuggest = function() {
			var sponsorInfo = angular.copy($rootScope.userInfo);
			sponsorInfo = prepareAutoSuggestLabel(sponsorInfo);
			vm.documentUploadLogModel.sponsor = sponsorInfo;
			return vm.documentUploadLogModel.sponsor.organizeId;
		}

		var getOrganize = function() {
			var organize = angular.copy($rootScope.userInfo);
			return organize;
		}

		var querySponsorCode = function(value) {
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

		vm.sponsorAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Enter organize name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : querySponsorCode
			});
		
		var prepareAutoSuggestLabel = function(item) {
			item.identity = [ 'sponsor-', item.organizeId, '-option' ].join('');
			item.label = [ item.organizeId, ': ', item.organizeName ].join('');
			return item;
		}
		// Prepare Auto Suggest

		var getFileType = function(sponsorID,sponsorConfigId,integrateType) {
			vm.docType = [];
			if(currentMode == mode.BANKVIEWBANK){
					vm.docType.push({
						label : 'All',
						value : null
					});
				}
			var uri = 'api/v1/organize-customers/'+sponsorID+'/sponsor-configs/'+sponsorConfigId+'/process-types';
			var deffered = Service.doGet(uri,{integrateType : integrateType});
			deffered.promise.then(function(response) {
				response.data.forEach(function(module) {
					vm.docType.push({
						label : module,
						value : module
					});
				});
				vm.criteria.fileType = vm.docType[0].value;
	        }).catch(function(response) {
	            log.error('Get modules fail');
	        });
			return vm.docType;
	    }
		
		vm.docStatusDropdowns = docStatus;
		vm.docChannelDropdowns = docChannel;
		// vm.docTypeDropdowns = vm.getFileType

		var isValid = function() {
			var valid = true;
			vm.wrongDateFormat = false;
			vm.wrongDateFromTo = false;
			
			//Wrong date format
			if(angular.isUndefined(vm.criteria.uploadDateFrom) && !angular.isDate(vm.criteria.uploadDateFrom)){
				valid = false;
			}else if(angular.isUndefined(vm.criteria.uploadDateTo) && !angular.isDate(vm.criteria.uploadDateTo)){
				valid = false;
			}
	
			if(!valid){
				vm.wrongDateFormat = true;
			}else{
				//Wrong date from to
				if (angular.isDate(vm.criteria.uploadDateFrom)&&angular.isDate(vm.criteria.uploadDateTo)) {

					var datetimeFrom = new Date(vm.criteria.uploadDateFrom.getFullYear(), 
							vm.criteria.uploadDateFrom.getMonth(), 
							vm.criteria.uploadDateFrom.getDate(), 
							0, 0, 0);
					
					var datetimeTo = new Date(vm.criteria.uploadDateTo.getFullYear(), 
							vm.criteria.uploadDateTo.getMonth(), 
							vm.criteria.uploadDateTo.getDate(), 
							0, 0, 0);
					
					if(datetimeFrom > datetimeTo){
						valid = false;
						vm.wrongDateFormat = false;
						vm.wrongDateFromTo = true;
					}
				}
			}
			return valid;
		}

		var uri = 'api/v1/upload-logs';
		vm.pagingController = PagingController.create(uri, vm.criteria, 'GET');

		vm.searchLog = function(pagingModel) {
			if(vm.documentUploadLogModel.sponsor != undefined && vm.documentUploadLogModel.sponsor.organizeId != undefined){
				vm.criteria.oraganizeId = vm.documentUploadLogModel.sponsor.organizeId;
			}
			
			if(isValid()){
				vm.pagingController = PagingController.create(uri, vm.criteria, 'GET');
				vm.pagingController.search(pagingModel);
			}
		}

		
		if (currentMode == mode.SPONSOR) {
			vm.headerName = 'Document upload log';
			hideColSponsor = true;
			hideColFileType = true;
			vm.sponsorTxtDisable = true;
			vm.documentUploadLogModel.roleType = ' ';
			sponsorAutoSuggestServiceUrl = 'api/v1/sponsors';
			var sponsorID = initSponsorAutoSuggest();
			vm.docTypeDropdowns = getFileType(sponsorID,'SFP','SPONSOR_UPLOAD');
		}else if(currentMode == mode.BANKVIEWSPONSOR){
			vm.headerName = 'Sponsor document upload log';
			vm.sponsorTxtDisable = false;
			vm.documentUploadLogModel.roleType = 'sponsor';
			hideColSponsor = false;
			hideColFileType = true;
			sponsorAutoSuggestServiceUrl = 'api/v1/sponsors';
			var organize = getOrganize();
			vm.docTypeDropdowns = getFileType(organize.organizeId,'SFP','SPONSOR_UPLOAD');
		}else if(currentMode == mode.BANKVIEWBANK){
			vm.headerName = 'Bank document upload log';
			hideColSponsor = true;
			vm.showSponsor = false;
			hideColFileType = false;
			vm.sponsorTxtDisable = false;
			vm.documentUploadLogModel.roleType = 'bank';
			sponsorAutoSuggestServiceUrl = 'api/v1/sponsors';
			var organize = getOrganize();
			vm.docTypeDropdowns = getFileType(organize.organizeId,'MASTER','BANK_UPLOAD');
			vm.criteria.isBankDoc = true;
		}

		vm.dataTable = {
			columns: [{
            	fieldName: 'startUploadTime',
            	labelEN: 'Upload date',
            	labelTH: 'Upload date',
            	idValueField: '$rowNo',
                id: 'upload-date-{value}',
                sortable: false,
                filterType : 'date',
                format : 'dd/MM/yyyy HH:mm',
                cssTemplate: 'text-center'
            },
			{
    			fieldName: 'organizeLogo',
            	labelEN: 'Sponsor',
            	labelTH: 'Sponsor',
                idValueField: '$rowNo',
                id: 'module-{value}',
                sortable: false,
                cssTemplate: 'text-center',
    			dataRenderer: function(data){
    				return '<img style="height: 32px; width: 32px;" data-ng-src="data:image/png;base64,'+atob(data.organizeLogo)+'"></img>';
    			},
    			hiddenColumn : hideColSponsor
            },
			{
            	fieldName: 'channel',
                labelEN: 'Channel',
                labelTH: 'Channel',
                idValueField: '$rowNo',
                id: 'channel-{value}',
				filterType: 'translate',
                sortable: false,
                cssTemplate: 'text-center'
            },
			{
            	fieldName: 'fileType',
            	labelEN: 'File type',
            	labelTH: 'File type',
            	idValueField: '$rowNo',
                id: 'file-type-{value}',
				filterType: 'translate',
                sortable: false,
                cssTemplate: 'text-left',
				hiddenColumn : hideColFileType
            },
			{
            	fieldName: 'fileName',
            	labelEN: 'File name',
            	labelTH: 'File name',
            	idValueField: '$rowNo',
                id: 'file-name-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },{
            	fieldName: 'success',
            	labelEN: 'Success',
            	labelTH: 'Success',
            	idValueField: '$rowNo',
                id: 'success-{value}',
                sortable: false,
                cssTemplate: 'text-right'
            },{
            	fieldName: 'fail',
            	labelEN: 'Fail',
            	labelTH: 'Fail',
            	idValueField: '$rowNo',
                id: 'fail-{value}',
                sortable: false,
                cssTemplate: 'text-right',
                dataRenderer : function(data){
					if(data != undefined){
						if(data.fail == null){
							return 'N/A';
						}
						else{
							return data.fail;
						}
					}
				}
            },{
            	fieldName: 'total',
            	labelEN: 'Total',
            	labelTH: 'Total',
            	idValueField: '$rowNo',
                id: 'total-{value}',
                sortable: false,
                cssTemplate: 'text-right',
                dataRenderer : function(data){
					if(data != undefined){
						if(data.fail == null){
							return 'N/A';
						}
						else{
							return data.fail+ data.success;
						}
					}
				}
            },
			{
            	fieldName: 'status',
            	labelEN: 'Status',
            	labelTH: 'Status',
            	idValueField: '$rowNo',
                id: 'status-{value}',
                sortable: false,
				filterType: 'translate',
                cssTemplate: 'text-center'
            },
			{
            	fieldName: 'action',
            	labelEN: 'Action',
            	labelTH: 'Action',
                cellTemplate : '<scf-button id="document-upload-log-{{$parent.$index + 1}}-view-button" class="btn-default gec-btn-action" ng-click="ctrl.viewLog(data)" title="View log details"><i class="glyphicon glyphicon-search" ></i></scf-button>'
            }
			]
		};

		vm.viewLog = function(data){
			var params = { 
				documentUploadLogModel: data,
				roleType: vm.documentUploadLogModel.roleType
			}
			PageNavigation.gotoPage('/document-upload-log/view-log',params,params)
		}

		vm.initLoad = function() {
			vm.searchLog();
		}

		vm.initLoad();
		
		
	} ]);
scfApp.constant("docStatus", [
	{
		label : 'All',
		value : '',
		valueObject : null
	},
	{
		label : 'Fail',
		value : 'FAILED',
		valueObject : 'FAILED'
	},
	{
		label : 'Success',
		value : 'SUCCESS',
		valueObject : 'SUCCESS'
		
	}
]);
scfApp.constant("docChannel", [
	{
		label : 'All',
		value : '',
		valueObject : null
	},{
		label : 'FTP',
		value : 'FTP',
		valueObject : 'FTP'
	},{
		label : 'Web',
		value : 'WEB',
		valueObject : 'WEB'
	}
]);