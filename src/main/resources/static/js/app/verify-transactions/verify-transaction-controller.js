angular.module('scfApp').controller(
		'VerifyTransactionController',
		[ 'VerifyTransactionService', '$stateParams','SCFCommonService','$scope','$timeout','$state',
				function(VerifyTransactionService, $stateParams, SCFCommonService,$scope,$timeout,$state) {
					var vm = this;
					$scope.showConfirmPopup = false; 
					$scope.verifyFailPopup = false;
					$scope.successPopup = false;
					vm.pageModel = {
							pageSizeSelectModel : '20',
							totalRecord : 0,
							currentPage : 0
						};
					vm.transactionModel = $stateParams.transactionModel;
					vm.splitePageTxt = '';
					function init(){
					     var deffered = VerifyTransactionService.prepare(vm.transactionModel);
				            deffered.promise.then(function (response) {
				            	  vm.transactionModel = angular.extend(vm.transactionModel, response.data);
									
				            	  vm.pageModel.totalRecord = vm.transactionModel.documents.length;
				            	  vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
				                })
				                .catch(function (response) {
				                    console.log('Cannot initial data');
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
							field : 'sponsorPaymentDate',
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
									 $scope.verifyFailPopup = true;
									 vm.errorMsgPopup = response.data.errorCode;
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
					
					vm.back = function(){
						$timeout(function(){
							$state.go('/transaction-list');
						}, 10);
					}				

				} ]);