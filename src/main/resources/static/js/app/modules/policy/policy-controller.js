angular.module('scfApp').controller(
	'PolicyController',
	[
		'$scope',
		'Service',
		'$stateParams',
		'$log',
		'SCFCommonService',
		'blockUI',
		'PageNavigation',
		'$state',
		'UIFactory',
		'$http',
		'$q',
		function($scope, Service, $stateParams, $log, SCFCommonService, blockUI, PageNavigation, $state, UIFactory, $http,$q) {
		    var model = {};
		    $scope.userPolicies = []
		    $scope.passwordPolicies = []
		    var getPolicies = function(criteria) {
			var deffered = Service.doGet('/api/v1/policies/common',
				criteria);
			deffered.promise.then(function(response) {
			    model = response.data;
			    $scope.userPolicies = [];
			    $scope.passwordPolicies = [];
			    
			    response.data.policyItems.forEach(function(data) {
				
					if (data.policyType == 'USER') {
					    $scope.userPolicies.push(data);
					} else if(data.policyType == 'PASSWORD') {
					    $scope.passwordPolicies.push(data);
					}
			    });
			});
		    }
		    
		    function _success() {
			UIFactory
				.showSuccessDialog({
				    data : {
					headerMessage : 'Edit policy complete.',
					bodyMessage : ''
				    },
				    preCloseCallback : function() {
					PageNavigation
						.gotoPage('/dashboard');
				    }
				});
		    }
		    
		    var validSave = function () {
		    	var isValid = true;
		    	
		    	$scope.userPolicies.forEach(function(data) {
					if (data.policyTopic == 'NOT_LOGIN') {
						if(data.numericValue1 == null || data.numericValue1 < 1 || data.numericValue1 > 999){
							isValid = false;
						}  
					} 
				});
		    	
		    	$scope.passwordPolicies.forEach(function(data) {
					if (data.policyTopic == 'LOCKED_USER') {
						if(data.numericValue1 == null || data.numericValue1 < 1 || data.numericValue1 > 100){
							isValid = false;
						}  
					} 
					if (data.policyTopic == 'PASS_LENGTH') {
						if(data.numericValue1 == null || data.numericValue1 < 1 || data.numericValue1 > 100){
							isValid = false;
						} 
						else if(data.numericValue2 == null || data.numericValue2 < 1 || data.numericValue2 > 100){
							isValid = false;
						} 
						else if (data.numericValue1 >= data.numericValue2){
							isValid = false;
						}
					} 
					if (data.policyTopic == 'PASS_EXPIRED') {
						if(data.numericValue1 == null || data.numericValue1 < 1 || data.numericValue1 > 999){
							isValid = false;
						}  
					} 
					if (data.policyTopic == 'PASS_HISTORY') {
						if(data.numericValue1 == null || data.numericValue1 < 1 || data.numericValue1 > 999){
							isValid = false;
						}  
					} 
					if (data.policyTopic == 'LOGOUT_USER') {
						if(data.numericValue1 == null || data.numericValue1 < 1 || data.numericValue1 > 999){
							isValid = false;
						}  
					} 
				});
		    	return isValid;
		    }
		    
		    $scope.save = function(){
		    	if (validSave()) {
					UIFactory.showConfirmDialog({
						data : {
						    headerMessage : 'Confirm save?'
						},
						confirm : $scope.confirmSave,
						onSuccess : function(response) {
						    blockUI.stop();
						    _success();
						},
						onFail : function(response) {
							var msg = {
									400: 'Policy is wrong format.',
									409: 'Policy has been modified.',
								};
								blockUI.stop();
								UIFactory.showFailDialog({
									data: {
										headerMessage: 'Edit policy fail.',
										bodyMessage: msg[response.status] ? msg[response.status] : response.statusText
									},
									preCloseCallback: null
								});
							}
						});
				}
		    }
		    $scope.confirmSave = function() { 
				blockUI.start();
				var policyItems = [];
				policyItems = policyItems.concat($scope.userPolicies);
				policyItems = policyItems.concat($scope.passwordPolicies);
				model.policyItems = policyItems;	
    			var url = '/api/v1/policies/common';	
    			var deferred = $q.defer();
    			
    			$http({
    				method : 'POST',
    				url : url,
    				headers : {
    					'If-Match' : model.version,
    					'X-HTTP-Method-Override': 'PUT'
    				},
    				data: model
    			}).then(function(response) {
    				return deferred.resolve(response);
    			}).catch(function(response) {
    				return deferred.reject(response);
    			});
    			return deferred;
    	    }
		    
		    var init = function() {
		    	getPolicies();
		    }();

		} ]);
angular.module('scfApp').directive('restrictTo', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var re = RegExp(attrs.restrictTo);
            var exclude = /Backspace|Enter|Tab|Delete|Del|ArrowUp|Up|ArrowDown|Down|ArrowLeft|Left|ArrowRight|Right/;

            element[0].addEventListener('keydown', function(event) {
                if (!exclude.test(event.key) && !re.test(event.key)) {
                    event.preventDefault();
                }
            });
        }
    }
});