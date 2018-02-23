'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('CustomerSystemIntegrationMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService, ngDialog) {

        var vm = this; 

        vm.customerModel;
        vm.showDetails = false;
        vm.requireCustomer = false;
        var organizeId = null;

        vm.check = function(){
            if(validateOrganizeValue()){
                $scope.organize = vm.customerModel;
                $scope.$broadcast('onload');
            }
        }

        var validateOrganizeValue= function(){
			var validate;
            if(typeof vm.customerModel != 'object'){
                vm.requireCustomer = true;
                vm.showDetails = false;
                validate = false;
            }else{
                vm.requireCustomer = false;
                vm.showDetails = true;
                validate = true;
            }
			return validate
		}

        // Prepare Auto Suggest
		var queryCustomerCode = function(value) {
			value = value = UIFactory.createCriteria(value);
			return $http.get('api/v1/organizes', {
			params : {
				q : value,
				offset : 0,
				limit : 5
			}
			}).then(function(response) {
				return response.data.map(function(item) {
					item = prepareAutoSuggestLabel(item);
					return item;
				});
			});
		};

		vm.customerAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Please enter organization name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : queryCustomerCode
			});
		
		var prepareAutoSuggestLabel = function(item) {
			item.identity = [ 'customer-', item.memberId, '-option' ].join('');
			item.label = [ item.memberCode, ': ', item.memberName ].join('');
			return item;
		}
		// Prepare Auto Suggest

        var initial = function(){

        }
        initial();
} ]);