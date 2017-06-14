'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('SponsorSystemIntegrationMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService, ngDialog) {

        var vm = this; 

        vm.sponsorModel;
        vm.showDetails = false;
        vm.requireSponsor = false;
        var organizeId = null;

        vm.check = function(){
            if(validateOrganizeValue()){
                $scope.organize = vm.sponsorModel;
                $scope.$broadcast('onload');
            }
        }

        var validateOrganizeValue= function(){
			var validate;
            if(typeof vm.sponsorModel != 'object'){
                vm.requireSponsor = true;
                vm.showDetails = false;
                validate = false;
            }else{
                vm.requireSponsor = false;
                vm.showDetails = true;
                validate = true;
            }
			return validate
		}

        // Prepare Auto Suggest
		var querySponsorCode = function(value) {
			value = value = UIFactory.createCriteria(value);
			return $http.get('api/v1/sponsors', {
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

		vm.sponsorAutoSuggestModel = UIFactory.createAutoSuggestModel({
			placeholder : 'Please enter organize name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : querySponsorCode
			});
		
		var prepareAutoSuggestLabel = function(item) {
			item.identity = [ 'sponsor-', item.organizeId, '-option' ].join('');
			item.label = [ item.organizeId, ': ', item.organizeName ].join('');
			return item;
		}
		// Prepare Auto Suggest

        var initial = function(){

        }
        initial();
} ]);