var app = angular.module('scfApp', ['pascalprecht.translate','ui.bootstrap'])
    .config(['$httpProvider', '$translateProvider', '$translatePartialLoaderProvider',
        function($httpProvider, $translateProvider, $translatePartialLoaderProvider) {

            $translateProvider.useLoader('$translatePartialLoader', {
                urlTemplate: '../{part}/{lang}/scf_label.json'
            });

            $translateProvider.preferredLanguage('en_EN');
            $translatePartialLoaderProvider.addPart('translations');
			$translateProvider.useSanitizeValueStrategy('escapeParameters');
			
            $httpProvider.defaults.headers.common['Accept-Language'] = 'en_EN';
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        }
    ]);

app.controller('ScfHomeCtrl', ['$translate', '$translatePartialLoader', 'scfFactory',
    function($translate, $translatePartialLoader, scfFactory) {
        var self = this;
		self.sysMessage = "";
        self.menus = [];
        self.changeLanguage = function(lang) {
            $translatePartialLoader.addPart('translations');
            $translate.use(lang);
            $translate.refresh(lang);
        };
		
		self.getMessage = function() {
			
			var defered = scfFactory.getErrorMsg($translate.use());
			defered.promise.then(function(response){
				self.sysMessage = response.content;
			});
			
		};
        
        self.getMyMenu = function(){
            var defered = scfFactory.getMyMenu();
            defered.promise.then(function(response){
                console.log(response);
                self.menus = response;
            }).catch(function(){
                
            });
        };
        self.getMyMenu();
    }
]);

    app.controller('CreateLoanRequestCtrl', [function() {
        var self = this;

        self.isOpenLoanReq = false;
        self.dateFormat = "dd/MM/yyyy";

        self.loanReqDate = new Date();
        self.openCalLoanDate = function() {		
            self.isOpenLoanReq = true;
        };
    }]);

app.factory('scfFactory', ['$http', '$q', function($http, $q) {
    return {
        getErrorMsg: getErrorMsg,
        getMyMenu: getMyMenu,
    };

    function getErrorMsg(lang) {
    	var deferred = $q.defer();
        $http.get('token').success(function(token) {
			
            $http({
                url: 'http://localhost:9002/message',
                method: 'GET',
                headers: {
                    'X-Auth-Token': token.token,
                    'Accept-Language': lang
                }
            }).success(function(response){
				deferred.resolve(response);
			});
        });
        return deferred;
    }
    
    function getMyMenu() {
    	var deferred = $q.defer();
        $http.get('token').success(function(token) {
			
            $http({
                url: 'http://localhost:9002/menus/me',
                method: 'GET',
                headers: {
                    'X-Auth-Token': token.token
                }
            }).success(function(response){
				deferred.resolve(response);
			});
        });
        return deferred;
    }
}]);