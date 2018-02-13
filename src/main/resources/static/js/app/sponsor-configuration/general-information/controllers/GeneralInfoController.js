'use strict';
angular.module('gecscf.sponsorConfiguration.generalInfo').controller('GeneralInfoController', [
	'$log',
	'$rootScope',
	'$scope',
	'$stateParams',
	'GeneralInfoService',
	'UIFactory',
	'PagingController',
	'SCFCommonService',
	'$http',
	'$q',
	'scfFactory',
	function ($log, $rootScope, $scope, $stateParams, GeneralInfoService, UIFactory, PagingController, SCFCommonService, $http, $q, scfFactory) {
		var vm = this;

		function loadTableData() {
			console.log("Thailand")
			// var deferred = GeneralInfoService.getGeneralInfo(organizeId);
		}

		// Main of program
		function initPage() {
			loadTableData();
		};
		initPage();
	}
]);