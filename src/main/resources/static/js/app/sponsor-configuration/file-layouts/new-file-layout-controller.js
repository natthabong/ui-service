angular
    .module('scfApp')
    .controller(
        'NewFileLayoutController', [
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
            function($log, $scope, $state, SCFCommonService,
                $stateParams, $timeout, ngDialog,
                PageNavigation, Service, $q, $rootScope) {
                var vm = this;
                var log = $log;

                vm.sponsorId = $rootScope.sponsorId;

                vm.newFile = false;

                vm.fileLayoutModel = $stateParams.fileLayoutModel;

                vm.fileType = {
                    fixedLength: 'FIXEDLENGTH',
                    delimited: 'CSV'
                }

                vm.delimitersDropdown = [];

                vm.fileEncodeDropdown = [];

                var dataTypeDisplay = {
                    customerCode: 'Customer code',
                    documentNo: 'Document No',
                    text: 'Text',
                    dateTime: 'Date time',
                    numeric: 'Numeric',
                    paymentAmount: 'Payment amount'
                }

                vm.dataTypeDropdown = [{
                    dataTypeDisplay: 'Please select'
                }];

                vm.customerCodeGroupDropdown = [];

                vm.dateTimeDropdown = [];

                // Model mapping whith page list
                vm.layoutInfoModel = {
                    fileType: vm.fileType.delimited,
                    delimiters: '',
                    fileEncode: '',
                    offsetRowNo: ''
                }

                vm.paymentDateTypeValues = {
                    formular: 'FORMULAR',
                    field: 'FIELD'
                }

                vm.paymentDateFieldModel = {
                    fieldSelect: '',
                    dropdowns: []
                }
                vm.paymentDateFormularModel = {
                    formularSelect: '',
                    dropdowns: []
                }

                vm.calendarType = {
                    christCalendar: 'AD',
                    buddhistCalendar: 'BE'
                }

                vm.numericType = {
                    anyNumericFormat: 'anyNumericFormat',
                    customNumericFormat: 'customNumericFormat'
                }

                vm.signFlagType = {
                    ignorePlusSymbol: 'ignorePlusSymbol',
                    needPlusSymbol: 'needPlusSymbol',
                    avoidPlusSymbol: 'avoidPlusSymbol'
                }

                vm.preview = function(data) {
                    SCFCommonService.parentStatePage()
                        .saveCurrentState($state.current.name);
                    var params = {}
                        // PageNavigation.gotoPage('/sponsor-configuration/file-layouts/new-file-layout/config-detail-field',params,params)
                }

                vm.decodeBase64 = function(data) {
                    if (angular.isUndefined(data)) {
                        return '';
                    }
                    return atob(data);
                }

                vm.loadDataTypes = function() {
                    var serviceURI = 'api/v1/configs/gecscf/layouts/file/data-types';
                    var serviceDiferred = Service.doGet(serviceURI, {
                        record_type: 'DETAIL'
                    });

                    serviceDiferred.promise.then(function(response) {
                        response.data.forEach(function(obj) {
                            vm.dataTypeDropdown.push(obj);
                        });

                    }).catch(function(response) {
                        log.error('Load customer code group data error');
                    });
                }

                vm.loadDelimiters = function() {
                    var delimiterList = [{
                        delimiterName: 'Comma (,)',
                        delimiterId: ','
                    }, {
                        delimiterName: 'Colon (:)',
                        delimiterId: ':'
                    }, {
                        delimiterName: 'Tab',
                        delimiterId: '3'
                    }, {
                        delimiterName: 'Semicolon (;)',
                        delimiterId: ';'
                    }, {
                        delimiterName: 'Other',
                        delimiterId: 'Other'
                    }];

                    delimiterList.forEach(function(obj) {
                        var selectObj = {
                            label: obj.delimiterName,
                            value: obj.delimiterId
                        }

                        vm.delimitersDropdown.push(selectObj);
                    });
                }

                vm.loadFileEncode = function() {
                    var fileEncodeList = [{
                        fileEncodeName: 'UTF-8',
                        fileEncodeId: 'UTF-8'
                    }, {
                        fileEncodeName: 'TIS-620',
                        fileEncodeId: 'TIS-620'
                    }];

                    fileEncodeList.forEach(function(obj) {
                        var selectObj = {
                            label: obj.fileEncodeName,
                            value: obj.fileEncodeId
                        }

                        vm.fileEncodeDropdown.push(selectObj);
                    });
                }

                vm.layoutConfigItems = [newItemConfig()];

                vm.addNewConfigItem = function() {
                    vm.layoutConfigItems.push(newItemConfig());
                }

                vm.removeConfigItem = function(record) {
                    var index = vm.layoutConfigItems.indexOf(record);
                    vm.layoutConfigItems.splice(index, 1);
                    vm.paymentDateFieldModel.fieldSelect = '';
                }

                vm.initLoad = function() {
                    if (!angular.isUndefined(vm.fileLayoutModel) && vm.fileLayoutModel != null) {
                        vm.fileLayoutName = vm.fileLayoutModel.displayName;
                        vm.sponsorId = vm.fileLayoutModel.sponsorId;
                    } else {
                        vm.fileLayoutName = '';
                        vm.newFile = true;
                    }

                    vm.loadDelimiters();
                    vm.loadFileEncode();
                    vm.loadDataTypes();
                    vm.layoutInfoModel.offsetRowNo = 1;

                    vm.paymentDateType = vm.paymentDateTypeValues.field;
                }

                vm.initLoad();
                
                vm.expectedValue = '';

                vm.rowItemPopup = {};
                vm.openSetting = function(record) {
                    var dataTypeConfig = record.dataType;
					
                    if (dataTypeConfig != null) {
                        vm.requireCheckbox = false;
                        vm.required = vm.requireCheckbox;
                        vm.disableText = true;

                        if (dataTypeConfig.dataTypeDisplay == dataTypeDisplay.customerCode) {
                            vm.loadCustomerCodeGroup();
                        } else if (dataTypeConfig.dataTypeDisplay == dataTypeDisplay.dateTime) {
                            vm.calendarTypeFormat = vm.calendarType.christCalendar;
                            vm.loadDateTimeFormat();
                        }else if (dataTypeConfig.dataTypeDisplay == dataTypeDisplay.numeric ||
							dataTypeConfig.dataTypeDisplay == dataTypeDisplay.paymentAmount) {
							
							vm.numericeModel = {
								numericTypeFormat: vm.numericType.anyNumericFormat,
								signFlagTypeFormat: vm.signFlagType.ignorePlusSymbol,
								disableCustomField: true,
								decimalPlacesValue: 0
							}
							vm.loadNumericFormat();
						}
                    } 
					
                    vm.rowItemPopup = record;
                    ngDialog.openConfirm({
                        template: dataTypeConfig.configActionUrl,
                        data: record,
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    }).then(function(value) {
                        console.log('Modal promise resolved. Value: ', value);
                    }, function(reason) {
                        console.log('Modal promise rejected. Reason: ', reason);
                    });
                };

                vm.exampleDateTime = Date.parse('04/13/2016 13:30:55');

                vm.loadDateTimeFormat = function() {
                    var diferred = $q.defer();
                    vm.dateTimeDropdown = [{
                        label: 'Please select',
                        value: ' '
                    }];

                    var serviceUrl = 'js/app/sponsor-configuration/file-layouts/date_time_format.json';
                    var serviceDiferred = Service.doGet(serviceUrl);
                    serviceDiferred.promise.then(function(response) {
                        var dateTimeDropdownList = response.data;
                        if (dateTimeDropdownList !== undefined) {
                            dateTimeDropdownList.forEach(function(obj) {
                                var selectObj = {
                                    label: obj.dateTimeName,
                                    value: obj.dateTimeId
                                }
                                vm.dateTimeDropdown.push(selectObj);
                            });
                        }
                        diferred.resolve(vm.dateTimeDropdown);
                    }).catch(function(response) {
                        $log.error('Load date time format Fail');
                        diferred.reject();
                    });

                    vm.dateTimeFormat = vm.dateTimeDropdown[0].value;
                    return diferred;
                }

                vm.examplePositiveNumeric = '123456';
                vm.exampleNegativeNumeric = '-123456';
                vm.decimalPlacesValue = 0;


                vm.loadNumericFormat = function() {
                    var loadSignFlagDiferred = vm.loadSignFlagList();
                    loadSignFlagDiferred.promise.then(function() {
                        vm.numericeModel.signFlag = vm.signFlagDropdown[0].value;
                    });
                }

                vm.loadSignFlagList = function() {
                    var diferred = $q.defer();
                    vm.signFlagDropdown = [];

                    var serviceUrl = 'js/app/sponsor-configuration/file-layouts/sign_flag_list.json';
                    var serviceDiferred = Service.doGet(serviceUrl);
                    serviceDiferred.promise.then(function(response) {

                        var signFlagList = response.data;
                        if (signFlagList !== undefined) {
                            signFlagList.forEach(function(obj) {
                                var selectObj = {
                                    label: obj.signFlagName,
                                    value: obj.signFlagName
                                }
                                vm.signFlagDropdown.push(selectObj);
                            });
                        }
                        diferred.resolve(vm.signFlagDropdown);
                    }).catch(function(response) {
                        $log.error('Load date time format Fail');
                        diferred.reject();
                    });
                    return diferred;
                }

                vm.loadCustomerCodeGroup = function() {
                    var diferred = $q.defer();
                    vm.customerCodeGroupDropdown = [{
                        label: 'Please select',
                        value: ''
                    }];

                    var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/customer-code-groups';
                    var serviceDiferred = Service.doGet(serviceUrl, {
                        offset: 0,
                        limit: 20
                    });
                    serviceDiferred.promise.then(function(response) {
                        var customerCodeGroupList = response.data;
                        if (customerCodeGroupList !== undefined) {
                            customerCodeGroupList.forEach(function(obj) {
                                var selectObj = {
                                    label: obj.groupName,
                                    value: obj.groupName
                                }
                                vm.customerCodeGroupDropdown.push(selectObj);
                            });
                        }
                        diferred.resolve(vm.customerCodeGroupDropdown);
                    }).catch(function(response) {
                        $log.error('Load Customer Code Group Fail');
                        diferred.reject();
                    });

                    vm.customerCodeGroup = vm.customerCodeGroupDropdown[0].value;
                    return diferred;
                };

                vm.newCustomerCodeGroup = function() {
                    vm.newCustCodeDialog = ngDialog.open({
                        template: '/configs/layouts/file/data-types/customer-code/new-customer-code',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    vm.newCustCodeDialogId = vm.newCustCodeDialog.id;
                };

                vm.customerCodeGroupRequest = {
                    groupName: '',
                    sponsorId: '',
                    completed: ''
                };

                vm.saveNewCustomerGroup = function() {
                    vm.customerCodeGroupRequest.groupName = vm.groupName;
                    vm.customerCodeGroupRequest.sponsorId = vm.sponsorId;
                    vm.customerCodeGroupRequest.completed = false;

                    var serviceUrl = '/api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/customer-code-groups';
                    var serviceDiferred = Service.requestURL(serviceUrl, vm.customerCodeGroupRequest, 'POST');
                    serviceDiferred.promise.then(function(response) {
                        if (response !== undefined) {
                            if (response.message !== undefined) {
                                vm.messageError = response.message;
                            } else {
                                var loadCustCodeDiferred = vm.loadCustomerCodeGroup();
                                loadCustCodeDiferred.promise.then(function() {
                                    vm.customerCodeGroup = '' + response.groupId;
                                });
                                ngDialog.close(vm.newCustCodeDialogId);
                            }
                        }
                    }).catch(function(response) {
                        $log.error('Save customer Code Group Fail');
                    });
                };

                vm.checkRequired = function() {
                    vm.required = !vm.required;
                    vm.disableText = !vm.required;
                };

                vm.checkCustomNumeric = function() {
                    if (vm.numericeModel.numericTypeFormat == 'anyNumericFormat') {
                        vm.numericeModel.disableCustomField = true;
                    } else if (vm.numericeModel.numericTypeFormat == 'customNumericFormat') {
                        vm.numericeModel.disableCustomField = false;
                    }
                };

                vm.displayExampleValue = function(record) {
                    if (angular.isUndefined(record.dataFormat) || record.dataFormat == null) {
                        return '';
                    }
                    
                    var dataType = record.dataType;
					
                    var msgDisplay = ''

                    if (dataType.dataTypeDisplay == dataTypeDisplay.customerCode) {

                        msgDisplay = dataType.configDetailPattern.replace('{required}', record.dataFormat.required);
                        msgDisplay = msgDisplay.replace('{expectedValue}', dataType.defaultExampleValue);
                        msgDisplay = msgDisplay.replace('{exampleData}', dataType.defaultExampleValue);

                    } else if (dataType.dataTypeDisplay == dataTypeDisplay.text) {
                    	
                    	var exampleDisplay = dataType.defaultExampleValue;
                    	if(record.dataFormat.expectedValue != ''){
                    		exampleDisplay = record.dataFormat.expectedValue;
                    	}
                    	
                        msgDisplay = dataType.configDetailPattern.replace('{required}', record.dataFormat.required);
                        msgDisplay = msgDisplay.replace('{expectedValue}', record.dataFormat.expectedValue);
                        msgDisplay = msgDisplay.replace('{exampleData}',exampleDisplay);
                        
                    } else if (dataType.dataTypeDisplay == dataTypeDisplay.documentNo) {
                        msgDisplay = dataType.configDetailPattern.replace('{required}', 'true');
                        msgDisplay = msgDisplay.replace('{exampleData}', dataType.defaultExampleValue);
						
                    } else if (dataType.dataTypeDisplay == dataTypeDisplay.dateTime) {

                       var calendarEra = "Christ calendar (A.D.)";
                    	if(record.dataFormat.calendarTypeFormat == "BE"){
                    		calendarEra = "Buddhist calendar (B.E.)";
                    	}
                    	
                        msgDisplay = dataType.configDetailPattern.replace('{required}', record.dataFormat.required);
                        msgDisplay = msgDisplay.replace('{dateTimeFormat}',record.dataFormat.dateTimeFormat.toUpperCase());
                        msgDisplay = msgDisplay.replace('{calendarType}', calendarEra);
                        msgDisplay = msgDisplay.replace('{exampleData}', convertDate(record.dataFormat.dateTimeFormat,dataType.defaultExampleValue));
                        msgDisplay = msgDisplay.replace('| {conditionUploadDate}', '');
						
                    }else if(dataType.dataTypeDisplay == dataTypeDisplay.numeric 
							 || dataType.dataTypeDisplay == dataTypeDisplay.paymentAmount){						
						msgDisplay = dataType.configDetailPattern.replace('{required}', record.dataFormat.required);
						msgDisplay = msgDisplay.replace('{signFlag}', record.dataFormat.signFlag);
						msgDisplay = msgDisplay.replace('{positiveExampleData}', vm.examplePositiveNumeric);
						msgDisplay = msgDisplay.replace('{negativeExampleData}', vm.exampleNegativeNumeric);
					}

                    return msgDisplay;
                };

                $scope.$watch('newFileLayoutCtrl.layoutConfigItems', function() {
                    vm.paymentDateFieldModel.dropdowns = addPaymentDateFieldDropdown(vm.layoutConfigItems);
                }, true);
				
				vm.expectedValue = '';
                vm.updateValue = function() {
                    var requiredFormat = "No";
                    if (vm.requireCheckbox) {
                        requiredFormat = "Yes";
                    }
					
                    var dataFormat = {};
                    if (vm.rowItemPopup.dataType.dataTypeDisplay == dataTypeDisplay.customerCode) {
                        dataFormat = {
                            required: requiredFormat,
                            expectedValue: vm.expectedValue,
                            customerCodeGroupName: vm.customerCodeGroup,
                            isExpectedValue: true
                        };

                    }else if(vm.rowItemPopup.dataType.dataTypeDisplay == dataTypeDisplay.dateTime){
                        dataFormat = {
                            required: requiredFormat,
                            dateTimeFormat: vm.dateTimeFormat,
                            calendarTypeFormat: vm.calendarTypeFormat,
                            isExpectedValue: false
                        };
                    }else if(vm.rowItemPopup.dataType.dataTypeDisplay == dataTypeDisplay.text){
                    	var isExpectedValue = false;
                    	if(vm.expectedValue != ''){
                    		isExpectedValue = true;
                    	}
                        dataFormat = {
                            required: vm.requireCheckbox,
                            expectedValue: vm.expectedValue,
                            isExpectedValue: isExpectedValue
                        };

                    }else if(vm.rowItemPopup.dataType.dataTypeDisplay == dataTypeDisplay.numeric 
							 || vm.rowItemPopup.dataType.dataTypeDisplay == dataTypeDisplay.paymentAmount){
						 	dataFormat = {
								required: requiredFormat,
								isExpectedValue: false
                        	};
						
						dataFormat = angular.extend(dataFormat, vm.numericeModel);
					}

                    vm.rowItemPopup = angular.extend(vm.rowItemPopup, {
                        dataFormat: dataFormat
                    });

                };

                vm.save = function() {
                    var layoutConfigRequest = getLayoutConfigRequest();
                    var apiURL = 'api/v1/organize-customers/' + vm.sponsorId + '/sponsor-configs/SFP/layouts';

                    var fileLayoutDiferred = Service.requestURL(apiURL, layoutConfigRequest, 'POST');

                    fileLayoutDiferred.promise.then(function(response) {
                        var organizeModel = {
                            organizeId: vm.sponsorId
                        }
                        PageNavigation.gotoPage('/sponsor-configuration', {
                            organizeModel: organizeModel
                        });
                    }).catch(function(response) {
                        log.error('Save config fail');
                    });
                };

                function getLayoutConfigRequest() {
                    var layoutConfigModel = {
                        sponsorIntegrateFileConfig: {
                            sponsorConfigId: 'SFP',
                            sponsorId: vm.sponsorId,
                            displayName: vm.fileLayoutName,
                            delimeter: vm.layoutInfoModel.delimiters,
                            wrapper: '"',
                            headerRecordType: null,
                            detailRecordType: null,
                            footerRecordType: null,
                            fileExtensions: getFileExtensionSelected(),
                            integrateType: 'SPONSOR_UPLOAD',
                            fileType: vm.layoutInfoModel.fileType,
                            charsetName: vm.layoutInfoModel.fileEncode,
                            checkBinaryFile: false,
                            completed: true,
                            ownerId: vm.sponsorId,
                            detailFlag: null,
                            headerFlag: null,
                            footerFlag: null,
                            items: convertLayoutConfigRequestItems(vm.layoutConfigItems)
                        },
                        paymentDateField: vm.paymentDateFieldModel.fieldSelect
                    }
                    return layoutConfigModel;
                }

                function convertLayoutConfigRequestItems(layoutConfigItems) {
                    if (angular.isUndefined(layoutConfigItems) || layoutConfigItems.length == 0) {
                        return null;
                    }
                    var items = [];

                    layoutConfigItems.forEach(function(item) {
                    	
                    	var require = false;
                        if (item.dataFormat != null && item.dataFormat.required == 'Yes') {
                        	require = true;
                        }
                    	
                    	var sponsorItem ={}
                    	if(item.dataType.documentTableField == 'CUSTOMER_CODE'){
                        	sponsorItem = {
	                            startIndex: item.startIndex,
	                            dataLength: item.dataLength,
	                            dataType: item.dataType.documentTableField,
	                            recordType: item.dataType.recordType,
	                            fieldName: null,
	                            calendarEra: null,
	                            datetimeFormat: null,
	                            paddingType: null,
	                            paddingCharacter: '',
	                            has1000Separator: null,
	                            hasDecimalSign: null,
	                            hasDecimalPlace: null,
	                            decimalPlace: null,
	                            defaultValue: null,
	                            displayValue: item.sponsorFieldName,
	                            signFlagConfig: null,
	                            isTransient: 0,
	                            required: require,
	                            positiveFlag: null,
	                            negativeFlag: null,
	                            primaryKeyField: item.primaryKeyField,
	                            expectedValue: getExpedtedValueRequest(item.dataFormat)
                        	}
                    	}else if(item.dataType.documentTableField == 'DATE_TIME'){
                        	sponsorItem = {
    	                            startIndex: item.startIndex,
    	                            dataLength: item.dataLength,
    	                            dataType: item.dataType.documentTableField,
    	                            recordType: item.dataType.recordType,
    	                            fieldName: null,
    	                            calendarEra: item.dataFormat.calendarTypeFormat,
    	                            datetimeFormat: item.dataFormat.dateTimeFormat,
    	                            paddingType: null,
    	                            paddingCharacter: '',
    	                            has1000Separator: null,
    	                            hasDecimalSign: null,
    	                            hasDecimalPlace: null,
    	                            decimalPlace: null,
    	                            defaultValue: null,
    	                            displayValue: item.sponsorFieldName,
    	                            signFlagConfig: null,
    	                            isTransient: 0,
    	                            required: require,
    	                            positiveFlag: null,
    	                            negativeFlag: null,
    	                            primaryKeyField: item.primaryKeyField,
    	                            expectedValue: null
                            }                  		
                    	}else if(item.dataType.documentTableField == 'TEXT'){
                        	sponsorItem = {
    	                            startIndex: item.startIndex,
    	                            dataLength: item.dataLength,
    	                            dataType: item.dataType.documentTableField,
    	                            recordType: item.dataType.recordType,
    	                            fieldName: null,
    	                            calendarEra: null,
    	                            datetimeFormat: null,
    	                            paddingType: null,
    	                            paddingCharacter: '',
    	                            has1000Separator: null,
    	                            hasDecimalSign: null,
    	                            hasDecimalPlace: null,
    	                            decimalPlace: null,
    	                            defaultValue: null,
    	                            displayValue: item.sponsorFieldName,
    	                            signFlagConfig: null,
    	                            isTransient: 0,
    	                            required: require,
    	                            positiveFlag: null,
    	                            negativeFlag: null,
    	                            primaryKeyField: item.primaryKeyField,
    	                            expectedValue: getExpedtedValueRequest(item.dataFormat)
                            }                  		
                    	}if(item.dataType.documentTableField == 'NUMERIC'
							|| item.dataType.documentTableField == 'PAYMENT_AMOUNT'){
							
							 sponsorItem = {
								startIndex: item.startIndex,
								dataLength: item.dataLength,
								dataType: item.dataType.documentTableField,
								recordType: item.dataType.recordType,
								fieldName: '',
								calendarEra: '',
								datetimeFormat: '',
								paddingType: null,
								paddingCharacter: '',
								has1000Separator: null,
								hasDecimalSign: null,
								hasDecimalPlace: null,
								decimalPlace: item.dataFormat.decimalPlacesValue,
								signFlagConfig: null,
								defaultValue: null,
								displayValue: item.sponsorFieldName,
								isTransient: 0,
								required: require,
								positiveFlag: null,
								negativeFlag: null,
								primaryKeyField: item.primaryKeyField,
								expectedValue: null
							}
                    	
						}if(item.dataType.documentTableField == 'DOCUMENT_NO'){
							 sponsorItem = {
								startIndex: item.startIndex,
								dataLength: item.dataLength,
								dataType: item.dataType.documentTableField,
								recordType: item.dataType.recordType,
								fieldName: '',
								calendarEra: '',
								datetimeFormat: '',
								paddingType: null,
								paddingCharacter: '',
								has1000Separator: null,
								hasDecimalSign: null,
								hasDecimalPlace: null,
								decimalPlace: null,
								signFlagConfig: null,
								defaultValue: null,
								displayValue: item.sponsorFieldName,
								isTransient: 0,
								required: true,
								positiveFlag: null,
								negativeFlag: null,
								primaryKeyField: item.primaryKeyField,
								expectedValue: null
							}		                    	
						}
                        items.push(sponsorItem);
                    });

                    return items;
                }

                function getFileExtensionSelected() {
                    if (vm.layoutInfoModel.fileType == vm.fileType.delimited) {
                        return 'csv';
                    }
                    return 'fixedLength';
                }

                function newItemConfig() {
                    var itemConfig = {
                        primaryKeyField: false,
                        sponsorFieldName: '',
                        dataType: null,
                        dataLength: 0,
                        startIndex: 0
                    };
                    return itemConfig;
                }

                function addPaymentDateFieldDropdown(configItems) {
                    var items = [{
                        label: 'Please select',
                        value: ''
                    }]
                    if (angular.isDefined(configItems) && configItems != null) {
                        configItems.forEach(function(data) {
                            if (data.sponsorFieldName.length > 0) {
                                items.push({
                                    label: data.sponsorFieldName,
                                    value: data.sponsorFieldName
                                });
                            }
                        });

                    }
                    return items;
                }

                function getExpedtedValueRequest(expectedValue) {
                    var result = null;

                    if (expectedValue.isExpectedValue) {
                        if (!isEmptyValue(expectedValue.customerCodeGroupName) || expectedValue.customerCodeGroupName.length > 0) {

                            result = expectedValue.customerCodeGroupName;

                        } else if (!isEmptyValue(expectedValue.expectedValue) || expectedValue.expectedValue.length > 0) {

                            result = expectedValue.expectedValue;

                        }
                    }

                    return result;
                }

                function isEmptyValue(value) {
                    if (angular.isUndefined(value) || value == null) {
                        return true;
                    }
                    return false;
                }

				vm.isSetupComplete = function(item){
					if(isEmptyValue(item.dataFormat)){
						return false;
					}
					return true;
				}
				
				function convertDate(format,exampledata){
                	var year = exampledata.substring(0, 4);
                	var month = exampledata.substring(4, 6);
                	var day = exampledata.substring(6, 8);
                	
                	format = format.replace('yyyy', year);
                	format = format.replace('MM', month);
                	format = format.replace('dd', day);
                	
                	return format;
                }
            }
        ]);