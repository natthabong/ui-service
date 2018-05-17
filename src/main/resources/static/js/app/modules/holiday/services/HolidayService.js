angular.module('scfApp').factory('BankHolidayService', ['$http', '$q', function($http, $q) {
    return {
    	save: save,
    	update: update,
    	deleteHoliday: deleteHoliday
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
    
     function update(account){
        var serviceUrl = '/api/v1/organize-customers/accounts/'+account.accountId;
		var deferred = $q.defer();
		$http({
			method : 'POST',
			url : serviceUrl,
			headers : {
				'If-Match' : account.version,
				'X-HTTP-Method-Override': 'PUT'
			},
			data: account
        }).then(function(response) {
            return deferred.resolve(response);
        }).catch(function(response) {
            return deferred.reject(response);
        });
        return deferred;
    
    }

    function deleteHoliday(account){		
		var serviceUrl = '/api/v1/organize-customers/accounts/'+account.accountId;
		var deferred = $q.defer();
		$http({
			method : 'POST',
			url : serviceUrl,
			headers : {
				'If-Match' : account.version,
				'X-HTTP-Method-Override': 'DELETE'
			},
			data: account
		}).then(function(response) {
			return deferred.resolve(response);
		}).catch(function(response) {
			return deferred.reject(response);
		});
		return deferred;
	}
}]);
