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
			
		} ]);