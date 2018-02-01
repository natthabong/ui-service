'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.service('FileLayoutService', ['$http', '$q', 'Service', function ($http, $q, Service) {

	this.getDocumentFields = function (fileLayoutType, sectionType, dataType) {
		var deffered = $q.defer();

		var uri = 'api/v1/configs/file-layout-types/' + fileLayoutType + '/section-types/' + sectionType + '/document-field';
		$http({
			url: uri,
			method: 'GET',
			params: {
				dataType: dataType
			}

		}).then(function (response) {
			deffered.resolve(response);
		}).catch(function (response) {
			deffered.reject(response);
		});
		return deffered;
	}

	this.getFileLayouts = function (owner, processTypes, integrateTypes) {
		var url = '/api/v1/organize-customers/' + owner + '/process-types/' + processTypes +
			'/integrate-types/' + integrateTypes + '/layouts';
		var serviceDiferred = Service.doGet(url, {
			offset: 0,
			limit: 999
		});
		return serviceDiferred
	}

	this.getFileLayout = function (owner, processTypes, integrateTypes, layoutId) {
		var url = '/api/v1/organize-customers/' + owner + '/process-types/' + processTypes +
			'/integrate-types/' + integrateTypes + '/layouts/' + layoutId;
		var serviceDiferred = Service.doGet(url);
		return serviceDiferred
	}

	this.createFileLayout = function (owner, processTypes, integrateTypes, layoutConfigData) {
		var serviceUrl = 'api/v1/organize-customers/' + owner + '/process-types/' + processTypes + '/integrate-types/' + integrateTypes + '/layouts';
		var deferred = $q.defer();
		$http({
			method : 'POST',
			url : serviceUrl,
			data : layoutConfigData
		  }).then(function(response){
		      return deferred.resolve(response);
		 }).catch(function(response){
		      return deferred.reject(response);
		 });
		 return deferred;
	}

	this.updateFileLayout = function(owner, processTypes, integrateTypes, layoutId, layoutConfigData){
	    
		var serviceUrl = 'api/v1/organize-customers/' + owner +
			 '/process-types/' + processTypes + '/integrate-types/' + integrateTypes + '/layouts/' + layoutId;
		var deferred = $q.defer();
		$http({
			method : 'POST',
			url : serviceUrl,
			data : layoutConfigData,
			headers : {
				'X-HTTP-Method-Override': 'PUT'
			}
		  }).then(function(response){
		      return deferred.resolve(response);
		 }).catch(function(response){
		      return deferred.reject(response);
		 });
		 return deferred;
	}

	this.getSpecificData = function () {

		var deffered = $q.defer();
		var uri = 'js/app/modules/organize/configuration/file-layout/data/specifics_data.json';

		$http({
			url: uri,
			method: 'GET'
		}).then(function (response) {
			deffered.resolve(response);
		}).catch(function (response) {
			deffered.reject(response);
		});

		return deffered;

	}

	this.loadDocumentFieldData = function (sectionType) {
		var deffered = $q.defer();
		var uri = 'api/v1/configs/file-layout-types/IMPORT/section-types/' + sectionType + '/document-field'
		$http({
			url: uri,
			method: 'GET',
			params: {
				isTransient: false
			}
		}).then(function (response) {
			deffered.resolve(response);
		}).catch(function (response) {
			deffered.reject(response);
		});

		return deffered;
	}

	this.validate = function (layout, docFieldList, messageFunc) {

		var documentFieldIdList = [];

		if (layout.processType == 'AR_DOCUMENT') {
			var errors = {
				requireLayoutName : true,
				requireDocDueDate: true,
				requireNetAmount: true,
				documentFieldIdListDupplicate: []
			}
			
			if(layout.displayName != ''){
				errors.requireLayoutName = false;
			}

			layout.items.forEach(function (item) {
				if (item.recordType == 'DETAIL') {
					var docFieldData = docFieldList[item.documentFieldId];
					if (documentFieldIdList.length > 0 && documentFieldIdList.indexOf(item.documentFieldId) > -1) {
						if (errors.documentFieldIdListDupplicate.indexOf(item.documentFieldId) < 0) {
							errors.documentFieldIdListDupplicate.push(item.documentFieldId);
						}
					} else if (item.documentFieldId != null && docFieldData.documentFieldName != null) {
						if (item.documentFieldId == 14) {
							errors.requireNetAmount = false;
						} else if (item.documentFieldId == 9) {
							errors.requireDocDueDate = false;
						}
						documentFieldIdList.push(item.documentFieldId);
					}

					if (item.valueCloningFields != null && item.valueCloningFields.length > 0) {
						item.valueCloningFields.forEach(function (itemClone) {
							if (documentFieldIdList.length > 0 && documentFieldIdList.indexOf(itemClone.documentFieldId) > -1) {
								if (errors.documentFieldIdListDupplicate.indexOf(itemClone.documentFieldId) < 0) {
									errors.documentFieldIdListDupplicate.push(itemClone.documentFieldId);
								}
							} else if (itemClone.documentFieldId != null && docFieldData.documentFieldName != null) {
								if (itemClone.documentFieldId == 14) {
									errors.requireNetAmount = false;
								} else if (itemClone.documentFieldId == 9) {
									errors.requireDocDueDate = false;
								}
								documentFieldIdList.push(itemClone.documentFieldId);
							}
						});
					}
				}
			});

			if (errors.requireLayoutName || errors.requireDocDueDate || errors.requireNetAmount || errors.documentFieldIdListDupplicate.length > 0) {
				messageFunc(errors);
				return false;
			}

		} else if (layout.processType == 'AP_DOCUMENT') {
			var errors = {
				documentFieldIdListDupplicate: []
			}

			layout.items.forEach(function (item) {
				if (item.recordType == 'DETAIL') {
					var docFieldData = docFieldList[item.documentFieldId];
					if (documentFieldIdList.length > 0 && documentFieldIdList.indexOf(item.documentFieldId) > -1) {
						if (errors.documentFieldIdListDupplicate.indexOf(item.documentFieldId) < 0) {
							errors.documentFieldIdListDupplicate.push(item.documentFieldId);
						}
					} else if (item.documentFieldId != null && docFieldData.documentFieldName != null) {

						documentFieldIdList.push(item.documentFieldId);
					}

					if (item.valueCloningFields != null && item.valueCloningFields.length > 0) {
						item.valueCloningFields.forEach(function (itemClone) {
							if (documentFieldIdList.length > 0 && documentFieldIdList.indexOf(itemClone.documentFieldId) > -1) {
								if (errors.documentFieldIdListDupplicate.indexOf(itemClone.documentFieldId) < 0) {
									errors.documentFieldIdListDupplicate.push(itemClone.documentFieldId);
								}
							} else if (itemClone.documentFieldId != null && docFieldData.documentFieldName != null) {

								documentFieldIdList.push(itemClone.documentFieldId);
							}
						});
					}
				}
			});

			if (errors.requirePaymentAmount || errors.documentFieldIdListDupplicate.length > 0) {
				messageFunc(errors);
				return false;
			}
		}

		messageFunc(errors);
		return true;
	}

	this.getFileLayoutItems = function(ownerId,layoutId,section){
		var uri = 'api/v1/organize-customers/' + ownerId + 
                '/process-types/EXPORT_DOCUMENT/integrate-types/EXPORT/layouts/' + layoutId + '/items';
		var deffered = Service.doGet(uri, {
			recordType: section
		});

		return deffered;
	}
	
	this.deleteLayout = function(model, processTypes, integrateTypes){
	  var uri = 'api/v1/organize-customers/' +  model.sponsorId  + 
    '/process-types/'+processTypes+'/integrate-types/'+integrateTypes+'/layouts/' + model.layoutConfigId;
	  
    var deffered = $q.defer();

    $http({
            url: uri,
            method: 'POST',
            headers: {
                'If-Match': model.version,
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
}]);