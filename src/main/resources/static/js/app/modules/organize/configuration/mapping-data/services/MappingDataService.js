'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule.factory('MappingDataService', [ '$http', '$q', function($http, $q) {

	
	var create = function(model){
		var uri = 'api/v1/organize-customers/'+model.ownerId+'/accounting-transactions/'+model.accountingTransactionType+'/mapping-datas/'; 
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
            	  deffered.reject(response);
            });
	     
        return deffered;
	}
	
	var remove = function(model){
		var uri = 'api/v1/organize-customers/'+model.ownerId+'/accounting-transactions/'+model.accountingTransactionType+'/mapping-datas/'+model.mappingDataId; 
		var deffered = $q.defer();
		 
		 $http({
	    	    url : uri,
	        	method: 'POST',
				headers : {
					'If-Match' : model.version,
					'X-HTTP-Method-Override': 'DELETE'
				},
	        	data: model
	        })
	        .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
            	  deffered.reject(response);
            });
	     
        return deffered;
	}

	function getMappingData(criteria){
		var deffered = $q.defer();
	
	    $http({
	    	    url :'api/v1/organize-customers/'+criteria.ownerId+'/mapping-data/'+criteria.mappingDataId,
	        	method: 'GET'
	        })
	        .then(function(response) {
	            deffered.resolve(response);
	        })
	        .catch(function(response) {
	        	  deffered.reject(response);
	        });
	    return deffered;
	}

	function deleteMappingData(mappingModel,mappingItem){
		var uri = 'api/v1/organize-customers/'+mappingModel.ownerId+'/accounting-transactions/'+mappingModel.accountingTransactionType+'/mapping-datas/'+mappingItem.mappingDataId+'/items/'+mappingItem.mappingDataItemId;
		var deffered = $q.defer();

		$http({
	    	    url : uri,
	        	method: 'POST',
				headers : {
					'If-Match' : mappingItem.version,
					'X-HTTP-Method-Override': 'DELETE'
				},
	        	data: mappingItem
	        })
	        .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
            	  deffered.reject(response);
            });

		return deffered;
		
	}
	
	function createMappingDataItem(mappingModel, mappingDataItemModel, newMode){
		var serviceUrl = 'api/v1/organize-customers/'+mappingModel.ownerId+'/accounting-transactions/'+mappingModel.accountingTransactionType+'/mapping-datas/'+mappingModel.mappingDataId+'/items'+(newMode?'': '/' + mappingDataItemModel.mappingDataItemId); 
		var deffered = $q.defer();
		 
		var req = {
    		method : newMode?'POST': 'PUT',
    		url : serviceUrl,
    		data: mappingDataItemModel
    	}
    	if(!newMode){
	        req.headers = {
	        	'If-Match' : mappingDataItemModel.version
		   }
    	}

		$http(req).then(function(response) {
            deffered.resolve(response);
        })
        .catch(function(response) {
        	  deffered.reject(response);
        });
	     
        return deffered;
	}
	
	return {
		create: create,
		remove: remove,
		deleteMappingData:deleteMappingData,
		createMappingDataItem: createMappingDataItem,
		getMappingData:getMappingData
	}
} ]);