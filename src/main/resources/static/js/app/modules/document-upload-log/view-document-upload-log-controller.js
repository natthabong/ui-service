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
				
				vm.headerMsg = 'View document upload log';
				
				vm.roleType = $stateParams.roleType;
				vm.documentUploadLogModel = $stateParams.documentUploadLogModel;
				
				var uploadLogId = vm.documentUploadLogModel.uploadDocumentLogId;
				
				console.log(vm.roleType);
				console.log(vm.documentUploadLogModel);
				console.log(vm.documentUploadLogModel.fileType);
				
				vm.sponsorName = '';
				
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
			            id: 'view-document-upload-log-description-{value}-label',
		            	sortData: false,
		            	cssTemplate: 'text-left'
			        }]
			    }
				
				vm.getSponsorName = function(){
					var serviceUrl = '/api/v1/organize-customers/'+vm.documentUploadLogModel.organizeId+'/profile';
					var serviceDiferred = Service.doGet(serviceUrl, {});		
					serviceDiferred.promise.then(function(response){
						vm.organizeData = response.data;
						vm.sponsorName = vm.organizeData.organizeName;
						
					}).catch(function(response){
						log.error('Load organize data error');
					});
				}
				
				vm.pagingController = PagingController.create('api/v1/upload-logs/'+uploadLogId+'/items', vm.viewCriteria, 'GET');
				
				vm.searchListLog = function(pagingModel) {
					var logListDiferred = vm.pagingController.search(pagingModel);
				}
				
				vm.initLoad = function() {	
					vm.getSponsorName();
					vm.searchListLog();
				}
				
				vm.downloadFile = function(){
					$http({
			             method: 'POST',
			             url: '/api/v1/upload-logs/'+uploadLogId+'/download-source-file',
			             data: transactionModel,
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