'use strict';
angular
		.module('gecscf.organize',
				[ 'ui.router', 'gecscf.ui', 'gecscf.organize.configuration' ])
		.config(
				[
						'$stateProvider',
						function($stateProvider) {

							$stateProvider
									.state(
											'/settings/organizes',
											{
												url : '/settings/organizes',
												controller : 'OrganizationListController',
												controllerAs : 'ctrl',
												params : {
													backAction : false,
													party : 'bank',
													criteria : null,
													organize : null
												},
												templateUrl : '/organize-list/bank',
												resolve : WebHelper
														.loadScript([
																'js/app/modules/organize/controllers/OrganizationListController.js',
																'js/app/modules/organize/controllers/OrganizationPopupController.js',
																'js/app/modules/organize/services/OrganizationService.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
											})
									.state(
											'/settings/organizes/all-funding',
											{
												url : '/settings/organizes/all-funding',
												controller : 'OrganizeListAllFundingController',
												controllerAs : 'ctrl',
												params : {
													backAction : false,
													criteria : null,
													organize : null
												},
												templateUrl : '/organize-list/all-funding',
												resolve : WebHelper
														.loadScript([
																'js/app/modules/organize/organize-list-all-funding-controller.js',
																'js/app/modules/organize/controllers/OrganizationPopupController.js',
																'js/app/modules/organize/services/OrganizationService.js',
																'js/app/common/scf-component.js',
																'js/app/common/scf-component.css' ])
											});

						} ]);