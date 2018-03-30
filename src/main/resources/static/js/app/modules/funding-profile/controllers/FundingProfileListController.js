'use strict';
var fpModule = angular.module('gecscf.fundingProfile');
fpModule.controller('FundingProfileListController',['$scope','$stateParams','UIFactory','PageNavigation'
	,'PagingController','FundingProfileService','$timeout','$cookieStore','SCFCommonService','$state',
	function($scope, $stateParams, UIFactory,PageNavigation, PagingController,FundingProfileService, 
	$timeout,$cookieStore,SCFCommonService,$state) {
	var vm = this;
	vm.canManage = false;
	
	vm.criteria = $stateParams.criteria || { };
	
	// The pagingController is a tool for navigate the
	// page of a table.
	vm.pagingController = PagingController.create('/api/v1/fundings', vm.criteria,'GET');
	
	// All functions of a controller.
	vm.search = function(pageModel) {
		vm.pagingController.search(pageModel || ( $stateParams.backAction? {
			offset : vm.criteria.offset,
			limit : vm.criteria.limit
		}: undefined));
		$stateParams.backAction = false;
	}
	
	// New Button Action
	vm.createNew = function() {
        UIFactory
        .showDialog({
          templateUrl: '/js/app/modules/funding-profile/templates/dialog-funding-profile.html',
          controller: 'FundingProfilePopupController',
          data: {
            preCloseCallback: function(confirm) {
              vm.search();
            },
            editionMode: false
          }
        });
	}
	
	// Edit Button Action
	vm.edit = function(record) {
		var params = {
				fundingId: record.fundingId
		};
		PageNavigation.gotoPage('/customer-registration/funding-profile/config',params);
	}
	
	// Main of program
	var initLoad = function() {
		vm.search();
	}();
	
}]);