var validateandsubmit = angular.module('scfApp');
validateandsubmit.controller('ValidateAndSubmitController', [
		'CreateTransactionService', '$state', '$scope', '$window', '$timeout',
		function(CreateTransactionService, $state, $scope, $window, $timeout) {
			var vm = this;
			$scope.validateDataPopup = false;
			vm.transactionMsg = "TES00125482345";
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

			vm.tradingPatnerData = {
				sponsorName : 'TESCO CO,LTD.',
				financingDocuments : '3',
				valueOfDocument : '58069.44',
				sponsorPaymentDate : '25/05/2016',
				prePercentage : '80.00%',
				transactionDate : '23/05/2016',
				transactionAmount : '46455.55',
				loanMaturityDate : '25/05/2016',
				selected : '3',
			};

			// vm.tradingPatnerData.loanMaturityDate =
			// function(sponsorPaymentDate,
			// maturityDate) {
			// var deffered =
			// ValidateAndSubmitService.prepareTransactionOnValidatePage(sponsorCode,
			// sponsorPaymentDate);
			// deffered.promise.then(function(response) {
			// vm.tradingPatnerData.loanMaturityDate = response.data;
			// }).catch(function(response) {
			// console.log(response);
			// });
			// };

			vm.dataTable = {
				columns : [ {
					label : 'No.',
					cssTemplate : 'text-center',
					showRowNo : true
				}, {
					field : 'dueDate',
					label : 'วันครบกำหนดชำระ',
					sortData : false,
					cssTemplate : 'text-center'
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
					sortData : true,
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
					field : 'documentAmount',
					label : 'จำนวนเงินตามเอกสาร',
					sortData : false,
					cssTemplate : 'text-right',
					filterType : 'number',
					filterFormat : '2'
				} ]
			}

			vm.tableRowCollection = [ {
				dueDate : '30/06/2016',
				documentDate : '10/05/2016',
				documentNo : '463868',
				documentType : 'RV',
				supplierCode : '30001',
				documentAmount : '19356.48'
			}, {
				dueDate : '30/06/2016',
				documentDate : '10/05/2016',
				documentNo : '463867',
				documentType : 'RV',
				supplierCode : '30001',
				documentAmount : '19356.48'
			}, {
				dueDate : '30/06/2016',
				documentDate : '10/05/2016',
				documentNo : '463866',
				documentType : 'RV',
				supplierCode : '30001',
				documentAmount : '19356.48'
			} ];


			vm.submitTransaction = function() {
				$scope.validateDataPopup = true;				
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

			// vm.submitTransaction = function() {
			// var deffered = ValidateAndSubmitService.submitTransaction();
			// deffered.promise.then(function(response) {
			// console.log($state);
			// }).catch(function(response) {
			// console.log(response);
			// });

		} ]);