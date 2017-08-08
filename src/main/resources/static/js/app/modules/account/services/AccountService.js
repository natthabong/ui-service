angular.module('gecscf.account').factory('AccountService', ['$http', '$q', function($http, $q) {
    return {
    	getAccounts: getAccounts
    };	

    function getAccounts(organizeId, offset, limit) {
        var deffered = $q.defer();

        $http.post('api/v1/accounts', {
                params: {
                	offset: offset,
                	limit: limit,
                	organizeId: organizeId
                }
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject('Cannot load page, pageSize ');
            });
        return deffered;
    }
     
}]);
