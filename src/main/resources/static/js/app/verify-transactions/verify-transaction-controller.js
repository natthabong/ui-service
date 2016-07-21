angular.module('scfApp').controller(
		'VerifyTransactionController',
		[ 'VerifyTransactionService', '$stateParams','SCFCommonService','$scope','$timeout','$state','PageNavigation',
				function(VerifyTransactionService, $stateParams, SCFCommonService,$scope,$timeout,$state,PageNavigation) {
					var vm = this;
					vm.dataTable = {
						options : {
							displayRowNo : {}
						},
						columns : []
					}
					vm.errorMessageModel = {
							errorMessage: '',
							modifyName: ''
					}
					$scope.showConfirmPopup = false; 
					$scope.verifyFailPopup = false;
					$scope.successPopup = false;
					vm.pageModel = {
							pageSizeSelectModel : '20',
							totalRecord : 0,
							currentPage : 0
						};
					vm.transactionModel = $stateParams.transactionModel || {};
					vm.splitePageTxt = '';
					function init(){
					     var deffered = VerifyTransactionService.prepare(vm.transactionModel);
				            deffered.promise.then(function (response) {
				            	  vm.transactionModel = angular.extend(vm.transactionModel, response.data);
									
				            	  vm.pageModel.totalRecord = vm.transactionModel.documents.length;
				            	  vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
				            	  vm.searchDocument();
				                })
				                .catch(function (response) {
				                    console.log('Cannot initial data');
				                });
				            
				          var columnDisplayConfig = vm.loadDocumentDisplayConfig(vm.transactionModel.sponsorId);
							columnDisplayConfig.promise.then(function(response){
								vm.dataTable.columns = response;
						  });
					}
					
					
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
					
					vm.loadDocumentDisplayConfig = function(sponsorId){
						var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId);
						return displayConfig;
					}
					
					
					init();
					
					vm.searchDocument = function(pagingModel){
						
						if(pagingModel === undefined){
							vm.pageModel = {
									pageSizeSelectModel : '20',
									totalRecord : 0,
									currentPage : 0,
									totalPage: 1
								};
						}else{							
							vm.pageModel.pageSizeSelectModel = pagingModel.pageSize;
							vm.pageModel.currentPage = pagingModel.page;
						}
						
						var txnDocCriteria = {
								transactionId: 	vm.transactionModel.transactionId,
								page: vm.pageModel.currentPage,
								pageSize: +vm.pageModel.pageSizeSelectModel
							}
						var deffered = VerifyTransactionService.getDocuments(txnDocCriteria);
						deffered.promise.then(function(response){
							vm.documentDisplay = response.data.content;
							vm.pageModel.totalPage = response.data.totalPages;
							vm.pageModel.totalRecord = response.data.totalElements;
			                vm.pageModel.currentPage = response.data.number;
			                vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
						}).catch(function(response){
							log.error('Cannot load transaction');
						});
						
					}
					vm.confirmApprove = function(){
						$scope.showConfirmPopup = true; 
					}
					
					vm.approve = function(){
						 var deffered = VerifyTransactionService.approve(vm.transactionModel);
				            deffered.promise.then(function (response) {
				            	  vm.transactionModel = angular.extend(vm.transactionModel, response.data);
				            	  vm.pageModel.totalRecord = vm.transactionModel.documents.length;
				            	  vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
				            	  vm.transactionNo = vm.transactionModel.transactionNo;
				            	  $scope.successPopup = true;
				                })
				                .catch(function (response) {
					               	 console.log('Cannot Approve');
					               	 var errorResponse = response.data.messages;
					               	 vm.errorMessageModel.errorMessage = errorResponse.actionOn;
					               	 vm.errorMessageModel.modifyName = errorResponse.lastModifiedBy;
					               	 vm.errorMsgPopup = response.data.errorCode;
									 $scope.verifyFailPopup = true;									 
				                });
					}
					
					vm.reject = function(){
						 var deffered = VerifyTransactionService.reject(vm.transactionModel);
				            deffered.promise.then(function (response) {
				            	  vm.transactionModel = angular.extend(vm.transactionModel, response.data);
				            	  vm.pageModel.totalRecord = vm.transactionModel.documents.length;
				            	  vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
				            	  vm.transactionNo = vm.transactionModel.transactionNo;
				            	  $scope.successPopup = true;
				                })
				                .catch(function (response) {
					               	 console.log('Cannot Reject');
					               	 $scope.verifyFailPopup = true;
									 vm.errorMsgPopup = response.data.errorCode;
				                });
					}
					
					vm.backAndReset = function(){
						$timeout(function(){
							PageNavigation.gotoPreviousPage(true);
						}, 10);
					}

					vm.backNotReset = function(){
						$timeout(function(){
							PageNavigation.gotoPreviousPage();
						}, 10);
					}

					vm.viewRecent = function(){
						SCFCommonService.parentStatePage().saveCurrentState('/transaction-list');
						$timeout(function(){
		                	var params = {transactionModel: vm.transactionModel, isShowViewHistoryButton:'show', isShowViewHistoryButton: true};
		                	PageNavigation.gotoPage('/view-transaction', params, params);
		            	}, 10);
					};
					
					vm.viewHistory = function(){
						$timeout(function(){
							PageNavigation.gotoPage('/transaction-list');
						}, 10);
					};					
					
				} ]);