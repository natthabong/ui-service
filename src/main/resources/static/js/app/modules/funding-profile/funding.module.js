'use strict';
angular.module('gecscf.fundingProfile', [ 'ui.router', 'gecscf.ui' ]).config(
		[ '$stateProvider', function($stateProvider) {
			
			$stateProvider.state('/customer-registration/funding-profile'
					, {
						url: '/customer-registration/funding-profile',
						controller: 'FundingProfileListController',
						controllerAs: 'ctrl',
						templateUrl: '/funding-profile',
						params: {
							params: [],
							backAction: false,
							criteria: null,
							organize: null
						},
						resolve: WebHelper.loadScript(['js/app/modules/funding-profile/controllers/FundingProfileListController.js'
							, 'js/app/modules/funding-profile/services/FundingProfileService.js'
							, 'js/app/common/scf-component.js'
							, 'js/app/common/scf-component.css'])
			});
			
} ]);