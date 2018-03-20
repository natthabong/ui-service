'use strict';
angular
		.module('gecscf.fundingProfile.configuration',
				[ 'ui.router', 'gecscf.ui' ])
		.config(
				[
						'$stateProvider',
						function($stateProvider) {
							$stateProvider
									.state(
											'/funding-configuration/logo/settings',
											{
												url : '/funding-configuration/:fundingId/logo/settings',
												controller : 'FundingLogoSettingController',
												controllerAs : 'ctrl',
												templateUrl : '/funding-configuration/logo/settings',
												params : {
													fundingId : null
												},
												resolve : WebHelper
														.loadScript([
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css',
																'js/app/modules/funding-profile/configuration/funding-logo/controllers/FundingLogoSettingController.js',
																'js/app/modules/funding-profile/configuration/funding-logo/services/FundingLogoService.js' ])
											})
						} ]);