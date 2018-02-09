'use strict';
var userModule = angular.module('gecscf.user');
userModule.controller('UserOrganizeController', [ '$scope', '$http', 'UserService', 'UIFactory', function($scope, $http, UserService, UIFactory) {
    
    var vm = this;
    
    vm.organize = [];
    vm.roles = [];
    
    
    var organizeAutoSuggestServiceUrl = 'api/v1/organizes';
    var searchOrganizeTypeHead = function(value) {
	
	value = UIFactory.createCriteria(value);
	return $http.get(organizeAutoSuggestServiceUrl, {
		    params : {
			q : value,
			offset : 0,
			limit : 5
		    }
		})
		.then(
			function(response) {
			    return response.data
				    .map(function(item) {
					item.identity = [ 'organize-', item.memberId, '-option' ]
						.join('');
					item.label = [ item.memberCode, ': ', item.memberName ]
						.join('');
					return item;
				    });
			});
    }
    
    vm.organizeAutoSuggestModel = UIFactory
	    .createAutoSuggestModel({
		placeholder : 'Enter organization name or code',
		itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
		query : searchOrganizeTypeHead
	    });
    
    vm.select = function(data) {};

	vm.selectedRoles = [];
    vm.selectAll = function() {
		if(vm.isSelectedAll){
			vm.selectedRoles = vm.roles;
		} 
		else{
			vm.selectedRoles = [];
		}
    }
	
	vm.errorOrganize = false;
	vm.errorRole = false;
    vm.submit = function(callback){
		vm.organizeLinks = [];
		if(vm.selectedRoles != [] && vm.selectedRoles.length != 0){
			if(typeof vm.organize === 'object' && vm.organize != [] && vm.organize.length != 0){
				vm.errorOrganize = false;
				vm.errorRole = false;
				for(var i=0; i<vm.selectedRoles.length;i++){
					vm.organizeLinks.push({
						roleId: vm.selectedRoles[i].roleId,
						role: vm.selectedRoles[i],
						organize: vm.organize,
						organizeId: vm.organize.memberId
					});
				}
				callback(vm.organizeLinks);	
			}else{
				vm.errorOrganize = true;
				vm.errorRole = false;
			}
		}else{
			if(typeof vm.organize === 'object' && vm.organize != [] && vm.organize.length != 0){
				vm.errorRole = true;
				vm.errorOrganize = false;
			}
			else{
				vm.errorOrganize = true;
				vm.errorRole = true;
			}
		}
    }
    
    var init = function(){
	
	 var deferred = UserService.getAllRoles();
	 deferred.promise.then(function(response){
	     vm.roles = response.data;
	 }).catch(function(response){
	     
	 });
	 
    }();
    
   
    
    
} ]);