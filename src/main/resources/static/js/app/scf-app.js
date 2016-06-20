var $stateProviderRef = null;

var app = angular.module('scfApp', ['pascalprecht.translate', 'ui.router', 'ui.bootstrap', 'authenApp', 'oc.lazyLoad', 'checklist-model',  'cfp.loadingBar', 'angular-loading-bar'])
    .config(['$httpProvider', '$translateProvider', '$translatePartialLoaderProvider', '$stateProvider', '$locationProvider','cfpLoadingBarProvider',
        function ($httpProvider, $translateProvider, $translatePartialLoaderProvider, $stateProvider, $locationProvider,cfpLoadingBarProvider) {
    		var version = (new Date()).getTime();
    	    cfpLoadingBarProvider.includeSpinner = false;
		    cfpLoadingBarProvider.latencyThreshold = 300;
		    
            $translateProvider.useLoader('$translatePartialLoader', {
                urlTemplate: '../{part}/{lang}/scf_label.json'
            });

            $translateProvider.preferredLanguage('en_EN');
            $translatePartialLoaderProvider.addPart('translations');
            $translateProvider.useSanitizeValueStrategy('escapeParameters');

            $httpProvider.defaults.headers.common['Accept-Language'] = 'en_EN';
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
			$stateProviderRef = $stateProvider;
            $stateProvider
                .state('/home', {
                    url: '/home',
                    templateUrl: '/home'
                })
			.state('/create-transaction', {
				url: '/create-transaction',
				controller: 'CreateTransactionController',
				onEnter: ['CreateTransactionService','$state', function(CreateTransactionService,$state){
					var deffered = CreateTransactionService.verifyTradingPartner();
		            deffered.promise.then(function (response) {

		                })
		                .catch(function (response) {
		                	console.log(response.data.errorCode);
		                	 $state.go('/error', {
		                		 errorCode: response.data.errorCode
		 	                });
		                });
				}],
				controllerAs: 'createTransactionCtrl',				
				templateUrl: '/create-transaction',
                params: {actionBack: false, transactionModel: null, tradingpartnerInfoModel: null, documentSelects: null},
				resolve: load(['js/app/create-transactions/create-service.js','js/app/create-transactions/create-controller.js',
				               'js/app/common/scf-component.js', 'js/app/create-transactions/transaction-service.js'])
			}).state('/create-transaction/validate-submit', {
				url: '/create-transaction/validate-submit',
				controller: 'ValidateAndSubmitController',
				controllerAs: 'validateAndSubmitCtrl',
				templateUrl: '/create-transaction/validate-submit',
				params: { transactionModel: null, totalDocumentAmount:0.00, tradingpartnerInfoModel: null, documentSelects: null},
				resolve: load(['js/app/create-transactions/validate-submit-service.js','js/app/create-transactions/validate-submit-controller.js', 'js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/transaction-list', {
				url: '/transaction-list',
				controller: 'ListTransactionController',
				controllerAs: 'listTransactionController',
				params: { listTransactionModel: null, actionBack: false},
				templateUrl: '/list-transaction',
				resolve: load(['js/app/list-transactions/list-transaction-service.js', 'js/app/list-transactions/list-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/verify-transaction', {
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
				params: { transactionModel: null, listTransactionModel: null, actionBack: false},
				resolve: load(['js/app/view-transactions/view-transaction-service.js', 'js/app/view-transactions/view-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/approve-transaction/approve',{
				url: '/approve-transaction/approve',
				controller: 'ApproveController',
				controllerAs: 'ctrl',
				templateUrl: '/approve-transaction/approve',
				params: {transactionModel: null},
				resolve: load(['js/app/approve-transactions/approve-transaction-service.js','js/app/approve-transactions/approve-transaction-controller.js','js/app/common/scf-component.js', 'js/app/common/scf-component.css'])
			}).state('/error', {
				url: '/error',
				controller: 'ErrorController',
				controllerAs: 'ctrl',
				templateUrl: '/error/internal',
				params: { errorCode: null},
				resolve: load([ 'js/app/common/error-controller.js'])
			});
			
			function load(srcs, callback) {
                return {                    
                    deps: ['$ocLazyLoad', '$q',
                                function ($ocLazyLoad, $q) {
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
    function ($translate, $translatePartialLoader, scfFactory, $scope) {
        var self = this;
        self.sysMessage = "";
		self.displayName = "";
        self.menus = [];
        self.changeLanguage = function (lang) {
            $translatePartialLoader.addPart('translations');
            $translate.use(lang);
            $translate.refresh(lang);
        };

        self.getMessage = function () {

            var defered = scfFactory.getErrorMsg($translate.use());
            defered.promise.then(function (response) {
                self.sysMessage = response.content;
            });

        };
		
		self.getUserInfo = function(){
			var defered = scfFactory.getUserInfo();
			defered.promise.then(function(response){
				self.displayName = response.displayName;
				$scope.userInfo = response;
			});
		};
		
		self.getUserInfo();

    }
]);

app.controller('CreateLoanRequestCtrl', [function () {
    var self = this;

    self.isOpenLoanReq = false;
    self.dateFormat = "dd/MM/yyyy";

    self.loanReqDate = new Date();
    self.openCalLoanDate = function () {
        self.isOpenLoanReq = true;
    };
    }]);


app.factory('scfFactory', ['$http', '$q', '$cookieStore', function ($http, $q, $cookieStore) {
    return {
        getErrorMsg: getErrorMsg,
        getUserInfo: getUserInfo
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
		currentUser = $cookieStore.get('globals').currentUser;
    	var deferred = $q.defer();
    	$http.get('/api/user-info', {
			params : {loginName: currentUser.username}
		}).success(function(response){
			deferred.resolve(response);
			return deferred;
		}).catch(function(response){
			deferred.reject("User Info Error");
			return deferred;
		});
    	return deferred;
    }
}]);

app.run(['$rootScope', '$q', '$http', '$urlRouter', '$window', function ($rootScope, $q, $http, $urlRouter, $window) {
    $rootScope
        .$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                // Show loading here
            });

    $rootScope
        .$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                $window.scrollTo(0, 0);
            });

}]);