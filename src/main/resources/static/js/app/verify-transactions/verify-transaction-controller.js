angular.module('scfApp').controller(
		'VerifyTransactionController',
		[ 'VerifyTransactionService', '$stateParams','SCFCommonService','$scope','$timeout','$state','PageNavigation', 'UIFactory', 'ngDialog', '$log',
				function(VerifyTransactionService, $stateParams, SCFCommonService,$scope,$timeout,$state,PageNavigation, UIFactory, ngDialog, $log) {
					var vm = this;
					var log = $log;
					vm.dataTable = {
						options : {
							displayRowNo : {
								idValueField: 'template',
			                	id: 'no-{value}-label'
							}
						},
						columns : []
					}
					vm.errorMessageModel = {
							errorMessage: '',
							modifyName: ''
					}
					$scope.verifyFailPopup = false;
					$scope.successPopup = false;
					vm.pageModel = {
							pageSizeSelectModel : '20',
							totalRecord : 0,
							currentPage : 0
						};
					vm.transactionModel = $stateParams.transactionModel || {};

					var sort = null;
					
					vm.splitePageTxt = '';
					
					function init(){
						var columnDisplayConfig = vm.loadDocumentDisplayConfig(vm.transactionModel.sponsorId);
							columnDisplayConfig.promise.then(function(response){
								vm.dataTable.columns = response.items;
								sort = response.sort;
								var deffered = VerifyTransactionService.prepare(vm.transactionModel);
								deffered.promise.then(function (response) {
									vm.transactionModel = angular.extend(vm.transactionModel, response.data);
									
									vm.pageModel.totalRecord = vm.transactionModel.documents.length;
									vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
									vm.searchDocument();
								})
								.catch(function (response) {
									log.error('Cannot initial data');
								});
						}).catch(function (response) {
							log.error('Cannot get display data');
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
						var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId,'PAYABLE','TRANSACTION_DOCUMENT');
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
								pageSize: +vm.pageModel.pageSizeSelectModel,
								sort : sort
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
						UIFactory.showConfirmDialog({
							data : {
								headerMessage : 'Confirm approval ?',
								mode: '',
								credentialMode : false,
								transactionModel : vm.transactionModel
							}, 
							confirm : function() {
								return vm.approve();
							},
							onFail : function(response) {					
								$scope.response = response.data;
								UIFactory.showFailDialog({
									data : {
										mode: 'concurrency',
										headerMessage : 'Verify transaction fail.',
										backAndReset : vm.backNotReset,
										viewHistory : vm.viewHistory,
										viewRecent : vm.viewRecent,
										errorCode : response.data.errorCode,
										action : response.data.attributes.action,
										actionBy : response.data.attributes.actionBy
									}
								});						
							},
							onSuccess : function(response) {
								UIFactory.showSuccessDialog({
									data : {
										mode: 'transaction',
										headerMessage : 'Verify transaction success.',						
										bodyMessage : vm.transactionModel.transactionNo,
										backAndReset : vm.backNotReset,
										viewRecent : vm.viewRecent,
										viewHistory : vm.viewHistory
									},
								});				
							}
						});
					}
					
					vm.approve = function(){
						 var deffered = VerifyTransactionService.approve(vm.transactionModel);
						 return deffered;
					}
					
					vm.confirmReject = function(){
						UIFactory.showConfirmDialog({
							data : {
								headerMessage : 'Confirm reject ?',
								mode: 'transaction',
								credentialMode : false,
								rejectReason : '',
								transactionModel : vm.transactionModel
							}, 
							confirm : function() {
								return vm.reject();
							},
							onFail : function(response) {					
								$scope.response = response.data;
								UIFactory.showFailDialog({
									data : {
										mode: 'concurrency',
										headerMessage : 'Reject transaction fail.',
										backAndReset : vm.backNotReset,
										viewHistory : vm.viewHistory,
										viewRecent : vm.viewRecent,
										errorCode : response.data.errorCode,
										action : response.data.attributes.action,
										actionBy : response.data.attributes.actionBy
									}
								});						
							},
							onSuccess : function(response) {
								UIFactory.showSuccessDialog({
									data : {
										mode: 'transaction',
										headerMessage : 'Reject transaction success.',						
										bodyMessage : vm.transactionModel.transactionNo,
										backAndReset : vm.backNotReset,
										viewRecent : vm.viewRecent,
										viewHistory : vm.viewHistory
									},
								});				
							}
						});
					}
					
					vm.reject = function(){
						var deffered = VerifyTransactionService.reject(vm.transactionModel);
						return deffered;
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
						$timeout(function(){
		                	var params = {transactionModel: vm.transactionModel, viewMode: 'MY_ORGANIZE' , isShowViewHistoryButton:'show', isShowViewHistoryButton: true};
		                	PageNavigation.gotoPage('/view-transaction', params, params);
		            	}, 10);
					};
					
					vm.viewHistory = function(){
						$timeout(function(){
							PageNavigation.gotoPage('/my-organize/transaction-list');
						}, 10);
					};					
					
				} ]);