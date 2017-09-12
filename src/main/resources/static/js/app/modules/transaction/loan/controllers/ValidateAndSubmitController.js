var validateandsubmit = angular.module('scfApp');
validateandsubmit.controller('ValidateAndSubmitController', [
		'ValidateAndSubmitService', '$state', '$scope', '$window', '$timeout','$stateParams', 'SCFCommonService', '$log', 'PageNavigation',
		function(ValidateAndSubmitService, $state, $scope, $window, $timeout, $stateParams, SCFCommonService, $log, PageNavigation) {
			var vm = this;
			var log = $log;
			$scope.validateDataPopup = false;
			$scope.submitFailPopup = false;
			$scope.confirmPopup = false;
			vm.transactionNo = '';
			// Transaction model after create success
			vm.transactionModel = {};
			vm.documentSelects = [];
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
			vm.splitePageTxt = '';
			
			vm.pageModel = {
				pageSizeSelectModel : '20',
				totalRecord : 0,
				currentPage : 0
			};
			
			vm.dataTable = {
				columns : []
			}
			
			vm.initLoadData = function(){
                vm.transactionModel = $stateParams.transactionModel;
				if(vm.transactionModel === null){
					PageNavigation.backStep();
                }else{
					vm.getDisplaySponsorConfig(vm.transactionModel.sponsorId);
					vm.documentSelects = $stateParams.documentSelects;
					vm.tradingpartnerInfoModel = $stateParams.tradingpartnerInfoModel;
					vm.valueOfDocument = $stateParams.totalDocumentAmount;
					vm.pageModel.totalRecord  = vm.transactionModel.documents.length;
					vm.searchDocument();
                }
            }
			
			vm.getDisplaySponsorConfig = function(sponsorId){
				var deffered = SCFCommonService.getDocumentDisplayConfig(sponsorId, 'PAYABLE', 'TRANSACTION_DOCUMENT');
				deffered.promise.then(function(response){
					vm.dataTable.columns = response.items;
				});
			};

			vm.submitPopup = function(){
				$scope.confirmPopup = true;
			};
			vm.submitTransaction = function() {
				var deffered = ValidateAndSubmitService.submitTransaction(vm.transactionModel);
				 deffered.promise.then(function(response) {
					 vm.transactionModel = response.data;
					 vm.transactionNo = vm.transactionModel.transactionNo;
					 $scope.confirmPopup = false;
					 $scope.validateDataPopup = true;
				 }).catch(function(response) {
					 $scope.submitFailPopup = true;
					 vm.errorMsgPopup = response.data.errorCode;
				 });
			};
			vm.createNewAction = function(){
				$timeout(function(){
					PageNavigation.backStep(true);
				}, 10);
			};
			
            vm.backToCreate = function(){
            	$timeout(function(){
            		PageNavigation.backStep();
            	}, 10);
            };
			vm.searchDocument = function(pagingModel){
				if(pagingModel === undefined){
					var pagingObject = SCFCommonService.clientPagination(vm.documentSelects, vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage);	
					vm.documentDisplay = pagingObject.content;
					vm.pageModel.totalPage = pagingObject.totalPages;
					vm.pageModel.totalRecord = vm.transactionModel.documents.length;
				}else{
					vm.pageModel.currentPage = pagingModel.page;
					vm.pageModel.pageSizeSelectModel = pagingModel.pageSize;
					var pagingObject = SCFCommonService.clientPagination(vm.documentSelects, vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage);	
					vm.documentDisplay = pagingObject.content;
					vm.pageModel.totalPage = pagingObject.totalPages;
					vm.pageModel.totalRecord = vm.transactionModel.documents.length;
				}
				vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
			};
			
			vm.initLoadData();
			
			vm.viewRecent = function(){
				
				$timeout(function(){		
					vm.transactionModel.sponsor = vm.tradingpartnerInfoModel.sponsorName;
					PageNavigation.gotoPage('/view-transaction', {transactionModel: vm.transactionModel, isShowViewHistoryButton: true,party: 'MY_ORGANIZE'});
            	}, 10);
			};
			
			vm.viewHistory = function(){
				$timeout(function(){
					PageNavigation.gotoPage('/my-organize/transaction-list');
				}, 10);
			};
			
			vm.homeAction = function(){
						$timeout(function(){
							PageNavigation.gotoPage('/home');
						}, 10);
					};
		} ]);