var validateandsubmit = angular.module('scfApp');
validateandsubmit.controller('ValidateAndSubmitController', [
		'ValidateAndSubmitService', '$state', '$scope', '$window', '$timeout','$stateParams', 'SCFCommonService',
		function(ValidateAndSubmitService, $state, $scope, $window, $timeout, $stateParams, SCFCommonService) {
			var vm = this;
			$scope.validateDataPopup = false;
			$scope.submitFailPopup = false;
			$scope.confirmPopup = false;
			vm.transactionNo = '';
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
					vm.splitePageTxt = SCFCommonService.splitePage(vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage, vm.pageModel.totalRecord);
					vm.searchDocument();
                    vm.loadMaturityDate();
                }
				
               
                
            }
			
			vm.loadMaturityDate = function() {
				var deffered = ValidateAndSubmitService.prepareTransactionOnValidatePage(vm.transactionModel);
				deffered.promise.then(function(response) {
					vm.transactionModel = response.data;
					
				}).catch(function(response) {
					console.log(response);
				});
			};

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
				                field: 'sponsorPaymentDate',
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
					 vm.transactionNo = response.data.transactionNo;
					 $scope.confirmPopup = false;
					 $scope.validateDataPopup = true;
				 }).catch(function(response) {
					 console.log(response);
					 $scope.submitFailPopup = true;
					 vm.errorMsgPopup = response.data.errorCode;
				 });
			};
			vm.createNewAction = function(){
				$timeout(function(){
					$state.go(SCFCommonService.parentStatePage().getParentState());
				}, 30);					
			};
			
            vm.backToCreate = function(){
                $state.go(SCFCommonService.parentStatePage().getParentState(), {actionBack: true, transactionModel: vm.transactionModel, tradingpartnerInfoModel: vm.tradingpartnerInfoModel, documentSelects: $stateParams.documentSelects});
            };
            
			vm.searchDocument = function(pagingModel){
				if(pagingModel === undefined){
					var pagingObject = SCFCommonService.clientPagination(vm.transactionModel.documents, vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage);	
					vm.documentDisplay = pagingObject.content;
					vm.pageModel.totalPage = pagingObject.totalPages;
					console.log(pagingObject);
				}else{
					vm.pageModel.currentPage = pagingModel.page;
					vm.pageModel.pageSizeSelectModel = pagingModel.pageSize;
					var pagingObject = SCFCommonService.clientPagination(vm.transactionModel.documents, vm.pageModel.pageSizeSelectModel, vm.pageModel.currentPage);	
					vm.documentDisplay = pagingObject.content;
					vm.pageModel.totalPage = pagingObject.totalPages;
					console.log(pagingObject);
				}
			};
			
			vm.initLoadData();

			// vm.changePageSize = function(page, pageSize) {
			// var deffered =
			// ValidateAndSubmitService.getDocumentOnValidatePage(page,
			// pageSize);
			// deffered.promise.then(function(response) {
			// //clear list transaction date
			// vm.tableRowCollection = [];
			// var transactionResponse = response.data;
			// transactionResponse.forEach(function(data) {
			// vm.tableRowCollection.push({
			// dueDate: data.dueDate,
			// documentDate: data.documentDate,
			// documentNo: data.documentNo,
			// documentType: data.documentType,
			// supplierCode: data.supplierCode,
			// documentDate: data.documentDate
			// });
			// });
			// //set select default value
			// vm.createTransactionModel.transactionDate =
			// vm.transactionDates[0].value;
			// }).catch(function(response) {
			// console.log(response);
			// });
			// };


		} ]);