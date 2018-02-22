'use strict';
angular.module('gecscf.organize.configuration.paymentDateFormula', ['ui.router', 'gecscf.ui']).config(
	['$stateProvider', function ($stateProvider) {

		var resources = [
			'js/app/modules/organize/configuration/payment-date-formulas/controllers/payment-date-formula-setting-controller.js', 
			'js/app/modules/organize/configuration/payment-date-formulas/services/payment-date-formula-setting-service.js', 
			'js/app/modules/organize/configuration/credit-terms/controllers/credit-terms-setting-controller.js', 
			'js/app/common/scf-component.js', 
			'js/app/common/scf-component.css'
		];

		$stateProvider.state('/sponsor-configuration/payment-date-formulas/edit', {
			url: '/organizations/:organizeId/accounting-transactions/:accountingTransactionType/customer-organize/payment-date-formulas/edit',
			controller: 'PaymentDateFormulaSettingController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/payment-date-formulas/edit',
			params: {
				mode: 'editPaymentDateFormula',
				paymentDateFormulaModel: null,
				organizeId: null,
				accountingTransactionType: 'PAYABLE'
			},
			resolve: WebHelper.loadScript(resources)
		}).state('/sponsor-configuration/payment-date-formulas/view', {
			url: '/organizations/:organizeId/accounting-transactions/:accountingTransactionType/customer-organize/payment-date-formulas/view',
			controller: 'PaymentDateFormulaSettingController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/payment-date-formulas/view',
			params: {
				mode: 'viewPaymentDateFormula',
				paymentDateFormulaModel: null,
				organizeId: null,
				accountingTransactionType: 'PAYABLE'
			},
			resolve: WebHelper.loadScript(resources)
		});
	}]
);