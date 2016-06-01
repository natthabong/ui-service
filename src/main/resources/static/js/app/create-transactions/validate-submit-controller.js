var validateandsubmit = angular.module('scfApp');
validateandsubmit.controller('ValidateAndSubmitController', [
		'ValidateAndSubmitService', '$state', '$scope', '$window', '$timeout','$stateParams',
		function(ValidateAndSubmitService, $state, $scope, $window, $timeout, $stateParams) {
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
			vm.tableRowCollection = $stateParams.documentSelects;
			vm.transactionModel = {
				sponsorName : 'TESCO CO,LTD.',
				documents : vm.tableRowCollection,
				valueOfDocument : '58069.44',
				sponsorPaymentDate : $stateParams.sponsorPaymentDate,
				prePercentage : '80.00%',
				transactionDate : '23/05/2016',
				transactionAmount : '46455.55',
				maturityDate : '25/05/2016'
			};

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