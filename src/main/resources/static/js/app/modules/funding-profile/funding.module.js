'use strict';
angular.module('gecscf.fundingProfile', [ 'ui.router', 'gecscf.ui', 'gecscf.fundingProfile.configuration' ]).config(
		[ '$stateProvider', function($stateProvider) {
			
			var resources = ['js/app/modules/funding-profile/controllers/FundingProfileListController.js'
				, 'js/app/modules/funding-profile/controllers/FundingProfileConfigurationController.js'
				, 'js/app/modules/funding-profile/controllers/FundingProfilePopupController.js'
				, 'js/app/modules/funding-profile/services/FundingProfileService.js'
				, 'js/app/common/scf-component.js'
				, 'js/app/common/scf-component.css'];
			
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
						resolve: WebHelper.loadScript(resources)
			}).state('/customer-registration/funding-profile/config', {
				url: '/customer-registration/funding-profile/config/:fundingId',
				controller: 'FundingProfileConfigurationController',
				controllerAs: 'ctrl',
				templateUrl: '/funding-profile/configuration',
				params: {
					taxId: null
				},
				resolve: WebHelper.loadScript(resources)
			});
			
} ]);