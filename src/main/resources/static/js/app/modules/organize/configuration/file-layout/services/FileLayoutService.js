'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.factory('FileLayoutService', [ '$http', '$q', function($http, $q) {

	var getDataTypes = function(dataType){
		var deffered = $q.defer();
		
		var uri = 'api/v1/configs/gecscf/layouts/file/data-types';
		$http({
    	    url : uri,
        	method: 'GET',
        	params: {
        		dataType: dataType,
        		isDisplayField : 'false'
        	}
	    }).then(function(response) {
            deffered.resolve(response);
        }).catch(function(response) {
           deffered.reject(response);
        });
        return deffered;
	}
	
	var getDisplayDataTypes = function(dataType){
		var deffered = $q.defer();
		
		var uri = 'api/v1/configs/gecscf/layouts/file/data-types';
		$http({
    	    url : uri,
        	method: 'GET',
        	params: {
        		dataType : dataType,
        		isTransient : 'false'
        	}
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
	
	var validate = function(layout, failFunc){
		
		var errors = [];
		
		if(layout.processType=='AR_DOCUMENT'){
			
			
		}else if(layout.processType=='AP_DOCUMENT'){
			
		}
		failFunc(errors);
//		if(vm.processType=='AR_DOCUMENT'){
//			
//			vm.requireDocDueDate = true;
//			vm.requireNetAmount = true;
//			var layoutFileDataTypeId = [];
//			vm.layoutFileDataTypeIdDupplicate = [];
//			vm.items.forEach(function(item) {
//				var dataType = vm.dataTypeByIds[item.layoutFileDataTypeId];
//				if(layoutFileDataTypeId.length > 0 && layoutFileDataTypeId.indexOf(item.layoutFileDataTypeId)>-1){
//					if(vm.layoutFileDataTypeIdDupplicate.indexOf(item.layoutFileDataTypeId) < 0){
//						vm.layoutFileDataTypeIdDupplicate.push(item.layoutFileDataTypeId);
//					}						
//				}else if(item.layoutFileDataTypeId != null && !dataType.transient){
//					if(item.layoutFileDataTypeId == 13){
//						vm.requireNetAmount = false;
//					}else if(item.layoutFileDataTypeId == 8){
//						vm.requireDocDueDate = false;
//					}
//					layoutFileDataTypeId.push(item.layoutFileDataTypeId);
//				}
//				
//				if(item.valueCloningFields!=null && item.valueCloningFields.length>0){
//					item.valueCloningFields.forEach(function(itemClone) {
//						if(layoutFileDataTypeId.length > 0 && layoutFileDataTypeId.indexOf(itemClone.layoutFileDataTypeId)>-1){
//							if(vm.layoutFileDataTypeIdDupplicate.indexOf(itemClone.layoutFileDataTypeId) < 0){
//								vm.layoutFileDataTypeIdDupplicate.push(itemClone.layoutFileDataTypeId);
//							}
//						}else if(item.layoutFileDataTypeId != null && !dataType.transient){
//							if(item.layoutFileDataTypeId == 13){
//								vm.requireNetAmount = false;
//							}else if(item.layoutFileDataTypeId == 8){
//								vm.requireDocDueDate = false;
//							}
//							layoutFileDataTypeId.push(itemClone.layoutFileDataTypeId);
//						}								
//					});		
//				}
//			});			
//			
//			vm.dataDetailItems.forEach(function(item) {
//				var dataType = vm.dataTypeByIds[item.layoutFileDataTypeId];
//				if(layoutFileDataTypeId.length > 0 && layoutFileDataTypeId.indexOf(item.layoutFileDataTypeId)>-1){
//					if(vm.layoutFileDataTypeIdDupplicate.indexOf(item.layoutFileDataTypeId) < 0){
//						vm.layoutFileDataTypeIdDupplicate.push(item.layoutFileDataTypeId);
//					}
//				}else if(item.layoutFileDataTypeId != null && !dataType.transient){
//					if(item.layoutFileDataTypeId == 13){
//						vm.requireNetAmount = false;
//					}else if(item.layoutFileDataTypeId == 8){
//						vm.requireDocDueDate = false;
//					}
//					layoutFileDataTypeId.push(item.layoutFileDataTypeId);
//				}
//			});		
//			
//			if(vm.requireDocDueDate || vm.requireNetAmount || vm.layoutFileDataTypeIdDupplicate.length > 0){
//				return false;
//			}
//			
//		}else if(vm.processType=='AP_DOCUMENT'){
//
//			vm.requirePaymentAmount = true;
//			var layoutFileDataTypeId = [];
//			vm.layoutFileDataTypeIdDupplicate = [];
//
//			vm.items.forEach(function(item) {
//				var dataType = vm.dataTypeByIds[item.layoutFileDataTypeId];
//				console.log(dataType);
//				if(layoutFileDataTypeId.length > 0 && layoutFileDataTypeId.indexOf(item.layoutFileDataTypeId)>-1){
//					if(vm.layoutFileDataTypeIdDupplicate.indexOf(item.layoutFileDataTypeId) < 0){
//						vm.layoutFileDataTypeIdDupplicate.push(item.layoutFileDataTypeId);
//					}
//				}else if(item.layoutFileDataTypeId != null && !dataType.transient){
//					if(item.layoutFileDataTypeId == 17){
//						vm.requirePaymentAmount = false;
//					}
//					layoutFileDataTypeId.push(item.layoutFileDataTypeId);
//				}
//				
//				if(item.valueCloningFields!=null && item.valueCloningFields.length>0){
//					item.valueCloningFields.forEach(function(itemClone) {
//						if(layoutFileDataTypeId.length > 0 && layoutFileDataTypeId.indexOf(itemClone.layoutFileDataTypeId)>-1){
//							if(vm.layoutFileDataTypeIdDupplicate.indexOf(itemClone.layoutFileDataTypeId) < 0){
//								vm.layoutFileDataTypeIdDupplicate.push(itemClone.layoutFileDataTypeId);
//							}
//						}else if(item.layoutFileDataTypeId != null && !dataType.transient){
//							if(item.layoutFileDataTypeId == 17){
//								vm.requirePaymentAmount = false;
//							}
//							layoutFileDataTypeId.push(itemClone.layoutFileDataTypeId);
//						}								
//					});		
//				}
//			});			
//			
//			vm.dataDetailItems.forEach(function(item) {
//				var dataType = vm.dataTypeByIds[item.layoutFileDataTypeId];
//				if(layoutFileDataTypeId.length > 0 && layoutFileDataTypeId.indexOf(item.layoutFileDataTypeId)>-1){
//					if(vm.layoutFileDataTypeIdDupplicate.indexOf(item.layoutFileDataTypeId) < 0){
//						vm.layoutFileDataTypeIdDupplicate.push(item.layoutFileDataTypeId);
//					}
//				}else if(item.layoutFileDataTypeId != null && !dataType.transient){
//					if(item.layoutFileDataTypeId == 17){
//						vm.requirePaymentAmount = false;
//					}
//					layoutFileDataTypeId.push(item.layoutFileDataTypeId);
//				}
//			});	
//			
//			if(vm.requirePaymentAmount || vm.layoutFileDataTypeIdDupplicate.length > 0){
//				return false;
//			}
//		}

		
		return true;
	}
	return {
		getDataTypes: getDataTypes,
		getDisplayDataTypes: getDisplayDataTypes,
		getValidationDataTypes: getValidationDataTypes,
		loadDataMappingTo:loadDataMappingTo,
		getSpecificData: getSpecificData,
		validate: validate
	}
} ]);