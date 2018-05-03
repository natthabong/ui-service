angular.module('gecscf.transaction').controller(
		'ViewTransactionController',
		[ 'ViewTransactionService','TransactionService','$stateParams','SCFCommonService','$scope','$timeout','$state','$log','PageNavigation','$filter','UIFactory',
  function(ViewTransactionService , TransactionService , $stateParams , SCFCommonService , $scope , $timeout , $state , $log , PageNavigation , $filter , UIFactory) {
					var vm = this;
					var log = $log;
					$scope.showConfirmPopup = false; 
					$scope.verifyFailPopup = false;
					$scope.successPopup = false;
					vm.isAdjustStatus = $stateParams.isAdjustStatus;
					vm.isSponsor = false;
					vm.isSupplier = false;
					vm.isBank = false;
					var sort = null;
					
					var currentViewMode = '';
					var viewMode = {
						sponsor : 'PARTNER',
						supplier : 'MY_ORGANIZE',
						bank : 'CUSTOMER'
					}
					
					currentViewMode = $stateParams.viewMode;
					
					vm.transactionModel = $stateParams.transactionModel;
					vm.isShowViewHistoryButton = $stateParams.isShowViewHistoryButton;;
					vm.isShowBackButton = $stateParams.isShowBackButton;
					
					vm.pageModel = {
							pageSizeSelectModel : '20',
							totalRecord : 0,
							currentPage : 0,
							totalPage: 1
						};
					
					vm.splitePageTxt = '';
					
					vm.dataTable = {
							options : {
								displayRowNo : {}
							},
							columns : []
						}
					
					function init(){
						if(vm.transactionModel === null){
							PageNavigation.gotoPreviousPage();
						}
						
						if (currentViewMode == viewMode.sponsor) {
							vm.isSponsor = true;
						} else if (currentViewMode == viewMode.supplier) {
							vm.isSupplier = true;
						} else if (currentViewMode == viewMode.bank) {
							vm.isBank = true;
						}
						
					     
						var columnDisplayConfig = vm.loadDocumentDisplayConfig(vm.transactionModel.sponsorId);
						columnDisplayConfig.promise.then(function(response){
							vm.dataTable.columns = response.items;
							sort = response.sort;
							var deffered = ViewTransactionService.prepare(vm.transactionModel);
							deffered.promise.then(function (response) {
								vm.transactionModel = angular.extend(response.data,{sponsor: vm.transactionModel.sponsor, supplier: vm.transactionModel.supplier});
								
								if(vm.transactionModel.statusCode == 'REJECT_BY_CHECKER' || vm.transactionModel.statusCode == 'REJECT_BY_APPROVER'){
									vm.isDisplayReason = 'block-inline';
								}else{
									vm.isDisplayReason = 'none';
								}
								
								if(vm.transactionModel.payerAccount.format){
									vm.transactionModel.payerAccountNo = $filter('accountNoDisplay')(vm.transactionModel.payerAccountNo);
								} 
								
								vm.pageModel.totalRecord = vm.transactionModel.documents.length;
								vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
								vm.searchDocument();
							})
							.catch(function (response) {
								console.log('View Transaction load error');
							});
						});

					}
					vm.loadDocumentDisplayConfig = function(sponsorId){
						var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId,'PAYABLE','TRANSACTION_DOCUMENT');
						return displayConfig;
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

					
					vm.back = function(){
						PageNavigation.gotoPreviousPage();
					}
					
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
						var deffered = ViewTransactionService.getDocuments(txnDocCriteria);
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
					
					vm.viewHistory = function(){
						$timeout(function(){
						    	if(vm.isSupplier){
						    	    PageNavigation.gotoPage('/my-organize/transaction-list');
						    	}
						    	else if(vm.isSponsor){
						    	    PageNavigation.gotoPage('/partner-organize/transaction-list');
						    	}
						    	else{
						    	    PageNavigation.gotoPage('/customer-organize/transaction-list');
						    	}
						}, 10);
					};
					
					
					var adjust = function(modeAdjust){
						var deffered = TransactionService.getConfirmToken(vm.transactionModel);
  						deffered.promise.then(function (response) {
  							if(response.status==200){
  	  							confirmToken = response.data.confirmToken;
  	  							confirmPopup(modeAdjust, confirmToken);
  							}
  						})
  						.catch(function (response) {
  							UIFactory.showDialog({
	                            templateUrl: '/js/app/modules/transaction/templates/fail-dialog.html',
	                            controller: 'AdjustStatusPopupController',
	                            data: {
	                                preCloseCallback: function(confirm) {
	                                
	                                },
	                                modeAdjust : modeAdjust,
	                                transactionModel : vm.transactionModel,
	                                transactionId : vm.transactionModel.transactionId,
	                                transactionNo :  vm.transactionModel.transactionNo,
	                                reason : response.reason,
	                                errorMessage : 'Transaction has been modified',
	                                isTokenExpired : false
	                            }
							});
  						});
					}
					
					var confirmPopup = function(modeAdjust, confirmToken) {
	                      UIFactory.showDialog({
	                             templateUrl: '/js/app/modules/transaction/templates/dialog-confirm-adjust-status.html',
	                             controller: 'AdjustStatusPopupController',
	                             data: {
	                                preCloseCallback: function(confirm) {
	                                	init();
	                                },
	                                modeAdjust : modeAdjust,
	                                transactionModel : vm.transactionModel,
	                                transactionId : vm.transactionModel.transactionId,
	                                transactionNo : vm.transactionModel.transactionNo,
	                                reason : null,
	                                confirmToken : confirmToken
	                             }
	                      });
	                }
					
					vm.failToDrawdown = function() {
						  adjust('failToDrawdown');
	                }
					
					vm.drawdownSuccess = function() {
						 adjust('drawdownSuccess');
					}
					init();
				} ]);