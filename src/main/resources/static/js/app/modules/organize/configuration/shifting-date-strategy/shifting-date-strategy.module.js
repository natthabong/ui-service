'use strict';
angular.module('gecscf.organize.configuration.shiftingDateStrategy', ['ui.router', 'gecscf.ui']).config(
	['$stateProvider', function ($stateProvider) {

		var resources = [
			'js/app/modules/organize/configuration/shifting-date-strategy/controllers/ShiftingDateStrategyController.js', 
			'js/app/modules/organize/configuration/shifting-date-strategy/controllers/ShiftingDateStrategySettingController.js', 
			'js/app/modules/organize/configuration/shifting-date-strategy/services/ShiftingDateStrategyService.js', 
			'js/app/common/scf-component.js', 
			'js/app/common/scf-component.css'
		];

		$stateProvider.state('/sponsor-configuration/shifting-date-strategy/settings', {
			url: '/sponsor-configuration/shifting-date-strategy/settings',
			controller: 'ShiftingDateStrategySettingController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/shifting-date-strategy/settings',
			params: {
				accountingTransactionType: null
			},
			resolve: WebHelper.loadScript(resources)
			
		}).state('/sponsor-configuration/shifting-date-strategy/view', {
			url: '/sponsor-configuration/shifting-date-strategy/view',
			controller: 'ShiftingDateStrategySettingController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/shifting-date-strategy/view',
			params: {
				accountingTransactionType: null
			},
			resolve: WebHelper.loadScript(resources)
		});
	}]
);