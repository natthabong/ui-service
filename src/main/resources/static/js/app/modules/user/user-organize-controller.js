'use strict';
var userModule = angular.module('gecscf.user');
userModule.controller('UserOrganizeController', [ '$scope', '$http', 'UserService', 'UIFactory', function($scope, $http, UserService, UIFactory) {
    
    var vm = this;
    
    vm.organize = null;
    vm.roles = [];
    
    
    var organizeAutoSuggestServiceUrl = 'api/v1/organizes';
    var searchOrganizeTypeHead = function(value) {
	
	value = UIFactory.createCriteria(value);
	return $http.get(organizeAutoSuggestServiceUrl, {
		    params : {
			q : value,
			isFounder : false,
			offset : 0,
			limit : 5
		    }
		})
		.then(
			function(response) {
			    return response.data
				    .map(function(item) {
					item.identity = [ 'organize-', item.organizeId, '-option' ]
						.join('');
					item.label = [ item.organizeId, ': ', item.organizeName ]
						.join('');
					return item;
				    });
			});
    }
    
    vm.organizeAutoSuggestModel = UIFactory
	    .createAutoSuggestModel({
		placeholder : 'Enter organize name or code',
		itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
		query : searchOrganizeTypeHead
	    });
    
    vm.select = function(data) {};
    
    vm.selectAll = function() {
	if(vm.isSelectedAll){
	    vm.selectedRoles = vm.roles;
	} 
	else{
	    vm.selectedRoles = [];
	}
    }
    
    vm.submit = function(callback){
	vm.organizeLinks = [];
	vm.selectedRoles.forEach((item, index, array) => {
	    vm.organizeLinks.push({
		roleId: item.roleId,
		role: item,
		organize: vm.organize,
		organizeId: vm.organize.organizeId
	    });
	});
	
	callback(vm.organizeLinks);
    }
    
    var init = function(){
	
	 var deferred = UserService.getAllRoles();
	 deferred.promise.then(function(response){
	     vm.roles = response.data;
	 }).catch(function(response){
	     
	 });
	 
    }();
    
   
    
    
} ]);