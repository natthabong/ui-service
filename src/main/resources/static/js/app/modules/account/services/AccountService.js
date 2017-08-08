angular.module('gecscf.account').factory('AccountService', ['$http', '$q', function($http, $q) {
    return {
    	getAccounts: getAccounts,
    	save: save
    };	
    function save(account){
        var serviceUrl = '/api/v1/organize-customers/'+account.organizeId+'/accounts';
        var deferred = $q.defer();
        $http({
            method : 'POST',
            url : serviceUrl,
            data: account
        }).then(function(response) {
            return deferred.resolve(response);
        }).catch(function(response) {
            return deferred.reject(response);
        });
        return deferred;
    
    }

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
