'use strict';
var displayModule = angular.module('gecscf.organize.configuration.display');
displayModule.controller('ViewDisplayController', [
    '$log',
    '$scope',
    '$state',
    'SCFCommonService',
    '$stateParams',
    '$timeout',
    'ngDialog',
    'PageNavigation',
    'Service',
    '$q',
    '$rootScope',
    '$injector',
    'DocumentDisplayConfigExampleService',
    'LOAN_REQUEST_MODE_ITEM',
    'DOCUMENT_SELECTION_ITEM',
    'SUPPLIER_CODE_GROUP_SELECTION_ITEM',
    'UIFactory',
    'blockUI',
    'DisplayService',
    'ConfigurationUtils',
    'scfFactory',
    'OVERDUE_DROPDOWN_ITEM',
    'PAYMENT_DATE_DROPDOWN_ITEM',
    'GRACE_PERIOD_DROPDOWN_ITEM',
    function($log, $scope, $state, SCFCommonService,
        $stateParams, $timeout, ngDialog,
        PageNavigation, Service, $q, $rootScope, $injector, DocumentDisplayConfigExampleService,
        LOAN_REQUEST_MODE_ITEM, DOCUMENT_SELECTION_ITEM, SUPPLIER_CODE_GROUP_SELECTION_ITEM,
        UIFactory, blockUI, DisplayService, ConfigurationUtils, scfFactory,
        OVERDUE_DROPDOWN_ITEM, PAYMENT_DATE_DROPDOWN_ITEM, GRACE_PERIOD_DROPDOWN_ITEM) {

        var vm = this;
        var log = $log;

        // read from stateParams
        var ownerId = $stateParams.organizeId;
        vm.accountingTransactionType = $stateParams.accountingTransactionType;
        vm.displayMode = $stateParams.displayMode;
        vm.displayId = $stateParams.documentDisplayId;

        vm.headerMessageLabel = vm.displayMode == "TRANSACTION_DOCUMENT" ? "View create transaction display" : "Document display configuration";
        vm.groupSelection = vm.accountingTransactionType == "RECEIVABLE" ? "Buyer code group selection" : "Supplier code group selection";
        vm.supplierCodeSelectionMode = SUPPLIER_CODE_GROUP_SELECTION_ITEM;
        vm.documentSelection = DOCUMENT_SELECTION_ITEM;
        vm.documentFieldData = [];
        vm.documentConditions = [];
        vm.showProductType = true;
        if (vm.accountingTransactionType == 'PAYABLE') {
            vm.showProductType = false;
        }

        var loadDisplayConfig = function(ownerId, accountingTransactionType, displayMode, displayId) {
           var deffered = DisplayService.getDocumentDisplayConfig(ownerId, accountingTransactionType, displayMode, displayId);
           return deffered;
        }
        
        var prepareDisplayConfig = function(data){
                vm.dataModel = data || {
                    displayName: null,
                    items: [newDisplayConfig()],
                    loanRequestMode: null,
                    documentSelection: null,
                    supplierCodeSelectionMode: null,
                    documentGroupingFields: [],
                    displayNegativeDocument: null,
                    reasonCodeMappingId: null,
                    supportPartial: false,
                    supportSpecialDebit: null,
                    productType: null
                };
        }
        
        var newDisplayConfig = function() {
            return {
                documentFieldId: null,
                sortType: null
            }
        }

        var loadDataTypes = function() {
            var deffered = SCFCommonService.getDocumentFields('DISPLAY', 'DETAIL');
            deffered.promise.then(function(response) {
                vm.documentFieldData = response.data;
            }).catch(function(response) {
                log.error('Load data type error');
            });
        }
        
        vm.checkedForDebit = false;
        vm.checkedForDrawdown = false;
        vm.checkedForSpecialDebit = false;
        vm.checkForOverdraft = false;

		var initialCheckBoxPayOnlyBankWorkingDay = function() {
            vm.dataModel.allowablePaymentDays.forEach(function(data) {
                if (data.transactionMethod == "DEBIT") {
                    vm.checkedForDebit = checkIsWorkingDay(data);
                } else if (data.transactionMethod == "TERM_LOAN") {
                    vm.checkedForDrawdown = checkIsWorkingDay(data);
                } else if (data.transactionMethod == "DEBIT_SPECIAL") {
                    vm.checkedForSpecialDebit = checkIsWorkingDay(data);
                } else if (data.transactionMethod = "OD") {
                    vm.checkForOverdraft = checkIsWorkingDay(data);
                }
            });
        }
        
        var checkIsWorkingDay = function(data) {
            var isWorkingDay = true
            if (data.allowablePaymentDay == "ALL_DAY") {
                isWorkingDay = false;
            }
            return isWorkingDay;
        }

        vm.backToSponsorConfigPage = function() {
            PageNavigation.gotoPage('/sponsor-configuration', {
                organizeId: ownerId
            });
        }

        vm.displayExample = function(record) {
            var msg = '';
            vm.documentFieldData.forEach(function(obj) {

                if (record.documentField != null && record.documentField.documentFieldId == obj.documentFieldId) {
                    msg = $injector.get('DocumentDisplayConfigExampleService')[obj.dataType + '_DisplayExample'](record, obj);
                }
            });
            return msg;
        };
        
        vm.overdueConfig = function(){
        	if(vm.dataModel != undefined){
	        	if(vm.dataModel.displayOverdue){
	        		return 'Display overdue invoice';
	        	}else{
	        		return 'Not display overdue invoice';
	        	}
	        }
        }
        
        vm.gracePeriodConfig = function(){
        	if(vm.dataModel != undefined){
	        	if(vm.dataModel.supportGracePeriod){
	        		return 'Support invoice grace period';
	        	}else{
	        		return 'Not support invoice grace period';
	        	}
	        }
        }
        
        vm.transactionDateConfig = function(){
        	if(vm.dataModel != undefined){
	        	if(vm.dataModel.loanRequestMode == 'CURRENT'){
	        		return 'Current date';
	        	}else{
	        		return 'Current date - Min due date';
	        	}
	        }
        }
        

        var init = function() {
            loadDataTypes();
            var deffered = loadDisplayConfig(ownerId, vm.accountingTransactionType, vm.displayMode, vm.displayId);
            
            deffered.promise.then(function(response) {
            	var data = response.data;
            	prepareDisplayConfig(data);
            	console.log(vm.dataModel);
            	initialCheckBoxPayOnlyBankWorkingDay();
            	
            	if(vm.dataModel.documentSelection != DOCUMENT_SELECTION_ITEM.anyDocument){
                	vm.groupDocumentType = angular.copy(vm.dataModel.documentSelection);
                	vm.dataModel.documentSelection = DOCUMENT_SELECTION_ITEM.groupBy;
                }
                
        	}).catch(function(response) {
                log.error('Load data error');
            });
        }();
        
    }
]).constant('DOCUMENT_SELECTION_ITEM', {
    anyDocument: 'ANY_DOCUMENT',
    groupBy: 'GROUP_BY',
    allDocument: 'ALL_DOCUMENT',
    atLeastOneDocument: 'AT_LEAST_ONE_DOCUMENT'
}).constant('DOCUMENT_SELECTION_ITEM', {
    anyDocument: 'ANY_DOCUMENT',
    groupBy: 'GROUP_BY',
    allDocument: 'ALL_DOCUMENT',
    atLeastOneDocument: 'AT_LEAST_ONE_DOCUMENT'
}).constant('SUPPLIER_CODE_GROUP_SELECTION_ITEM', {
    singlePerTransaction: 'SINGLE_PER_TRANSACTION',
    multiplePerTransaction: 'MULTIPLE_PER_TRANSACTION'
}).factory('DocumentDisplayConfigExampleService', ['$filter', 'SCFCommonService', function($filter, SCFCommonService) {
    return {
        TEXT_DisplayExample: TEXT_DisplayExample,
        CUSTOMER_CODE_DisplayExample: CUSTOMER_CODE_DisplayExample,
        NUMERIC_DisplayExample: NUMERIC_DisplayExample,
        DATE_TIME_DisplayExample: DATE_TIME_DisplayExample
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