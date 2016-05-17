var validateandsubmit = angular.module('scfApp');
validateandsubmit.controller('ValidateAndSubmitController', [
		'CreateTransactionService', '$state', '$scope', '$window',
		function(CreateTransactionService, $state, $scope, $window) {
			var vm = this;

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
				console.log($state);
			};
		} ]);