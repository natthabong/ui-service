'use strict';
var docModule = angular.module('gecscf.document');
docModule.factory('DocumentService', ['$http', '$q', 'Service', '$log', 'UIFactory',
    function($http, $q, Service, log, UIFactory) {

        function prepareAutoSuggestLabel(item, role) {
            item.identity = [role, '-', item.memberId, '-option'].join('');
            item.label = [item.memberId, ': ', item.memberName].join('');
            return item;
        };
        
        function getProductTypes (ownerId) {
    		var differed = $q.defer();
    		var reqUrl = '/api/v1/organize-customers/' + ownerId + '/product-types';
    		$http({
    			url: reqUrl,
    			method: 'GET',

    		}).then(function (response) {
    			differed.resolve(response);
    		}).catch(function (response) {
    			differed.resolve(response);
    		});
    		return differed;
    	};

        function queryAutoSuggest(serviceUrl, value, buyer, supplier, role) {
            value = value = UIFactory.createCriteria(value);
            $http.get(serviceUrl, {
                params: {
                    q: value,
                    buyerId: buyer,
                    supplierId: supplier,
                    offset: 0,
                    limit: 5
                }
            }).then(function(response) {
                return response.data.map(function(item) {
                    item = prepareAutoSuggestLabel(item, role);
                    return item;
                });
            }).catch(function(response) {
                log.error("Load auto suggest fail!")
                return null;
            });
        };

        return {
            prepareAutoSuggestLabel: prepareAutoSuggestLabel,
            queryAutoSuggest: queryAutoSuggest,
            getProductTypes: getProductTypes
        }
    }
]);