'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.factory('FileLayoutService', [ '$http', '$q', function($http, $q) {
	
	var getDocumentFields = function(fileLayoutType, sectionType, dataType){
		var deffered = $q.defer();
		
		var uri = 'api/v1/configs/file-layout-types/'+fileLayoutType+'/section-types/'+ sectionType + '/document-field';
		$http({
    	    url : uri,
        	method: 'GET',
        	params: {
        		dataType: dataType
	    	}
        		
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

	var loadDataMappingToDropDown = function(sectionType){
		var deffered = $q.defer();
		var uri = 'api/v1/configs/file-layout-types/IMPORT/section-types/'+sectionType+'/document-field'
		$http({
    	    url : uri,
        	method: 'GET',
			params:{
				isTransient : false
			}
	    }).then(function(response) {
	    	deffered.resolve(response);
		}).catch(function(response) {
			deffered.reject(response);
		});
		
		return deffered;
	}
	
	var validate = function(layout, docFieldList, messageFunc){
		
		var documentFieldIdList = [];
		
		console.log(layout);
		console.log(docFieldList);
		
		if(layout.processType=='AR_DOCUMENT'){
			var errors = { 
					requireDocDueDate : true,
					requireNetAmount : true,
					documentFieldIdListDupplicate : []
			}	
			
			layout.items.forEach(function(item) {
				var docFieldData = docFieldList[item.documentFieldId];
				if(documentFieldIdList.length > 0 && documentFieldIdList.indexOf(item.documentFieldId)>-1){
					if(errors.documentFieldIdListDupplicate.indexOf(item.documentFieldId) < 0){
						errors.documentFieldIdListDupplicate.push(item.documentFieldId);
					}						
				}else if(item.documentFieldId != null && docFieldData.documentFieldName!=null){
					if(item.documentFieldId == 14){
						errors.requireNetAmount = false;
					}else if(item.documentFieldId == 9){
						errors.requireDocDueDate = false;
					}
					documentFieldIdList.push(item.documentFieldId);
				}
				
				if(item.valueCloningFields!=null && item.valueCloningFields.length>0){
					item.valueCloningFields.forEach(function(itemClone) {
						if(documentFieldIdList.length > 0 && documentFieldIdList.indexOf(itemClone.documentFieldId)>-1){
							if(errors.documentFieldIdListDupplicate.indexOf(itemClone.documentFieldId) < 0){
								errors.documentFieldIdListDupplicate.push(itemClone.documentFieldId);
							}
						}else if(itemClone.documentFieldId != null && docFieldData.documentFieldName!=null){
							if(itemClone.documentFieldId == 14){
								errors.requireNetAmount = false;
							}else if(itemClone.documentFieldId == 9){
								errors.requireDocDueDate = false;
							}
							documentFieldIdList.push(itemClone.documentFieldId);
						}								
					});		
				}				
			});
			
			if(errors.requireDocDueDate || errors.requireNetAmount || errors.documentFieldIdListDupplicate.length > 0){
				messageFunc(errors);
				return false;
			}
			
		}else if(layout.processType=='AP_DOCUMENT'){
			var errors = { 
//				requirePaymentAmount : true,
				documentFieldIdListDupplicate : []
			}
			
			layout.items.forEach(function(item) {
				var docFieldData = docFieldList[item.documentFieldId];
				if(documentFieldIdList.length > 0 && documentFieldIdList.indexOf(item.documentFieldId)>-1){
					if(errors.documentFieldIdListDupplicate.indexOf(item.documentFieldId) < 0){
						errors.documentFieldIdListDupplicate.push(item.documentFieldId);
					}
				}else if(item.documentFieldId != null && docFieldData.documentFieldName!=null){
//					if(item.documentFieldId == 18){
//						errors.requirePaymentAmount = false;
//					}
					documentFieldIdList.push(item.documentFieldId);
				}
				
				if(item.valueCloningFields!=null && item.valueCloningFields.length>0){
					item.valueCloningFields.forEach(function(itemClone) {
						if(documentFieldIdList.length > 0 && documentFieldIdList.indexOf(itemClone.documentFieldId)>-1){							
							if(errors.documentFieldIdListDupplicate.indexOf(itemClone.documentFieldId) < 0){
								errors.documentFieldIdListDupplicate.push(itemClone.documentFieldId);
							}
						}else if(itemClone.documentFieldId != null && docFieldData.documentFieldName!=null){
//							if(itemClone.documentFieldId == 18){
//								errors.requirePaymentAmount = false;
//							}
							documentFieldIdList.push(itemClone.documentFieldId);
						}								
					});		
				}
			});		
			
			if(errors.requirePaymentAmount || errors.documentFieldIdListDupplicate.length > 0){
				messageFunc(errors);
				return false;
			}
		}
		
		messageFunc(errors);
		return true;
	}
	return {
		loadDataMappingToDropDown:loadDataMappingToDropDown,
		getDocumentFields: getDocumentFields,
		getSpecificData: getSpecificData,
		validate: validate
	}
} ]);