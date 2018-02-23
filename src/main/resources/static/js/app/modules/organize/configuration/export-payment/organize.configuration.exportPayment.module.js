'use strict';

var exportPayment = angular.module('gecscf.organize.configuration.exportPayment', ['ui.router', 'gecscf.ui']).config(
	['$stateProvider', function ($stateProvider) {

		var resources = [
			'js/app/modules/organize/configuration/file-layout/services/FileLayoutService.js',
			'js/app/modules/organize/configuration/export-payment/controllers/ExportPaymentController.js',
			'js/app/modules/organize/configuration/export-payment/services/ExportPaymentService.js',
			'js/app/modules/organize/configuration/export-payment/controllers/SpecificTextExportLayoutConfigController.js',
			'js/app/modules/organize/configuration/export-payment/controllers/FillerExportLayoutConfigController.js',
			'js/app/modules/organize/configuration/export-payment/controllers/SignFlagExportLayoutConfigController.js',
			'js/app/modules/organize/configuration/export-payment/controllers/DateTimeExportLayoutConfigController.js',
			'js/app/modules/organize/configuration/export-payment/controllers/PaymentTypeExportLayoutConfigController.js',
			'js/app/modules/organize/configuration/export-payment/controllers/NumericExportLayoutConfigController.js',
			'js/app/modules/organize/configuration/export-payment/controllers/CountExportLayoutConfigController.js',
			'js/app/modules/organize/configuration/export-payment/controllers/SummaryExportLayoutConfigController.js'
		];

		$stateProvider.state('/sponsor-configuration/export-payments/settings', {
			url: '/organizations/:organizeId/export-payments/settings',
			controller: 'ExportPaymentController',
			controllerAs: 'ctrl',
			templateUrl: '/sponsor-configuration/export-payments/settings',
			params: {
				layoutConfigId: ':layoutConfigId'
			},
			resolve: WebHelper.loadScript(resources)
		})

	}]
);

exportPayment.constant('FILE_TYPE_ITEM', {
	fixedLength: 'FIXED_LENGTH',
	delimited: 'CSV',
	specific: 'SPECIFIC'
});

exportPayment.constant('DELIMITER_TYPE_TEM', [{
		delimiterName: 'Comma (,)',
		delimiterId: ','
	},
	{
		delimiterName: 'Colon (:)',
		delimiterId: ':'
	},
	{
		delimiterName: 'Tab',
		delimiterId: '3'
	},
	{
		delimiterName: 'Semicolon (;)',
		delimiterId: ';'
	},
	{
		delimiterName: 'Other',
		delimiterId: 'Other'
	}
]);

exportPayment.constant('CHARSET_ITEM', [{
		fileEncodeName: 'UTF-8',
		fileEncodeId: 'UTF-8'
	},
	{
		fileEncodeName: 'UTF-8-BOM',
		fileEncodeId: 'UTF-8-BOM'
	},
	{
		fileEncodeName: 'TIS-620',
		fileEncodeId: 'TIS-620'
	}
]);