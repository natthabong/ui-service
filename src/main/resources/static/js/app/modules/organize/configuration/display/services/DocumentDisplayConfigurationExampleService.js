'use strict';
var displayModule = angular.module('gecscf.organize.configuration.display');
displayModule.factory('DocumentDisplayConfigurationExampleService', ['$filter', 'SCFCommonService', function($filter, SCFCommonService) {
    return {
    	ROW_NO_DisplayExample: ROW_NO_DisplayExample,
        TEXT_DisplayExample: TEXT_DisplayExample,
        CUSTOMER_CODE_DisplayExample: CUSTOMER_CODE_DisplayExample,
        NUMERIC_DisplayExample: NUMERIC_DisplayExample,
        DATE_TIME_DisplayExample: DATE_TIME_DisplayExample
    }

	function ROW_NO_DisplayExample(record, config) {
        var displayMessage = config.detailExamplePattern;
        var replacements = [SCFCommonService.camelize(record.alignment), config.defaultExampleValue];
        return SCFCommonService.replacementStringFormat(displayMessage, replacements);
    }
    
    function TEXT_DisplayExample(record, config) {
        var displayMessage = config.detailExamplePattern;
        var replacements = [SCFCommonService.camelize(record.alignment), config.defaultExampleValue];
        return SCFCommonService.replacementStringFormat(displayMessage, replacements);
    }
    
    function CUSTOMER_CODE_DisplayExample(record, config) {
        var displayMessage = config.detailExamplePattern;
        var replacements = [SCFCommonService.camelize(record.alignment), config.defaultExampleValue];
        return SCFCommonService.replacementStringFormat(displayMessage, replacements);
    }

    function NUMERIC_DisplayExample(record, config) {
        var displayMessage = config.detailExamplePattern;
        var exampleRawData = parseFloat(config.defaultExampleValue).toFixed(2);
        var examplePosDataDisplay = '';
        var exampleNegDataDisplay = '';
        if (record.filterType != null) {
            examplePosDataDisplay = $filter(record.filterType)(exampleRawData, 2);
            exampleNegDataDisplay = $filter(record.filterType)(-exampleRawData, 2);
        } else {
            examplePosDataDisplay = $filter('number')(exampleRawData, 2);
            exampleNegDataDisplay = $filter('number')(-exampleRawData, 2);
        }
        var replacements = [SCFCommonService.camelize(record.alignment), examplePosDataDisplay, exampleNegDataDisplay];
        return SCFCommonService.replacementStringFormat(displayMessage, replacements);
    }

    function DATE_TIME_DisplayExample(record, config) {
        var displayMessage = config.detailExamplePattern;
        var date = new Date(config.defaultExampleValue);
        var exampleDataDisplay = '';
        var replacements = '';
        if (record.format != null) {
            exampleDataDisplay = $filter('date')(date, record.format);
            replacements = [SCFCommonService.camelize(record.alignment), record.format.toUpperCase(), exampleDataDisplay];
        } else {
            replacements = [SCFCommonService.camelize(record.alignment), '-', config.defaultExampleValue];
        }
        return SCFCommonService.replacementStringFormat(displayMessage, replacements);
    }

}]);