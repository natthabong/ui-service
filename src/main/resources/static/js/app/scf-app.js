var $stateProviderRef = null;

var app = angular.module('scfApp', ['pascalprecht.translate', 'ui.router', 'ui.bootstrap', 'authenApp'])
    .config(['$httpProvider', '$translateProvider', '$translatePartialLoaderProvider', '$stateProvider', '$locationProvider',
        function ($httpProvider, $translateProvider, $translatePartialLoaderProvider, $stateProvider, $locationProvider) {

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
                    url: "/home",
                    templateUrl: "/home"
                })
                .state('/user', {
					url: "/user",
					templateUrl: "/user"
				})
        }
    ]);

app.controller('ScfHomeCtrl', ['$translate', '$translatePartialLoader', 'scfFactory',
    function ($translate, $translatePartialLoader, scfFactory) {
        var self = this;
        self.sysMessage = "";
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


app.factory('scfFactory', ['$http', '$q', function ($http, $q) {
    return {
        getErrorMsg: getErrorMsg
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
}]);

app.run(['$rootScope', '$q', '$http', '$urlRouter', function ($rootScope, $q, $http, $urlRouter) {
	$http.get('/api/menus').success(function(response){
		angular.forEach(response, function(data){
			var state = {
				'url': data,
				'templateUrl': data
			}			
			$stateProviderRef.state(data, state);
		});
		$urlRouter.sync();
        $urlRouter.listen();		
	});

    $rootScope
        .$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                // Show loading here
            });

    $rootScope
        .$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                // Hide loading here
            });

}]);