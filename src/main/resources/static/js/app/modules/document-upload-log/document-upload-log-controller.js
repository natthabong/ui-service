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
		
		vm.headerName = '';
		var sponsorAutoSuggestServiceUrl = '';
		vm.sponsorTxtDisable = false;
		
		vm.criteria =  {
				oraganizeId : '',
				fileType : null,
				uploadDateFrom : null,
				uploadDateTo : null,
				channel : null,
				status : null,
				
		};
		
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

		vm.logListModel = null;
		vm.documentListModel = {
			sponsor : undefined
		}
		
		
		vm.pageModel = {
			pageSizeSelectModel : vm.defaultPageSize,
			totalRecord : 0,
			totalPage : 0,
			currentPage : vm.defaultPage,
			clearSortOrder : false
		};
		
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
            	fieldName: 'Sponsor',
                labelEN: 'Sponsor',
                labelTH: 'Sponsor',
                idValueField: '$rowNo',
                id: 'module-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },
			{
            	fieldName: 'channel',
                labelEN: 'Channel',
                labelTH: 'Channel',
                idValueField: '$rowNo',
                id: 'channel-{value}',
				filterType: 'translate',
                sortable: false,
                cssTemplate: 'text-left'
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
                cssTemplate: 'text-left'
            },{
            	fieldName: 'fail',
            	labelEN: 'Fail',
            	labelTH: 'Fail',
            	idValueField: '$rowNo',
                id: 'fail-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },{
            	fieldName: 'total',
            	labelEN: 'Total',
            	labelTH: 'Total',
            	idValueField: '$rowNo',
                id: 'total-{value}',
                sortable: false,
                cssTemplate: 'text-left'
            },
			{
            	fieldName: 'status',
            	labelEN: 'Status',
            	labelTH: 'Status',
            	idValueField: '$rowNo',
                id: 'status-{value}',
                sortable: false,
				filterType: 'translate',
                cssTemplate: 'text-left'
            },
			{
            	fieldName: 'action',
            	labelEN: 'Action',
            	labelTH: 'Action',
                id: 'document-upload-log-{value}-view-button',
				cellTemplate: '<scf-button class="btn-default gec-btn-action" id="document-upload-log-1-view-button" ng-click="ctrl.viewLog(data)" title="Verify a transaction"><i class="glyphicon glyphicon-search" ></i></scf-button>'
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
			placeholder : 'Please Enter organize name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : querySponsorCode
			});

		

		var prepareAutoSuggestLabel = function(item) {
			item.identity = [ 'sponsor-', item.organizeId, '-option' ].join('');
			item.label = [ item.organizeId, ': ', item.organizeName ].join('');
			return item;
		}
		// Prepare Auto Suggest
		
		vm.docStatusDropdowns = docStatus;
		vm.docChannelDropdowns = docChannel;

		var getFileType = function(sponsorID,sponsorConfigId,integrateType) {
			vm.docType = [];
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
		
		vm.initLoad = function() {
			if (currentMode == mode.SPONSOR) {
				vm.headerName = 'Document upload log';
				vm.sponsorTxtDisable = true;
				sponsorAutoSuggestServiceUrl = 'api/v1/sponsors';
				var sponsorID = initSponsorAutoSuggest();
				vm.docTypeDropdowns = getFileType(sponsorID,'SFP','SPONSOR_UPLOAD');
			}else if(currentMode == mode.BANKVIEWSPONSOR){
				vm.headerName = 'Sponsor document upload log';
				vm.sponsorTxtDisable = false;
				sponsorAutoSuggestServiceUrl = 'api/v1/sponsors';
				var organize = getOrganize();
				vm.docTypeDropdowns = getFileType(organize.organizeId,'SFP','SPONSOR_UPLOAD');
			}else if(currentMode == mode.BANKVIEWBANK){
				vm.headerName = 'Bank document upload log';
				vm.sponsorTxtDisable = false;
				sponsorAutoSuggestServiceUrl = 'api/v1/sponsors';
			}
			vm.searchLog();
		}

		

		vm.docTypeDropdowns = vm.getFileType

		var prepareFileTypeDropDown = function(items){
			vm.logListModel = items[0].value;
		}
		
		var uri = 'api/v1/upload-logs';
		vm.pagingController = PagingController.create(uri, vm.criteria, 'GET');
		
		vm.searchLog = function(pagingModel) {
			vm.criteria.oraganizeId = vm.documentListModel.sponsor.organizeId;
			var logDiferred = vm.pagingController.search(pagingModel);
		}

		vm.docUploadListModel = {
			logDateFrom : '',
			logDateTo : '',
			fileType : null,
			channel : vm.docChannelDropdowns[0].value,
			status : vm.docStatusDropdowns[0].value
		}

		vm.search = function(){
			console.log(vm.documentListModel.sponsor)
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
		label : 'Success',
		value : 'SUCCESS',
		valueObject : 'SUCCESS'
		
	},{
		label : 'Fail',
		value : 'FAILED',
		valueObject : 'FAILED'
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