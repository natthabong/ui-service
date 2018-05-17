var $stateProviderRef = null;
var app = angular.module('scfApp', ['ui.router'])
  .config(['$httpProvider', '$translateProvider','$stateProvider',
    function ($httpProvider, $translateProvider, $stateProvider) {

      
      $stateProvider
        .state('/home', {
          url: '/home',
          templateUrl: '/home',
          redirectTo: '/dashboard'
        }).state('/my-organize/create-transaction', {
          url: '/my-organize/create-transaction',
          controller: 'CreateLoanController',
          onEnter: ['TransactionService', '$state', function (TransactionService, $state) {
            var deffered = TransactionService.verifyTradingPartner();
            deffered.promise.then(function (response) {})
              .catch(function (response) {
                $state.go('/error', {
                  errorCode: response.data.errorCode
                });
              });
          }],
          controllerAs: 'ctrl',
          templateUrl: '/create-transaction',
          params: {
            backAction: false,
            transactionModel: null,
            tradingpartnerInfoModel: null,
            documentSelects: null,
            dashboardParams: null,
            showBackButton: false,
            criteria: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/transaction/services/TransactionService.js', 'js/app/modules/transaction/loan/controllers/CreateLoanController.js',
            'js/app/common/scf-component.js',
            'js/app/modules/account/services/AccountService.js'
          ])
        }).state('/create-transaction/validate-submit', {
          url: '/create-transaction/validate-submit',
          controller: 'ValidateAndSubmitController',
          controllerAs: 'validateAndSubmitCtrl',
          templateUrl: '/create-transaction/validate-submit',
          params: {
            transactionModel: null,
            totalDocumentAmount: 0.00,
            tradingpartnerInfoModel: null,
            documentSelects: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/transaction/loan/services/ValidateAndSubmitService.js', 'js/app/modules/transaction/loan/controllers/ValidateAndSubmitController.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        })
        .state('/verify-transaction', {
          url: '/verify-transaction',
          controller: 'VerifyTransactionController',
          controllerAs: 'verifyTxnCtrl',
          templateUrl: '/verify-transaction',
          params: {
            transactionModel: null
          },
          resolve: WebHelper.loadScript(['js/app/verify-transactions/verify-transaction-service.js', 'js/app/verify-transactions/verify-transaction-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
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
            isDisplayReason: 'none'
          },
          resolve: WebHelper.loadScript(['js/app/modules/transaction/loan/services/ViewTransactionService.js', 'js/app/modules/transaction/loan/controllers/ViewTransactionController.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/approve-transaction/approve', {
          url: '/approve-transaction/approve',
          controller: 'ApproveController',
          controllerAs: 'ctrl',
          templateUrl: '/approve-transaction/approve',
          params: {
            transaction: null
          },
          resolve: WebHelper.loadScript(['js/app/approve-transactions/approve-transaction-service.js', 'js/app/modules/transaction/services/TransactionService.js', 'js/app/approve-transactions/approve-transaction-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/my-organize/upload-document', {
          url: '/my-organize/upload-document',
          controller: 'UploadDocumentController',
          controllerAs: 'ctrl',
          params: {
            party: 'supplier'
          },
          templateUrl: '/upload-document',
          resolve: WebHelper.loadScript(['js/app/modules/upload-document/upload-document-service.js', 'js/app/modules/upload-document/upload-document-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/my-organize/ap-document-list', {
          url: '/my-organize/ap-document-list',
          controller: 'DocumentListController',
          controllerAs: 'ctrl',
          params: {
            viewMode: 'MY_ORGANIZE'
          },
          templateUrl: '/ap-document-list/my-organize',
          resolve: WebHelper.loadScript(['js/app/modules/document-list/controllers/ap-document-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/partner-organize/ap-document-list', {
          url: '/partner-organize/ap-document-list',
          controller: 'DocumentListController',
          controllerAs: 'ctrl',
          params: {
            viewMode: 'PARTNER'
          },
          templateUrl: '/ap-document-list/partner-organize',
          resolve: WebHelper.loadScript(['js/app/modules/document-list/controllers/ap-document-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/customer-organize/ap-document-list', {
          url: '/customer-organize/ap-document-list',
          controller: 'DocumentListController',
          controllerAs: 'ctrl',
          params: {
            viewMode: 'CUSTOMER'
          },
          templateUrl: '/ap-document-list/customer-organize',
          resolve: WebHelper.loadScript(['js/app/modules/document-list/controllers/ap-document-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/my-organize/ar-document-list', {
          url: '/my-organize/ar-document-list',
          controller: 'ARDocumentController',
          controllerAs: 'ctrl',
          params: {
            viewMode: 'MY_ORGANIZE'
          },
          templateUrl: '/ar-document-list/my-organize',
          resolve: WebHelper.loadScript(['js/app/modules/document-list/controllers/ARDocumentController.js', 'js/app/modules/document-list/services/DocumentService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/partner-organize/ar-document-list', {
          url: '/partner-organize/ar-document-list',
          controller: 'ARDocumentController',
          controllerAs: 'ctrl',
          params: {
            viewMode: 'PARTNER'
          },
          templateUrl: '/ar-document-list/partner-organize',
          resolve: WebHelper.loadScript(['js/app/modules/document-list/controllers/ARDocumentController.js', 'js/app/modules/document-list/services/DocumentService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/customer-organize/ar-document-list', {
          url: '/customer-organize/ar-document-list',
          controller: 'ARDocumentController',
          controllerAs: 'ctrl',
          params: {
            viewMode: 'CUSTOMER'
          },
          templateUrl: '/ar-document-list/customer-organize',
          resolve: WebHelper.loadScript(['js/app/modules/document-list/controllers/ARDocumentController.js', 'js/app/modules/document-list/services/DocumentService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/my-organize/transaction-list', {
          url: '/my-organize/transaction-list',
          controller: 'ListTransactionController',
          controllerAs: 'ctrl',
          params: {
            backAction: false,
            viewMode: 'MY_ORGANIZE',
            criteria: null
          },
          templateUrl: '/transaction-list/my-organize',
          resolve: WebHelper.loadScript(['js/app/list-transactions/list-transaction-service.js', 'js/app/modules/transaction/services/TransactionService.js', 'js/app/list-transactions/list-transaction-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/partner-organize/transaction-list', {
          url: '/partner-organize/transaction-list',
          controller: 'ListTransactionController',
          controllerAs: 'ctrl',
          params: {
            backAction: false,
            viewMode: 'PARTNER',
            criteria: null
          },
          templateUrl: '/transaction-list/partner-organize',
          resolve: WebHelper.loadScript(['js/app/list-transactions/list-transaction-service.js', 'js/app/modules/transaction/services/TransactionService.js', 'js/app/list-transactions/list-transaction-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/customer-organize/transaction-list', {
          url: '/customer-organize/transaction-list',
          controller: 'ListTransactionController',
          controllerAs: 'ctrl',
          params: {
            backAction: false,
            viewMode: 'CUSTOMER',
            criteria: null
          },
          templateUrl: '/transaction-list/customer-organize',
          resolve: WebHelper.loadScript(['js/app/list-transactions/list-transaction-service.js', 'js/app/modules/transaction/services/TransactionService.js', 'js/app/list-transactions/list-transaction-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/dashboard', {
          url: '/dashboard',
          controller: 'DashboardController',
          controllerAs: 'dashboardCtrl',
          templateUrl: '/dashboard',
          resolve: WebHelper.loadScript(['js/app/dashboard/dashboard-controller.js', 'js/app/dashboard/transaction/newduedate-group-controller.js',
            'js/app/dashboard/credit-information-controller.js',
            'js/app/dashboard/credit-information-summary-controller.js',
            'js/app/modules/account/services/AccountService.js',
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
            'js/app/dashboard/payment-journey/future-payment.js'
          ])
        }).state('/sponsor-configuration/organize-logo/settings', {
          url: '/organizations/:organizeId/organize-logo/setup',
          controller: 'OrganizeLogoSettingController',
          controllerAs: 'ctrl',
          templateUrl: '/sponsor-configuration/organize-logo/settings',
          params: {
            organizeInfo: null
          },
          resolve: WebHelper.loadScript(['js/app/sponsor-configuration/organize-logo/organize-logo-setting-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/sponsor-configuration/workflow/setup', {
          url: '/organizations/:organizeId/workflow/setup',
          controller: 'SetupWorkflowController',
          controllerAs: 'ctrl',
          templateUrl: '/sponsor-configuration/workflow/setup',
          params: {
            workflowModel: null
          },
          resolve: WebHelper.loadScript(['js/app/sponsor-configuration/workflow/controllers/setup-workflow-controller.js', 'js/app/sponsor-configuration/workflow/services/workflow-service.js'])
        }).state('/bank-information/holidays', {
          url: '/bank-information/holidays',
          controller: 'BankHolidayListController',
          controllerAs: 'ctrl',
          templateUrl: '/holidays/',
          resolve: WebHelper.loadScript(['js/app/modules/holiday/controllers/HolidayListController.js', 'js/app/modules/holiday/controllers/HolidayController.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/monitoring/activity-log', {
          url: '/monitoring/activity-log',
          controller: 'ActivityLogController',
          controllerAs: 'ctrl',
          params: {
            mode: 'all'
          },
          templateUrl: '/activity-log',
          resolve: WebHelper.loadScript(['js/app/modules/holiday/controllers/HolidayListController.js', 'js/app/modules/holiday/controllers/HolidayController.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/my-activity-log', {
          url: '/my-activity-log',
          controller: 'ActivityLogController',
          controllerAs: 'ctrl',
          params: {
            mode: 'personal'
          },
          templateUrl: '/activity-log',
          resolve: WebHelper.loadScript(['js/app/modules/activity-log/activity-log-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/settings/user-and-password-policy', {
          url: '/settings/user-and-password-policy',
          controller: 'PolicyController',
          controllerAs: 'ctrl',
          templateUrl: '/policy',
          resolve: WebHelper.loadScript(['js/app/modules/policy/policy-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/settings/role', {
          url: '/settings/role',
          controller: 'RoleListController',
          controllerAs: 'ctrl',
          templateUrl: '/role',
          params: {
            backAction: false,
            criteria: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/role/role-list-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/role/new', {
          url: '/roles/new',
          controller: 'RoleController',
          controllerAs: 'ctrl',
          templateUrl: '/role/new',
          params: {
            mode: ''
          },
          resolve: WebHelper.loadScript(['js/app/modules/role/role-controller.js', 'js/app/modules/role/role-service.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/role/edit', {
          url: '/roles/:roleId/edit',
          controller: 'RoleController',
          controllerAs: 'ctrl',
          templateUrl: '/role/edit',
          params: {
            mode: '',
            data: '',
            roleId: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/role/role-controller.js', 'js/app/modules/role/role-service.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/role/view', {
          url: '/roles/:roleId',
          controller: 'RoleController',
          controllerAs: 'ctrl',
          templateUrl: '/role/view',
          params: {
            mode: '',
            data: '',
            roleId: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/role/role-controller.js', 'js/app/modules/role/role-service.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/settings/users', {
          url: '/settings/users',
          controller: 'UserListController',
          controllerAs: 'ctrl',
          templateUrl: '/user',
          params: {
            backAction: false,
            criteria: null,
            userListModel: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/user/user-list-controller.js',
            'js/app/modules/user/user-service.js',
            'js/app/common/scf-component.js',
            'js/app/common/scf-component.css'
          ])
        }).state('/customer-registration/customer-users', {
          url: '/customer-registration/customer-users',
          controller: 'UserListController',
          controllerAs: 'ctrl',
          templateUrl: '/user',
          params: {
            backAction: false,
            criteria: null,
            userListModel: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/user/user-list-controller.js',
            'js/app/modules/user/user-service.js',
            'js/app/common/scf-component.js',
            'js/app/common/scf-component.css'
          ])
        }).state('/user/new', {
          url: '/user/new',
          controller: 'UserController',
          controllerAs: 'ctrl',
          templateUrl: '/user/new',
          params: {
            mode: 'newUser',
            userModel: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/user/user-list-controller.js', 'js/app/modules/user/user-service.js', 'js/app/modules/user/user-organize-controller.js', 'js/app/modules/user/user-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/user/edit', {
          url: '/user/edit',
          controller: 'UserController',
          controllerAs: 'ctrl',
          templateUrl: '/user/new',
          params: {
            mode: 'editUser',
            userModel: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/user/user-list-controller.js', 'js/app/modules/user/user-service.js', 'js/app/modules/user/user-organize-controller.js', 'js/app/modules/user/user-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/user/view', {
          url: '/user/view',
          controller: 'UserController',
          controllerAs: 'ctrl',
          params: {
            mode: 'viewUser',
            userModel: null
          },
          templateUrl: '/user/view',
          resolve: WebHelper.loadScript(['js/app/modules/user/user-list-controller.js', 'js/app/modules/user/user-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/change-password', {
          url: '/change-password',
          controller: 'PasswordController',
          controllerAs: 'ctrl',
          params: {
            mode: 'profileChange'
          },
          templateUrl: '/change-password',
          resolve: WebHelper.loadScript(['js/app/modules/profile/change-password/password-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/document-upload-log/view-log', {
          url: '/document-upload-log/view-log',
          controller: 'ViewDocumentUplaodLogController',
          controllerAs: 'ctrl',
          templateUrl: '/document-upload-log/view-log',
          params: {
            recordModel: null,
            viewMode: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/document-upload-log/controllers/ViewDocumentUplaodLogController.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/customer-registration/account', {
          url: '/customer-registration/account',
          controller: 'AccountListController',
          controllerAs: 'ctrl',
          templateUrl: '/account',
          params: {
            params: [],
            backAction: false,
            criteria: null,
            organize: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/account/controllers/AccountListController.js', 'js/app/modules/account/controllers/AccountController.js', 'js/app/modules/account/services/AccountService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/customer-registration/trading-partners', {
          url: '/customer-registration/trading-partners',
          controller: 'TradingPartnerListController',
          controllerAs: 'ctrl',
          templateUrl: '/trading-partners',
          params: {
            params: [],
            backAction: false,
            criteria: null,
            organize: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/trading-partner/controllers/TradingPartnerListController.js', 'js/app/modules/trading-partner/services/TradingPartnerService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/trading-partners/new', {
          url: '/trading-partners/new',
          controller: 'TradingPartnerController',
          controllerAs: 'ctrl',
          templateUrl: '/trading-partners/new',
          params: {
            mode: 'newTradingPartner',
            selectedItem: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/trading-partner/controllers/TradingPartnerController.js', 'js/app/modules/trading-partner/services/TradingPartnerService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/trading-partners/edit', {
          url: '/trading-partners/edit',
          controller: 'TradingPartnerController',
          controllerAs: 'ctrl',
          templateUrl: '/trading-partners/new',
          params: {
            mode: 'editTradingPartner',
            selectedItem: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/trading-partner/controllers/TradingPartnerController.js', 'js/app/modules/trading-partner/services/TradingPartnerService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/trade-finance/config', {
          url: '/trade-finance/config',
          controller: 'ConfigTradeFinanceController',
          controllerAs: 'ctrl',
          templateUrl: '/trade-finance/config',
          params: {
            setupModel: null,
            backAction: false
          },
          resolve: WebHelper.loadScript(['js/app/modules/trading-partner/financing/controllers/ConfigTradeFinanceController.js', 'js/app/modules/trading-partner/financing/services/ConfigTradeFinanceService.js', 'js/app/modules/trading-partner/services/TradingPartnerService.js', 'js/app/modules/account/controllers/AccountController.js', 'js/app/modules/account/services/AccountService.js', 'js/app/modules/trading-partner/financing/controllers/SetupDebitPaymentController.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/trade-finance/new', {
          url: '/trade-finance/new',
          controller: 'TradeFinanceController',
          controllerAs: 'ctrl',
          templateUrl: '/trade-finance/new',
          params: {
            mode: 'NEW',
            params: '',
            data: ''
          },
          resolve: WebHelper.loadScript(['js/app/modules/trading-partner/financing/controllers/TradeFinanceController.js', 'js/app/modules/trading-partner/financing/services/TradeFinanceService.js', 'js/app/modules/account/services/AccountService.js', 'js/app/modules/account/controllers/AccountController.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/trade-finance/edit', {
          url: '/trade-finance/edit',
          controller: 'TradeFinanceController',
          controllerAs: 'ctrl',
          templateUrl: '/trade-finance/edit',
          params: {
            mode: 'EDIT',
            params: '',
            data: ''
          },
          resolve: WebHelper.loadScript(['js/app/modules/trading-partner/financing/controllers/TradeFinanceController.js', 'js/app/modules/account/controllers/AccountController.js', 'js/app/modules/account/services/AccountService.js', 'js/app/modules/trading-partner/financing/services/TradeFinanceService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/trade-finance/view', {
          url: '/trade-finance/view',
          controller: 'TradeFinanceController',
          controllerAs: 'ctrl',
          templateUrl: '/trade-finance/view',
          params: {
            mode: 'VIEW',
            params: '',
            data: ''
          },
          resolve: WebHelper.loadScript(['js/app/modules/trading-partner/financing/controllers/TradeFinanceController.js', 'js/app/modules/account/controllers/AccountController.js', 'js/app/modules/account/services/AccountService.js', 'js/app/modules/trading-partner/financing/services/TradeFinanceService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/customer-organize/remittance-advice', {
          url: '/customer-organize/remittance-advice',
          controller: 'RemittanceAdviceBankController',
          controllerAs: 'ctrl',
          templateUrl: '/remittance-advice-bank',
          params: {
            viewMode: 'CUSTOMER',
            transactionModel: null,
            backAction: false,
            criteria: null,
            buyer: null,
            supplier: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/remittance-advice/bank/controllers/RemittanceAdviceBankController.js', 'js/app/modules/remittance-advice/bank/services/RemittanceAdviceBankService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/my-organize/remittance-advice', {
          onEnter: ['RemittanceAdviceCustomerService', '$state', "$stateParams", function (RemittanceAdviceCustomerService, $state, $stateParams) {
            var deferred = RemittanceAdviceCustomerService.verifyBorrowerType();
            deferred.promise.then(function (response) {
              if (response.data.length <= 0) {
                $state.go('/my-organize/remittance-advice/error', {});
              }
            }).catch(function (response) {
              $state.go('/my-organize/remittance-advice/error', {});
            });
          }],
          url: '/my-organize/remittance-advice',
          controller: 'RemittanceAdviceCustomerController',
          controllerAs: 'ctrl',
          templateUrl: '/remittance-advice-customer',
          params: {
            criteria: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/remittance-advice/customer/controllers/RemittanceAdviceCustomerController.js', 'js/app/modules/remittance-advice/customer/services/RemittanceAdviceCustomerService.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
        }).state('/my-organize/remittance-advice/error', {
          url: '/my-organize/remittance-advice/error',
          controller: 'ErrorController',
          controllerAs: 'ctrl',
          templateUrl: '/remittance-advice-error',
          resolve: WebHelper.loadScript(['js/app/common/error-controller.js'])
        }).state('/payment-transaction/view', {
          url: '/payment-transaction/view',
          controller: 'ViewPaymentController',
          controllerAs: 'ctrl',
          templateUrl: '/payment-transaction/view',
          params: {
            viewMode: null,
            transactionModel: null,
            isShowViewHistoryButton: false,
            isShowBackButton: false
          },
          resolve: WebHelper.loadScript(['js/app/modules/transaction/payment/services/ViewPaymentService.js', 'js/app/modules/transaction/payment/controllers/ViewPaymentController.js'])
        }).state('/payment-transaction/verify', {
          url: '/payment-transaction/verify',
          controller: 'VerifyPaymentController',
          controllerAs: 'ctrl',
          templateUrl: '/payment-transaction/verify',
          params: {
            transaction: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/transaction/payment/services/VerifyPaymentService.js', 'js/app/modules/transaction/payment/controllers/VerifyPaymentController.js'])
        }).state('/payment-transaction/approve', {
          url: '/payment-transaction/approve',
          controller: 'ApprovePaymentController',
          controllerAs: 'ctrl',
          templateUrl: '/payment-transaction/approve',
          params: {
            transaction: null
          },
          resolve: WebHelper.loadScript(['js/app/modules/transaction/payment/services/ApprovePaymentService.js', 'js/app/modules/transaction/payment/controllers/ApprovePaymentController.js', 'js/app/modules/transaction/services/TransactionService.js'])
        }).state('/upload-document-error', {
          url: '/upload-document-error',
          controller: 'ErrorController',
          controllerAs: 'ctrl',
          templateUrl: '/upload-document-error',
          params: {
            errorCode: null
          },
          resolve: WebHelper.loadScript(['js/app/common/error-controller.js'])
        }).state('/error', {
          url: '/error',
          controller: 'ErrorController',
          controllerAs: 'ctrl',
          templateUrl: '/error/internal',
          params: {
            errorCode: null
          },
          resolve: WebHelper.loadScript(['js/app/common/error-controller.js'])
        }).state('/error/401', {
          url: '/error/401',
          controller: 'ErrorController',
          controllerAs: 'ctrl',
          templateUrl: '/error/401',
          params: {
            errorCode: 401
          },
          resolve: WebHelper.loadScript(['js/app/common/error-controller.js'])
        }).state('/error/403', {
          url: '/error/403',
          controller: 'ErrorController',
          controllerAs: 'ctrl',
          templateUrl: '/error/403',
          params: {
            errorCode: 403
          },
          resolve: WebHelper.loadScript(['js/app/common/error-controller.js'])
        });

    }
  ]);

app.controller('ScfHomeCtrl', ['$translate', '$translatePartialLoader', 'scfFactory', '$scope',
  'Service', '$window', '$rootScope', '$http', 'UIFactory',
  function ($translate, $translatePartialLoader, scfFactory, $scope, Service, $window, $rootScope, $http, UIFactory) {
    var vm = this;
    vm.title = '';
    vm.banner = 'Loading...';
    vm.sysMessage = "";
    vm.menus = [];
    vm.changeLanguage = function (lang) {
    	console.log(lang);
      $translatePartialLoader.addPart('translations');
      $translate.use(lang);
      $translate.refresh(lang);
    };
    
    vm.decodeBase64 = function(data){
		if(data==null||angular.isUndefined(data)){
			return '';
		}
		return atob(data);
	}

    vm.getMessage = function () {
      var defered = scfFactory.getErrorMsg($translate.use());
      defered.promise.then(function (response) {
        vm.sysMessage = response.content;
      });

    };

    $http.get('assets/theme.json').then(function (res) {
      vm.title = res.data.title;
      vm.banner = res.data.banner;
    });

    // Begin Code Get Organize List
    vm.organizeHeader;
    vm.getUserInfo = function () {
      var defered = scfFactory.getUserInfo();
      defered.promise.then(function (response) {
        $scope.userInfo = response;
        $rootScope.userInfo = response;
        vm.organizeHeader = $rootScope.userInfo;
        console.log(vm.organizeHeader);
        alert(vm.organizeHeader)
        vm.getListUserOrgranize();
        if (vm.organizeHeader.memberLogo != null) {
            
            vm.organizeHeader.memberLogo = vm.decodeBase64(vm.organizeHeader.memberLogo);
        }
        else{
          vm.organizeHeader.memberLogo = vm.decodeBase64(UIFactory.constants.NOLOGO);
        }
      });
    };

    vm.ListOrgAndHeader = [];
    vm.getListUserOrgranize = function () {
      var defered = scfFactory.getOrganizeList();
      defered.promise.then(function (response) {
        vm.ListOrgAndHeader = response;
        cutOrganizeHeaderFromOrganizeList();
      });
    };

    vm.orgList = [];
    vm.showDropDown = false;
    var cutOrganizeHeaderFromOrganizeList = function () {
      if (vm.ListOrgAndHeader.length != 0 && vm.ListOrgAndHeader != []) {
        for (var i = 0; i < vm.ListOrgAndHeader.length; i++) {
          if (vm.ListOrgAndHeader[i].memberId != vm.organizeHeader.organizeId) {
            vm.orgList.push({
              memberId: vm.ListOrgAndHeader[i].memberId,
              memberName: vm.ListOrgAndHeader[i].memberName
            })
            vm.showDropDown = true;
          }
        }
      }
    };
    // End Code Get Organize List

    // Begin Code Change Organize
    vm.changeOrganize = function (index) {
      var organize_id = vm.orgList[index].memberId;
      var defered = scfFactory.changeOrganize(organize_id);
      defered.promise.then(function (response) {
        window.location.href = "/";
      });
    }
    // End Code Change Organize


    vm.getUserInfo();


    $rootScope.isDesktopDevice = true;
    getWindowSize();
    angular.element($window).bind('resize', function () {
      getWindowSize();
    });

    function getWindowSize() {
      var width = $window.innerWidth;
      if (width > 992) {
        $rootScope.isDesktopDevice = true;
      } else {
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
    changeOrganize: changeOrganize,
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

  function getUserInfo() {
    var deferred = $q.defer();
    $http.get('/api/users/me').success(function (response) {
      deferred.resolve(response);
      return deferred;
    }).catch(function (response) {
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

  function getOrganizeList() {
    var deferred = $q.defer();
    $http.get('/api/v1/users/me/organizes').success(function (response) {
      deferred.resolve(response);
      return deferred;
    }).catch(function (response) {
      deferred.reject("User Organization List Error");
      return deferred;
    });
    return deferred;
  }

  function changeOrganize(organize_id) {
    var deferred = $q.defer();
    $http.post('/api/v1/users/me/change-organize/' + organize_id).success(function (response) {
      deferred.resolve(response);
      return deferred;
    }).catch(function (response) {
      deferred.reject("Change User Organization Error");
      return deferred;
    });
    return deferred;
  }

  function getMenu() {
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
  function ($q, $location, $window) {
    return {
      response: function (responseData) {
        return responseData;
      },
      responseError: function error(response) {
        switch (response.status) {
          case 401:
          case 406:
            $window.location.href = "/error/401";
            break;
            // case 403:
            // $window.location.href = "/error/403";
            // break;
          default:
            break;
        }

        return $q.reject(response);
      }
    };
  }
]);
// register the interceptor as a service
app.factory('templateInterceptor', function ($q) {
  return {
    'responseError': function (rejection) {
      if (rejection.config != undefined) {
        var isTemplate = !!rejection.config.url.match(/^content/g);
        if (isTemplate) {
          rejection.data = '<div><template-error url="\'' + (rejection.config.url) + '\'"><strong>Error from interceptor.</strong></template-error></div>';
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
  defered.promise.then(function (response) {
    self.menu = response.data;
  });

}]);

self.goTo = function (state) {
  $state.go(state);
}

app.run(['$rootScope', '$q', '$http', '$urlRouter', '$window', 'blockUI', '$state', '$filter', '$cookieStore', function ($rootScope, $q, $http, $urlRouter, $window, blockUI, $state, $filter, $cookieStore) {
  // $window.Date.prototype.toISOString = function(){
  // return $filter('date')(this, 'yyyy-MM-ddTHH:mm:ss.000+0000');
  // };
  $window.Date.prototype.toJSON = function () {
    return moment(this).format();
  }
  var isLoginPage = window.location.href.indexOf("login") != -1;
  if (isLoginPage) {
    if ($cookieStore.get("access_token")) {
      window.location.href = "/";
    }
  } else {
    if ($cookieStore.get("access_token")) {
      $http.defaults.headers.common.Authorization =
        'Bearer ' + $cookieStore.get("access_token");
    } else {
      window.location.href = "login";
    }
  }
  $rootScope
    .$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        if (toState.redirectTo) {
          event.preventDefault();
          $state.go(toState.redirectTo, toParams, {
            location: 'replace'
          });
        }
      });

  $rootScope
    .$on('$stateChangeSuccess',
      function (event, toState, toParams, fromState, fromParams) {
        $window.scrollTo(0, 0);
      });
}]);