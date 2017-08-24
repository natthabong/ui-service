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
                deffered.reject('Cannot save mapping');
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
                deffered.reject('Cannot delete mapping');
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
	            deffered.reject('Cannot load mapping data');
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
                deffered.reject('Cannot delete mapping');
            });

		return deffered;
		
	}
	
	function createMappingDataItem(mappingModel, mappingDataItemModel, editMode){
		var uri = 'api/v1/organize-customers/'+mappingModel.ownerId+'/accounting-transactions/'+mappingModel.accountingTransactionType+'/mapping-datas/'+mappingModel.mappingDataId+'/items'; 
		var deffered = $q.defer();
		 
		 $http({
	    	    url : uri,
	        	method: 'POST',
	        	data: mappingDataItemModel
	        })
	        .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject('Cannot save mapping data item');
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