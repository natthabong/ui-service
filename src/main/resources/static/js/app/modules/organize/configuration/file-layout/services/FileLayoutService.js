'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.factory('FileLayoutService', [ '$http', '$q', function($http, $q) {

	var getDataTypes = function(){
		var deffered = $q.defer();
		
		var uri = 'api/v1/configs/gecscf/layouts/file/data-types';
		$http({
    	    url : uri,
        	method: 'GET'
	    }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
           deffered.reject(response);
        });
        return deffered;
	}
	
	var getValidationDataTypes = function(){
		var deffered = $q.defer();
		
		var uri = 'api/v1/configs/gecscf/layouts/file/data-types';
		$http({
    	    url : uri,
        	method: 'GET',
        	params: {
                isTransient : 'true'
        	}
	    }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
           deffered.reject(response);
        });
        return deffered;
	}
	
	var getSpecificData = function(){

		var deffered = $q.defer();
		var uri = 'js/app/sponsor-configuration/file-layouts/specifics_data.json';
		
		$http({
    	    url : uri,
        	method: 'GET'
	    }).then(function(response) {
	    	deffered.resolve(response);
		}).catch(function(response) {
			deffered.reject(response);
		});
		
		return deffered;
	
	}

	var loadDataMappingTo = function(){
		var deffered = $q.defer();
		var uri = 'api/v1/configs/gecscf/layouts/file/data-types'
		$http({
    	    url : uri,
        	method: 'GET',
			params:{
				dataType : "TEXT",
				isTransient : false
			}
	    }).then(function(response) {
	    	deffered.resolve(response);
		}).catch(function(response) {
			deffered.reject(response);
		});
		
		return deffered;
	}
	return {
		getDataTypes: getDataTypes,
		getValidationDataTypes: getValidationDataTypes,
		loadDataMappingTo:loadDataMappingTo,
		getSpecificData: getSpecificData
	}
} ]);