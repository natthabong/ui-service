var $stateProviderRef = null;
var app = angular.module('scfApp', ['pascalprecht.translate', 'ui.router', 'ui.bootstrap', 'ui.mask', 'authenApp', 'oc.lazyLoad', 'checklist-model', 'blockUI', 'scf-ui', 'ngDialog', 'nvd3ChartDirectives',
                        			'legendDirectives','chart.js', 'gecscf.ui', 'ngCookies', 'gecscf.organize', 'gecscf.profile', 'gecscf.user', 'gecscf.tradingPartner', 'gecscf.account', 'gecscf.transaction', 'gecscf.tradingPartner.financing','gecscf.supplierCreditInformation','gecscf.buyerCreditInformation'
									,'gecscf.sponsorConfiguration.workflow','gecscf.document','gecscf.organize.configuration.exportPayment','gecscf.organize.configuration.display'])
    .config(['$httpProvider', '$translateProvider', '$translatePartialLoaderProvider', '$stateProvider', '$locationProvider','blockUIConfig','$logProvider','$compileProvider','$urlRouterProvider','ngDialogProvider',
        function ($httpProvider, $translateProvider, $translatePartialLoaderProvider, $stateProvider, $locationProvider, blockUIConfig, $logProvider,$compileProvider, $urlRouterProvider, ngDialogProvider) {

    		var version = (new Date()).getTime();
			$compileProvider.debugInfoEnabled(false);
    		$logProvider.debugEnabled(true);
    		blockUIConfig.blockBrowserNavigation = true;
      	    blockUIConfig.delay = 500;
      	    blockUIConfig.autoBlock = false;
      	    
      	    ngDialogProvider.setDefaults({
              className: 'ngdialog-theme-default',
              plain: false,
              showClose: false,
              closeByDocument: false,
              closeByEscape: false,
              appendTo: false,
              disableAnimation: true
          });
      	    
            $translateProvider.useLoader('$translatePartialLoader', {
                urlTemplate: '../{part}/{lang}/scf_label.json'
            });

            $translateProvider.preferredLanguage('en_EN');
            $translatePartialLoaderProvider.addPart('translations');
            $translateProvider.useSanitizeValueStrategy('escapeParameters');

            $httpProvider.defaults.headers.common['Accept-Language'] = 'en_EN';
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $httpProvider.interceptors.push('httpErrorResponseInterceptor');
            $httpProvider.interceptors.push('templateInterceptor');
            
	    $stateProviderRef = $stateProvider;
			
	    $urlRouterProvider.otherwise('/dashboard');
            $stateProvider			
            .state('/home', {
                url: '/home',
				templateUrl: '/home',
				redirectTo: '/dashboard'
            }).state('/my-organize/create-transaction', {
				url: '/my-organize/create-transaction',
				controller: 'CreateLoanController',
				onEnter: ['TransactionService','$state', function(TransactionService,$state){
					var deffered = TransactionService.verifyTradingPartner();
		            deffered.promise.then(function (response) {
		                })
		                .catch(function (response) {
		                	 $state.go('/error', {
		                		 errorCode: response.data.errorCode
		 	                });
		                });
				}],
				controllerAs: 'ctrl',				
				templateUrl: '/create-transaction',
                params: {backAction: false, transactionModel: null, tradingpartnerInfoModel: null, documentSelects: null, dashboardParams: null, showBackButton: false, criteria: null},
				resolve: load(['js/app/modules/transaction/services/TransactionService.js','js/app/modules/transaction/loan/controllers/CreateLoanController.js',
				               'js/app/common/scf-component.js'])
			}).state('/create-transaction/validate-submit', {
				url: '/create-transaction/validate-submit',
				controller: 'ValidateAndSubmitController',
				controllerAs: 'validateAndSubmitCtrl',
				templateUrl: '/create-transaction/validate-submit',
				params: { transactionModel: null, totalDocumentAmount:0.00, tradingpartnerInfoModel: null, documentSelects: null},
				resolve: load(['js/app/modules/transaction/loan/services/ValidateAndSubmitService.js','js/app/modules/transaction/loan/controllers/ValidateAndSubmitController.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/settings/organizes', {
				url: '/settings/organizes',
				controller: 'OrganizeListController',
				controllerAs: 'ctrl',
				params: {backAction: false,party:'bank', criteria:null, organize:null},
				templateUrl: '/organize-list/bank',
				resolve: load(['js/app/modules/organize/organize-list-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			})
			.state('/customer-registration/supplier-credit-information', {
				url: '/customer-registration/supplier-credit-information',
				controller: 'SupplierCreditInformationController',
				controllerAs: 'ctrl',
				templateUrl: '/supplier-credit-information',
				params: { viewMode:'CUSTOMER', backAction: false, criteria : null, organize: null},
				resolve: load(['js/app/modules/supplier-credit-information/controllers/SupplierCreditInformationController.js', 'js/app/modules/supplier-credit-information/services/SupplierCreditInformationService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			})
			.state('/my-organize/supplier-credit-information', {
				url: '/my-organize/supplier-credit-information',
				controller: 'SupplierCreditInformationController',
				controllerAs: 'ctrl',
				templateUrl: '/supplier-credit-information',
				params: { viewMode:'MY_ORGANIZE', backAction: false, criteria : null, organize: null},
				resolve: load(['js/app/modules/supplier-credit-information/controllers/SupplierCreditInformationController.js', 'js/app/modules/supplier-credit-information/services/SupplierCreditInformationService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			})
			.state('/customer-registration/buyer-credit-information', {
				url: '/customer-registration/buyer-credit-information',
				controller: 'BuyerCreditInformationController',
				controllerAs: 'ctrl',
				templateUrl: '/buyer-credit-information',
				params: { viewMode:'CUSTOMER', backAction: false, criteria : null, organize: null},
				resolve: load(['js/app/modules/buyer-credit-information/controllers/BuyerCreditInformationController.js', 'js/app/modules/buyer-credit-information/services/BuyerCreditInformationService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			})
			.state('/my-organize/buyer-credit-information', {
				url: '/my-organize/buyer-credit-information',
				controller: 'BuyerCreditInformationController',
				controllerAs: 'ctrl',
				templateUrl: '/buyer-credit-information',
				params: { viewMode:'MY_ORGANIZE', backAction: false, criteria : null, organize: null},
				resolve: load(['js/app/modules/buyer-credit-information/controllers/BuyerCreditInformationController.js', 'js/app/modules/buyer-credit-information/services/BuyerCreditInformationService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			})
			.state('/partner-organize/buyer-credit-information', {
				url: '/partner-organize/buyer-credit-information',
				controller: 'BuyerCreditInformationController',
				controllerAs: 'ctrl',
				templateUrl: '/buyer-credit-information',
				params: { viewMode:'PARTNER', backAction: false, criteria : null, organize: null},
				resolve: load(['js/app/modules/buyer-credit-information/controllers/BuyerCreditInformationController.js', 'js/app/modules/buyer-credit-information/services/BuyerCreditInformationService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			})
			.state('/verify-transaction', {
				url: '/verify-transaction',
				controller: 'VerifyTransactionController',
				controllerAs: 'verifyTxnCtrl',
				templateUrl: '/verify-transaction',
				params: { transactionModel: null},
				resolve: load(['js/app/verify-transactions/verify-transaction-service.js', 'js/app/verify-transactions/verify-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/view-transaction', {
				url: '/view-transaction',
				controller: 'ViewTransactionController',
				controllerAs: 'viewTxnCtrl',
				templateUrl: '/view-transaction',
				params: { viewMode: null, transactionModel: null, listTransactionModel: null, backAction: false, isShowBackButton: false, isShowBackButton: false, isShowViewHistoryButton: false, isDisplayReason: 'none'},
				resolve: load(['js/app/modules/transaction/loan/services/ViewTransactionService.js', 'js/app/modules/transaction/loan/controllers/ViewTransactionController.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/approve-transaction/approve',{
				url: '/approve-transaction/approve',
				controller: 'ApproveController',
				controllerAs: 'ctrl',
				templateUrl: '/approve-transaction/approve',
				params: {transaction: null},
				resolve: load(['js/app/approve-transactions/approve-transaction-service.js','js/app/modules/transaction/services/TransactionService.js','js/app/approve-transactions/approve-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/my-organize/upload-document',{
				url: '/my-organize/upload-document',
				controller: 'UploadDocumentController',
				controllerAs: 'ctrl',
				params: {party:'supplier'},
				templateUrl: '/upload-document',
				resolve: load(['js/app/modules/upload-document/upload-document-service.js','js/app/modules/upload-document/upload-document-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/my-organize/ap-document-list',{
				url: '/my-organize/ap-document-list',
				controller: 'DocumentListController',
				controllerAs: 'ctrl',
				params: {viewMode:'MY_ORGANIZE'},
				templateUrl: '/ap-document-list/my-organize',
				resolve: load(['js/app/modules/document-list/controllers/ap-document-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/partner-organize/ap-document-list',{
				url: '/partner-organize/ap-document-list',
				controller: 'DocumentListController',
				controllerAs: 'ctrl',
				params: {viewMode:'PARTNER'},
				templateUrl: '/ap-document-list/partner-organize',
				resolve: load(['js/app/modules/document-list/controllers/ap-document-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/customer-organize/ap-document-list',{
				url: '/customer-organize/ap-document-list',
				controller: 'DocumentListController',
				controllerAs: 'ctrl',
				params: {viewMode:'CUSTOMER'},
				templateUrl: '/ap-document-list/customer-organize',
				resolve: load(['js/app/modules/document-list/controllers/ap-document-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/my-organize/ar-document-list',{
				url: '/my-organize/ar-document-list',
				controller: 'ARDocumentController',
				controllerAs: 'ctrl',
				params: {viewMode:'MY_ORGANIZE'},
				templateUrl: '/ar-document-list/my-organize',
				resolve: load(['js/app/modules/document-list/controllers/ARDocumentController.js', 'js/app/modules/document-list/services/DocumentService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/partner-organize/ar-document-list',{
				url: '/partner-organize/ar-document-list',
				controller: 'ARDocumentController',
				controllerAs: 'ctrl',
				params: {viewMode:'PARTNER'},
				templateUrl: '/ar-document-list/partner-organize',
				resolve: load(['js/app/modules/document-list/controllers/ARDocumentController.js', 'js/app/modules/document-list/services/DocumentService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/customer-organize/ar-document-list',{
				url: '/customer-organize/ar-document-list',
				controller: 'ARDocumentController',
				controllerAs: 'ctrl',
				params: {viewMode:'CUSTOMER'},
				templateUrl: '/ar-document-list/customer-organize',
				resolve: load(['js/app/modules/document-list/controllers/ARDocumentController.js', 'js/app/modules/document-list/services/DocumentService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/my-organize/transaction-list', {
				url: '/my-organize/transaction-list',
				controller: 'ListTransactionController',
				controllerAs: 'ctrl',
				params: {backAction: false, viewMode:'MY_ORGANIZE', criteria : null},
				templateUrl: '/transaction-list/my-organize',
				resolve: load(['js/app/list-transactions/list-transaction-service.js', 'js/app/modules/transaction/services/TransactionService.js', 'js/app/list-transactions/list-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/partner-organize/transaction-list', {
				url: '/partner-organize/transaction-list',
				controller: 'ListTransactionController',
				controllerAs: 'ctrl',
				params: {backAction: false, viewMode:'PARTNER', criteria : null},
				templateUrl: '/transaction-list/partner-organize',
				resolve: load(['js/app/list-transactions/list-transaction-service.js', 'js/app/modules/transaction/services/TransactionService.js', 'js/app/list-transactions/list-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/customer-organize/transaction-list', {
				url: '/customer-organize/transaction-list',
				controller: 'ListTransactionController',
				controllerAs: 'ctrl',
				params: {backAction: false, viewMode:'CUSTOMER', criteria : null},
				templateUrl: '/transaction-list/customer-organize',
				resolve: load(['js/app/list-transactions/list-transaction-service.js', 'js/app/modules/transaction/services/TransactionService.js', 'js/app/list-transactions/list-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/dashboard', {
				url: '/dashboard',
				controller: 'DashboardController',
				controllerAs: 'dashboardCtrl',
				templateUrl: '/dashboard',
				resolve: load([ 'js/app/dashboard/dashboard-controller.js', 'js/app/dashboard/transaction/newduedate-group-controller.js',
							   'js/app/dashboard/credit-information-controller.js',
							   'js/app/dashboard/credit-information-summary-controller.js',
							   'js/app/dashboard/twelve-months-credit-movement-controller.js',
							   'js/app/dashboard/transaction/internal-step-controller.js',
							   'js/app/dashboard/transaction/transaction-todolist-controller.js', 
							   'js/app/common/scf-component.js', 
							   'js/app/common/scf-component.css',
							   'js/app/dashboard/transaction/approve-transaction-todolist-controller.js',
							   'js/app/dashboard/transaction-journey/new-document.js',
							  'js/app/dashboard/transaction-journey/wait-for-verify.js',
							  'js/app/dashboard/transaction-journey/wait-for-approve.js',
							  'js/app/dashboard/transaction-journey/future-drawdown.js',
							  'js/app/dashboard/transaction-journey/controllers/JourneyResultController.js',
							  'js/app/dashboard/transaction-journey/services/JourneyResultService.js',
							  'js/app/dashboard/payment/payment-todolist-controller.js',
							  'js/app/dashboard/payment/invoice-to-pay-controller.js',
							  'js/app/dashboard/payment/approve-payment-todolist-controller.js',
							  'js/app/dashboard/payment-journey/new-document.js',
							  'js/app/dashboard/payment-journey/wait-for-verify.js',
							  'js/app/dashboard/payment-journey/wait-for-approve.js',
							  'js/app/dashboard/payment-journey/future-payment.js'])
			}).state('/sponsor-configuration',{
				url: '/sponsor-configuration',
				controller: 'SponsorConfigController',
				controllerAs: 'sponsorConfigCtrl',
				templateUrl: '/sponsor-configuration',
				params: { organizeModel: null, fileLayoutModel: null},
				resolve: load(['js/app/sponsor-configuration/sponsor-config-controller.js', 
							   'js/app/sponsor-configuration/profile-controller.js', 
							   'js/app/sponsor-configuration/workflow/controllers/workflow-controller.js',
							   'js/app/sponsor-configuration/workflow/controllers/setup-workflow-controller.js',
							   'js/app/sponsor-configuration/workflow/services/workflow-service.js',
							   'js/app/sponsor-configuration/file-layouts-controller.js',
							   'js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupController.js',
							   'js/app/sponsor-configuration/channel-config-controller.js',
							   'js/app/common/scf-component.js', 
							   'js/app/common/scf-component.css',
							  'js/app/sponsor-configuration/DisplayConfigController.js',
							  'js/app/sponsor-configuration/payment-date-formula-controller.js',
							  'js/app/sponsor-configuration/payment-date-formula-service.js',
							  'js/app/modules/organize/configuration/mapping-data/controllers/MappingDataListController.js',
							  'js/app/modules/organize/configuration/mapping-data/controllers/MappingDataNewPopupController.js',
							  'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js',
							  'js/app/sponsor-configuration/ExportPaymentConfigController.js'
							   ])
			}).state('/sponsor-configuration/mapping-data/edit',{
				url: '/sponsor-configuration/mapping-data/edit',
				controller: 'EditMappingDataController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/mapping-data/edit',
				params: { mappingData: null, backAction: null},
				resolve: load(['js/app/modules/organize/configuration/mapping-data/controllers/EditMappingDataController.js', 'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/sponsor-configuration/mapping-data/code/new',{
				url: '/sponsor-configuration/mapping-data/code/new',
				controller: 'MappingDataCodeController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/mapping-data/code/new',
				params: { mappingData: null, mode: "newCode", mappingDataItem: null},
				resolve: load(['js/app/modules/organize/configuration/mapping-data/controllers/MappingDataCodeController.js', 'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])	
			}).state('/sponsor-configuration/mapping-data/code/edit',{
				url: '/sponsor-configuration/mapping-data/code/edit',
				controller: 'MappingDataCodeController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/mapping-data/code/new',
				params: { mappingData: null, mode: "editCode", mappingDataItem: null},
				resolve: load(['js/app/modules/organize/configuration/mapping-data/controllers/MappingDataCodeController.js', 'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])	
					
			}).state('/sponsor-configuration/file-layouts/new-file-layout',{
				url: '/sponsor-configuration/file-layouts/new-file-layout',
				controller: 'FileLayoutController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/file-layouts/new-file-layout',
				params: { fileLayoutModel: null,processType:null,integrateType:null},
				resolve: load(['js/app/modules/organize/configuration/file-layout/controllers/FileLayoutController.js',
					'js/app/modules/organize/configuration/file-layout/controllers/TextLayoutConfigController.js',
					'js/app/modules/organize/configuration/file-layout/controllers/DateTimeLayoutConfigController.js',
					'js/app/modules/organize/configuration/file-layout/controllers/NumericLayoutConfigController.js',
					'js/app/modules/organize/configuration/file-layout/controllers/RecordTypeLayoutConfigController.js',
					'js/app/modules/organize/configuration/file-layout/controllers/FillerLayoutConfigController.js',
					'js/app/modules/organize/configuration/file-layout/controllers/SignFlagLayoutConfigController.js',
					'js/app/modules/organize/configuration/mapping-data/controllers/MappingDataNewPopupController.js',
					'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js',
					'js/app/modules/organize/configuration/file-layout/services/FileLayoutService.js',
					'js/app/modules/organize/configuration/file-layout/services/FileLayerExampleDisplayService.js',
					'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/sponsor-configuration/document-display/settings',{
				url: '/sponsor-configuration/document-display/settings',
				controller: 'DisplayController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/document-display/settings',
				params: { accountingTransactionType: null, displayMode: null, selectedItem: null},
				resolve: load(['js/app/modules/organize/configuration/display/controllers/DisplayController.js',
					'js/app/modules/organize/configuration/display/services/DisplayService.js'])
			}).state('/sponsor-configuration/create-transaction-displays/settings',{
				url: '/sponsor-configuration/create-transaction-displays/settings',
				controller: 'DisplayController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/create-transaction-displays/settings',
				params: { accountingTransactionType: null, displayMode: null, selectedItem: null},
				resolve: load(['js/app/modules/organize/configuration/display/controllers/DisplayController.js',
					'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js',
					'js/app/modules/organize/configuration/display/services/DisplayService.js'])
			}).state('/sponsor-configuration/components/setup-display-fields',{
				url: '/sponsor-configuration/components/setup-display-fields',
				templateUrl: '/sponsor-configuration/components/setup-display-fields'
			})
			.state('/sponsor-configuration/export-payments/settings',{
				url: '/sponsor-configuration/export-payments/settings',
				controller: 'ExportPaymentController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/export-payments/settings',
				params: { fileLayoutModel: null},
				resolve: load(
					[
						'js/app/modules/organize/configuration/file-layout/services/FileLayoutService.js',
						'js/app/modules/organize/configuration/export-payment/controllers/ExportPaymentController.js',
						'js/app/modules/organize/configuration/export-payment/services/ExportPaymentService.js',
						'js/app/modules/organize/configuration/export-payment/controllers/SpecificTextExportLayoutConfigController.js',
						'js/app/modules/organize/configuration/export-payment/controllers/FillerExportLayoutConfigController.js',
						'js/app/modules/organize/configuration/export-payment/controllers/SignFlagExportLayoutConfigController.js',
						'js/app/modules/organize/configuration/export-payment/controllers/DateTimeExportLayoutConfigController.js',
						'js/app/modules/organize/configuration/export-payment/controllers/PaymentTypeExportLayoutConfigController.js',
						'js/app/modules/organize/configuration/export-payment/controllers/NumericExportLayoutConfigController.js',
						'js/app/modules/organize/configuration/export-payment/controllers/CountExportLayoutConfigController.js',
						'js/app/modules/organize/configuration/export-payment/controllers/SummaryExportLayoutConfigController.js'
					])
			}).state('/sponsor-configuration/payment-date-formulas/settings',{
				url: '/sponsor-configuration/payment-date-formulas/settings',
				controller: 'PaymentDateFormulaSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/payment-date-formulas/settings',
				params: { paymentDateFormulaModel: null},
				resolve: load(['js/app/sponsor-configuration/payment-date-formulas/payment-date-formula-setting-controller.js','js/app/sponsor-configuration/payment-date-formulas/payment-date-formula-setting-service.js', 'js/app/sponsor-configuration/credit-terms/credit-terms-setting-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/sponsor-configuration/customer-code-groups/settings',{
				url: '/sponsor-configuration/customer-code-groups/settings',
				controller: 'CustomerCodeGroupSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/customer-code-groups/settings',
				params: { selectedItem: null, mode: 'all'}
			}).state('/sponsor-configuration/organize-logo/settings',{
				url: '/sponsor-configuration/organize-logo/settings',
				controller: 'OrganizeLogoSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/organize-logo/settings',
				params: { organizeInfo: null},
				resolve: load(['js/app/sponsor-configuration/organize-logo/organize-logo-setting-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/sponsor-configuration/import-channels/settings',{
				url: '/sponsor-configuration/import-channels/settings',
				controller: 'ChannelSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/import-channels/settings',
				params: { selectedItem: null},
				resolve: load(['js/app/sponsor-configuration/import-channels/import-channels-setting-controller.js'])
			}).state('/sponsor-configuration/workflow/setup',{
				url: '/sponsor-configuration/workflow/setup',
				controller: 'SetupWorkflowController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/workflow/setup',
				params: { workflowModel: null},
				resolve: load(['js/app/sponsor-configuration/workflow/controllers/setup-workflow-controller.js','js/app/sponsor-configuration/workflow/services/workflow-service.js'])
			}).state('/bank-information/holidays',{
				url: '/bank-information/holidays',
				controller: 'BankHolidayController',
				controllerAs: 'ctrl',
				templateUrl: '/holidays/',
				resolve: load(['js/app/modules/holiday/holiday-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/monitoring/activity-log',{
				url: '/monitoring/activity-log',
				controller: 'ActivityLogController',
				controllerAs: 'ctrl',
				params: {mode:'all'},
				templateUrl: '/activity-log',
				resolve: load(['js/app/modules/activity-log/activity-log-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/my-activity-log',{
				url: '/my-activity-log',
				controller: 'ActivityLogController',
				controllerAs: 'ctrl',
				params: {mode:'personal'},
				templateUrl: '/activity-log',
				resolve: load(['js/app/modules/activity-log/activity-log-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/settings/user-and-password-policy',{
				url: '/settings/user-and-password-policy',
				controller: 'PolicyController',
				controllerAs: 'ctrl',
				templateUrl: '/policy',
				resolve: load(['js/app/modules/policy/policy-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/settings/role',{
				url: '/settings/role',
				controller: 'RoleListController',
				controllerAs: 'ctrl',
				templateUrl: '/role',
				params: {backAction: false, criteria : null},
				resolve: load(['js/app/modules/role/role-list-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/role/new',{
				url: '/role/new',
				controller: 'RoleController',
				controllerAs: 'ctrl',
				templateUrl: '/role/new',
				params: {mode:''},
				resolve: load(['js/app/modules/role/role-controller.js', 'js/app/modules/role/role-service.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/role/edit',{
				url: '/role/edit',
				controller: 'RoleController',
				controllerAs: 'ctrl',
				templateUrl: '/role/edit',
				params: {mode:'',data:''},
				resolve: load(['js/app/modules/role/role-controller.js', 'js/app/modules/role/role-service.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/role/view',{
				url: '/role/view',
				controller: 'RoleController',
				controllerAs: 'ctrl',
				templateUrl: '/role/view',
				params: {mode:'',data:''},
				resolve: load(['js/app/modules/role/role-controller.js', 'js/app/modules/role/role-service.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/settings/users',{
				url: '/settings/users',
				controller: 'UserListController',
				controllerAs: 'ctrl',
				templateUrl: '/user',
				params: {backAction: false , criteria:null},
				resolve: load(['js/app/modules/user/user-list-controller.js',
								'js/app/modules/user/user-service.js',
								'js/app/common/scf-component.js',
								'js/app/common/scf-component.css'])
			}).state('/customer-registration/customer-users',{
				url: '/customer-registration/customer-users',
				controller: 'UserListController',
				controllerAs: 'ctrl',
				templateUrl: '/user',
				params: {backAction: false , criteria:null},
				resolve: load(['js/app/modules/user/user-list-controller.js',
								'js/app/modules/user/user-service.js',
								'js/app/common/scf-component.js',
								'js/app/common/scf-component.css'])
			}).state('/user/new',{
				url: '/user/new',
				controller: 'UserController',
				controllerAs: 'ctrl',
				templateUrl: '/user/new',
				params: {mode:'newUser', userModel: null},
				resolve: load(['js/app/modules/user/user-list-controller.js', 'js/app/modules/user/user-service.js', 'js/app/modules/user/user-organize-controller.js', 'js/app/modules/user/user-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/user/edit',{
				url: '/user/edit',
				controller: 'UserController',
				controllerAs: 'ctrl',
				templateUrl: '/user/new',
				params: {mode:'editUser', userModel: null},
				resolve: load(['js/app/modules/user/user-list-controller.js', 'js/app/modules/user/user-service.js', 'js/app/modules/user/user-organize-controller.js', 'js/app/modules/user/user-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/user/view', {
				url: '/user/view',
				controller: 'UserController',
				controllerAs : 'ctrl',
				params: {mode:'viewUser', userModel: null},
				templateUrl: '/user/view',
				resolve: load(['js/app/modules/user/user-list-controller.js', 'js/app/modules/user/user-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/change-password',{
				url: '/change-password',
				controller: 'PasswordController',
				controllerAs: 'ctrl',
				params: {mode:'profileChange'},
				templateUrl: '/change-password',
				resolve: load(['js/app/modules/profile/change-password/password-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/my-organize/supplier-code-list',{
				url: '/my-organize/supplier-code-list',
				controller: 'CustomerCodeGroupSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/customer-code-groups/supplier-code-list/settings',
				params: { viewMode:'MY_ORGANIZE', organizeId: null, accountingTransactionType: 'PAYABLE'},
				resolve: load(['js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupSettingController.js',
								'js/app/modules/organize/configuration/customer-code/services/CustomerCodeGroupService.js',
								'js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupDialogController.js',
								'js/app/common/scf-component.js',
								'js/app/common/scf-component.css'])
			}).state('/my-organize/buyer-code-list',{
				url: '/my-organize/buyer-code-list',
				controller: 'CustomerCodeGroupSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/customer-code-groups/buyer-code-list/settings',
				params: { viewMode:'MY_ORGANIZE', organizeId: null, accountingTransactionType: 'RECEIVABLE'},
				resolve: load(['js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupSettingController.js',
								'js/app/modules/organize/configuration/customer-code/services/CustomerCodeGroupService.js',
								'js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupDialogController.js',
								'js/app/common/scf-component.js',
								'js/app/common/scf-component.css'])
			}).state('/customer-organize/supplier-code-list',{
				url: '/customer-organize/supplier-code-list',
				controller: 'CustomerCodeGroupSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/customer-code-groups/supplier-code-list/settings',
				params: { viewMode:'CUSTOMER', organizeId: null, accountingTransactionType: 'PAYABLE'},
				resolve: load(['js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupSettingController.js',
								'js/app/modules/organize/configuration/customer-code/services/CustomerCodeGroupService.js',
								'js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupDialogController.js',
								'js/app/common/scf-component.js',
								'js/app/common/scf-component.css'])
			}).state('/customer-organize/buyer-code-list',{
				url: '/customer-organize/buyer-code-list',
				controller: 'CustomerCodeGroupSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/customer-code-groups/buyer-code-list/settings',
				params: { viewMode:'CUSTOMER', organizeId: null, accountingTransactionType: 'RECEIVABLE'},
				resolve: load(['js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupSettingController.js',
								'js/app/modules/organize/configuration/customer-code/services/CustomerCodeGroupService.js',
								'js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupDialogController.js',
								'js/app/common/scf-component.js',
								'js/app/common/scf-component.css'])
			}).state('/my-organize/document-upload-log',{
				url: '/my-organize/document-upload-log',
				controller: 'DocumentUploadLogController',
				controllerAs: 'ctrl',
				params: {viewMode:'MY_ORGANIZE',criteria: null, backAction:false},
				templateUrl: '/document-upload-log',
				resolve: load(['js/app/modules/document-upload-log/controllers/DocumentUploadLogController.js',
								'js/app/modules/document-upload-log/services/DocumentUploadLogService.js',
								'js/app/common/scf-component.js',
								'js/app/common/scf-component.css'])
			}).state('/customer-organize/upload-document-logs',{
				url: '/customer-organize/upload-document-logs',
				controller: 'DocumentUploadLogController',
				controllerAs: 'ctrl',
				params: {viewMode:'CUSTOMER',criteria: null, backAction:false},
				templateUrl: '/document-upload-log/sponsor',
				resolve: load(['js/app/modules/document-upload-log/controllers/DocumentUploadLogController.js',
								'js/app/modules/document-upload-log/services/DocumentUploadLogService.js',
								'js/app/common/scf-component.js', 
								'js/app/common/scf-component.css'])
			}).state('/document-upload-log/view-log',{
				url: '/document-upload-log/view-log',
				controller: 'ViewDocumentUplaodLogController',
				controllerAs: 'ctrl',
				templateUrl: '/document-upload-log/view-log',
				params: { documentUploadLogModel: null, roleType: null},
				resolve: load(['js/app/modules/document-upload-log/controllers/ViewDocumentUplaodLogController.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/monitoring/bank-system-integration',{
				url: '/monitoring/bank-system-integration',
				controller: 'BankSystemIntegrationMonitorController',
				controllerAs: 'ctrl',
				templateUrl: '/system-integration-monitor/bank',
				params: { mode: 'bank', bankCode: '004'},
				resolve: load(['js/app/modules/monitor/bank-system-integration-monitor-controller.js'
						,'js/app/modules/monitor/web-service-monitor-controller.js'
						,'js/app/modules/monitor/ftp-monitor-controller.js'
						,'js/app/modules/monitor/batch-job-monitor-controller.js'
						,'js/app/modules/monitor/batch-job-monitor-service.js'
						,'js/app/modules/monitor/system-integration-monitor-service.js'
						,'js/app/common/scf-component.js'
						,'js/app/common/scf-component.css'])
			}).state('/monitoring/customer-system-integration',{
				url: '/monitoring/customer-system-integration',
				controller: 'SponsorSystemIntegrationMonitorController',
				controllerAs: 'ctrl',
				templateUrl: '/system-integration-monitor/sponsor',
				params: { mode: 'sponsor',organize:[]},
				resolve: load(['js/app/modules/monitor/sponsor-system-integration-monitor-controller.js'
						,'js/app/modules/monitor/web-service-monitor-controller.js'
						,'js/app/modules/monitor/ftp-monitor-controller.js'
						,'js/app/modules/monitor/batch-job-monitor-controller.js'
						,'js/app/modules/monitor/batch-job-monitor-service.js'
						,'js/app/modules/monitor/system-integration-monitor-service.js'
						,'js/app/common/scf-component.js'
						,'js/app/common/scf-component.css'])
			}).state('/monitoring/gec-system-integration',{
				url: '/monitoring/gec-system-integration',
				controller: 'GECSystemIntegrationMonitorController',
				controllerAs: 'ctrl',
				templateUrl: '/system-integration-monitor/gec',
				params: { mode: 'gec',organize:[]},
				resolve: load(['js/app/modules/monitor/gec-system-integration-monitor-controller.js'
						,'js/app/modules/monitor/web-service-monitor-controller.js'
						,'js/app/modules/monitor/ftp-monitor-controller.js'
						,'js/app/modules/monitor/batch-job-monitor-controller.js'
						,'js/app/modules/monitor/batch-job-monitor-service.js'
						,'js/app/modules/monitor/system-integration-monitor-service.js'
						,'js/app/common/scf-component.js'
						,'js/app/common/scf-component.css'
					])
			}).state('/monitoring/transaction-tracking',{
				url: '/monitoring/transaction-tracking',
				controller: 'TransactionTrackingController',
				controllerAs: 'ctrl',
				templateUrl: '/transaction-tracking',
				params: {backAction: false , criteria : null},
				resolve: load(['js/app/modules/monitor/transaction-tracking-controller.js','js/app/modules/monitor/transaction-tracking-service.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/view-transaction-tracking-message',{
				url: '/view-transaction-tracking-message',
				controller: 'ViewTransactionTrackingMessageController',
				controllerAs: 'ctrl',
				templateUrl: '/view-transaction-tracking-message',
				params: { params: []},
				resolve: load(['js/app/modules/monitor/view-transaction-tracking-message-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/batch-job-tracking',{
				url: '/batch-job-tracking',
				controller: 'BatchJobTrackingController',
				controllerAs: 'ctrl',
				templateUrl: '/batch-job-tracking',
				params: { params: []},
				resolve: load(['js/app/modules/monitor/batch-job-tracking-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/view-batch-job-tracking-message',{
				url: '/view-batch-job-tracking-message',
				controller: 'ViewBatchJobTrackingMessageController',
				controllerAs: 'ctrl',
				templateUrl: '/view-batch-job-tracking-message',
				params: { params: []},
				resolve: load(['js/app/modules/monitor/view-batch-job-tracking-message-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/customer-registration/account',{
				url: '/customer-registration/account',
				controller: 'AccountListController',
				controllerAs: 'ctrl',
				templateUrl: '/account',
				params: { params: [], backAction: false, criteria : null, organize: null},
				resolve: load(['js/app/modules/account/controllers/AccountListController.js', 'js/app/modules/account/controllers/AccountController.js', 'js/app/modules/account/services/AccountService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/customer-registration/trading-partners',{
				url: '/customer-registration/trading-partners',
				controller: 'TradingPartnerListController',
				controllerAs: 'ctrl',
				templateUrl: '/trading-partners',
				params: { params: [], backAction: false, criteria : null, organize: null},
				resolve: load(['js/app/modules/trading-partner/controllers/TradingPartnerListController.js', 'js/app/modules/trading-partner/services/TradingPartnerService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/trading-partners/new',{
				url: '/trading-partners/new',
				controller: 'TradingPartnerController',
				controllerAs: 'ctrl',
				templateUrl: '/trading-partners/new',
				params: { mode:'newTradingPartner', selectedItem: null},
				resolve: load(['js/app/modules/trading-partner/controllers/TradingPartnerController.js', 'js/app/modules/trading-partner/services/TradingPartnerService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/trading-partners/edit',{
				url: '/trading-partners/edit',
				controller: 'TradingPartnerController',
				controllerAs: 'ctrl',
				templateUrl: '/trading-partners/new',
				params: { mode:'editTradingPartner', selectedItem: null},
				resolve: load(['js/app/modules/trading-partner/controllers/TradingPartnerController.js', 'js/app/modules/trading-partner/services/TradingPartnerService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/trade-finance/config',{
				url: '/trade-finance/config',
				controller: 'ConfigTradeFinanceController',
				controllerAs: 'ctrl',
				templateUrl: '/trade-finance/config',
				params: { setupModel: null,backAction: false},
				resolve: load(['js/app/modules/trading-partner/financing/controllers/ConfigTradeFinanceController.js', 'js/app/modules/trading-partner/financing/services/ConfigTradeFinanceService.js', 'js/app/modules/account/controllers/AccountController.js', 'js/app/modules/account/services/AccountService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/trade-finance/new',{
				url: '/trade-finance/new',
				controller: 'TradeFinanceController',
				controllerAs: 'ctrl',
				templateUrl: '/trade-finance/new',
				params: { mode: 'NEW' , params:'',data:''},
				resolve: load(['js/app/modules/trading-partner/financing/controllers/TradeFinanceController.js', 'js/app/modules/trading-partner/financing/services/TradeFinanceService.js', 'js/app/modules/account/services/AccountService.js', 'js/app/modules/account/controllers/AccountController.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/trade-finance/edit',{
				url: '/trade-finance/edit',
				controller: 'TradeFinanceController',
				controllerAs: 'ctrl',
				templateUrl: '/trade-finance/edit',
				params: { mode: 'EDIT', params:'',data:''},
				resolve: load(['js/app/modules/trading-partner/financing/controllers/TradeFinanceController.js', 'js/app/modules/account/controllers/AccountController.js', 'js/app/modules/account/services/AccountService.js', 'js/app/modules/trading-partner/financing/services/TradeFinanceService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/trade-finance/view',{
				url: '/trade-finance/view',
				controller: 'TradeFinanceController',
				controllerAs: 'ctrl',
				templateUrl: '/trade-finance/view',
				params: { mode: 'VIEW', params:'',data:''},
				resolve: load(['js/app/modules/trading-partner/financing/controllers/TradeFinanceController.js', 'js/app/modules/account/controllers/AccountController.js', 'js/app/modules/account/services/AccountService.js', 'js/app/modules/trading-partner/financing/services/TradeFinanceService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/my-organize/create-payment', {
				url: '/my-organize/create-payment',
				controller: 'CreatePaymentController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment/create',
				params: {transactionModel: null, tradingpartnerInfoModel: null, criteria: null, supplierModel: null, documentSelects: null, backAction: false, dashboardParams: null, showBackButton: false},
				resolve: load(['js/app/modules/transaction/services/TransactionService.js','js/app/modules/transaction/payment/controllers/CreatePaymentController.js', 'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js'])
			}).state('/my-organize/create-payment-woip', {
				url: '/my-organize/create-payment-woip',
				controller: 'CreatePaymentWithoutInvoiceController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment/create-woip',
				params: {transactionModel: null, tradingpartnerInfoModel: null, criteria: null, supplierModel: null, backAction: false , documents: null},
				resolve: load(['js/app/modules/transaction/services/TransactionService.js','js/app/modules/transaction/payment/controllers/CreatePaymentWithoutInvoiceController.js'])
			}).state('/create-payment/validate-submit', {
				url: '/create-payment/validate-submit',
				controller: 'ValidateSubmitController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment/validate-submit',
                params: {transactionModel: null, tradingpartnerInfoModel: null},
				resolve: load(['js/app/modules/transaction/services/TransactionService.js','js/app/modules/transaction/payment/controllers/ValidateSubmitController.js'])
			}).state('/my-organize/payment-transaction', {
				url: '/my-organize/payment-transaction',
				controller: 'PaymentTransactionController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment-transaction/my',
                params: {viewMode:'MY_ORGANIZE',transactionModel: null, backAction: false, criteria : null,buyer : null, supplier : null},
				resolve: load(['js/app/modules/transaction/payment/services/PaymentTransactionService.js','js/app/modules/transaction/payment/controllers/PaymentTransactionController.js','js/app/modules/transaction/services/TransactionService.js'])
			}).state('/partner-organize/payment-transaction', {
				url: '/partner-organize/payment-transaction',
				controller: 'PaymentTransactionController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment-transaction/partner',
                params: {viewMode:'PARTNER',transactionModel: null, backAction: false, criteria : null,buyer : null, supplier : null},
				resolve: load(['js/app/modules/transaction/payment/services/PaymentTransactionService.js','js/app/modules/transaction/payment/controllers/PaymentTransactionController.js','js/app/modules/transaction/services/TransactionService.js'])
			}).state('/customer-organize/payment-transaction', {
				url: '/customer-organize/payment-transaction',
				controller: 'PaymentTransactionController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment-transaction/all',
                params: {viewMode:'CUSTOMER',transactionModel: null, backAction: false, criteria : null,buyer : null, supplier : null},
				resolve: load(['js/app/modules/transaction/payment/services/PaymentTransactionService.js','js/app/modules/transaction/payment/controllers/PaymentTransactionController.js','js/app/modules/transaction/services/TransactionService.js'])
			}).state('/customer-organize/remittance-advice', {
				url: '/customer-organize/remittance-advice',
				controller: 'RemittanceAdviceBankController',
				controllerAs: 'ctrl',				
				templateUrl: '/remittance-advice-bank',
                params: {viewMode:'CUSTOMER',transactionModel: null, backAction: false, criteria : null,buyer : null, supplier : null},
				resolve: load(['js/app/modules/remittance-advice/bank/controllers/RemittanceAdviceBankController.js','js/app/modules/remittance-advice/bank/services/RemittanceAdviceBankService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/payment-transaction/view', {
				url: '/payment-transaction/view',
				controller: 'ViewPaymentController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment-transaction/view',
                params: {viewMode: null, transactionModel: null, isShowViewHistoryButton: false, isShowBackButton: false},
				resolve: load(['js/app/modules/transaction/payment/services/ViewPaymentService.js','js/app/modules/transaction/payment/controllers/ViewPaymentController.js'])
			}).state('/payment-transaction/verify',{
				url: '/payment-transaction/verify',
				controller: 'VerifyPaymentController',
				controllerAs: 'ctrl',
				templateUrl: '/payment-transaction/verify',
				params: {transaction: null},
				resolve: load(['js/app/modules/transaction/payment/services/VerifyPaymentService.js','js/app/modules/transaction/payment/controllers/VerifyPaymentController.js'])
			}).state('/payment-transaction/approve',{
				url: '/payment-transaction/approve',
				controller: 'ApprovePaymentController',
				controllerAs: 'ctrl',
				templateUrl: '/payment-transaction/approve',
				params: {transaction: null},
				resolve: load(['js/app/modules/transaction/payment/services/ApprovePaymentService.js','js/app/modules/transaction/payment/controllers/ApprovePaymentController.js','js/app/modules/transaction/services/TransactionService.js'])
			}).state('/partner-organize/download-payment-advices',{
				url: '/partner-organize/download-payment-advices',
				controller: 'DownloadPaymentResultController',
				controllerAs: 'ctrl',
				templateUrl: '/download-payment-result/supplier',
				params: {transaction: null},
				resolve: load(['js/app/modules/download-payment-result/services/DownloadPaymentResultService.js','js/app/modules/download-payment-result/controllers/DownloadPaymentResultController.js'])
			}).state('/error', {
				url: '/error',
				controller: 'ErrorController',
				controllerAs: 'ctrl',
				templateUrl: '/error/internal',
				params: { errorCode: null},
				resolve: load([ 'js/app/common/error-controller.js'])
			}).state('/error/401', {
				url: '/error/401',
				controller: 'ErrorController',
				controllerAs: 'ctrl',
				templateUrl: '/error/401',
				params: { errorCode: 401},
				resolve: load([ 'js/app/common/error-controller.js'])
			}).state('/error/403', {
				url: '/error/403',
				controller: 'ErrorController',
				controllerAs: 'ctrl',
				templateUrl: '/error/403',
				params: { errorCode: 403},
				resolve: load([ 'js/app/common/error-controller.js'])
			});
			
			function load(srcs, callback) {
                return {                    
                    deps: ['$ocLazyLoad', '$q', 'blockUI',
                                function ($ocLazyLoad, $q, blockUI) {
                  
                            var deferred = $q.defer();
                            var promise = false;
                            var name;
                            srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
									
                            if (!promise) {
                                promise = deferred.promise;
                            }
                            angular.forEach(srcs, function (src) {
                            	src = src + '?v' + version;
                                promise = promise.then(function () {
                                    return $ocLazyLoad.load(src);
                                });
                            });
                            deferred.resolve();
                    		  
                            return callback ? promise.then(function () {
                                return callback();
                            }) : promise;
                                }]
                }
            }
        }
    ]);

app.controller('ScfHomeCtrl', ['$translate', '$translatePartialLoader', 'scfFactory','$scope', 
                               'Service', '$window', '$rootScope',
    function ($translate, $translatePartialLoader, scfFactory, $scope, Service, $window,$rootScope) {
        var vm = this;
        vm.sysMessage = "";
        vm.menus = [];
        vm.changeLanguage = function (lang) {
            $translatePartialLoader.addPart('translations');
            $translate.use(lang);
            $translate.refresh(lang);
        };

        vm.getMessage = function () {
            var defered = scfFactory.getErrorMsg($translate.use());
            defered.promise.then(function (response) {
                vm.sysMessage = response.content;
            });

        };
		
		// Begin Code Get Organize List
		vm.organizeHeader;
		vm.getUserInfo = function(){
			var defered = scfFactory.getUserInfo();
			defered.promise.then(function(response){				
				$scope.userInfo = response;
				$rootScope.userInfo = response;
				vm.organizeHeader = $rootScope.userInfo;
				vm.getListUserOrgranize();
			});
		};

		vm.ListOrgAndHeader=[];
		vm.getListUserOrgranize = function(){
			var defered = scfFactory.getOrganizeList();
			defered.promise.then(function(response){
				vm.ListOrgAndHeader = response;
				cutOrganizeHeaderFromOrganizeList();
			});
		};
		
		vm.orgList = [];
		vm.showDropDown = false;
		var cutOrganizeHeaderFromOrganizeList = function(){
			if(vm.ListOrgAndHeader.length != 0 && vm.ListOrgAndHeader != []){
				for(var i = 0; i < vm.ListOrgAndHeader.length; i++){
					if(vm.ListOrgAndHeader[i].organizeId != vm.organizeHeader.organizeId){
						vm.orgList.push({
							organizeId : vm.ListOrgAndHeader[i].organizeId,
							organizeName : vm.ListOrgAndHeader[i].organizeName
						})
						vm.showDropDown = true;
					}
				}
			}
		};
		// End Code Get Organize List

		// Begin Code Change Organize
		vm.changeOrganize = function(index){
			var organize_id = vm.orgList[index].organizeId;
			var defered = scfFactory.changeOrganize(organize_id);
			defered.promise.then(function(response){
				window.location.href = "/";
			});
		}
		// End Code Change Organize
		
		
		vm.getUserInfo();
		
		
		$rootScope.isDesktopDevice = true;
		getWindowSize();
		angular.element($window).bind('resize', function(){
			getWindowSize();
	    });
		function getWindowSize(){
			 var width = $window.innerWidth;
	         if(width > 992){
	        	 $rootScope.isDesktopDevice = true;
	         }else{
	        	 $rootScope.isDesktopDevice = false;
	         }
		}
    }
]);

app.factory('scfFactory', ['$http', '$q', '$cookieStore', '$window', function ($http, $q, $cookieStore, $window) {
    return {
        getErrorMsg: getErrorMsg,
        getUserInfo: getUserInfo,
		getOrganizeList: getOrganizeList,
		changeOrganize:changeOrganize,
        getMenu: getMenu
    };

    function getErrorMsg(lang) {
        var deferred = $q.defer();
        $http.get('token').success(function (token) {

            $http({
                url: 'http://localhost:9002/message',
                method: 'GET',
                headers: {
                    'X-Auth-Token': token.token,
                    'Accept-Language': lang
                }
            }).success(function (response) {
                deferred.resolve(response);
            });
        });
        return deferred;
    }
    
    function getUserInfo(){
    	var deferred = $q.defer();
    	$http.get('/api/users/me').success(function(response){
			deferred.resolve(response);
			return deferred;
		}).catch(function(response){
			switch (response.status) {
            case 401:
	            $window.location.href = "/login";
	            break;
            default:
        	break;
          }
		});
    	return deferred;
    }

	function getOrganizeList(){
    	var deferred = $q.defer();
    	$http.get('/api/v1/users/me/organizes').success(function(response){
			deferred.resolve(response);
			return deferred;
		}).catch(function(response){
			deferred.reject("User Organize List Error");
			return deferred;
		});
    	return deferred;
    }

	function changeOrganize(organize_id){
		var deferred = $q.defer();
		$http.post('/api/v1/users/me/change-organize/'+ organize_id).success(function(response){
			deferred.resolve(response);
			return deferred;
		}).catch(function(response){
			deferred.reject("Change User Organize Error");
			return deferred;
		});
		return deferred;
	}
    
    function getMenu(){
	var deferred = $q.defer();
	$http({
            url: 'api/menus',
            method: 'GET'
        }).then(function (response) {
            deferred.resolve(response);
        });
	return deferred;
    }
}]);

app.factory('httpErrorResponseInterceptor', ['$q', '$location', '$window',
    function($q, $location, $window) {
      return {
        response: function(responseData) {
          return responseData;
        },
        responseError: function error(response) {
          switch (response.status) {
            case 401:
            case 406:
	            $window.location.href = "/error/401";
	            break;
//            case 403:
//		    $window.location.href = "/error/403";
//		    break;
            default:
        	break;
          }

          return $q.reject(response);
        }
      };
    }
  ]);
// register the interceptor as a service
app.factory('templateInterceptor', function($q) {
  return {
    'responseError': function(rejection) {
       if(rejection.config != undefined){
    	   var isTemplate = !!rejection.config.url.match(/^content/g);
           if (isTemplate) {
             rejection.data = '<div><template-error url="\''+ (rejection.config.url) + '\'"><strong>Error from interceptor.</strong></template-error></div>';
             return rejection;
           } 
       }
       return $q.reject(rejection);
    }
  }
});
app.controller('MenuController', ['scfFactory', '$state', function (scfFactory, $state) {
    var self = this;
    self.menu = [];
    var defered = scfFactory.getMenu();
    defered.promise.then(function(response){
	self.menu = response.data;
    });
    
    }]);

    self.goTo = function(state){
	$state.go(state);
    }

app.run(['$rootScope', '$q', '$http', '$urlRouter', '$window', 'blockUI', '$state', '$filter', '$cookieStore', function ($rootScope, $q, $http, $urlRouter, $window, blockUI, $state, $filter, $cookieStore) {
// $window.Date.prototype.toISOString = function(){
// return $filter('date')(this, 'yyyy-MM-ddTHH:mm:ss.000+0000');
// };
    $window.Date.prototype.toJSON = function(){ return moment(this).format(); }
    var isLoginPage = window.location.href.indexOf("login") != -1;
    if(isLoginPage){
        if($cookieStore.get("access_token")){
            window.location.href = "/";
        }
    } else{
        if($cookieStore.get("access_token")){
            $http.defaults.headers.common.Authorization = 
              'Bearer ' + $cookieStore.get("access_token");
        } else{
            window.location.href = "login";
        }
    }
    $rootScope
        .$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
				if(toState.redirectTo){
					event.preventDefault();
					$state.go(toState.redirectTo, toParams, {location: 'replace'});
				}
            });

    $rootScope
        .$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                $window.scrollTo(0, 0);        
            });
}]);