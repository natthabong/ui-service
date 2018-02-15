(function () {
    'use strict';
    var app = angular.module('authenApp', ['pascalprecht.translate', 'ngCookies', 'blockUI', 'ui.router', 'ngDialog', 'gecscf.profile', 'scf-ui', 'gecscf.ui', 'scf-component']).config(['$httpProvider','ngDialogProvider', '$translateProvider', '$translatePartialLoaderProvider', function ($httpProvider, ngDialogProvider, $translateProvider, $translatePartialLoaderProvider) {

        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.headers.common['Accept'] = 'application/json';
        
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
        
    }]);
    app.controller('LoginController', ['$window', 'AuthenticationService', '$state', 'ngDialog', function ($window, AuthenticationService, $state, ngDialog) {
        var self = this;

        self.login = login;
        self.error = false;
        self.errorMessage = '';
        self.usernameRequired = false;
        self.passwordRequired = false;
             
        (function initController() {
            AuthenticationService.ClearCredentials();
        })();

        function goToHome(){
        	AuthenticationService.SetCredentials(self.username, self.password);
                $window.location.href = '/';
        }
        
        function login() {
        	self.error = false;
        	self.errorMessage = '';
        	var loginFlag = true;
        	self.usernameRequired = false;
        	self.passwordRequired = false;
            
        	if(isBlank(self.username) && isBlank(self.password)){
        		loginFlag = false;
        		self.usernameRequired = true;
        		self.passwordRequired = true;
        	}else if(isBlank(self.username)){
        		loginFlag = false;
        		self.usernameRequired = true;
        	}else if(isBlank(self.password)){
        		loginFlag = false;
        		self.error = true;
        		self.errorMessage = 'Invalid username or password.';
        	}
        	
        	if(loginFlag){
	             var deffered = AuthenticationService.Login(self.username, self.password, self.funding, self.clientId, self.clientSecret, function (response) {});
	              deffered.promise.then(function(response) {
	        	    if(response.data.forceChangePassword){
	        		self.forceChangeDialog = ngDialog.open({
    					id : 'force-change-password-dialog',
    					template : '/change-password/force',
    					className : 'ngdialog-theme-default',
    					controller: 'PasswordController',
    					controllerAs: 'ctrl',
    					preCloseCallback : function() {
    						goToHome();
    					}
    				});
	        	    }
	        	    else{
	        		goToHome();
	        	    }
	            }).catch(function(response) {
	            	self.errorMessage = response.data.errorMessage;
	            	self.error = true;
	            	if(!angular.isDefined(self.errorMessage)){
	            	    self.errorMessage = response.status + ' '+response.statusText;
	            	}
	            });
        	}
        };
        
        function isBlank(str) {
            return (!str || /^\s*$/.test(str));
        };
        
    }]);
    app.controller('LogoutController', ['$window', '$cookieStore', 'AuthenticationService', function ($window, $cookieStore, AuthenticationService) {

        var vm = this;
        var access_token = $cookieStore.get("access_token")
        var refresh_token = $cookieStore.get("refresh_token")
        vm.at = access_token;
        vm.rf = refresh_token;
        vm.logout = function () {

            AuthenticationService.Logout(function (response) {
            	$window.location.href = '/login';
            });
        };

}]);
 
      app.factory('AuthenticationService', ['$http', '$window', '$httpParamSerializer', '$cookieStore', '$rootScope', '$timeout',  'blockUI', '$q', function ($http, $window, $httpParamSerializer, $cookieStore, $rootScope, $timeout, blockUI, $q) {
        var service = {};

        service.Login = Login;
        service.Logout = logout;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.validateForceChangePassword = validateForceChangePassword;

        return service;

        function Login(username, password, funding, clientId,  clientSecret) {

            /* Use this for real authentication
             ----------------------------------------------*/
        	
        	var deffered = $q.defer();
        	blockUI.start("Authentication...");
        	var encoded = btoa(clientId+":"+clientSecret);
        	var req = {
    	            method: 'POST',
    	            url: "/api/oauth/token",
    	            headers: {
    	                "Authorization": "Basic " + encoded,
    	                "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
    	            },
    	            data: $httpParamSerializer({
    	        	username: username,
    	        	password: password,
    	        	funding: funding,
    	        	grant_type: 'password'
    	            })
    	        }
    	        $http(req).then(function(response) {
                    $http.defaults.headers.common.Authorization = 
      	              'Bearer ' + response.data.access_token;
                    var expireDate = new Date (new Date().getTime() + (1000 * response.data.expires_in));
                    $cookieStore.put("access_token", response.data.access_token, {'expires': expireDate});
                    $cookieStore.put("refresh_token", response.data.refresh_token, {'expires': expireDate});
                    blockUI.stop();
                    deffered.resolve(response);
                }).catch(function(response) {
                    blockUI.stop();
                    deffered.reject(response);
                })
            return deffered;
        }
        
        function validateForceChangePassword(access_token){
        	var deffered = $q.defer();
        	var req = {
    	            method: 'POST',
    	            url: "/api/v1/users/validate-force-change-password",
    	            headers: {
    	                "Authorization": "Bearer " + access_token,
    	                "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
    	            }
    	        }
	        $http(req).then(function(response) {				
                deffered.resolve(response);
            }).catch(function(response) {
                deffered.reject(response);
            })	 
        	return deffered;
        }
        function logout(){
        	 var access_token = $cookieStore.get("access_token")
             var refresh_token = $cookieStore.get("refresh_token")
        	 $window.location.href = ['/login?logout_at=',access_token,"&rf=",refresh_token].join("");
        }
        function Logout1(callback) {
            var deffered = $q.defer();
            blockUI.start();
            var access_token = $cookieStore.get("access_token")
            var refresh_token = $cookieStore.get("refresh_token")
            var req = {
    	            method: 'POST',
    	            url: "/api/oauth/revoke-token",
    	            params: {
    	        	refreshToken: refresh_token
    	            }
    	        }
    	        $http(req).then(function(response) {
                    blockUI.stop();
                    ClearCredentials();
                    callback();
                    deffered.resolve(response);
                }).catch(function(response) {
                    
                    switch (response.status) {
                    	case 401:
                    		blockUI.stop();
                    		response.status = 200;
                            callback();
                            deffered.resolve(response);
                    		break;
                    }
                })
            
            /* Use this for real authentication
             ----------------------------------------------*/
            
        }

        function SetCredentials(username, password) {
//            var authdata = btoa(username + ':' + password);
//            $rootScope.globals = {
//                currentUser: {
//                    username: username,
//                    authdata: authdata
//                }
//            };
//
//            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
//            $cookieStore.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('access_token');
            delete $http.defaults.headers.common.Authorization;
        }
    }]);

    // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
})();