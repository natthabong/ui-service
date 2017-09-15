'use strict';
var docModule = angular.module('gecscf.document');
docModule.factory('DocumentService', [ '$http', '$q', 'Service','$log','UIFactory',
    function($http, $q, Service,log,UIFactory) {
	
    function prepareAutoSuggestLabel(item,role) {
        console.log(role);
        item.identity = [ role,'-', item.organizeId, '-option' ].join('');
        item.label = [ item.organizeId, ': ', item.organizeName ].join('');
        console.log(item);
        return item;
    }

    function queryAutoSuggest(serviceUrl,value,buyer,supplier,role){
        value = value = UIFactory.createCriteria(value);
        $http.get(serviceUrl, {
            params : {
                q : value,
                buyerId : buyer,
                supplierId : supplier,
                offset : 0,
                limit : 5
            }
        }).then(function(response) {
            console.log(response.data);
            return response.data.map(function(item) {
                item = prepareAutoSuggestLabel(item,role);
                return item;
            });
        }).catch(function(response) {
            log.error("Load auto suggest fail!")
            return null;
        });
    }

	return {
        prepareAutoSuggestLabel : prepareAutoSuggestLabel,
        queryAutoSuggest :queryAutoSuggest 
	}
} ]);