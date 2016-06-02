var validateandsubmit = angular.module('scfApp');
validateandsubmit.controller('ValidateAndSubmitController', [
		'ValidateAndSubmitService', '$state', '$scope', '$window', '$timeout','$stateParams',
		function(ValidateAndSubmitService, $state, $scope, $window, $timeout, $stateParams) {
			var vm = this;
			$scope.validateDataPopup = false;
			$scope.confirmPopup = false;
			vm.transactionNo = '';
			vm.pageSizeList = [ {
				label : '10',
				value : '10'
			} ];
			vm.pageSizeSelectModel = '10';
			vm.pageModel = {
				pageSizeSelectModel : '10',
				totalRecord : '10',
				currentPage : 0
			};
			
			vm.transactionModel = $stateParams.transactionModel;
			vm.tradingpartnerInfoModel = $stateParams.tradingpartnerInfoModel;
			vm.tradingModel = {sponsorName : 'TESCO CO,LTD.'};
			vm.valueOfDocument = $stateParams.totalDocumentAmount;
			
			vm.loadMaturityDate = function() {
				var deffered = ValidateAndSubmitService.prepareTransactionOnValidatePage(vm.transactionModel);
				deffered.promise.then(function(response) {
					vm.transactionModel = response.data;
					
				}).catch(function(response) {
					console.log(response);
				});
			};
			vm.loadMaturityDate();

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
				 });
			};
			vm.createNewAction = function(){
				$timeout(function(){
					$state.go('/create-transaction');
				}, 30);					
			};

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