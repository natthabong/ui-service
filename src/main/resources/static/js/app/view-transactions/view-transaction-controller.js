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
					console.log(vm.isShowViewHistoryButton);
					console.log(vm.isShowBackButton);
					vm.pageModel = {
							pageSizeSelectModel : '20',
							totalRecord : 0,
							currentPage : 0,
							totalPage: 1
						};
					
					vm.splitePageTxt = '';
					function init(){
						
					     var deffered = ViewTransactionService.prepare(vm.transactionModel);
				            deffered.promise.then(function (response) {
				            	  vm.transactionModel = angular.extend(response.data,{sponsor: vm.transactionModel.sponsor});
//				            	  vm.transactionModel = response.data;
				            	  vm.pageModel.totalRecord = vm.transactionModel.documents.length;
				            	  vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
				                })
				                .catch(function (response) {
				                    console.log(response);
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

					vm.viewHistory = function(){
						$timeout(function(){
							$state.go('/transaction-list');
						}, 10);
					};

				} ]);