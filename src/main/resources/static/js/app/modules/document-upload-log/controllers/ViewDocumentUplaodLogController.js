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
			'PagingController',
			function(SCFCommonService, $log, $scope, $stateParams, $timeout, $rootScope,
				PageNavigation, Service, $http, blockUI, ngDialog, $q, UIFactory, PagingController) {
		
				var vm = this;
				var log = $log;
				
				vm.roleType = $stateParams.roleType;
				vm.headerMsg = vm.roleType == 'MY_ORGANIZE' ? "View upload document logs" : "View customer document upload log";
				
				vm.isSponsor = true;
				vm.documentUploadLogModel = $stateParams.documentUploadLogModel;
				var uploadLogId = vm.documentUploadLogModel.uploadDocumentLogId;
				var organizeId = vm.documentUploadLogModel.organizeName;
				
				vm.viewCriteria = {};
				
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
				
				vm.dataTable = {
			        columns: [{
						fieldName: 'lineNo',
			            labelEN: 'Line no.',
		            	labelTH: 'Line no.',
			            idValueField: '$rowNo',
			            id: 'line-no-{value}',
			            sortData: false,
			            cellTemplate: '<span ng-bind="data.lineNo == null ? \'N/A\': data.lineNo">N/A</span>',
						cssTemplate: 'text-center'
			        },{
			        	fieldName: 'description',
			            labelEN: 'Description',
		            	    labelTH: 'Description.',
			            idValueField: '$rowNo',
			            id: 'description-{value}',
		            	sortData: false,
		            	cssTemplate: 'text-left'
			        }]
			    }

				vm.backToDocumentUploadLogPage = function() {
					$timeout(function(){
						PageNavigation.backStep();
					}, 10);
				}
				
				vm.pagingController = PagingController.create('api/v1/upload-logs/'+uploadLogId+'/items', vm.viewCriteria, 'GET');
				
				vm.searchListLog = function(pagingModel) {
					var logListDiferred = vm.pagingController.search(pagingModel);
				}
				
				vm.initLoad = function() {
					if(vm.roleType==='bank'){
						vm.isSponsor = false;
					}
					
					vm.searchListLog();
				}
				vm.initLoad();
				
				vm.downloadFile = function(){
					$http({
			             method: 'POST',
			             url: '/api/v1/upload-logs/'+uploadLogId+'/download-source-file',
			             responseType: 'arraybuffer'
			         }).success(function(response) {
			          var file = new Blob([response], {type: 'text/plain'});
			          var fileURL = URL.createObjectURL(file);
			          var a         = document.createElement('a');
			             a.href        = fileURL; 
			             a.target      = '_blank';
			             a.download    = vm.documentUploadLogModel.fileName;
			             document.body.appendChild(a);
			             a.click();
			         }).error(function(response) {
			             
			         });
				}
			}
		]
	);