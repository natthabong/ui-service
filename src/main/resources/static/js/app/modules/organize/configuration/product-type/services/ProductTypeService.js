'use strict';
angular.module('gecscf.organize.configuration.productType').service(
		'ProductTypeService',  [ '$q', '$http', function($q, $http) {

			this.createProductType = function(data){
			    var deferred = $q.defer();
	     		$http({
	     			method : 'POST',
	     			url : '/api/v1/organize-customers/'+data.organizeId+'/product-types',
	     			data: data
	     		}).then(function(response) {
	     			return deferred.resolve(response);
	     		}).catch(function(response) {
	     			return deferred.reject(response);
	     		});
	     		return deferred;
			}
			
			this.updateProductType = function(data){
				   var url = '/api/v1/organize-customers/' + data.organizeId +'/product-types/' + data.productType
				   var req = {
			            method: 'POST',
			            url: url,
			            data: data,
			            headers: {
			                'If-Match': data.version,
			                'X-HTTP-Method-Override': 'PUT'
			            }
			        }
				    var deffered = $q.defer();
			        $http(req).then(function(response) {
			        	deffered.resolve(response);
		            })
		            .catch(function(response) {
		            	deffered.reject(response);
		            });
			        return deffered;
				}
			
			this.getProductType = function(organizeId, productType){
			    var deferred = $q.defer();
	     		$http({
	     			method : 'GET',
	     			url : '/api/v1/organize-customers/' + organizeId +'/product-types/' + productType
	     		}).then(function(response) {
	     			return deferred.resolve(response);
	     		}).catch(function(response) {
	     			return deferred.reject(response);
	     		});
	     		return deferred;
			}
			
			this.getProductTypes = function(organizeId, criteria){
			    var deferred = $q.defer();
	     		$http({
	     			method : 'GET',
	     			url : '/api/v1/organize-customers/' + organizeId +'/product-types',
	     			params: criteria
	     		}).then(function(response) {
	     			return deferred.resolve(response);
	     		}).catch(function(response) {
	     			return deferred.reject(response);
	     		});
	     		return deferred;
			}
			
			this.removeProductType = function(data){
				   var url = '/api/v1/organize-customers/' + data.organizeId +'/product-types/' + data.productType
				   var req = {
			            method: 'POST',
			            url: url,
			            data: data,
			            headers: {
			                'If-Match': data.version,
			                'X-HTTP-Method-Override': 'DELETE'
			            }
			        }
				    var deffered = $q.defer();
			        $http(req).then(function(response) {
			        	deffered.resolve(response);
		            })
		            .catch(function(response) {
		            	deffered.reject(response);
		            });
			        return deffered;
				}
			
		} ]);