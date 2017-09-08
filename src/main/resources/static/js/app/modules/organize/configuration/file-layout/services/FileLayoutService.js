'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.factory('FileLayoutService', [ '$http', '$q', function($http, $q) {
	
	var getDocumentFields = function(fileLayoutType, sectionType){
		var deffered = $q.defer();
		
		var uri = 'api/v1/configs/file-layout-types/'+fileLayoutType+'/section-types/'+ sectionType + '/document-field';
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

//	var getDataTypes = function(dataType){
//		var deffered = $q.defer();
//		
//		var uri = 'api/v1/configs/gecscf/layouts/document-field';
//		$http({
//    	    url : uri,
//        	method: 'GET',
//        	params: {
//        		fileLayoutType: 'IMPORT',
//        		sectionType : 'DETAIL'
//        	}
//	    }).then(function(response) {
//            deffered.resolve(response);
//        }).catch(function(response) {
//           deffered.reject(response);
//        });
//        return deffered;
//	}
//	
//	var getDisplayDataTypes = function(dataType){
//		var deffered = $q.defer();
//		
//		var uri = 'api/v1/configs/gecscf/layouts/file/data-types';
//		$http({
//    	    url : uri,
//        	method: 'GET',
//        	params: {
//        		dataType : dataType,
//        		isTransient : 'false'
//        	}
//	    }).then(function(response) {
//            deffered.resolve(response);
//        }).catch(function(response) {
//           deffered.reject(response);
//        });
//        return deffered;
//	}
//	
//	var getValidationDataTypes = function(){
//		var deffered = $q.defer();
//		
//		var uri = 'api/v1/configs/gecscf/layouts/document-field';
//		$http({
//    	    url : uri,
//        	method: 'GET',
//        	params: {
//        		fileLayoutType: 'IMPORT',
//        		sectionType : 'HEADER'
//        	}
//	    }).then(function(response) {
//            deffered.resolve(response);
//        }).catch(function(response) {
//           deffered.reject(response);
//        });
//        return deffered;
//	}
	
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
				isTransient : false,
        		isDisplayField : 'false'
			}
	    }).then(function(response) {
	    	deffered.resolve(response);
		}).catch(function(response) {
			deffered.reject(response);
		});
		
		return deffered;
	}
	
	var validate = function(layout, dataTypeByIds, failFunc){
		
		var layoutFileDataTypeId = [];
		
		/*if(layout.processType=='AR_DOCUMENT'){
			var errors = { 
					requireDocDueDate : true,
					requireNetAmount : true,
					layoutFileDataTypeIdDupplicate : []
			}
			layout.items.forEach(function(item) {
				var dataType = dataTypeByIds[item.layoutFileDataTypeId];
				if(layoutFileDataTypeId.length > 0 && layoutFileDataTypeId.indexOf(item.layoutFileDataTypeId)>-1){
					if(errors.layoutFileDataTypeIdDupplicate.indexOf(item.layoutFileDataTypeId) < 0){
						errors.layoutFileDataTypeIdDupplicate.push(item.layoutFileDataTypeId);
					}						
				}else if(item.layoutFileDataTypeId != null && !dataType.transient){
					if(item.layoutFileDataTypeId == 13){
						errors.requireNetAmount = false;
					}else if(item.layoutFileDataTypeId == 8){
						errors.requireDocDueDate = false;
					}
					layoutFileDataTypeId.push(item.layoutFileDataTypeId);
				}
				
				if(item.valueCloningFields!=null && item.valueCloningFields.length>0){
					item.valueCloningFields.forEach(function(itemClone) {
						if(layoutFileDataTypeId.length > 0 && layoutFileDataTypeId.indexOf(itemClone.layoutFileDataTypeId)>-1){
							if(errors.layoutFileDataTypeIdDupplicate.indexOf(itemClone.layoutFileDataTypeId) < 0){
								errors.layoutFileDataTypeIdDupplicate.push(itemClone.layoutFileDataTypeId);
							}
						}else if(itemClone.layoutFileDataTypeId != null && !dataType.transient){
							if(itemClone.layoutFileDataTypeId == 13){
								errors.requireNetAmount = false;
							}else if(itemClone.layoutFileDataTypeId == 8){
								errors.requireDocDueDate = false;
							}
							layoutFileDataTypeId.push(itemClone.layoutFileDataTypeId);
						}								
					});		
				}
					
			});
						
			if(errors.requireDocDueDate || errors.requireNetAmount || errors.layoutFileDataTypeIdDupplicate.length > 0){
				failFunc(errors);
				return false;
			}
			
		}else if(layout.processType=='AP_DOCUMENT'){
			var errors = { 
					requirePaymentAmount : true,
					layoutFileDataTypeIdDupplicate : []
			}			
			layout.items.forEach(function(item) {
				var dataType = dataTypeByIds[item.layoutFileDataTypeId];
				if(layoutFileDataTypeId.length > 0 && layoutFileDataTypeId.indexOf(item.layoutFileDataTypeId)>-1){
					if(errors.layoutFileDataTypeIdDupplicate.indexOf(item.layoutFileDataTypeId) < 0){
						errors.layoutFileDataTypeIdDupplicate.push(item.layoutFileDataTypeId);
					}
				}else if(item.layoutFileDataTypeId != null && !dataType.transient){
					if(item.layoutFileDataTypeId == 17){
						errors.requirePaymentAmount = false;
					}
					layoutFileDataTypeId.push(item.layoutFileDataTypeId);
				}
				
				if(item.valueCloningFields!=null && item.valueCloningFields.length>0){
					item.valueCloningFields.forEach(function(itemClone) {
						if(layoutFileDataTypeId.length > 0 && layoutFileDataTypeId.indexOf(itemClone.layoutFileDataTypeId)>-1){							
							if(errors.layoutFileDataTypeIdDupplicate.indexOf(itemClone.layoutFileDataTypeId) < 0){
								errors.layoutFileDataTypeIdDupplicate.push(itemClone.layoutFileDataTypeId);
							}
						}else if(itemClone.layoutFileDataTypeId != null && !dataType.transient){
							if(itemClone.layoutFileDataTypeId == 17){
								errors.requirePaymentAmount = false;
							}
							layoutFileDataTypeId.push(itemClone.layoutFileDataTypeId);
						}								
					});		
				}
			});			
			
			if(errors.requirePaymentAmount || errors.layoutFileDataTypeIdDupplicate.length > 0){
				failFunc(errors);
				return false;
			}			
		}*/
		
		return true;
	}
	return {
		loadDataMappingTo:loadDataMappingTo,
		getDocumentFields: getDocumentFields,
		getSpecificData: getSpecificData,
		validate: validate
	}
} ]);