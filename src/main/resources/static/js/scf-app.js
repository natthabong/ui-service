var app = angular.module('scfApp', ['pascalprecht.translate'])
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
    }
]);

app.factory('scfFactory', ['$http', '$q', function($http, $q) {
    return {
        getErrorMsg: getErrorMsg
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
}]);