angular.module('scfApp').factory('BankHolidayService', ['$http', '$q', function($http, $q) {
    return {
    	save: save,
    	update: update,
    	deleteHoliday: deleteHoliday
    };	
    
    function save(holiday){
        var serviceUrl = '/api/v1/holidays';
        var deferred = $q.defer();
        $http({
            method : 'POST',
            url : serviceUrl,
            data: holiday
        }).then(function(response) {
            return deferred.resolve(response);
        }).catch(function(response) {
            return deferred.reject(response);
        });
        return deferred;
    
    }
    
     function update(holiday){
        var serviceUrl = '/api/v1/holidays/'+holiday.holidayDate;
		var deferred = $q.defer();
		$http({
			method : 'POST',
			url : serviceUrl,
			headers : {
				'If-Match' : null,
				'X-HTTP-Method-Override': 'PUT'
			},
			data: holiday
        }).then(function(response) {
            return deferred.resolve(response);
        }).catch(function(response) {
            return deferred.reject(response);
        });
        return deferred;
    
    }

    function deleteHoliday(holiday){		
		var serviceUrl = '/api/v1/holidays/'+holiday.holidayDate;
		var deferred = $q.defer();
		$http({
			method : 'POST',
			url : serviceUrl,
			headers : {
				'If-Match' : null,
				'X-HTTP-Method-Override': 'DELETE'
			},
			data: holiday
		}).then(function(response) {
			return deferred.resolve(response);
		}).catch(function(response) {
			return deferred.reject(response);
		});
		return deferred;
	}
}]);
