var $stateProviderRef = null;
var app = angular.module('scfApp', ['pascalprecht.translate', 'ui.router', 'ui.bootstrap', 'ui.mask', 'authenApp', 'oc.lazyLoad', 'checklist-model', 'blockUI', 'scf-ui', 'ngDialog', 'nvd3ChartDirectives',
                        			'legendDirectives','chart.js', 'gecscf.ui', 'ngCookies', 'gecscf.organize', 'gecscf.profile', 'gecscf.user', 'gecscf.tradingPartner', 'gecscf.account', 'gecscf.transaction', 'gecscf.tradingPartner.financing'
									,'gecscf.sponsorConfiguration.workflow'])
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
            }).state('/create-transaction', {
				url: '/create-transaction',
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
			}).state('/organize-list/bank', {
				url: '/organize-list/bank',
				controller: 'OrganizeListController',
				controllerAs: 'ctrl',
				params: {backAction: false,party:'bank', criteria:null, organize:null},
				templateUrl: '/organize-list/bank',
				resolve: load(['js/app/modules/organize/organize-list-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			})
			.state('/supplier-credit-information', {
				url: '/supplier-credit-information',
				controller: 'SupplierCreditInformationController',
				controllerAs: 'ctrl',
				templateUrl: '/supplier-credit-information',
				resolve: load(['js/app/modules/supplier-credit-information/supplier-credit-information-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
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
				params: { party: null, transactionModel: null, listTransactionModel: null, backAction: false, isShowBackButton: false, isShowBackButton: false, isShowViewHistoryButton: false, isDisplayReason: 'none'},
				resolve: load(['js/app/modules/transaction/loan/services/ViewTransactionService.js', 'js/app/modules/transaction/loan/controllers/ViewTransactionController.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/approve-transaction/approve',{
				url: '/approve-transaction/approve',
				controller: 'ApproveController',
				controllerAs: 'ctrl',
				templateUrl: '/approve-transaction/approve',
				params: {transaction: null},
				resolve: load(['js/app/approve-transactions/approve-transaction-service.js','js/app/modules/transaction/services/TransactionService.js','js/app/approve-transactions/approve-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/upload-document',{
				url: '/upload-document',
				controller: 'UploadDocumentController',
				controllerAs: 'ctrl',
				params: {party:'sponsor'},
				templateUrl: '/upload-document',
				onEnter: ['UploadDocumentService','$state', function(UploadDocumentService, $state){
					var deffered = UploadDocumentService.verifyChannel('WEB');
					deffered.promise.then(function (response) {
					}).catch(function (response) {
		                	 $state.go('/error', {
		                		 errorCode: response.data.errorCode
		 	                });
				   });
				}],
				resolve: load(['js/app/modules/upload-document/upload-document-service.js','js/app/modules/upload-document/upload-document-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/upload-document/supplier',{
				url: '/upload-document/supplier',
				controller: 'UploadDocumentController',
				controllerAs: 'ctrl',
				params: {party:'supplier'},
				templateUrl: '/upload-document',
				onEnter: ['UploadDocumentService','$state', function(UploadDocumentService, $state){
					var deffered = UploadDocumentService.verifyChannel('WEB');
					deffered.promise.then(function (response) {
					}).catch(function (response) {
		                	 $state.go('/error', {
		                		 errorCode: response.data.errorCode
		 	                });
				   });
				}],
				resolve: load(['js/app/modules/upload-document/upload-document-service.js','js/app/modules/upload-document/upload-document-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/upload-document/bank',{
				url: '/upload-document/bank',
				controller: 'UploadDocumentController',
				controllerAs: 'ctrl',
				params: {party:'bank'},
				templateUrl: '/upload-document/bank',
				resolve: load(['js/app/modules/upload-document/upload-document-service.js','js/app/modules/upload-document/upload-document-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/document-list/sponsor',{
				url: '/document-list/sponsor',
				controller: 'DocumentListController',
				controllerAs: 'ctrl',
				params: {party:'sponsor'},
				templateUrl: '/document-list/sponsor',
				resolve: load(['js/app/modules/document-list/ap-document-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/document-list/supplier',{
				url: '/document-list/supplier',
				controller: 'DocumentListController',
				controllerAs: 'ctrl',
				params: {party:'supplier'},
				templateUrl: '/document-list/supplier',
				resolve: load(['js/app/modules/document-list/ap-document-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/document-list/bank',{
				url: '/document-list/bank',
				controller: 'DocumentListController',
				controllerAs: 'ctrl',
				params: {party:'bank'},
				templateUrl: '/document-list/bank',
				resolve: load(['js/app/modules/document-list/ap-document-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/transaction-list/sponsor', {
				url: '/transaction-list/sponsor',
				controller: 'ListTransactionController',
				controllerAs: 'ctrl',
				params: {backAction: false, party:'sponsor', criteria : null},
				templateUrl: '/list-transaction/sponsor',
				resolve: load(['js/app/list-transactions/list-transaction-service.js', 'js/app/modules/transaction/services/TransactionService.js', 'js/app/list-transactions/list-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/transaction-list/supplier', {
				url: '/transaction-list/supplier',
				controller: 'ListTransactionController',
				controllerAs: 'ctrl',
				params: {backAction: false, party:'supplier', criteria : null},
				templateUrl: '/list-transaction/supplier',
				resolve: load(['js/app/list-transactions/list-transaction-service.js', 'js/app/modules/transaction/services/TransactionService.js', 'js/app/list-transactions/list-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/transaction-list/bank', {
				url: '/transaction-list/bank',
				controller: 'ListTransactionController',
				controllerAs: 'ctrl',
				params: {backAction: false, party:'bank', criteria : null},
				templateUrl: '/list-transaction/bank',
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
							  'js/app/sponsor-configuration/document-display-configs.js',
							  'js/app/sponsor-configuration/payment-date-formula-controller.js',
							  'js/app/sponsor-configuration/payment-date-formula-service.js',
							  'js/app/modules/organize/configuration/mapping-data/controllers/MappingDataListController.js',
							  'js/app/modules/organize/configuration/mapping-data/controllers/MappingDataNewPopupController.js',
							  'js/app/modules/organize/configuration/mapping-data/services/MappingDataService.js', ])
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
				params: { fileLayoutModel: null,processType:null},
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
				controller: 'DocumentDisplayController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/document-display/settings',
				params: { accountingTransactionType: null, displayMode: null, selectedItem: null},
				resolve: load(['js/app/sponsor-configuration/document-display/document-display-controller.js',
					'js/app/modules/organize/configuration/file-layout/services/FileLayoutService.js'])
			}).state('/sponsor-configuration/payment-date-formulas/settings',{
				url: '/sponsor-configuration/payment-date-formulas/settings',
				controller: 'PaymentDateFormulaSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/payment-date-formulas/settings',
				params: { paymentDateFormulaModel: null},
				resolve: load(['js/app/sponsor-configuration/payment-date-formulas/payment-date-formula-setting-controller.js','js/app/sponsor-configuration/payment-date-formulas/payment-date-formula-setting-service.js', 'js/app/sponsor-configuration/credit-terms/credit-terms-setting-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/sponsor-configuration/customer-code-groups/supplier-code-list/settings',{
				url: '/sponsor-configuration/customer-code-groups/supplier-code-list/settings',
				controller: 'CustomerCodeGroupSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/customer-code-groups/supplier-code-list/settings',
				params: { selectedItem: null, mode: 'all', accountingTransactionType: 'PAYABLE'},
				resolve: load(['js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupSettingController.js',
								'js/app/modules/organize/configuration/customer-code/services/CustomerCodeGroupService.js',
								'js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupDialogController.js',
								'js/app/common/scf-component.js',
								'js/app/common/scf-component.css'])
			}).state('/sponsor-configuration/customer-code-groups/buyer-code-list/settings',{
				url: '/sponsor-configuration/customer-code-groups/buyer-code-list/settings',
				controller: 'CustomerCodeGroupSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/customer-code-groups/buyer-code-list/settings',
				params: { selectedItem: null, mode: 'all', accountingTransactionType: 'RECEIVABLE'},
				resolve: load(['js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupSettingController.js',
								'js/app/modules/organize/configuration/customer-code/services/CustomerCodeGroupService.js',
								'js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupDialogController.js',
								'js/app/common/scf-component.js',
								'js/app/common/scf-component.css'])
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
			}).state('/bank-holidays',{
				url: '/bank-holidays',
				controller: 'BankHolidayController',
				controllerAs: 'ctrl',
				templateUrl: '/holidays/',
				resolve: load(['js/app/modules/holiday/holiday-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/activity-log/bank',{
				url: '/activity-log/bank',
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
			}).state('/policy',{
				url: '/policy',
				controller: 'PolicyController',
				controllerAs: 'ctrl',
				templateUrl: '/policy',
				resolve: load(['js/app/modules/policy/policy-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/role',{
				url: '/role',
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
			}).state('/user',{
				url: '/user',
				controller: 'UserListController',
				controllerAs: 'ctrl',
				templateUrl: '/user',
				params: {backAction: false , criteria:null},
				resolve: load(['js/app/modules/user/user-list-controller.js', 'js/app/modules/user/user-service.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
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
			}).state('/supplier-code-list',{
				url: '/supplier-code-list',
				controller: 'CustomerCodeGroupSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/customer-code-groups/settings',
				params: { selectedItem: null, mode: 'personal'},
				resolve: load(['js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupSettingController.js',
								'js/app/modules/organize/configuration/customer-code/services/CustomerCodeGroupService.js',
								'js/app/modules/organize/configuration/customer-code/controllers/CustomerCodeGroupDialogController.js',
								'js/app/common/scf-component.js',
								'js/app/common/scf-component.css'])
			}).state('/document-upload-log',{
				url: '/document-upload-log',
				controller: 'DocumentUploadLogController',
				controllerAs: 'ctrl',
				params: {mode:'sponsor',criteria: null, backAction:false},
				templateUrl: '/document-upload-log',
				resolve: load(['js/app/modules/document-upload-log/document-upload-log-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/document-upload-log/bank',{
				url: '/document-upload-log/bank',
				controller: 'DocumentUploadLogController',
				controllerAs: 'ctrl',
				params: {mode:'bankbank',criteria: null, backAction:false},
				templateUrl: '/document-upload-log/bank',
				resolve: load(['js/app/modules/document-upload-log/document-upload-log-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/document-upload-log/sponsor',{
				url: '/document-upload-log/sponsor',
				controller: 'DocumentUploadLogController',
				controllerAs: 'ctrl',
				params: {mode:'banksponsor',criteria: null, backAction:false},
				templateUrl: '/document-upload-log/sponsor',
				resolve: load(['js/app/modules/document-upload-log/document-upload-log-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/document-upload-log/view-log',{
				url: '/document-upload-log/view-log',
				controller: 'ViewDocumentUplaodLogController',
				controllerAs: 'ctrl',
				templateUrl: '/document-upload-log/view-log',
				params: { documentUploadLogModel: null, roleType: null},
				resolve: load(['js/app/modules/document-upload-log/view-document-upload-log-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/system-integration-monitor/bank',{
				url: '/system-integration-monitor/bank',
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
			}).state('/system-integration-monitor/sponsor',{
				url: '/system-integration-monitor/sponsor',
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
			}).state('/system-integration-monitor/gec',{
				url: '/system-integration-monitor/gec',
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
			}).state('/transaction-tracking',{
				url: '/transaction-tracking',
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
			}).state('/account',{
				url: '/account',
				controller: 'AccountController',
				controllerAs: 'ctrl',
				templateUrl: '/account',
				params: { params: [], backAction: false, criteria : null, organize: null},
				resolve: load(['js/app/modules/account/controllers/AccountListController.js', 'js/app/modules/account/services/AccountService.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/trading-partners',{
				url: '/trading-partners',
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
			}).state('/create-payment', {
				url: '/create-payment',
				controller: 'CreatePaymentController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment/create',
				params: {transactionModel: null, tradingpartnerInfoModel: null, criteria: null, documentSelects: null, backAction: false, dashboardParams: null, showBackButton: false},
				resolve: load(['js/app/modules/transaction/services/TransactionService.js','js/app/modules/transaction/payment/controllers/CreatePaymentController.js'])
			}).state('/create-payment/validate-submit', {
				url: '/create-payment/validate-submit',
				controller: 'ValidateSubmitController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment/validate-submit',
                params: {transactionModel: null, tradingpartnerInfoModel: null},
				resolve: load(['js/app/modules/transaction/services/TransactionService.js','js/app/modules/transaction/payment/controllers/ValidateSubmitController.js'])
			}).state('/payment-transaction/buyer', {
				url: '/payment-transaction/buyer',
				controller: 'PaymentTransactionController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment-transaction/',
                params: {mode:"BUYER",transactionModel: null, backAction: false, criteria : null,buyer : null, supplier : null},
				resolve: load(['js/app/modules/transaction/payment/services/PaymentTransactionService.js','js/app/modules/transaction/payment/controllers/PaymentTransactionController.js'])
			}).state('/payment-transaction/view', {
				url: '/payment-transaction/view',
				controller: 'ViewPaymentController',
				controllerAs: 'ctrl',				
				templateUrl: '/payment-transaction/view',
                params: {mode: null, transactionModel: null, isShowViewHistoryButton: false, isShowBackButton: false},
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
				resolve: load(['js/app/modules/transaction/payment/services/ApprovePaymentService.js','js/app/modules/transaction/payment/controllers/ApprovePaymentController.js'])
			}).state('/download-payment-result/supplier',{
				url: '/download-payment-result/supplier',
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