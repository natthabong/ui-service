(function () {
    'use strict';
    var app = angular.module('authenApp', ['ngCookies']);
    app.controller('LoginController', ['$location', 'AuthenticationService', function ($location, AuthenticationService) {
        var self = this;

        self.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            self.dataLoading = true;
            AuthenticationService.Login(self.username, self.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(self.username, self.password);
                    $location.path('/');
                } else {
                    self.dataLoading = false;
                }
            });
        };
    }]);


    app.factory('AuthenticationService', ['$http', '$cookieStore', '$rootScope', '$timeout', function ($http, $cookieStore, $rootScope, $timeout) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(username, password, callback) {

            /* Use this for real authentication
             ----------------------------------------------*/
            $http.post('/api/authenticate', {
                    username: username,
                    password: password
                })
                .success(function (response) {
                    callback(response);
                });

        }

        function SetCredentials(username, password) {
            var authdata = btoa(username + ':' + password);

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }]);

})();