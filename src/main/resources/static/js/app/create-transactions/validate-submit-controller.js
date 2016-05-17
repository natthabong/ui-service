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

			vm.document = {
				no : '',
				paymentDate : '',
				documentDate : '',
				documentNo : '',
				documentType : '',
				supplierCode : '',
				documentAmount : '',
			};

			vm.selectedDocuments = [ {
				no : '1',
				paymentDate : '30/06/2016',
				documentDate : '10/05/2016',
				documentNo : '463868',
				documentType : 'RV',
				supplierCode : '30001',
				documentAmount : '19356.48'
			}, {
				no : '2',
				paymentDate : '30/06/2016',
				documentDate : '10/05/2016',
				documentNo : '463867',
				documentType : 'RV',
				supplierCode : '30001',
				documentAmount : '19356.48'
			}, {
				no : '3',
				paymentDate : '30/06/2016',
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
		} ]);