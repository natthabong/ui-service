'use strict';
var module = angular.module('gecscf.organize.configuration.fileLayout');
module.factory('FileLayerExampleDisplayService', ['$filter', function($filter) {
	
	return {
		TEXT_DisplayExample : TEXT_DisplayExample,
		DOCUMENT_NO_DisplayExample : DOCUMENT_NO_DisplayExample,
		CUSTOMER_CODE_DisplayExample : CUSTOMER_CODE_DisplayExample,
		DATE_TIME_DisplayExample : DATE_TIME_DisplayExample,
		NUMERIC_DisplayExample : NUMERIC_DisplayExample,
		PAYMENT_AMOUNT_DisplayExample : PAYMENT_AMOUNT_DisplayExample,
		DOCUMENT_TYPE_DisplayExample : DOCUMENT_TYPE_DisplayExample,
		RECORD_TYPE_DisplayExample : RECORD_TYPE_DisplayExample,
		FILLER_DisplayExample : FILLER_DisplayExample,
		SIGN_FLAG_DisplayExample : SIGN_FLAG_DisplayExample,
		MATCHING_REF_DisplayExample : MATCHING_REF_DisplayExample
	}

	function TEXT_DisplayExample(record, config, mappingDataList) {
		var displayMessage = config.detailExamplePattern;
		var hasExpected = !(angular.isUndefined(record.expectedValue) || record.expectedValue === null);
		var hasValidationType = !(angular.isUndefined(record.validationType) || record.validationType === null);
		
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		if(hasValidationType){	
			displayMessage = displayMessage.replace('Expected value', 'Expected in');	
			if(mappingDataList != null){
				for (var i = 0; i < mappingDataList.length; i++) { 
					if(mappingDataList[i].mappingDataId == record.expectedValue){
						displayMessage = displayMessage.replace('{expectedValue}', mappingDataList[i].mappingDataName);
					}
				}
			}else{
				displayMessage = displayMessage.replace('{expectedValue}', 'Mapping data');
			}
			displayMessage = displayMessage.replace('{exampleData}', config.defaultExampleValue);	
		}else{
			displayMessage = displayMessage.replace('{expectedValue}', (hasExpected ? record.expectedValue : ''));		
			displayMessage = displayMessage.replace('{exampleData}', (hasExpected ? record.expectedValue : config.defaultExampleValue));			
		}
		
		return displayMessage;
	}
	
	function MATCHING_REF_DisplayExample(record, config) {
		var displayMessage = config.detailExamplePattern;
		var hasExpected = !(angular.isUndefined(record.expectedValue) || record.expectedValue === null);
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', (hasExpected ? record.expectedValue : ''));
		displayMessage = displayMessage.replace('{exampleData}', (hasExpected ? record.expectedValue : config.defaultExampleValue));
		return displayMessage;
	}

	function DOCUMENT_NO_DisplayExample(record, config) {
		var displayMessage = config.detailExamplePattern;

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', record.expectedValue);
		displayMessage = displayMessage.replace('{exampleData}', config.defaultExampleValue);
		return displayMessage;
	}

	function CUSTOMER_CODE_DisplayExample(record, config) {
		var displayMessage = config.detailExamplePattern;
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', '');
		displayMessage = displayMessage.replace('{exampleData}', config.defaultExampleValue);
		return displayMessage;
	}

	function DATE_TIME_DisplayExample(record, config) {
		var format = record.datetimeFormat || '';
		if (format == 0) {
			return '';
		}
		var displayMessage = config.detailExamplePattern;

		var calendarEra = "Christ calendar (A.D.)";
		if (record.calendarEra == "BE") {
			calendarEra = "Buddhist calendar (B.E.)";
		}

		//2016-04-13T13:30:55
		var defaultDateExample = config.defaultExampleValue;
		var year = defaultDateExample.substring(0, 4);
	    var month = defaultDateExample.substring(5, 7);
	    var day = defaultDateExample.substring(8, 10);    
	    var hours = defaultDateExample.substring(11, 13);
	    var minutes = defaultDateExample.substring(14, 16); 
	    var seconds = defaultDateExample.substring(17, 19);
		var dateDefault = new Date(year, month-1, day, hours, minutes, seconds, 0)
	    
		var displayDateTimeFormat = record.datetimeFormat.replace('HHmmss','T1');
		displayDateTimeFormat = displayDateTimeFormat.replace('HH:mm:ss','T2');
		displayDateTimeFormat = displayDateTimeFormat.toUpperCase();
		displayDateTimeFormat = displayDateTimeFormat.replace('T1','HHMMSS');
		displayDateTimeFormat = displayDateTimeFormat.replace('T2','HH:MM:SS');

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('| {conditionUploadDate}', '');
		displayMessage = displayMessage.replace('{dateTimeFormat}', displayDateTimeFormat);
		displayMessage = displayMessage.replace('{calendarType}', calendarEra);
		displayMessage = displayMessage.replace('{exampleData}', $filter('date')(dateDefault, record.datetimeFormat));

		return displayMessage;
	}

	function NUMERIC_DisplayExample(record, config) {
		var displayMessage = config.detailExamplePattern;

		var numberFormatDisplay = 'Any numeric format'
		if ((record.paddingCharacter != null&&record.paddingCharacter != '') || record.has1000Separator == true || record.hasDecimalPlace == true) {
			var numberFormatDisplay = ''
			if(record.paddingCharacter != null && record.paddingCharacter != ''){
				numberFormatDisplay = numberFormatDisplay + ', Padding character ('+record.paddingCharacter+')';
			}
			if(record.has1000Separator == true){
				numberFormatDisplay = numberFormatDisplay + ', Has 1,000 seperator (,)';
			}
			if(record.hasDecimalPlace == true){
				numberFormatDisplay = numberFormatDisplay + ', Has decimal place (.)';
			}
			numberFormatDisplay = numberFormatDisplay.substring(2);
		}
			
		var signFlagTypeDisplay = '';
		if(record.signFlagConfig !=null && !angular.isUndefined(record.signFlagConfig)){
			signFlagTypeDisplay = ' sign flag field ('+record.signFlagConfig.displayValue+')'
		}else if (record.hasDecimalSign == null) {
			signFlagTypeDisplay = ' within field (ignore plus symbol (+) on positive value)'
		} else if (record.hasDecimalSign == true) {
			signFlagTypeDisplay = ' within field (need plus symbol (+) on positive value)'
		} else if (record.hasDecimalSign == false) {
			signFlagTypeDisplay = ' within field (avoid plus symbol (+) on positive value)'
		}
		
		var examplePosDataDisplay = parseFloat(config.defaultExampleValue).toFixed(record.decimalPlace);
		var exampleNegDataDisplay = parseFloat(-config.defaultExampleValue).toFixed(record.decimalPlace);

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));

		displayMessage = displayMessage.replace('{numberFormat}', numberFormatDisplay);
		
		if(record.decimalPlace != null && record.decimalPlace.length> 0){
			displayMessage = displayMessage.replace('{decimalPlace}', record.decimalPlace);
		}else{
			displayMessage = displayMessage.replace('{decimalPlace}', '0');
		}
		
		displayMessage = displayMessage.replace('{signFlag}', signFlagTypeDisplay);
		displayMessage = displayMessage.replace('{positiveExampleData}', examplePosDataDisplay);
		displayMessage = displayMessage.replace('{negativeExampleData}', exampleNegDataDisplay);

		return displayMessage;
	}

	function PAYMENT_AMOUNT_DisplayExample(record, config) {
		var displayMessage = config.detailExamplePattern;

		var numberFormatDisplay = 'Any numeric format'

		if ((record.paddingCharacter != null && record.paddingCharacter != '') || record.has1000Separator == true || record.hasDecimalPlace == true) {
			var numberFormatDisplay = ''
			if (record.paddingCharacter != null && record.paddingCharacter != '') {
				numberFormatDisplay = numberFormatDisplay + ', Padding character (' + record.paddingCharacter + ')';
			}
			if (record.has1000Separator == true) {
				numberFormatDisplay = numberFormatDisplay + ', Has 1,000 seperator (,)';
			}
			if (record.hasDecimalPlace == true) {
				numberFormatDisplay = numberFormatDisplay + ', Has decimal place (.)';
			}
			numberFormatDisplay = numberFormatDisplay.substring(2);
		}

		var signFlagTypeDisplay = '';
		if(record.signFlagConfig != null){
			signFlagTypeDisplay = ' sign flag field ('+record.signFlagConfig.displayValue+')'
		}else if (record.signFlagTypeFormat == "IGNORE_PLUS") {
			signFlagTypeDisplay = ' Within field (ignore plus symbol (+) on positive value)'
		} else if (record.signFlagTypeFormat == "NEES_PLUS") {
			signFlagTypeDisplay = ' Within field (need plus symbol (+) on positive value)'
		} else if (record.signFlagTypeFormat == "AVOID_PLUS") {
			signFlagTypeDisplay = ' Within field (avoid plus symbol (+) on positive value)'
		}

		var examplePosDataDisplay = parseFloat(config.defaultExampleValue).toFixed(record.decimalPlace);
		var exampleNegDataDisplay = parseFloat(-config.defaultExampleValue).toFixed(record.decimalPlace);

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));

		displayMessage = displayMessage.replace('{numberFormat}', numberFormatDisplay);
		if(record.decimalPlace != null){
			displayMessage = displayMessage.replace('{decimalPlace}', record.decimalPlace);
		}else{
			displayMessage = displayMessage.replace('{decimalPlace}', '0');
		}
		displayMessage = displayMessage.replace('{signFlag}', signFlagTypeDisplay);
		displayMessage = displayMessage.replace('{positiveExampleData}', examplePosDataDisplay);
		displayMessage = displayMessage.replace('{negativeExampleData}', exampleNegDataDisplay);

		return displayMessage;
	}

	function DOCUMENT_TYPE_DisplayExample(record, config) {
		var displayMessage = config.detailExamplePattern;

		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', record.expectedValue || '-');
		displayMessage = displayMessage.replace('{exampleData}', config.defaultExampleValue);
		displayMessage = displayMessage.replace('{defaultValue}', record.defaultValue == null ? '-' : record.defaultValue);
		return displayMessage;
	}

	function RECORD_TYPE_DisplayExample(record, config) {
		var displayMessage = config.detailExamplePattern;
		var hasExpected = !(angular.isUndefined(record.expectedValue) || record.expectedValue === null);
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{expectedValue}', (hasExpected ? record.expectedValue : ''));
		displayMessage = displayMessage.replace('{exampleData}', (hasExpected ? record.expectedValue : config.defaultExampleValue));
		return displayMessage;
	}

	function FILLER_DisplayExample(record, config) {
		var displayMessage = config.detailExamplePattern;
		var hasExpected = !(angular.isUndefined(record.expectedValue) || record.expectedValue === null);
		var fillerTypeMsg = '';

		if (record.expectedValue == null) {
			fillerTypeMsg = 'Unexpect'
		} else if (record.expectedValue == ' ') {
			fillerTypeMsg = 'Space';
		} else if (record.expectedValue == '0') {
			fillerTypeMsg = 'Zero';
		} else {
			fillerTypeMsg = 'Other';
		}
		
		displayMessage = displayMessage.replace('{fillerType}', fillerTypeMsg);
		displayMessage = displayMessage.replace('{exampleData}', (hasExpected ? record.expectedValue : config.defaultExampleValue));
		if(!hasExpected){
			displayMessage = displayMessage.replace('(Ex. )', '');
		}
		return displayMessage;
	}
	
	function SIGN_FLAG_DisplayExample(record, config) {
		var displayMessage = config.detailExamplePattern;
		var hasPositiveValue = !(angular.isUndefined(record.positiveFlag) || record.positiveFlag === null);
		var hasNegativeValue = !(angular.isUndefined(record.negativeFlag) || record.negativeFlag === null);
		var examplePosDataDisplay = parseFloat(config.defaultExampleValue);
		var exampleNegDataDisplay = parseFloat(-config.defaultExampleValue);
		
		displayMessage = displayMessage.replace('{required}', convertRequiredToString(record));
		displayMessage = displayMessage.replace('{positiveValue}', (hasPositiveValue ? record.positiveFlag : ''));
		displayMessage = displayMessage.replace('{negativeValue}', (hasNegativeValue ? record.negativeFlag : ''));
		displayMessage = displayMessage.replace('{positiveExampleData}', examplePosDataDisplay);
		displayMessage = displayMessage.replace('{negativeExampleData}', exampleNegDataDisplay);
		return displayMessage;
	}

	function convertRequiredToString(record) {
		return record.required == true ? 'yes' : 'no';
	}
	;
} ]);