var validateandsubmit = angular.module('scfApp');
validateandsubmit.controller('ValidateAndSubmitController', [
		'ValidateAndSubmitService', '$state', '$scope', '$window', '$timeout','$stateParams', 'SCFCommonService',
		function(ValidateAndSubmitService, $state, $scope, $window, $timeout, $stateParams, SCFCommonService) {
			var vm = this;
			$scope.validateDataPopup = false;
			$scope.submitFailPopup = false;
			$scope.confirmPopup = false;
			vm.transactionNo = '';
			//Transaction model after create success
			vm.transactionModel = {};
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
			
			vm.initLoadData = function(){
                vm.transactionModel = $stateParams.transactionModel;
				
				if(vm.transactionModel === null){
                    $state.go('/create-transaction');
                }else{
					vm.tradingpartnerInfoModel = $stateParams.tradingpartnerInfoModel;
					vm.valueOfDocument = $stateParams.totalDocumentAmount;
					vm.pageModel.totalRecord  = vm.transactionModel.documents.length;
					vm.searchDocument();
                }
            }

			vm.dataTable = {
					options: {
	        			displayRowNo: {}
					},
				columns : [
				            {
				                field: 'sponsorPaymentDate',
				                label: 'วันครบกำหนดชำระ',
				                sortData: false,
				                cssTemplate: 'text-center',
				                filterType: 'date',
				                filterFormat: 'dd/MM/yyyy'
				            }, {
				                field: 'documentDate',
				                label: 'วันที่เอกสาร',
				                sortData: false,
				                cssTemplate: 'text-center',
				                filterType: 'date',
				                filterFormat: 'dd/MM/yyyy'
				            }, {
				                field: 'documentNo',
				                label: 'เลขที่เอกสาร',
				                sortData: false,
				                cssTemplate: 'text-center',
				            }, {
				                field: 'documentType',
				                label: 'ประเภทเอกสาร',
				                sortData: false,
				                cssTemplate: 'text-center',
				            }, {
				                field: 'supplierCode',
				                label: 'รหัสลูกค้า',
				                sortData: false,
				                cssTemplate: 'text-center'
				            }, {
				                field: 'outstandingAmount',
				                label: 'จำนวนเงินตามเอกสาร',
				                sortData: false,
				                cssTemplate: 'text-right',
				                filterType: 'number',
				                filterFormat: '2'
				            }]
			}

			vm.submitPopup = function(){
				$scope.confirmPopup = true;
			}
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
					$state.go(SCFCommonService.parentStatePage().getParentState());
				}, 10);
			};
			
            vm.backToCreate = function(){
            	$timeout(function(){
                $state.go(SCFCommonService.parentStatePage().getParentState(), {actionBack: true, transactionModel: vm.transactionModel, tradingpartnerInfoModel: vm.tradingpartnerInfoModel, documentSelects: $stateParams.documentSelects});
            	}, 10);
            };
            
			vm.searchDocument = function(pagingModel){
				if(pagingModel === undefined){
					var pagingObject = SCFCommonService.clientPagination(vm.transactionModel.documents, vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage);	
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
			};
			
			vm.initLoadData();
			
			vm.viewRecent = function(){
				
				$timeout(function(){					
                	$state.go('/view-transaction', {transactionModel: vm.transactionModel});
            	}, 10);
			};
			
			vm.viewHistory = function(){
				$timeout(function(){
					$state.go('/transaction-list');
				}, 10);
			};
		} ]);