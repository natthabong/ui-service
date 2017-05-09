'use strict';
var scfApp = angular.module('scfApp');
scfApp.controller('SystemIntegrationMonitorController', [ '$scope', 'Service', '$stateParams', '$log', 'PagingController', 'UIFactory', '$q',
	'$rootScope', '$http','PageNavigation','SystemIntegrationMonitorService','ngDialog',
	function($scope, Service, $stateParams, $log, PagingController, UIFactory, $q, $rootScope, $http, PageNavigation, SystemIntegrationMonitorService,ngDialog) {
		var vm = this;
		vm.headerName = '';
		vm.showDetails = true;
		vm.success = false;
		vm.isBank = false;
		var mode = {
			SPONSOR : 'sponsor',
			BANK : 'bank'
		}

		vm.webServiceModel;
		vm.sponsorModel;
		vm.organize = {
			organizeId : null,
			organizeName : null
		};

		var getMyOrganize = function() {
			vm.organize = angular.copy($rootScope.userInfo);
		}

		var currentMode = $stateParams.mode;
		
		var getBankCode = function(){
			return $stateParams.bankCode;
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

		var getWebServiceList = function(){
			if(validateOrganizeForCheck){
				var deffered = SystemIntegrationMonitorService.getWebServiceList(getBankCode());
					deffered.promise.then(function(response) {
						vm.webServiceModel = response.data;
					}).catch(function(response) {

					});
			}else{
				console.log("validate organize fail.")
			}
		}

		// vm.newFormulaDialog = ngDialog.open({
		// 		id : 'new-formula-dialog',
		// 		template : '/js/app/sponsor-configuration/file-layouts/dialog-new-formula.html',
		// 		className : 'ngdialog-theme-default',
		// 		controller : 'NewPaymentDateFormulaController',
		// 		controllerAs : 'ctrl',
		// 		scope : $scope,
		// 		data : {
		// 			formula : vm.formula
		// 		},

		

		vm.systemChecking = function(){
			if(validateOrganizeForCheck){
				var deffered = SystemIntegrationMonitorService.getWebServiceList(getBankCode());
                deffered.promise.then(function(response) {
					vm.webServiceModel = response.data;
                }).catch(function(response) {

                });
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
				getWebServiceList();
				// vm.systemChecking();
			}
		}

		vm.initLoad();

		vm.viewSystemInfo = function(data){
			vm.systemInfo = ngDialog.open({
				id : 'service-information-dialog',
				template : '/js/app/modules/monitor/dialog-service-information.html',
				className : 'ngdialog-theme-default',
				scope : $scope,
				data : {
					serviceInfo : data
				}
			});
		}

		

		
} ]);