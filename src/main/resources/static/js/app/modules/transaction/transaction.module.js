'use strict';

angular.module('gecscf.transaction', [ 'ui.router', 'gecscf.ui', 'gecscf.organize.configuration' ]).config(
		[ '$stateProvider', function($stateProvider) {
			var requiredModules = ['js/app/modules/transaction/services/TransactionService.js',
				'js/app/modules/transaction/payment/controllers/CreatePaymentController.js', 
				'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js', 
				'js/app/modules/organize/configuration/product-type/services/ProductTypeService.js',
				'js/app/modules/transaction/payment/reason-code/controllers/SelectReasonCodePopupController.js',
				'js/app/modules/transaction/payment/controllers/ValidateSubmitController.js',
				'js/app/modules/account/services/AccountService.js',
				'js/app/common/scf-component.js',
			     'js/app/common/scf-component.css'];
			
			$stateProvider.state('/my-organize/create-payment', {
				url: '/my-organize/create-payment',
				controller: 'CreatePaymentController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment/create',
				params: {transactionModel: null, tradingpartnerInfoModel: null, criteria: null, supplierModel: null, documentSelects: null, backAction: false, dashboardParams: null, showBackButton: false},
				resolve: WebHelper.loadScript(requiredModules)
			}).state('/my-organize/create-payment-woip', {
				url: '/my-organize/create-payment-woip',
				controller: 'CreatePaymentWithoutInvoiceController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment/create-woip',
				params: {transactionModel: null, tradingpartnerInfoModel: null, criteria: null, supplierModel: null, backAction: false , documents: null},
				resolve: WebHelper.loadScript(['js/app/modules/transaction/services/TransactionService.js','js/app/modules/transaction/payment/controllers/CreatePaymentWithoutInvoiceController.js', 'js/app/modules/account/services/AccountService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/create-payment/validate-submit', {
				url: '/create-payment/validate-submit',
				controller: 'ValidateSubmitController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment/validate-submit',
                params: {transactionModel: null, tradingpartnerInfoModel: null, formatAccount: null},
				resolve: WebHelper.loadScript(requiredModules)
			}).state('/my-organize/payment-transaction', {
				url: '/my-organize/payment-transaction',
				controller: 'PaymentTransactionController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment-transaction/my',
                params: {viewMode:'MY_ORGANIZE',transactionModel: null, backAction: false, criteria : null,buyer : null, supplier : null},
				resolve: WebHelper.loadScript(['js/app/modules/transaction/payment/services/PaymentTransactionService.js','js/app/modules/transaction/payment/controllers/PaymentTransactionController.js','js/app/modules/transaction/services/TransactionService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/partner-organize/payment-transaction', {
				url: '/partner-organize/payment-transaction',
				controller: 'PaymentTransactionController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment-transaction/partner',
                params: {viewMode:'PARTNER',transactionModel: null, backAction: false, criteria : null,buyer : null, supplier : null},
				resolve: WebHelper.loadScript(['js/app/modules/transaction/payment/services/PaymentTransactionService.js','js/app/modules/transaction/payment/controllers/PaymentTransactionController.js','js/app/modules/transaction/services/TransactionService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/customer-organize/payment-transaction', {
				url: '/customer-organize/payment-transaction',
				controller: 'PaymentTransactionController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment-transaction/all',
                params: {viewMode: 'CUSTOMER', transactionModel: null, backAction: false, criteria : null,buyer : null, supplier : null},
				resolve: WebHelper.loadScript(['js/app/modules/transaction/payment/services/PaymentTransactionService.js','js/app/modules/transaction/payment/controllers/PaymentTransactionController.js','js/app/modules/transaction/services/TransactionService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/view-transaction', {
				url: '/view-transaction',
				controller: 'ViewTransactionController',
				controllerAs: 'viewTxnCtrl',
				templateUrl: '/view-transaction',
				params: {
					viewMode: null,
					transactionModel: null,
					listTransactionModel: null,
					backAction: false,
					isShowBackButton: false,
					isShowBackButton: false,
					isShowViewHistoryButton: false,
					isDisplayReason: 'none',
					isAdjustStatus: false
				},
				resolve: WebHelper.loadScript(['js/app/modules/transaction/loan/services/ViewTransactionService.js', 'js/app/modules/transaction/loan/controllers/ViewTransactionController.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/adjust-status-transaction', {
				url: '/adjust-status-transaction',
				controller: 'ViewTransactionController',
				controllerAs: 'viewTxnCtrl',
				templateUrl: '/adjust-status-transaction',
				params: {
					viewMode: null,
					transactionModel: null,
					listTransactionModel: null,
					backAction: false,
					isShowBackButton: false,
					isShowBackButton: false,
					isShowViewHistoryButton: false,
					isDisplayReason: 'none',
					isAdjustStatus: true
				},
				resolve: WebHelper.loadScript(['js/app/modules/transaction/loan/services/ViewTransactionService.js','js/app/modules/transaction/services/TransactionService.js', 'js/app/modules/transaction/loan/controllers/ViewTransactionController.js', 'js/app/modules/transaction/controllers/AdjustStatusPopupController.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/payment-transaction/adjust-status', {
				url: '/payment-transaction/adjust-status',
				controller: 'ViewPaymentController',
				controllerAs: 'ctrl',
				templateUrl: '/payment-transaction/view',
				params: {
					viewMode: null,
					transactionModel: null,
					isShowViewHistoryButton: false,
					isShowBackButton: false,
					isAdjustStatus: true
				},
				resolve: WebHelper.loadScript(['js/app/modules/transaction/payment/services/ViewPaymentService.js', 'js/app/modules/transaction/payment/controllers/ViewPaymentController.js'])
			})
			
		} ]).filter('accountNoDisplay', function() {
		    return function(accountNo) {
		    	var pattern = new RegExp("^\\d{10}$");
		    	var accountNoDisplay = accountNo;
		    	if(accountNo.match(pattern)){
		    		var word1 = accountNo.substring(0,3);
		    		var word2 = accountNo.substring(3,4);
		    		var word3 = accountNo.substring(4, 9);
		    		var word4 = accountNo.substring(9,10);
		    		accountNoDisplay = word1+'-'+word2+'-'+word3+'-'+word4;    		
		    	}
				return accountNoDisplay;
		    };
		});