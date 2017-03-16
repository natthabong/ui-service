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
		function($scope, Service, $stateParams, $log, SCFCommonService,
			blockUI, PageNavigation, $state, UIFactory,
			$http) {
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
				}
				else if(data.policyType == 'PASSWORD'){
				    $scope.passwordPolicies.push(data);
				}
			    });
			});
		    }
		    
		    function _success() {
			UIFactory
				.showSuccessDialog({
				    data : {
					headerMessage : 'Saved policies success.',
					bodyMessage : ''
				    },
				    preCloseCallback : function() {
					PageNavigation
						.gotoPage('/dashboard');
				    }
				});
		    }
		    
		    $scope.save = function(){
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
				    blockUI.stop();
				}
			    });
		    }
		    
		    $scope.confirmSave = function() { 
			blockUI.start();
			var policyItems = [];
			policyItems = policyItems.concat($scope.userPolicies);
			policyItems = policyItems.concat($scope.passwordPolicies);
			model.policyItems = policyItems;
			
    			var serviceUrl = '/api/v1/policies/common';
    			var deferred = Service.requestURL(serviceUrl, model, 'PUT');
    			return deferred;
    	            }
		    
		    var init = function() {
			getPolicies();
		    }();

		} ]);