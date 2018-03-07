angular
	.module('gecscf.documentUploadLog')
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
				
				vm.viewMode = $stateParams.viewMode;
				vm.headerMsg = vm.viewMode == 'MY_ORGANIZE' ? "View upload document logs" : "View customer document upload log";
				
				vm.isFunding = true;
				vm.recordModel = $stateParams.recordModel;
				var uploadLogId = vm.recordModel.uploadDocumentLogId;
				
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
					$timeout(function(){
						PageNavigation.backStep();
					}, 10);
				}
				
				vm.pagingController = PagingController.create('api/v1/upload-logs/'+uploadLogId+'/items', vm.viewCriteria, 'GET');
				
				vm.searchListLog = function(pagingModel) {
					var logListDiferred = vm.pagingController.search(pagingModel);
				}
				
				vm.initLoad = function() {
					if(vm.viewMode === 'MY_ORGANIZE'){
						vm.isFunding = false;
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
			             a.download    = vm.recordModel.fileName;
			             document.body.appendChild(a);
			             a.click();
			         }).error(function(response) {
			             
			         });
				}
			}
		]
	);