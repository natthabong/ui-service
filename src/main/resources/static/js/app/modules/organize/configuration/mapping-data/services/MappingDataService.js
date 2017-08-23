'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule.factory('MappingDataService', [ '$http', '$q', function($http, $q) {

	var create = function(model){
		var uri = 'api/v1/organize-customers/'+model.ownerId+'/accounting-transactions/'+model.accountingTransactionType+'/mapping-datas'; 
		var deffered = $q.defer();
		 
		 $http({
	    	    url : uri,
	        	method: 'POST',
	        	data: model
	        })
	        .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject('Cannot save mapping');
            });
	     
        return deffered;
	}
	
	return {
		create: create
	}
} ]);