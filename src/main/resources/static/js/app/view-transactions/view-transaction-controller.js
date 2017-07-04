angular.module('scfApp').controller(
		'ViewTransactionController',
		[ 'ViewTransactionService', '$stateParams','SCFCommonService','$scope','$timeout','$state','$log', 'PageNavigation',
				function(ViewTransactionService, $stateParams, SCFCommonService,$scope,$timeout,$state, $log, PageNavigation) {
					var vm = this;
					var log = $log;
					$scope.showConfirmPopup = false; 
					$scope.verifyFailPopup = false;
					$scope.successPopup = false;
					
					vm.isSponsor = false;
					vm.isSupplier = false;
					vm.isBank = false;
					
					var currentParty = '';
					var partyRole = {
						sponsor : 'sponsor',
						supplier : 'supplier',
						bank : 'bank'
					}
					
					currentParty = $stateParams.party;
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
						
						if (currentParty == partyRole.sponsor) {
							vm.isSponsor = true;
						} else if (currentParty == partyRole.supplier) {
							vm.isSupplier = true;
						} else if (currentParty == partyRole.bank) {
							vm.isBank = true;
						}
						
					     var deffered = ViewTransactionService.prepare(vm.transactionModel);
				            deffered.promise.then(function (response) {
				            	  vm.transactionModel = angular.extend(response.data,{sponsor: vm.transactionModel.sponsor, supplier: vm.transactionModel.supplier});
				            	  if(vm.transactionModel.statusCode == 'REJECT_BY_CHECKER' || vm.transactionModel.statusCode == 'REJECT_BY_APPROVER'){
				            		  vm.isDisplayReason = 'block-inline';
				            	  }else{
				            		  vm.isDisplayReason = 'none';
				            	  }
				            	  
				            	  vm.pageModel.totalRecord = vm.transactionModel.documents.length;
				            	  vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
				            	  vm.searchDocument();
				                })
				                .catch(function (response) {
				                    console.log('View Transaction load error');
				                });
				            var columnDisplayConfig = vm.loadDocumentDisplayConfig(vm.transactionModel.sponsorId);
							columnDisplayConfig.promise.then(function(response){
								vm.dataTable.columns = response.items;
						  });
					}
					vm.loadDocumentDisplayConfig = function(sponsorId){
						var displayConfig = SCFCommonService.getDocumentDisplayConfig(sponsorId);
						return displayConfig;
					}
					init();
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
								pageSize: +vm.pageModel.pageSizeSelectModel
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
						    	    PageNavigation.gotoPage('/transaction-list/supplier');
						    	}
						    	else if(vm.isSponsor){
						    	    PageNavigation.gotoPage('/transaction-list/sponsor');
						    	}
						    	else{
						    	    PageNavigation.gotoPage('/transaction-list/bank');
						    	}
						}, 10);
					};

				} ]);