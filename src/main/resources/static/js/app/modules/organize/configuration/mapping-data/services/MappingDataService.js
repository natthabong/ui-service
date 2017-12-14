'use strict';
var tpModule = angular.module('gecscf.organize.configuration');
tpModule.factory('MappingDataService', ['$http', '$q', function($http, $q) {


    var create = function(model) {
        var uri = 'api/v1/organize-customers/' + model.ownerId + '/accounting-transactions/' + model.accountingTransactionType + '/mapping-datas/';
        var deffered = $q.defer();

        $http({
                url: uri,
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

    var remove = function(model) {
        var uri = 'api/v1/organize-customers/' + model.ownerId + '/accounting-transactions/' + model.accountingTransactionType + '/mapping-datas/' + model.mappingDataId;
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

    function getMappingData(criteria) {
        var deffered = $q.defer();

        $http({
                url: 'api/v1/organize-customers/' + criteria.ownerId + '/mapping-data/' + criteria.mappingDataId,
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

    function deleteMappingData(mappingModel, mappingItem) {
        var uri = 'api/v1/organize-customers/' + mappingModel.ownerId + '/accounting-transactions/' + mappingModel.accountingTransactionType + '/mapping-datas/' + mappingItem.mappingDataId + '/items/' + mappingItem.mappingDataItemId;
        var deffered = $q.defer();

        $http({
                url: uri,
                method: 'POST',
                headers: {
                    'If-Match': mappingItem.version,
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

    function createMappingDataItem(mappingModel, mappingDataItemModel, newMode) {
        var serviceUrl = 'api/v1/organize-customers/' + mappingModel.ownerId + '/accounting-transactions/' + mappingModel.accountingTransactionType + '/mapping-datas/' + mappingModel.mappingDataId + '/items' + (newMode ? '' : '/' + mappingDataItemModel.mappingDataItemId);
        var deffered = $q.defer();

        var req = {
            method: 'POST',
            url: serviceUrl,
            data: mappingDataItemModel
        }
        if (!newMode) {
            req.headers = {
                'If-Match': mappingDataItemModel.version,
                'X-HTTP-Method-Override': 'PUT'
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

    function setDefaultCode(model, dataItem) {
        var serviceUrl = 'api/v1/organize-customers/' + model.ownerId + '/accounting-transactions/' + model.accountingTransactionType + '/mapping-datas/' + model.mappingDataId + '/items/' + dataItem.mappingDataItemId + '/set-default';
        var deffered = $q.defer();

        $http({
                url: serviceUrl,
                method: 'POST',
                headers: {
                    'If-Match': dataItem.version,
                    'X-HTTP-Method-Override': 'PUT'
                },
                data: dataItem
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });

        return deffered;
    }

    function loadMappingData(owner, accountingTransactionType, mappingTypeList) {
        var serviceUrl = 'api/v1/organize-customers/' + owner + '/accounting-transactions/' + accountingTransactionType + '/mapping-datas';
        var deffered = $q.defer();
        $http({
                url: serviceUrl,
                method: 'GET',
                params: {
                    mappingType: mappingTypeList
                }
            })
            .then(function(response) {
                deffered.resolve(response);
            })
            .catch(function(response) {
                deffered.reject(response);
            });
        return deffered;
    }

    function loadMappingDataItems(ownerId, accountingTransactionType, mappingDataId, params) {
        var serviceUrl = 'api/v1/organize-customers/' + ownerId + '/accounting-transactions/' + accountingTransactionType + '/mapping-datas/' + mappingDataId + '/items';
        var deffered = $q.defer();
        $http({
                url: serviceUrl,
                method: 'GET',
                params: {
                    offset: params.offset,
                    limit: params.limit,
                    sort: params.sort
                }
            })
            .then(function(response) {
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
        deleteMappingData: deleteMappingData,
        createMappingDataItem: createMappingDataItem,
        getMappingData: getMappingData,
        loadMappingData: loadMappingData,
        setDefaultCode: setDefaultCode,
        loadMappingDataItems: loadMappingDataItems
    }
}]);