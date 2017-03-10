angular.module('scfApp').controller('PolicyController',['$scope','Service', '$stateParams', '$log', 
	'SCFCommonService','PagingController','PageNavigation', '$state', 'UIFactory', '$http', 
	function($scope,Service, $stateParams, $log, SCFCommonService,PagingController, PageNavigation, $state, UIFactory, $http ){
    
    
    $scope.userPolicies = [{
	policyType:'USER',
	policyTopic:'NOT_LOGIN',
	passwordDisplay: false,
	active: true,
	numericValue1: 180,
	numericValue2: null,
	numericValue3: null
    }]
    $scope.passwordPolicies = []
    
}]);