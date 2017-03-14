angular.module('scfApp').controller(
	'PolicyController',
	[
		'$scope',
		'Service',
		'$stateParams',
		'$log',
		'SCFCommonService',
		'PagingController',
		'PageNavigation',
		'$state',
		'UIFactory',
		'$http',
		function($scope, Service, $stateParams, $log, SCFCommonService,
			PagingController, PageNavigation, $state, UIFactory,
			$http) {
		    var model = {};
		    $scope.userPolicies = []
		    
		    $scope.passwordPolicies = []

		    var getPolicies = function(criteria) {
			var deffered = Service.doGet('/api/v1/policies/common',
				criteria);
			deffered.promise.then(function(response) {
			    model = response;
			    $scope.userPolicies = [];
			    $scope.passwordPolicies = [];
			    
			    response.data.policyItems.forEach(function(data) {
				
				if (data.policyType == 'USER') {
				    $scope.userPolicies.push(data);
				}
				else if(data.policyType == 'PASSWORD'){
				    $scope.passwordPolicies.push(data);
				}
			    });
			});
		    }
		    
		    $scope.save = function() { 
			model.policyItems = [];
			model.policyItems.concat($scope.userPolicies);
			model.policyItems.concat($scope.passwordPolicies);
			
    			var serviceUrl = '/api/v1/policies/common';
    			var deferred = Service.requestURL(serviceUrl, model, 'PUT');
    			
    			deferred.promise.then(function(response) {
        			PageNavigation.gotoPage('/dashboard' );
    			}).catch(function(response) {
    			    
    			});
    	            }
		    
		    var init = function() {
			getPolicies();
		    }
		    
		    init();
		} ]);