angular.module('gecscf.account').factory('AccountService', ['$http', '$q', function($http, $q) {
    return {
    	getAccounts: getAccounts,
    	save: save,
    	update: update,
    	deleteAccount: deleteAccount,
    	enquiryCreditLimit: enquiryCreditLimit,
    	enquiryAccountBalance: enquiryAccountBalance
    	
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
        var serviceUrl = '/api/v1/organize-customers/'+account.organizeId+'/accounts/'+account.accountId;
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

    function deleteAccount(account){		
		var serviceUrl = '/api/v1/organize-customers/'+account.organizeId+'/accounts/'+account.accountId;
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
    
    function enquiryCreditLimit(tpAccountModel) {
        var deffered = $q.defer();
        
		$http({
			url: '/api/v1/update-credit-limit-from-bank',
			method: 'POST',
			data: tpAccountModel
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject('Cannot update account credit limit');
		});	
		
		return deffered;
    }
    
    function enquiryAccountBalance(accountModel) {
        var deffered = $q.defer();
  
		$http({
			url: '/api/v1/update-account-balance-from-bank',
			method: 'POST',
			data: accountModel
		}).then(function(response){
			deffered.resolve(response);
		}).catch(function(response){
			deffered.reject('Cannot update account balance');
		});	
		
		return deffered;
    }
   
     
}]);
