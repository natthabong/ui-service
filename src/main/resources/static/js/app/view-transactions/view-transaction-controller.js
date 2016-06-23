angular.module('scfApp').controller(
		'ViewTransactionController',
		[ 'ViewTransactionService', '$stateParams','SCFCommonService','$scope','$timeout','$state',
				function(ViewTransactionService, $stateParams, SCFCommonService,$scope,$timeout,$state) {
					var vm = this;
					$scope.showConfirmPopup = false; 
					$scope.verifyFailPopup = false;
					$scope.successPopup = false;
					
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
					function init(){
						if(vm.transactionModel === null){
							$state.go(SCFCommonService.parentStatePage().getParentState());
						}
					     var deffered = ViewTransactionService.prepare(vm.transactionModel);
				            deffered.promise.then(function (response) {
				            	  vm.transactionModel = angular.extend(response.data,{sponsor: vm.transactionModel.sponsor});
//				            	  vm.transactionModel = response.data;
				            	  vm.pageModel.totalRecord = vm.transactionModel.documents.length;
				            	  vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
								vm.searchDocument();
				                })
				                .catch(function (response) {
				                    console.log('View Transaction load error');
				                });
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

					
					
					vm.dataTable = {
						options : {
							displayRowNo : {}
						},
						columns : [ {
							field : 'sponsorPaymentDate',
							label : 'วันครบกำหนดชำระ',
							sortData : false,
							cssTemplate : 'text-center',
							filterType : 'date',
							filterFormat : 'dd/MM/yyyy'
						}, {
							field : 'documentDate',
							label : 'วันที่เอกสาร',
							sortData : false,
							cssTemplate : 'text-center',
							filterType : 'date',
							filterFormat : 'dd/MM/yyyy'
						}, {
							field : 'documentNo',
							label : 'เลขที่เอกสาร',
							sortData : false,
							cssTemplate : 'text-center',
						}, {
							field : 'documentType',
							label : 'ประเภทเอกสาร',
							sortData : false,
							cssTemplate : 'text-center',
						}, {
							field : 'supplierCode',
							label : 'รหัสลูกค้า',
							sortData : false,
							cssTemplate : 'text-center'
						}, {
							field : 'outstandingAmount',
							label : 'จำนวนเงินตามเอกสาร',
							sortData : false,
							cssTemplate : 'text-right',
							filterType : 'number',
							filterFormat : '2'
						} ]
					}
					
					vm.back = function(){
						$state.go(SCFCommonService.parentStatePage().getParentState(), {actionBack: true});	
					}
					
					vm.searchDocument = function(pagingModel){
						if(pagingModel === undefined){
							var pagingObject = SCFCommonService.clientPagination(vm.transactionModel.documents,
																				 vm.pageModel.pageSizeSelectModel,
																				 vm.pageModel.currentPage);
							vm.documentDisplay = pagingObject.content;
							vm.pageModel.totalPage = pagingObject.totalPages;
							vm.pageModel.totalRecord = vm.transactionModel.documents.length;
						}else{
							vm.pageModel.currentPage = pagingModel.page;
							vm.pageModel.pageSizeSelectModel = pagingModel.pageSize;
							var pagingObject = SCFCommonService.clientPagination(vm.transactionModel.documents, vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage);	
							vm.documentDisplay = pagingObject.content;
							vm.pageModel.totalPage = pagingObject.totalPages;
							vm.pageModel.totalRecord = vm.transactionModel.documents.length;
						}
						vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
					}
					
					vm.viewHistory = function(){
						$timeout(function(){
							$state.go('/transaction-list');
						}, 10);
					};

				} ]);