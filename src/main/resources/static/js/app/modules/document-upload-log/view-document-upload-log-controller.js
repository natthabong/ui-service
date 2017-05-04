angular
	.module('scfApp')
	.controller(
		'ViewDocumentUplaodLogController', [
			'SCFCommonService',
			'$log',
			'$scope',
			'$stateParams',
			'$timeout',
			'$rootScope',
			'PageNavigation',
			'Service',
			'$http',
			'blockUI',
			'ngDialog',
			'$q', 
			'UIFactory', 
			function(SCFCommonService, $log, $scope, $stateParams, $timeout, $rootScope,
				PageNavigation, Service, $http, blockUI, ngDialog, $q, UIFactory) {
		
				var vm = this;
				var log = $log;
		
				vm.roleType = $stateParams.roleType;
				vm.documentUploadLogModel = $stateParams.documentUploadLogModel;
				
				vm.pageSizeList = [{
			        label: '10',
			        value: '10'
			    }, {
			        label: '20',
			        value: '20'
			    }, {
			        label: '50',
			        value: '50'
			    }];

				vm.backToDocumentUploadLogPage = function() {
					PageNavigation.gotoPreviousPage();
				}
				
				vm.dataTable = {
			        columns: [{
						fieldName: 'lineNo',
			            field: 'lineNo',
			            label: 'Line no.',
			            idValueField: '$rowNo',
			            id: 'view-document-upload-log-line-no-{value}-label',
			            sortData: false,
			            cellTemplate: '<span ng-bind="data.lineNo == null ? \'N/A\': data.lineNo">N/A</span>',
						cssTemplate: 'text-left'
			        },{
			        	fieldName: 'description',
			            field: 'description',
			            label: 'Description',
			            idValueField: '$rowNo',
			            id: 'view-document-upload-log-description-{value}-label'
		            	sortData: false,
		            	cssTemplate: 'text-left'
			        }]
			    }
				
				vm.pagingController = PagingController.create('api/v1/upload-logs/'+vm.documentUploadLogModel.uploadDocumentLogId+'/items', null, 'GET');
				
				vm.searchListLog = function(pagingModel) {
					var logListDiferred = vm.pagingController.search(pagingModel);
				}
				vm.searchListLog();
			}
		]
	);