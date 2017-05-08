'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('SystemIntegrationMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService',
	function($scope, Service, $stateParams, $log, PagingController, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService) {
		var vm = this;
		vm.headerName = '';
		vm.showDetails = true;
		vm.isBank = false;
		var mode = {
			SPONSOR : 'sponsor',
			BANK : 'bank'
		}

		vm.sponsorModel;
		vm.organize = {
			organizeId : null,
			organizeName : null
		};

		var getMyOrganize = function() {
			vm.organize = angular.copy($rootScope.userInfo);
		}

		var currentMode = $stateParams.mode;

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
			placeholder : 'Enter organize name or code',
			itemTemplateUrl : 'ui/template/autoSuggestTemplate.html',
			query : querySponsorCode
			});
		
		var prepareAutoSuggestLabel = function(item) {
			item.identity = [ 'sponsor-', item.organizeId, '-option' ].join('');
			item.label = [ item.organizeId, ': ', item.organizeName ].join('');
			return item;
		}
		// Prepare Auto Suggest

		var validateOrganizeForCheck = function(){
			var validate = true;
			if(currentMode == mode.SPONSOR){
				if(typeof vm.sponsorModel !== 'object'){
					validate = false;
				}else{
					vm.organize = vm.sponsorModel;
				}
			}else{
				if(vm.organize == null || vm.organize == undefined || vm.organize == ''){
					validate = false;
				}
			}
			return validate
		}

		vm.systemChecking = function(){
			if(validateOrganizeForCheck()){
				console.log("send");
			}
		}

		vm.initLoad = function() {
			if (currentMode == mode.SPONSOR) {
				vm.headerName = 'Sponsor system integration monitor';
				vm.isBank = false;
			}else if(currentMode == mode.BANK){
				vm.headerName = 'Bank system integration monitor';
				vm.isBank = true;
				getMyOrganize();
				vm.systemChecking();
			}
		}

		vm.initLoad();
} ]);