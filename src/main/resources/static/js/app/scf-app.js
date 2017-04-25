var $stateProviderRef = null;
var app = angular.module('scfApp', ['pascalprecht.translate', 'ui.router', 'ui.bootstrap', 'authenApp', 'oc.lazyLoad', 'checklist-model', 'blockUI', 'scf-ui', 'ngDialog', 'nvd3ChartDirectives',
                        			'legendDirectives','chart.js', 'gecscf.ui', 'ngCookies', 'gecscf.profile', 'gecscf.user'])
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
            
	    $stateProviderRef = $stateProvider;
			
	    $urlRouterProvider.otherwise('/dashboard');
            $stateProvider			
            .state('/home', {
                url: '/home',
				templateUrl: '/home',
				redirectTo: '/dashboard'
            }).state('/create-transaction', {
				url: '/create-transaction',
				controller: 'CreateTransactionController',
				onEnter: ['CreateTransactionService','$state', function(CreateTransactionService,$state){
					var deffered = CreateTransactionService.verifyTradingPartner();
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
                params: {backAction: false, transactionModel: null, tradingpartnerInfoModel: null, documentSelects: null, dashboardParams: null, showBackButton: false},
				resolve: load(['js/app/create-transactions/create-service.js','js/app/create-transactions/create-controller.js',
				               'js/app/common/scf-component.js', 'js/app/create-transactions/transaction-service.js'])
			}).state('/create-transaction/validate-submit', {
				url: '/create-transaction/validate-submit',
				controller: 'ValidateAndSubmitController',
				controllerAs: 'validateAndSubmitCtrl',
				templateUrl: '/create-transaction/validate-submit',
				params: { transactionModel: null, totalDocumentAmount:0.00, tradingpartnerInfoModel: null, documentSelects: null},
				resolve: load(['js/app/create-transactions/validate-submit-service.js','js/app/create-transactions/validate-submit-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/organize-list/bank', {
				url: '/organize-list/bank',
				controller: 'OrganizeListController',
				controllerAs: 'ctrl',
				params: {backAction: false,party:'bank'},
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
				resolve: load(['js/app/view-transactions/view-transaction-service.js', 'js/app/view-transactions/view-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/approve-transaction/approve',{
				url: '/approve-transaction/approve',
				controller: 'ApproveController',
				controllerAs: 'ctrl',
				templateUrl: '/approve-transaction/approve',
				params: {transaction: null},
				resolve: load(['js/app/approve-transactions/approve-transaction-service.js','js/app/transactions/transaction-service.js','js/app/approve-transactions/approve-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/upload-document',{
				url: '/upload-document',
				controller: 'UploadDocumentController',
				controllerAs: 'ctrl',
				params: {party:'sponsor'},
				templateUrl: '/upload-document',
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
				resolve: load(['js/app/modules/document-list/document-list-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/document-list/supplier',{
				url: '/document-list/supplier',
				controller: 'DocumentListController',
				controllerAs: 'ctrl',
				params: {party:'supplier'},
				templateUrl: '/document-list/supplier',
				resolve: load(['js/app/modules/document-list/document-list-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/document-list/bank',{
				url: '/document-list/bank',
				controller: 'DocumentListController',
				controllerAs: 'ctrl',
				params: {party:'bank'},
				templateUrl: '/document-list/bank',
				resolve: load(['js/app/modules/document-list/document-list-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/transaction-list/sponsor', {
				url: '/transaction-list/sponsor',
				controller: 'ListTransactionController',
				controllerAs: 'ctrl',
				params: {backAction: false,party:'sponsor'},
				templateUrl: '/list-transaction/sponsor',
				resolve: load(['js/app/list-transactions/list-transaction-service.js', 'js/app/transactions/transaction-service.js', 'js/app/list-transactions/list-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/transaction-list/supplier', {
				url: '/transaction-list/supplier',
				controller: 'ListTransactionController',
				controllerAs: 'ctrl',
				params: {backAction: false,party:'supplier'},
				templateUrl: '/list-transaction/supplier',
				resolve: load(['js/app/list-transactions/list-transaction-service.js', 'js/app/transactions/transaction-service.js', 'js/app/list-transactions/list-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/transaction-list/bank', {
				url: '/transaction-list/bank',
				controller: 'ListTransactionController',
				controllerAs: 'ctrl',
				params: {backAction: false,party:'bank'},
				templateUrl: '/list-transaction/bank',
				resolve: load(['js/app/list-transactions/list-transaction-service.js', 'js/app/transactions/transaction-service.js', 'js/app/list-transactions/list-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/dashboard', {
				url: '/dashboard',
				controller: 'DashboardController',
				controllerAs: 'dashboardCtrl',
				templateUrl: '/dashboard',
				resolve: load([ 'js/app/dashboard/dashboard-controller.js', 'js/app/dashboard/newduedate-group-controller.js',
							   'js/app/dashboard/credit-information-controller.js',
							   'js/app/dashboard/credit-information-summary-controller.js',
							   'js/app/dashboard/twelve-months-credit-movement-controller.js',
							   'js/app/dashboard/internal-step-controller.js',
							   'js/app/dashboard/transaction-todolist-controller.js', 
							   'js/app/common/scf-component.js', 
							   'js/app/common/scf-component.css',
							   'js/app/dashboard/approve-transaction-todolist-controller.js',
							   'js/app/dashboard/transaction-journey/new-document.js',
							  'js/app/dashboard/transaction-journey/wait-for-verify.js',
							  'js/app/dashboard/transaction-journey/wait-for-approve.js',
							  'js/app/dashboard/transaction-journey/future-drawdown.js',
							  'js/app/dashboard/transaction-journey/result.js'])
			}).state('/sponsor-configuration',{
				url: '/sponsor-configuration',
				controller: 'SponsorConfigController',
				controllerAs: 'sponsorConfigCtrl',
				templateUrl: '/sponsor-configuration',
				params: { organizeModel: null, fileLayoutModel: null},
				resolve: load(['js/app/sponsor-configuration/sponsor-config-controller.js', 
							   'js/app/sponsor-configuration/profile-controller.js', 
							   'js/app/sponsor-configuration/file-layouts-controller.js', 
							   'js/app/modules/sponsor-config/customer-code-groups/customer-code-groups-controller.js',
							   'js/app/sponsor-configuration/channel-config-controller.js',
							   'js/app/common/scf-component.js', 
							   'js/app/common/scf-component.css',
							  'js/app/sponsor-configuration/document-display-configs.js',
							  'js/app/sponsor-configuration/payment-date-formula-controller.js',])
			}).state('/sponsor-configuration/file-layouts/new-file-layout',{
				url: '/sponsor-configuration/file-layouts/new-file-layout',
				controller: 'NewFileLayoutController',
				controllerAs: 'newFileLayoutCtrl',
				templateUrl: '/sponsor-configuration/file-layouts/new-file-layout',
				params: { fileLayoutModel: null},
				resolve: load(['js/app/sponsor-configuration/file-layouts/new-file-layout-controller.js', 'js/app/modules/sponsor-config/customer-code-groups/customer-code-groups-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/sponsor-configuration/document-display/settings',{
				url: '/sponsor-configuration/document-display/settings',
				controller: 'DocumentDisplayController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/document-display/settings',
				params: { selectedItem: null},
				resolve: load(['js/app/sponsor-configuration/document-display/document-display-controller.js'])
			}).state('/sponsor-configuration/payment-date-formulas/settings',{
				url: '/sponsor-configuration/payment-date-formulas/settings',
				controller: 'PaymentDateFormulaSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/payment-date-formulas/settings',
				params: { paymentDateFormulaModel: null},
				resolve: load(['js/app/sponsor-configuration/payment-date-formulas/payment-date-formula-setting-controller.js', 'js/app/sponsor-configuration/credit-terms/credit-terms-setting-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/sponsor-configuration/customer-code-groups/settings',{
				url: '/sponsor-configuration/customer-code-groups/settings',
				controller: 'CustomerCodeGroupSettingController',
				controllerAs: 'ctrl',
				templateUrl: '/sponsor-configuration/customer-code-groups/settings',
				params: { selectedItem: null, mode: 'all'}
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
			}).state('/user',{
				url: '/user',
				controller: 'UserListController',
				controllerAs: 'ctrl',
				templateUrl: '/user',
				params: {backAction: false},
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
				resolve: load(['js/app/modules/sponsor-config/customer-code-groups/customer-code-groups-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
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

app.factory('scfFactory', ['$http', '$q', '$cookieStore', function ($http, $q, $cookieStore) {
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