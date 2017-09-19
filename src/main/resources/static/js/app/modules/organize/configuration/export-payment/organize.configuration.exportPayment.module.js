'use strict';

var exportPayment = angular.module(
		'gecscf.organize.configuration.exportPayment',
		[ 'ui.router', 'gecscf.ui' ]).config(
		[ '$stateProvider', function($stateProvider) {

		} ]);
exportPayment.constant('FILE_TYPE_ITEM', {
	fixedLength : 'FIXED_LENGTH',
	delimited : 'CSV',
	specific : 'SPECIFIC'
});

exportPayment.constant('DELIMITER_TYPE_TEM', [ {
	delimiterName : 'Comma (,)',
	delimiterId : ','
}, {
	delimiterName : 'Colon (:)',
	delimiterId : ':'
}, {
	delimiterName : 'Tab',
	delimiterId : '3'
}, {
	delimiterName : 'Semicolon (;)',
	delimiterId : ';'
}, {
	delimiterName : 'Other',
	delimiterId : 'Other'
} ]);

exportPayment.constant('CHARSET_ITEM', [ {
	fileEncodeName : 'UTF-8',
	fileEncodeId : 'UTF-8'
}, {
	fileEncodeName : 'UTF-8-BOM',
	fileEncodeId : 'UTF-8-BOM'
}, {
	fileEncodeName : 'TIS-620',
	fileEncodeId : 'TIS-620'
} ]);