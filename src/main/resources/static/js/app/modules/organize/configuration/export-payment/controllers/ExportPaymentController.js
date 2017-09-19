'use strict';
var module = angular.module('gecscf.organize.configuration.exportPayment');
module.controller('ExportPaymentController', [
	'$log',
	'$rootScope',
	'$scope',
	'$state',
	'$stateParams',
	'$injector',
	'ngDialog',
	'UIFactory',
	'PageNavigation',
	'blockUI', 'FileLayoutService',
	'FILE_TYPE_ITEM',
	'DELIMITER_TYPE_TEM',
	'CHARSET_ITEM', 'Service',
	function (log, $rootScope, $scope, $state, $stateParams, $injector, ngDialog, UIFactory, PageNavigation,
		blockUI, FileLayoutService, FILE_TYPE_ITEM, DELIMITER_TYPE_TEM, CHARSET_ITEM, Service) {
            
            var vm = this;

            vm.fileType = FILE_TYPE_ITEM;
            vm.fileEncodeDropdown = [];
            vm.delimitersDropdown = [];
            vm.specificsDropdown = [];
            vm.items = [];

            // vm.model = $stateParams.fileLayoutModel || {
            //     ownerId: ownerId,
            //     paymentDateConfig: vm.processType == 'AP_DOCUMENT' ? {
            //         strategy: 'FIELD',
            //         documentDateFieldOfField: null,
            //         documentDateFieldOfFormula: null,
            //         documentDateField: null,
            //         paymentDateFormulaId: null
            //     } : null
            // };

            var loadFileEncode = function () {
                CHARSET_ITEM.forEach(function (obj) {
                    var selectObj = {
                        label: obj.fileEncodeName,
                        value: obj.fileEncodeId
                    }

                    vm.fileEncodeDropdown.push(selectObj);
                });
            }

            var loadDelimiters = function () {
                DELIMITER_TYPE_TEM.forEach(function (obj) {
                    var selectObj = {
                        label: obj.delimiterName,
                        value: obj.delimiterId
                    }

                    vm.delimitersDropdown.push(selectObj);
                });
            }

            var loadFileSpecificsData = function () {
                var deffered = FileLayoutService.getSpecificData();
                deffered.promise.then(function (response) {

                    var specificModels = response.data;
                    if (specificModels !== undefined) {
                        specificModels.forEach(function (obj) {
                            var selectObj = {
                                label: obj.specificName,
                                value: obj.specificName,
                                item: obj.specificItem
                            }
                            vm.specificsDropdown.push(selectObj);
                        });
                    }

                    deffered.resolve(vm.specificModels);
                }).catch(function (response) {
                    log.error('Load relational operators format Fail');
                    deffered.reject();
                });
            }

            var initialModel = function () {
                vm.model = {
                    displayName: vm.headerName,
                    sponsorConfigId: 'SFP',
                    sponsorId: null,
                    delimeter: ',',
                    wrapper: '"',
                    fileExtensions: 'csv',
                    integrateType: 'IMPORT',
                    fileType: 'FIXED_LENGTH',
                    charsetName: 'TIS-620',
                    checkBinaryFile: false,
                    completed: false,
                    ownerId: null,
                    paymentDateConfig: {
                        strategy: 'FIELD',
                        documentDateFieldOfField: null,
                        documentDateFieldOfFormula: null,
                        documentDateField: null,
                        paymentDateFormulaId: null
                    }
                }

                vm.items = [{
                    primaryKeyField: false,
                    docFieldName: null,
                    dataType: null,
                    isTransient: false,
                    dataLength: null,
                    startIndex: null,
                    endIndex: null,
                    recordType: "DETAIL",
                    itemType: 'FIELD'
                }];

                vm.delimeter = ',';
                vm.delimeterOther = '';

                vm.specificModel = 'Specific 1';
            }

            var initial = function(){
                loadFileEncode();
                loadDelimiters();
                loadFileSpecificsData();
                initialModel();
            }();

            //<---------------- founction for user action  ---------------->
            vm.addItem = function () {
                var itemConfig = {
                    primaryKeyField: false,
                    docFieldName: null,
                    dataType: null,
                    dataLength: null,
                    startIndex: null,
                    endIndex: null,
                    isTransient: false,
                    recordType: "DETAIL",
                    itemType: 'FIELD'
                };
                vm.items.push(itemConfig);
            }
            //<---------------- founction for user action  ---------------->
        }
    ]);